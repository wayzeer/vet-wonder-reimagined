-- Create security_logs table for monitoring abuse attempts
CREATE TABLE public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  source TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read security logs
CREATE POLICY "Admins can view security logs"
ON public.security_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Public insert via edge function (service role)
CREATE POLICY "Service role can insert security logs"
ON public.security_logs
FOR INSERT
WITH CHECK (true);

-- Indexes for efficient querying
CREATE INDEX idx_security_logs_event_type ON public.security_logs(event_type);
CREATE INDEX idx_security_logs_created_at ON public.security_logs(created_at DESC);
CREATE INDEX idx_security_logs_ip_hash ON public.security_logs(ip_hash);