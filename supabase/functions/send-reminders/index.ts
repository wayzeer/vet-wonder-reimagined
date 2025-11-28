import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const n8nWebhook = Deno.env.get('N8N_WEBHOOK_URL') || 'https://placeholder-webhook.n8n.io/webhook/reminders';

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔔 Iniciando proceso de recordatorios...');

    // Buscar recordatorios de citas pendientes (24h antes)
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    
    const { data: appointments, error: aptError } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointment_type,
        client_id,
        pet_id,
        pets (name),
        profiles (full_name, phone)
      `)
      .eq('status', 'confirmed')
      .gte('appointment_date', new Date().toISOString())
      .lte('appointment_date', tomorrow.toISOString())
      .is('reminder_sent', null);

    if (aptError) throw aptError;

    console.log(`📅 Encontradas ${appointments?.length || 0} citas para recordar`);

    // Buscar vacunas próximas a vencer (7 días)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const { data: vaccinations, error: vacError } = await supabase
      .from('vaccinations')
      .select(`
        id,
        vaccine_name,
        next_due_date,
        pet_id,
        pets (name, owner_id),
        profiles (full_name, phone)
      `)
      .lte('next_due_date', nextWeek.toISOString())
      .gte('next_due_date', new Date().toISOString())
      .is('reminder_sent', null);

    if (vacError) throw vacError;

    console.log(`💉 Encontradas ${vaccinations?.length || 0} vacunas próximas`);

    const reminders: any[] = [];

    // Preparar recordatorios de citas
    for (const apt of appointments || []) {
      const profile = Array.isArray(apt.profiles) ? apt.profiles[0] : apt.profiles;
      const pet = Array.isArray(apt.pets) ? apt.pets[0] : apt.pets;
      
      reminders.push({
        type: 'appointment',
        id: apt.id,
        name: profile?.full_name || 'Cliente',
        phone: profile?.phone,
        pet_name: pet?.name,
        appointment_date: apt.appointment_date,
        appointment_type: apt.appointment_type,
      });
    }

    // Preparar recordatorios de vacunas
    for (const vac of vaccinations || []) {
      const profile = Array.isArray(vac.profiles) ? vac.profiles[0] : vac.profiles;
      const pet = Array.isArray(vac.pets) ? vac.pets[0] : vac.pets;
      
      reminders.push({
        type: 'vaccination',
        id: vac.id,
        name: profile?.full_name || 'Cliente',
        phone: profile?.phone,
        pet_name: pet?.name,
        vaccine_name: vac.vaccine_name,
        due_date: vac.next_due_date,
      });
    }

    console.log(`📤 Enviando ${reminders.length} recordatorios a n8n webhook...`);

    // Enviar batch a n8n
    if (reminders.length > 0) {
      const webhookResponse = await fetch(n8nWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reminders,
          timestamp: new Date().toISOString(),
          clinic: 'VetWonder Moralzarzal',
          phone: '651 50 38 27',
        }),
      });

      if (!webhookResponse.ok) {
        console.error('Error enviando a n8n:', webhookResponse.status);
      } else {
        console.log('✅ Recordatorios enviados a n8n exitosamente');
      }

      // Marcar como enviados
      const appointmentIds = reminders.filter(r => r.type === 'appointment').map(r => r.id);
      const vaccinationIds = reminders.filter(r => r.type === 'vaccination').map(r => r.id);

      if (appointmentIds.length > 0) {
        await supabase
          .from('appointments')
          .update({ reminder_sent: new Date().toISOString() })
          .in('id', appointmentIds);
      }

      if (vaccinationIds.length > 0) {
        await supabase
          .from('vaccinations')
          .update({ reminder_sent: new Date().toISOString() })
          .in('id', vaccinationIds);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      reminders_sent: reminders.length,
      appointments: appointments?.length || 0,
      vaccinations: vaccinations?.length || 0,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error en send-reminders:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Error desconocido',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
