-- ============================================================
-- Migration 001: Initial Schema - Profiles table
-- Wedding Gift List MVP
-- ============================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  partner_name_1 TEXT,
  partner_name_2 TEXT,
  slug TEXT UNIQUE NOT NULL,
  wedding_date DATE,
  welcome_message TEXT,
  cover_image_url TEXT,
  avatar_url TEXT,
  is_published BOOLEAN DEFAULT false NOT NULL,
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT false NOT NULL,
  currency TEXT DEFAULT 'eur' NOT NULL,
  locale TEXT DEFAULT 'nl' NOT NULL,
  pricing_tier TEXT DEFAULT 'free' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account_id ON public.profiles(stripe_account_id);

-- ============================================================
-- Functions & Triggers
-- ============================================================

-- 1. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, slug, partner_name_1, partner_name_2, wedding_date)
  VALUES (
    NEW.id,
    NEW.email,
    -- Generate slug from email prefix + random suffix
    LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-z0-9]', '', 'g'))
      || '-' || SUBSTR(MD5(RANDOM()::TEXT), 1, 6),
    -- Pull partner names from user metadata if provided
    NEW.raw_user_meta_data->>'partner_name_1',
    NEW.raw_user_meta_data->>'partner_name_2',
    CASE
      WHEN NEW.raw_user_meta_data->>'wedding_date' IS NOT NULL
        AND NEW.raw_user_meta_data->>'wedding_date' != ''
      THEN (NEW.raw_user_meta_data->>'wedding_date')::DATE
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
