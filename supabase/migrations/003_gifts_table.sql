-- ============================================================
-- Migration 003: Gifts table
-- Wedding Gift List MVP
-- ============================================================

CREATE TABLE IF NOT EXISTS public.gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_amount INTEGER NOT NULL CHECK (target_amount > 0),
  collected_amount INTEGER DEFAULT 0 NOT NULL CHECK (collected_amount >= 0),
  image_url TEXT,
  is_fully_funded BOOLEAN DEFAULT false NOT NULL,
  allow_partial BOOLEAN DEFAULT true NOT NULL,
  min_contribution INTEGER DEFAULT 500 NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_visible BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gifts_user_id ON public.gifts(user_id);
CREATE INDEX IF NOT EXISTS idx_gifts_user_id_sort_order ON public.gifts(user_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_gifts_user_id_visible ON public.gifts(user_id, is_visible);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.gifts;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.gifts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- Owner can do everything with their own gifts
CREATE POLICY "Owner can manage gifts"
  ON public.gifts FOR ALL
  USING (auth.uid() = user_id);

-- Public can view visible gifts of published profiles
CREATE POLICY "Public can view visible gifts"
  ON public.gifts FOR SELECT
  USING (
    is_visible = true
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = gifts.user_id
      AND profiles.is_published = true
    )
  );
