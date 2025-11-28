-- Crear bucket de storage para fotos de mascotas
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-photos', 'pet-photos', true);

-- Política: Cualquiera puede ver las fotos
CREATE POLICY "Fotos de mascotas son públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'pet-photos');

-- Política: Usuarios autenticados pueden subir sus propias fotos
CREATE POLICY "Usuarios pueden subir fotos de mascotas"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pet-photos' 
  AND auth.role() = 'authenticated'
);

-- Política: Usuarios pueden actualizar sus propias fotos
CREATE POLICY "Usuarios pueden actualizar sus fotos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pet-photos' 
  AND auth.role() = 'authenticated'
);

-- Política: Usuarios pueden eliminar sus propias fotos
CREATE POLICY "Usuarios pueden eliminar sus fotos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pet-photos' 
  AND auth.role() = 'authenticated'
);

-- Insertar clínica por defecto VetWonder Moralzarzal
INSERT INTO public.clinics (name, address, phone, email, description)
VALUES (
  'VetWonder Moralzarzal',
  'Calle Example, 123, Moralzarzal, Madrid',
  '651 50 38 27',
  'info@vetwonder.com',
  'Clínica veterinaria especializada en el cuidado integral de tu mascota. Atención personalizada, urgencias 24h y los mejores profesionales.'
);

-- Insertar artículos de blog iniciales
INSERT INTO public.blog_posts (title, slug, content, excerpt, category, published, published_at, clinic_id)
VALUES 
(
  'La Procesionaria del Pino: Peligro Mortal para tu Mascota',
  'procesionaria-pino-peligro',
  '<h2>¿Qué es la procesionaria?</h2><p>La procesionaria del pino (Thaumetopoea pityocampa) es una oruga que desciende de los pinos en fila durante los meses de febrero a abril. Sus pelos urticantes pueden causar graves reacciones en perros y gatos.</p><h2>Síntomas de contacto</h2><ul><li>Inflamación severa de lengua y boca</li><li>Salivación excesiva</li><li>Vómitos</li><li>Necrosis de tejidos</li><li>Dificultad respiratoria</li></ul><h2>¿Qué hacer?</h2><p><strong>URGENCIA VETERINARIA INMEDIATA</strong>. Lava la zona con agua abundante sin frotar. No intentes quitar los pelos. Acude a tu veterinario de inmediato.</p><p>En VetWonder estamos preparados para atender estas urgencias. Llama al <strong>651 50 38 27</strong>.</p>',
  'Alerta sobre la oruga procesionaria, sus peligros y cómo actuar en caso de contacto.',
  'Alerta',
  true,
  NOW(),
  (SELECT id FROM public.clinics WHERE name = 'VetWonder Moralzarzal' LIMIT 1)
),
(
  'Vacunación Antirrábica: Obligatoria en Madrid',
  'vacunacion-antirrabica-madrid',
  '<h2>Normativa en la Comunidad de Madrid</h2><p>La vacunación contra la rabia es <strong>obligatoria</strong> para todos los perros en la Comunidad de Madrid a partir de los 3 meses de edad.</p><h2>Calendario de vacunación</h2><ul><li>Primera dosis: 3-4 meses de edad</li><li>Revacunación: Anual</li></ul><h2>Sanciones</h2><p>No vacunar a tu perro puede conllevar multas de hasta 3.000€.</p><h2>Certificado oficial</h2><p>En VetWonder expedimos el certificado oficial de vacunación y realizamos la inscripción en el registro correspondiente. Pide cita en el <strong>651 50 38 27</strong>.</p>',
  'Todo lo que necesitas saber sobre la vacuna de la rabia obligatoria en Madrid.',
  'Normativa',
  true,
  NOW(),
  (SELECT id FROM public.clinics WHERE name = 'VetWonder Moralzarzal' LIMIT 1)
),
(
  'Leishmaniosis Canina: Prevención y Tratamiento',
  'leishmaniosis-canina',
  '<h2>¿Qué es la leishmaniosis?</h2><p>La leishmaniosis es una enfermedad grave transmitida por la picadura del mosquito flebotomo. Afecta principalmente a perros y puede ser mortal si no se trata.</p><h2>Síntomas</h2><ul><li>Pérdida de peso</li><li>Lesiones en piel (especialmente en nariz y orejas)</li><li>Crecimiento anormal de uñas</li><li>Problemas renales</li><li>Apatía</li></ul><h2>Prevención</h2><p>Existen vacunas y collares repelentes específicos. La prevención es clave, especialmente en zonas endémicas como Madrid.</p><h2>Diagnóstico y tratamiento</h2><p>En VetWonder realizamos tests rápidos de detección y ofrecemos tratamientos personalizados. Consulta con nuestros especialistas.</p>',
  'Información completa sobre leishmaniosis: síntomas, prevención y tratamiento.',
  'Prevención',
  true,
  NOW(),
  (SELECT id FROM public.clinics WHERE name = 'VetWonder Moralzarzal' LIMIT 1)
),
(
  'Cuidados para tu Mascota en Verano',
  'cuidados-verano-mascotas',
  '<h2>Protege a tu mascota del calor</h2><p>Las altas temperaturas pueden ser peligrosas. Los perros y gatos no sudan como nosotros y son más susceptibles al golpe de calor.</p><h2>Consejos esenciales</h2><ul><li>Agua fresca siempre disponible</li><li>Evita paseos en horas de máximo calor (12h-18h)</li><li>Nunca dejes a tu mascota en el coche</li><li>Proporciona zonas de sombra</li><li>Considera cortarle el pelo (consulta antes con tu veterinario)</li></ul><h2>Señales de golpe de calor</h2><ul><li>Jadeo excesivo</li><li>Temblores</li><li>Encías muy rojas o pálidas</li><li>Desorientación</li></ul><p><strong>URGENCIA:</strong> Si detectas estos síntomas, moja a tu mascota con agua fresca (no helada) y acude inmediatamente al veterinario.</p>',
  'Consejos prácticos para proteger a tu mascota durante el verano.',
  'Consejos',
  true,
  NOW(),
  (SELECT id FROM public.clinics WHERE name = 'VetWonder Moralzarzal' LIMIT 1)
),
(
  'Calendario de Desparasitación: ¿Cada Cuánto?',
  'calendario-desparasitacion',
  '<h2>Importancia de la desparasitación</h2><p>La desparasitación regular protege a tu mascota de parásitos internos (lombrices) y externos (pulgas, garrapatas). También protege a tu familia.</p><h2>Desparasitación interna</h2><ul><li>Cachorros: Cada 15 días hasta los 3 meses, luego mensual hasta los 6 meses</li><li>Adultos: Cada 3 meses</li></ul><h2>Desparasitación externa</h2><ul><li>Todo el año: Collares, pipetas o comprimidos mensuales</li><li>Especialmente importante de marzo a octubre (temporada de garrapatas)</li></ul><h2>Productos recomendados</h2><p>En VetWonder te asesoramos sobre el mejor antiparasitario según el estilo de vida de tu mascota. No todos los productos son igual de efectivos.</p><p>Consulta nuestro plan de desparasitación personalizado.</p>',
  'Guía completa sobre cuándo y cómo desparasitar a tu mascota.',
  'Prevención',
  true,
  NOW(),
  (SELECT id FROM public.clinics WHERE name = 'VetWonder Moralzarzal' LIMIT 1)
);