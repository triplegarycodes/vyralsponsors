-- Fix vboard_trials RLS policy to prevent manipulation
-- Drop existing permissive UPDATE policy
DROP POLICY IF EXISTS "Anyone can update trial count" ON public.vboard_trials;

-- Create a more restrictive UPDATE policy
-- Only allow incrementing trials_used, not resetting it
CREATE POLICY "Users can only increment their own trial count"
ON public.vboard_trials
FOR UPDATE
USING (true)
WITH CHECK (
  -- Prevent decrementing trials_used (must be >= current value)
  trials_used >= (SELECT t.trials_used FROM public.vboard_trials t WHERE t.device_fingerprint = public.vboard_trials.device_fingerprint LIMIT 1)
);

-- Add database-level constraints for contact_submissions as defense in depth
-- Use DO block to handle "already exists" gracefully
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_name_length') THEN
    ALTER TABLE public.contact_submissions ADD CONSTRAINT check_name_length CHECK (char_length(name) <= 100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_email_length') THEN
    ALTER TABLE public.contact_submissions ADD CONSTRAINT check_email_length CHECK (char_length(email) <= 255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_message_length') THEN
    ALTER TABLE public.contact_submissions ADD CONSTRAINT check_message_length CHECK (char_length(message) <= 5000);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_subject_length') THEN
    ALTER TABLE public.contact_submissions ADD CONSTRAINT check_subject_length CHECK (subject IS NULL OR char_length(subject) <= 100);
  END IF;
END $$;