-- Felicio Clone Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  iban TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gift Lists table
CREATE TABLE public.lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_date DATE,
  cover_image TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gifts table
CREATE TABLE public.gifts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  list_id UUID REFERENCES public.lists(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  image TEXT,
  external_url TEXT,
  is_group_gift BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contributions table
CREATE TABLE public.contributions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gift_id UUID REFERENCES public.gifts(id) ON DELETE CASCADE NOT NULL,
  contributor_name TEXT NOT NULL,
  contributor_email TEXT,
  amount_cents INTEGER NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Lists policies
CREATE POLICY "Users can view own lists" ON public.lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published lists" ON public.lists
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can insert own lists" ON public.lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lists" ON public.lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lists" ON public.lists
  FOR DELETE USING (auth.uid() = user_id);

-- Gifts policies
CREATE POLICY "Anyone can view gifts of published lists" ON public.gifts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.lists 
      WHERE lists.id = gifts.list_id 
      AND (lists.is_published = true OR lists.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage gifts of own lists" ON public.gifts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.lists 
      WHERE lists.id = gifts.list_id 
      AND lists.user_id = auth.uid()
    )
  );

-- Contributions policies
CREATE POLICY "Anyone can insert contributions" ON public.contributions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "List owners can view contributions" ON public.contributions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.gifts
      JOIN public.lists ON lists.id = gifts.list_id
      WHERE gifts.id = contributions.gift_id
      AND lists.user_id = auth.uid()
    )
  );

-- Create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_lists_user_id ON public.lists(user_id);
CREATE INDEX idx_lists_slug ON public.lists(slug);
CREATE INDEX idx_gifts_list_id ON public.gifts(list_id);
CREATE INDEX idx_contributions_gift_id ON public.contributions(gift_id);
