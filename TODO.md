# 📋 VetWonder - Tareas Pendientes y Configuración

## 🔧 Configuraciones Necesarias

### 1. **n8n Webhook para Recordatorios**
**Estado**: ⏳ Pendiente de configurar

**Pasos**:
1. Ir a n8n y crear un nuevo workflow
2. Añadir un webhook trigger (método POST)
3. Configurar las acciones:
   - Parsear el JSON recibido
   - Filtrar por tipo de recordatorio (`appointment` o `vaccination`)
   - Enviar emails con Resend/Gmail/SMTP
   - Opcional: Enviar SMS con Twilio
4. Copiar la URL del webhook generada
5. En Lovable Cloud → Secrets, añadir:
   - Secret name: `N8N_WEBHOOK_URL`
   - Value: `https://tu-instancia.n8n.io/webhook/tu-webhook-id`

**Payload que recibirá n8n**:
```json
{
  "reminders": [
    {
      "type": "appointment",
      "id": "uuid",
      "name": "Nombre Cliente",
      "phone": "651503827",
      "pet_name": "Max",
      "appointment_date": "2025-12-01T10:00:00Z",
      "appointment_type": "Consulta general"
    },
    {
      "type": "vaccination",
      "id": "uuid",
      "name": "Nombre Cliente",
      "phone": "651503827",
      "pet_name": "Luna",
      "vaccine_name": "Rabia",
      "due_date": "2025-12-05"
    }
  ],
  "timestamp": "2025-11-28T10:00:00Z",
  "clinic": "VetWonder Moralzarzal",
  "phone": "651 50 38 27"
}
```

### 2. **Configurar Cron Job para Recordatorios**
**Estado**: ⏳ Pendiente

Una vez tengas el webhook configurado, ejecuta este SQL en Cloud → Database → SQL Editor:

```sql
-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Crear cron job que se ejecuta cada hora
SELECT cron.schedule(
  'send-veterinary-reminders',
  '0 * * * *',  -- Cada hora en punto
  $$
  SELECT net.http_post(
    url := 'https://REDACTED_PROJECT.supabase.co/functions/v1/send-reminders',
    headers := '{"Authorization": "Bearer REDACTED_KEY"}'::jsonb
  );
  $$
);
```

Para verificar que está activo:
```sql
SELECT * FROM cron.job;
```

### 3. **Elfsight Instagram Widget**
**Estado**: ⏳ Pendiente (alternativa manual disponible)

**Opción A - Widget de Elfsight** (Recomendado):
1. Ir a [Elfsight Instagram Feed](https://elfsight.com/instagram-feed-instashow/)
2. Crear cuenta gratuita
3. Conectar cuenta de Instagram @lahuella_dewonder
4. Personalizar diseño (6 columnas, sin bordes)
5. Copiar el código del widget
6. Reemplazar el div en `src/components/instagram/InstagramFeed.tsx`:
   ```tsx
   <div className="elfsight-app-TU-CODIGO-AQUI" />
   ```

**Opción B - Usar tabla gallery_photos**:
- Ya existe en la base de datos
- Subir fotos manualmente desde el admin
- Se mostrarán automáticamente

### 4. **Contenido Inicial para Base de Datos**

#### Añadir noticias de ejemplo:
```sql
INSERT INTO news (title, excerpt, content, category, image_url, published)
VALUES 
  (
    'Consejos para el cuidado dental de tu perro',
    'La salud dental es fundamental para el bienestar de tu mascota',
    'El cuidado dental en perros es esencial para prevenir enfermedades...',
    'Consejos',
    NULL,
    true
  ),
  (
    'Campaña de vacunación 2025',
    'Protege a tu mascota con nuestro plan de vacunación anual',
    'Ya está disponible nuestra campaña de vacunación para el año 2025...',
    'Noticias',
    NULL,
    true
  );
```

---

## ✅ Completado

- [x] Logo y teléfono en header
- [x] Arreglar vídeo YouTube (sin overlay, sin barras negras)
- [x] Corregir mapa de Google Maps
- [x] Sección "Últimas Noticias" con tabla `news`
- [x] Sección Instagram Feed
- [x] Chatbot mejorado con detección de intención de citas
- [x] Sistema de recordatorios (Edge Function)
- [x] Migración de base de datos (news, reminders)

---

## 📝 Próximos Pasos Recomendados

1. **Configurar n8n webhook** (prioritario para recordatorios)
2. **Activar cron job** en base de datos
3. **Configurar widget de Instagram** o subir fotos manualmente
4. **Añadir contenido inicial** (noticias)
5. **Probar sistema de recordatorios** con una cita de prueba
6. **Personalizar emails** en n8n con branding de VetWonder

---

## 📞 Contacto y Soporte

- **Teléfono**: 651 50 38 27
- **Email**: info@vetwonder.es
- **Instagram**: @lahuella_dewonder
- **Ubicación**: Moralzarzal, Madrid

---

**Última actualización**: 28 de noviembre de 2025
