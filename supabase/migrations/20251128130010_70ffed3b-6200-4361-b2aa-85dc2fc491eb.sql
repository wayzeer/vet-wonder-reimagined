-- Tabla de noticias
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  category TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  clinic_id UUID REFERENCES public.clinics(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS para news
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news"
  ON public.news
  FOR SELECT
  USING (published = true);

CREATE POLICY "Staff can manage news"
  ON public.news
  FOR ALL
  USING (
    has_role(auth.uid(), 'staff'::app_role) OR 
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Añadir columna reminder_sent a appointments
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS reminder_sent TIMESTAMPTZ;

-- Añadir columna reminder_sent a vaccinations
ALTER TABLE public.vaccinations 
ADD COLUMN IF NOT EXISTS reminder_sent TIMESTAMPTZ;

-- Trigger para updated_at en news
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_reminder ON public.appointments(appointment_date, reminder_sent) WHERE status = 'confirmed';
CREATE INDEX IF NOT EXISTS idx_vaccinations_reminder ON public.vaccinations(next_due_date, reminder_sent);