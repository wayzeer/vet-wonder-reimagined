-- Migration to add unique constraint and admin role
-- First, add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_roles_user_id_role_key'
  ) THEN
    ALTER TABLE public.user_roles 
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;

-- Now insert admin role for the specified user
-- IMPORTANT: Replace 'admin@vetwonder.es' with your actual admin user email
-- The user must be registered through the signup page first
INSERT INTO public.user_roles (user_id, role, clinic_id)
SELECT 
  au.id,
  'admin'::app_role,
  (SELECT id FROM public.clinics LIMIT 1)
FROM auth.users au
WHERE au.email = 'admin@vetwonder.es'
ON CONFLICT (user_id, role) DO NOTHING;