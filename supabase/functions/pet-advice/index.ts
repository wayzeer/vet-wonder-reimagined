import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = ['https://vetwonder.es', 'https://www.vetwonder.es'];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const { petId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user from auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('No autorizado');
    }

    // Check rate limiting (1 week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: recentAdvice, error: checkError } = await supabaseClient
      .from('pet_advice')
      .select('*')
      .eq('pet_id', petId)
      .eq('user_id', user.id)
      .gte('created_at', oneWeekAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (checkError) throw checkError;

    // If advice exists from less than a week ago, return it
    if (recentAdvice && recentAdvice.length > 0) {
      const daysUntilNext = 7 - Math.floor((Date.now() - new Date(recentAdvice[0].created_at).getTime()) / (1000 * 60 * 60 * 24));
      return new Response(
        JSON.stringify({ 
          advice: recentAdvice[0].advice_text,
          cached: true,
          daysUntilNext
        }),
        { headers: { ...getCorsHeaders(req),'Content-Type': 'application/json' } }
      );
    }

    // Get pet details
    const { data: pet, error: petError } = await supabaseClient
      .from('pets')
      .select('*')
      .eq('id', petId)
      .eq('owner_id', user.id)
      .single();

    if (petError || !pet) throw new Error('Mascota no encontrada');

    // Get medical records
    const { data: medicalRecords } = await supabaseClient
      .from('medical_records')
      .select('*')
      .eq('pet_id', petId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get appointments
    const { data: appointments } = await supabaseClient
      .from('appointments')
      .select('*')
      .eq('pet_id', petId)
      .order('appointment_date', { ascending: false })
      .limit(3);

    // Calculate age
    const calculateAge = (dob: string | null) => {
      if (!dob) return 'edad desconocida';
      const birthDate = new Date(dob);
      const today = new Date();
      const years = today.getFullYear() - birthDate.getFullYear();
      const months = today.getMonth() - birthDate.getMonth();
      if (years === 0) return `${months} meses`;
      if (months < 0) return `${years - 1} años`;
      return `${years} años`;
    };

    const age = calculateAge(pet.date_of_birth);
    const currentMonth = new Date().getMonth() + 1;

    // Build context
    const context = `
Mascota: ${pet.name}
Especie: ${pet.species}
Raza: ${pet.breed || 'No especificada'}
Edad: ${age}
Género: ${pet.gender || 'No especificado'}
Peso: ${pet.weight ? `${pet.weight}kg` : 'No registrado'}

${medicalRecords && medicalRecords.length > 0 ? 
  `Historial médico reciente:\n${medicalRecords.map(r => `- ${r.title} (${r.record_type}): ${r.description || r.diagnosis || ''}`).join('\n')}` 
  : 'Sin historial médico registrado'}

${appointments && appointments.length > 0 ?
  `Última cita: ${appointments[0].appointment_date}` 
  : 'Sin citas registradas'}

Época del año: ${currentMonth >= 3 && currentMonth <= 6 ? 'Primavera (alerta procesionaria)' : 
  currentMonth >= 6 && currentMonth <= 9 ? 'Verano (golpe de calor)' : 
  currentMonth >= 9 && currentMonth <= 11 ? 'Otoño (leishmaniosis)' : 'Invierno'}
    `.trim();

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY no configurada');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente veterinario experto. Proporciona consejos personalizados, concisos y prácticos para el cuidado de la mascota basándote en su información. 
            Incluye:
            - Recomendaciones de salud específicas para su raza y edad
            - Alertas estacionales relevantes (procesionaria, golpe de calor, etc.)
            - Consejos de nutrición
            - Próximas vacunas o desparasitación recomendadas
            - Señales de alerta a vigilar
            
            Responde en español de España, en un tono profesional pero cercano. Máximo 250 palabras.`
          },
          {
            role: 'user',
            content: `Genera consejos personalizados para:\n\n${context}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        throw new Error('Límite de solicitudes alcanzado. Por favor, inténtalo más tarde.');
      }
      if (aiResponse.status === 402) {
        throw new Error('Servicio no disponible temporalmente.');
      }
      throw new Error('Error al generar consejos');
    }

    const aiData = await aiResponse.json();
    const advice = aiData.choices[0].message.content;

    // Save advice to database
    const { error: insertError } = await supabaseClient
      .from('pet_advice')
      .insert({
        pet_id: petId,
        user_id: user.id,
        advice_text: advice,
      });

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ 
        advice,
        cached: false,
        daysUntilNext: 7
      }),
      { headers: { ...getCorsHeaders(req),'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in pet-advice function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error al generar consejos' }),
      { 
        status: 500,
        headers: { ...getCorsHeaders(req),'Content-Type': 'application/json' }
      }
    );
  }
});
