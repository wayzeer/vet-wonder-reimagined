-- Security Fix: Restrict access to guest appointment personal data
-- Only clinic staff should be able to view guest contact information

-- First, drop the existing "Staff can manage guest appointments" policy
-- We'll replace it with more specific policies
DROP POLICY IF EXISTS "Staff can manage guest appointments" ON public.guest_appointments;

-- Allow staff to SELECT (view) guest appointments
CREATE POLICY "Staff can view guest appointments"
ON public.guest_appointments
FOR SELECT
USING (is_clinic_staff(auth.uid(), clinic_id));

-- Allow staff to UPDATE guest appointments (change status, etc.)
CREATE POLICY "Staff can update guest appointments"
ON public.guest_appointments
FOR UPDATE
USING (is_clinic_staff(auth.uid(), clinic_id));

-- Allow staff to DELETE guest appointments if needed
CREATE POLICY "Staff can delete guest appointments"
ON public.guest_appointments
FOR DELETE
USING (is_clinic_staff(auth.uid(), clinic_id));

-- The "Anyone can create guest appointments" INSERT policy remains unchanged
-- This allows the public booking form to work while protecting personal data