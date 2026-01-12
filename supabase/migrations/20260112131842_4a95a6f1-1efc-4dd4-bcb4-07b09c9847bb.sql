-- Create table for tracking AI trial usage per device/fingerprint
CREATE TABLE public.vboard_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_fingerprint TEXT NOT NULL UNIQUE,
  trials_used INTEGER NOT NULL DEFAULT 0,
  max_trials INTEGER NOT NULL DEFAULT 3,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vboard_trials ENABLE ROW LEVEL SECURITY;

-- Anyone can read their own trial count (by fingerprint)
CREATE POLICY "Anyone can read trial status"
ON public.vboard_trials FOR SELECT
USING (true);

-- Anyone can insert their trial record
CREATE POLICY "Anyone can create trial record"
ON public.vboard_trials FOR INSERT
WITH CHECK (true);

-- Anyone can update trial count
CREATE POLICY "Anyone can update trial count"
ON public.vboard_trials FOR UPDATE
USING (true);

-- Create index for fast fingerprint lookups
CREATE INDEX idx_vboard_trials_fingerprint ON public.vboard_trials(device_fingerprint);

-- Create storage bucket for VBoard file uploads (for creative analysis)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vboard-uploads', 'vboard-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to vboard-uploads bucket
CREATE POLICY "Anyone can upload to vboard-uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'vboard-uploads');

-- Allow public read from vboard-uploads (for analysis)
CREATE POLICY "Anyone can read from vboard-uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'vboard-uploads');

-- Allow deletion
CREATE POLICY "Anyone can delete from vboard-uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'vboard-uploads');