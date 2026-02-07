-- ============================================================
-- Migration 004: Storage Buckets
-- Wedding Gift List MVP
-- ============================================================

-- Gift images bucket (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gift-images',
  'gift-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Profile images bucket (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Storage RLS Policies
-- ============================================================

-- Gift images: owner can upload to own folder
CREATE POLICY "Users can upload own gift images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gift-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own gift images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'gift-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own gift images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gift-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Profile images: owner can upload to own folder
CREATE POLICY "Users can upload own profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own profile images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own profile images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public read for both buckets
CREATE POLICY "Public can view gift images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gift-images');

CREATE POLICY "Public can view profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');
