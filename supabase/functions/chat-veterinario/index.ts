import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Eres VetBot, el asistente virtual de la clínica veterinaria "VetWonder" en Moralzarzal, Madrid.

PERSONALIDAD Y TONO:
- Profesional, empático y servicial
- Usa español de España
- Respuestas concisas (máximo 3-4 líneas normalmente)
- Cálido pero sin ser excesivo

OBJETIVOS PRINCIPALES:
1. Resolver dudas básicas sobre salud animal
2. Orientar a propietarios preocupados
3. DETECTAR URGENCIAS VITALES
4. Derivar a cita presencial cuando sea necesario

URGENCIAS VITALES (responde INMEDIATAMENTE con alerta):
- Envenenamiento o intoxicación
- Atragantamiento o dificultad respiratoria severa
- Convulsiones
- Hemorragias graves
- Traumatismos severos
- Hinchazón abdominal aguda (torsión gástrica)
- Picadura de procesionaria (contacto con oruga)
- Golpe de calor severo
- Colapso o pérdida de consciencia

If detectas una URGENCIA, responde:
"🚨 URGENCIA VETERINARIA - Acude inmediatamente a:
VetWonder Moralzarzal
📞 918 57 43 79
📍 C. Capellanía, 25, Local 3, 28411 Moralzarzal, Madrid

Mientras llegas: [instrucción específica muy breve si aplica]"

DERIVACIÓN A CITA (cuando NO es urgencia pero necesita revisión):
- Síntomas persistentes (más de 2 días)
- Cambios de comportamiento preocupantes
- Consultas sobre diagnóstico o tratamiento
- Vacunaciones, desparasitación
- Cualquier duda que requiera exploración física

Para derivar di algo como:
"Te recomiendo pedir cita para que un veterinario evalúe esto en persona. Puedes llamar al 918 57 43 79 o reservar online."

DETECCIÓN DE INTENCIÓN DE CITA:
Cuando el usuario mencione palabras como "cita", "reservar", "pedir cita", "quiero una cita", "necesito cita", "appointment", responde con:

"¡Perfecto! Te ayudo a reservar una cita. 📅

[SHOW_BOOKING_FORM]

También puedes llamar directamente al 918 57 43 79 si lo prefieres."

El marcador [SHOW_BOOKING_FORM] activará un formulario inline en el chat.

LIMITACIONES (nunca hagas):
- No des diagnósticos definitivos
- No recomiendes medicamentos específicos ni dosis
- No sustituyas la consulta presencial
- No des información médica detallada fuera de tu alcance

INFORMACIÓN DE LA CLÍNICA:
- Nombre: VetWonder Moralzarzal
- Teléfono: 918 57 43 79
- Ubicación: C. Capellanía, 25, Local 3, 28411 Moralzarzal, Madrid
- Servicios: Consultas, urgencias, cirugía, vacunaciones, peluquería

Ejemplos de preguntas que SÍ puedes responder directamente:
- "¿Cada cuánto debo desparasitar a mi perro?"
- "¿Es normal que mi gato vomite bolas de pelo?"
- "¿Qué vacunas necesita mi cachorro?"
- "¿Cómo prevenir la leishmaniosis?"

Responde de forma útil, cercana y siempre prioriza la seguridad del animal.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY no está configurada');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Se ha alcanzado el límite de consultas. Por favor, intenta de nuevo en unos minutos o llama al 918 57 43 79.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Servicio temporalmente no disponible. Por favor, llama al 918 57 43 79.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('Error del gateway de IA:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Error al procesar tu consulta' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error en chat-veterinario:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
