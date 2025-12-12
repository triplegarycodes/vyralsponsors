-- Create product type enum
CREATE TYPE public.product_type AS ENUM ('supporter_access', 'sponsorship', 'donation');

-- Create payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Create role type enum for waitlist
CREATE TYPE public.waitlist_role AS ENUM ('student', 'parent', 'educator', 'sponsor', 'other');

-- Create Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  product_type product_type NOT NULL,
  tier_name TEXT,
  stripe_price_id TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  purchaser_email TEXT NOT NULL,
  purchaser_name TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  payment_provider TEXT NOT NULL DEFAULT 'stripe',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Sponsor Interest table (separate from contact_submissions for sponsor-specific data)
CREATE TABLE public.sponsor_interest (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  company_type TEXT,
  message TEXT,
  tier_interest TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Site Config table for feature toggles
CREATE TABLE public.site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add role column to existing waitlist table
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS role waitlist_role DEFAULT 'other';

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can view active products
CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
USING (active = true);

-- Orders: Only created via edge functions (service role), no direct access
CREATE POLICY "Orders are managed by service role only"
ON public.orders
FOR ALL
USING (false);

-- Sponsor Interest: Anyone can submit
CREATE POLICY "Anyone can submit sponsor interest"
ON public.sponsor_interest
FOR INSERT
WITH CHECK (true);

-- Site Config: Public read for enabled features
CREATE POLICY "Anyone can read site config"
ON public.site_config
FOR SELECT
USING (true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert default site config
INSERT INTO public.site_config (key, value) VALUES
  ('purchases_enabled', 'true'::jsonb),
  ('waitlist_open', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Insert sponsorship tier products
INSERT INTO public.products (name, description, price_cents, currency, product_type, tier_name, features, active) VALUES
  (
    'Spark Tier',
    'Low-cost entry for individuals and small groups. Perfect for early believers in the VYRAL mission.',
    2500,
    'usd',
    'sponsorship',
    'spark',
    '["Early access newsletters", "1 exclusive merch drop", "Digital supporter badge", "Name on supporters page"]'::jsonb,
    true
  ),
  (
    'Ignite Tier',
    'For educators, small businesses, or youth organizations who want to bring VYRAL to their community.',
    14900,
    'usd',
    'sponsorship',
    'ignite',
    '["App access for 10 teens", "Classroom/group dashboards", "2 exclusive merch items", "Sponsor spotlight feature", "Private webinar access"]'::jsonb,
    true
  ),
  (
    'Inferno Tier',
    'Top-level brand partnership for organizations committed to teen empowerment and innovation.',
    49900,
    'usd',
    'sponsorship',
    'inferno',
    '["App access for 50 teens", "Custom Tree evolution cosmetic", "Logo in sponsor constellation view", "Early-feature testing access", "Physical Neo Band prototypes", "PR feature opportunities"]'::jsonb,
    true
  ),
  (
    'Cosmic Partner',
    'Premium corporate or institution-level partnership with deep integration and co-creation opportunities.',
    149900,
    'usd',
    'sponsorship',
    'cosmic',
    '["Co-branded Vybe reskin", "R&D collaboration access", "Dedicated microsite", "Early adoption pipeline", "Student innovation grant contribution", "Yearly impact report"]'::jsonb,
    true
  );