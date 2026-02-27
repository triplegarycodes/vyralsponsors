
-- Fix 1: Replace permissive vboard-uploads storage policies with user-scoped ones
DROP POLICY IF EXISTS "Anyone can upload to vboard-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read from vboard-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from vboard-uploads" ON storage.objects;

CREATE POLICY "Authenticated users can upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vboard-uploads' AND
  auth.uid() IS NOT NULL AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'vboard-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vboard-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Fix 2: Restrict vboard_trials SELECT to fingerprint-scoped access
DROP POLICY IF EXISTS "Anyone can read trial status" ON public.vboard_trials;

CREATE POLICY "Users can only read own trial record"
ON public.vboard_trials FOR SELECT
USING (
  device_fingerprint = current_setting('request.headers', true)::json->>'x-device-fingerprint'
);
