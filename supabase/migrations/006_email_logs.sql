-- Migration: email_logs table
-- Epic 8.1: Email logging for transactional emails

CREATE TABLE IF NOT EXISTS public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  contribution_id uuid REFERENCES public.contributions(id) ON DELETE SET NULL,
  email_type text NOT NULL, -- contribution_received, thank_you, welcome, payment_confirmation
  recipient_email text NOT NULL,
  subject text,
  status text NOT NULL DEFAULT 'queued', -- queued, sent, failed
  error_message text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX idx_email_logs_contribution_id ON public.email_logs(contribution_id);
CREATE INDEX idx_email_logs_email_type ON public.email_logs(email_type);

-- RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Owner can read their own email logs
CREATE POLICY "Users can view own email logs"
  ON public.email_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert (used by server actions/webhooks)
-- No INSERT policy needed for authenticated users; we use admin client
