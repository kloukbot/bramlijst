-- ============================================================
-- Migration 002: Row Level Security Policies for Profiles
-- Wedding Gift List MVP
-- ============================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Owner can view own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Owner can update own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Public can view published profiles (for public gift list pages)
CREATE POLICY "Public can view published profiles"
  ON public.profiles FOR SELECT
  USING (is_published = true);
