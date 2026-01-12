# Sistema de Recordatorios Automaticos - VetWonder

Este documento describe como configurar el sistema de recordatorios automaticos para citas y vacunaciones.

## Arquitectura

```
+----------------+     +------------------+     +------------+
|  pg_cron       | --> | Edge Function    | --> | n8n        |
|  (cada hora)   |     | send-reminders   |     | webhook    |
+----------------+     +------------------+     +------------+
                              |                      |
                              v                      v
                       +-------------+        +-------------+
                       | Supabase DB |        | WhatsApp/   |
                       | (mark sent) |        | SMS/Email   |
                       +-------------+        +-------------+
```

## Componentes

### 1. Edge Function: `send-reminders`

**Ubicacion:** `supabase/functions/send-reminders/index.ts`

**Funcionalidad:**
- Busca citas confirmadas en las proximas 24 horas
- Busca vacunaciones proximas a vencer (7 dias)
- Envia batch de recordatorios al webhook de n8n
- Marca los registros como `reminder_sent` para evitar duplicados

**Variables de entorno requeridas:**
- `SUPABASE_URL` - URL del proyecto Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `N8N_WEBHOOK_URL` - URL del webhook de n8n

### 2. Cron Job (pg_cron)

El cron job ejecuta la Edge Function cada hora para enviar recordatorios pendientes.

## Configuracion Paso a Paso

### Paso 1: Habilitar pg_cron en Supabase

1. Ve al Dashboard de Supabase
2. Settings > Database > Extensions
3. Busca `pg_cron` y habilitalo
4. Tambien habilita `pg_net` (necesario para HTTP requests)

### Paso 2: Crear el Cron Job

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- Habilitar extensiones (si no estan habilitadas)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Crear el cron job que se ejecuta cada hora
SELECT cron.schedule(
  'send-reminders-hourly',
  '0 * * * *',  -- Cada hora, minuto 0
  $$
  SELECT net.http_post(
    url := 'https://REDACTED_PROJECT.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
```

**Nota:** Reemplaza la URL con tu proyecto de Supabase si es diferente.

### Paso 3: Configurar Variable de Entorno

En Supabase Dashboard > Settings > Database > Configuration:

Anade la variable `app.settings.service_role_key` con tu service role key.

Alternativamente, usa la funcion con el service role key directamente en el cron:

```sql
SELECT cron.schedule(
  'send-reminders-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://REDACTED_PROJECT.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1...'  -- Tu service role key
    ),
    body := '{}'::jsonb
  );
  $$
);
```

### Paso 4: Configurar webhook de n8n

En Supabase Dashboard > Edge Functions > send-reminders > Secrets:

Anade la variable:
- `N8N_WEBHOOK_URL` = URL de tu webhook n8n (ej: `https://tu-n8n.com/webhook/abc123`)

### Paso 5: Verificar el cron job

```sql
-- Ver jobs programados
SELECT * FROM cron.job;

-- Ver historial de ejecuciones
SELECT * FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 10;

-- Eliminar un job (si necesitas recrearlo)
SELECT cron.unschedule('send-reminders-hourly');
```

## Estructura del Payload enviado a n8n

Cuando la Edge Function envia recordatorios, el payload tiene esta estructura:

```json
{
  "reminders": [
    {
      "type": "appointment",
      "id": "uuid-de-la-cita",
      "name": "Nombre del Cliente",
      "phone": "651503827",
      "pet_name": "Max",
      "appointment_date": "2025-12-01T10:00:00Z",
      "appointment_type": "consulta"
    },
    {
      "type": "vaccination",
      "id": "uuid-de-la-vacuna",
      "name": "Nombre del Cliente",
      "phone": "612345678",
      "pet_name": "Luna",
      "vaccine_name": "Rabia",
      "due_date": "2025-12-05T00:00:00Z"
    }
  ],
  "timestamp": "2025-11-28T10:00:00Z",
  "clinic": "VetWonder Moralzarzal",
  "phone": "651 50 38 27"
}
```

## Ejemplo de Workflow n8n

### Workflow basico para WhatsApp via Twilio

