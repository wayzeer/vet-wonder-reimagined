-- Crear tabla para citas de invitados (sin cuenta)
CREATE TABLE public.guest_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  pet_name TEXT NOT NULL,
  pet_species TEXT NOT NULL,
  appointment_type TEXT NOT NULL,
  preferred_date TIMESTAMPTZ NOT NULL,
  preferred_time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  clinic_id UUID NOT NULL REFERENCES public.clinics(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guest_appointments ENABLE ROW LEVEL SECURITY;

-- Staff can view and manage guest appointments
CREATE POLICY "Staff can manage guest appointments"
ON public.guest_appointments
FOR ALL
USING (is_clinic_staff(auth.uid(), clinic_id));

-- Anyone can create guest appointments (no auth required)
CREATE POLICY "Anyone can create guest appointments"
ON public.guest_appointments
FOR INSERT
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_guest_appointments_updated_at
BEFORE UPDATE ON public.guest_appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_guest_appointments_clinic_id ON public.guest_appointments(clinic_id);
CREATE INDEX idx_guest_appointments_status ON public.guest_appointments(status);