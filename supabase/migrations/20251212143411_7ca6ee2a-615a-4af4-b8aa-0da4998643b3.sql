-- Fix security issues: Add explicit SELECT policies to block public reads on sensitive tables

-- Restrict waitlist reads
CREATE POLICY "Restrict waitlist reads"
ON public.waitlist
FOR SELECT
USING (false);

-- Restrict contact_submissions reads
CREATE POLICY "Restrict contact submissions reads"
ON public.contact_submissions
FOR SELECT
USING (false);

-- Restrict sponsor_interest reads
CREATE POLICY "Restrict sponsor interest reads"
ON public.sponsor_interest
FOR SELECT
USING (false);