```json
{
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "vetwonder-reminders",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Split Reminders",
      "type": "n8n-nodes-base.splitInBatches",
      "parameters": {
        "batchSize": 1,
        "options": {}
      }
    },
    {
      "name": "Format Message",
      "type": "n8n-nodes-base.set",
      "parameters": {
        "values": {
          "string": [
            {
              "name": "message",
              "value": "={{$json.type === 'appointment' ? 'Hola ' + $json.name + ', te recordamos tu cita manana a las ' + new Date($json.appointment_date).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}) + ' para ' + $json.pet_name + '. VetWonder Moralzarzal' : 'Hola ' + $json.name + ', la vacuna ' + $json.vaccine_name + ' de ' + $json.pet_name + ' vence pronto. Pide cita en VetWonder Moralzarzal 651 50 38 27'}}"
            }
          ]
        }
      }
    },
    {
      "name": "Send WhatsApp",
      "type": "n8n-nodes-base.twilio",
      "parameters": {
        "operation": "send",
        "from": "whatsapp:+14155238886",
        "to": "={{`whatsapp:+34${$json.phone}`}}",
        "message": "={{$json.message}}"
      }
    }
  ]
}
```

### Alternativa: SMS via Twilio

```javascript
// En un nodo Function de n8n
const reminder = $input.item.json;

let message = '';
if (reminder.type === 'appointment') {
  const date = new Date(reminder.appointment_date);
  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  message = `VetWonder: Hola ${reminder.name}, te recordamos tu cita manana a las ${time} para ${reminder.pet_name}. Tel: 651 50 38 27`;
} else {
  message = `VetWonder: Hola ${reminder.name}, la vacuna ${reminder.vaccine_name} de ${reminder.pet_name} vence pronto. Pide cita: 651 50 38 27`;
}

return {
  to: `+34${reminder.phone}`,
  message: message
};
```

## Pruebas

### Probar la Edge Function manualmente

```bash
curl -X POST 'https://REDACTED_PROJECT.supabase.co/functions/v1/send-reminders' \
  -H 'Authorization: Bearer TU_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'
```

### Probar el webhook de n8n

```bash
curl -X POST 'https://tu-n8n.com/webhook/vetwonder-reminders' \
  -H 'Content-Type: application/json' \
  -d '{
    "reminders": [{
      "type": "appointment",
      "id": "test-123",
      "name": "Test User",
      "phone": "600000000",
      "pet_name": "Test Pet",
      "appointment_date": "2025-12-01T10:00:00Z",
      "appointment_type": "consulta"
    }],
    "timestamp": "2025-11-30T10:00:00Z",
    "clinic": "VetWonder Moralzarzal",
    "phone": "651 50 38 27"
  }'
```

## Troubleshooting

### Los recordatorios no se envian

1. Verifica que pg_cron esta habilitado
2. Revisa los logs de la Edge Function en Supabase Dashboard
3. Verifica que el webhook de n8n esta accesible
4. Revisa `cron.job_run_details` para ver errores

### Recordatorios duplicados

El sistema marca `reminder_sent` despues de enviar. Si ves duplicados:

1. Verifica que la columna `reminder_sent` existe en las tablas
2. Asegurate de que la Edge Function tiene permisos de escritura

### Cron job no se ejecuta

```sql
-- Verificar estado del cron
SELECT * FROM cron.job WHERE jobname = 'send-reminders-hourly';

-- Verificar pg_net esta habilitado
SELECT * FROM pg_extension WHERE extname = 'pg_net';
```

## Mantenimiento

### Limpiar historial de cron jobs

```sql
-- Eliminar registros antiguos (mas de 7 dias)
DELETE FROM cron.job_run_details
WHERE end_time < NOW() - INTERVAL '7 days';
```

### Pausar temporalmente los recordatorios

```sql
-- Pausar
UPDATE cron.job SET active = false WHERE jobname = 'send-reminders-hourly';

-- Reactivar
UPDATE cron.job SET active = true WHERE jobname = 'send-reminders-hourly';
```

## Contacto

- Clinica: VetWonder Moralzarzal
- Telefono: 651 50 38 27
- Supabase Project ID: REDACTED_PROJECT
