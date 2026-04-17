-- 1. Profiles: prevent email column changes via API (email changes go through auth)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND email = (SELECT p.email FROM public.profiles p WHERE p.user_id = auth.uid())
);

-- 2. Orders: drop email-based fallback, only owner by user_id can read
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Order items: align with orders policy (owner-only via user_id)
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items"
ON public.order_items
FOR SELECT
USING (
  order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);

-- 4. vboard_trials: restrict UPDATE to caller's own device fingerprint
DROP POLICY IF EXISTS "Users can only increment their own trial count" ON public.vboard_trials;
CREATE POLICY "Users can only increment their own trial count"
ON public.vboard_trials
FOR UPDATE
USING (
  device_fingerprint = ((current_setting('request.headers', true))::json ->> 'x-device-fingerprint')
)
WITH CHECK (
  device_fingerprint = ((current_setting('request.headers', true))::json ->> 'x-device-fingerprint')
  AND trials_used >= (
    SELECT t.trials_used FROM public.vboard_trials t
    WHERE t.device_fingerprint = vboard_trials.device_fingerprint
    LIMIT 1
  )
);