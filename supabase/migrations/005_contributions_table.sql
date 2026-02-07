-- ============================================================
-- Migration 005: Contributions table + triggers
-- Wedding Gift List MVP — Epic 6 (Checkout & Betalingen)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id UUID REFERENCES public.gifts(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  amount INTEGER NOT NULL CHECK (amount > 0),
  message TEXT,
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  is_thank_you_sent BOOLEAN DEFAULT false NOT NULL,
  thank_you_message TEXT,
  thank_you_sent_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contributions_gift_id ON public.contributions(gift_id);
CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON public.contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON public.contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_stripe_session
  ON public.contributions(stripe_checkout_session_id);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.contributions;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.contributions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- Trigger: Auto-update gifts.collected_amount & is_fully_funded
-- Fires after INSERT/UPDATE/DELETE on contributions
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_gift_collected()
RETURNS TRIGGER AS $$
DECLARE
  target_gift_id UUID;
  new_collected INTEGER;
  gift_target INTEGER;
BEGIN
  -- Determine which gift_id to recalculate
  IF TG_OP = 'DELETE' THEN
    target_gift_id := OLD.gift_id;
  ELSE
    target_gift_id := NEW.gift_id;
    -- Also recalculate old gift if gift_id changed
    IF TG_OP = 'UPDATE' AND OLD.gift_id IS DISTINCT FROM NEW.gift_id AND OLD.gift_id IS NOT NULL THEN
      SELECT COALESCE(SUM(amount), 0) INTO new_collected
        FROM public.contributions
        WHERE gift_id = OLD.gift_id AND status = 'succeeded';
      SELECT target_amount INTO gift_target FROM public.gifts WHERE id = OLD.gift_id;
      UPDATE public.gifts
        SET collected_amount = new_collected,
            is_fully_funded = (new_collected >= gift_target)
        WHERE id = OLD.gift_id;
    END IF;
  END IF;

  IF target_gift_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  SELECT COALESCE(SUM(amount), 0) INTO new_collected
    FROM public.contributions
    WHERE gift_id = target_gift_id AND status = 'succeeded';

  SELECT target_amount INTO gift_target FROM public.gifts WHERE id = target_gift_id;

  UPDATE public.gifts
    SET collected_amount = new_collected,
        is_fully_funded = (new_collected >= gift_target)
    WHERE id = target_gift_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_gift_collected ON public.contributions;
CREATE TRIGGER trg_update_gift_collected
  AFTER INSERT OR UPDATE OR DELETE ON public.contributions
  FOR EACH ROW EXECUTE FUNCTION public.update_gift_collected();

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Gift owner can read contributions for their gifts
CREATE POLICY "Owner can read contributions"
  ON public.contributions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role bypasses RLS automatically, so no insert/update policy needed
-- for webhook processing. But allow service role explicitly:
CREATE POLICY "Service role full access"
  ON public.contributions FOR ALL
  USING (auth.role() = 'service_role');
