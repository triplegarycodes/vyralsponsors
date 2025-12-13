import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Tier price mapping
const TIER_PRICES: Record<string, string> = {
  spark: "price_1SdVg0KqEenQ5cHcbejYmF2i",
  ignite: "price_1SdXOnKqEenQ5cHc9doedgsD",
  inferno: "price_1SdXP9KqEenQ5cHcMJwsT3FC",
  cosmic: "price_1SdXPPKqEenQ5cHcX7wsB97x",
};

// Rate limiting: 10 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 1000;

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(clientIP)) {
    logStep("Rate limit exceeded", { ip: clientIP });
    return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 429,
    });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Parse request body
    const { tier, email, name } = await req.json();
    logStep("Request parsed", { tier, email, name });

    if (!tier || !TIER_PRICES[tier]) {
      throw new Error(`Invalid tier: ${tier}`);
    }

    if (!email) {
      throw new Error("Email is required");
    }

    // Initialize Supabase client with service role for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get product info from database
    const { data: product, error: productError } = await supabaseClient
      .from("products")
      .select("*")
      .eq("tier_name", tier)
      .eq("active", true)
      .maybeSingle();

    if (productError || !product) {
      logStep("Product lookup failed", { error: productError });
      throw new Error("Product not found");
    }
    logStep("Product found", { productId: product.id, name: product.name });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    }

    // Create checkout session
    const origin = req.headers.get("origin") || "https://vyralsponsors.lovable.app";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price: TIER_PRICES[tier],
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/sponsors?success=true&tier=${tier}`,
      cancel_url: `${origin}/sponsors?canceled=true`,
      metadata: {
        tier,
        product_id: product.id,
        purchaser_name: name || "",
      },
    });

    logStep("Checkout session created", { sessionId: session.id });

    // Create pending order in database
    const { error: orderError } = await supabaseClient.from("orders").insert({
      product_id: product.id,
      purchaser_email: email,
      purchaser_name: name || null,
      amount_cents: product.price_cents,
      currency: product.currency,
      payment_status: "pending",
      stripe_session_id: session.id,
      metadata: { tier },
    });

    if (orderError) {
      logStep("Order creation failed", { error: orderError });
      // Don't fail the checkout - order will be created by webhook
    } else {
      logStep("Pending order created");
    }

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
