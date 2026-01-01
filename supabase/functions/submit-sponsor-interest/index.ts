import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: 5 requests per minute per IP (stricter for form submissions)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;

// Minimum time (ms) for form submission - blocks instant bot submissions
const MIN_SUBMISSION_TIME_MS = 3000;

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
  console.log(`[SUBMIT-SPONSOR-INTEREST] ${step}${detailsStr}`);
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate input lengths and format
const validateInput = (data: {
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  company_type?: string;
  message?: string;
  tier_interest?: string;
  website_url?: string;
  form_start_time?: number;
}) => {
  const errors: string[] = [];

  // Required fields
  if (!data.company_name?.trim()) {
    errors.push("Company name is required");
  } else if (data.company_name.length > 200) {
    errors.push("Company name is too long");
  }

  if (!data.contact_name?.trim()) {
    errors.push("Contact name is required");
  } else if (data.contact_name.length > 100) {
    errors.push("Contact name is too long");
  }

  if (!data.contact_email?.trim()) {
    errors.push("Email is required");
  } else if (!emailRegex.test(data.contact_email)) {
    errors.push("Please enter a valid email address");
  } else if (data.contact_email.length > 255) {
    errors.push("Email is too long");
  }

  // Optional field length checks
  if (data.company_type && data.company_type.length > 100) {
    errors.push("Company type is too long");
  }

  if (data.message && data.message.length > 2000) {
    errors.push("Message is too long");
  }

  // Honeypot check - should be empty
  if (data.website_url && data.website_url.trim().length > 0) {
    logStep("Honeypot triggered - likely bot");
    errors.push("Invalid submission");
  }

  // Timing check - submission should take at least MIN_SUBMISSION_TIME_MS
  if (data.form_start_time) {
    const elapsed = Date.now() - data.form_start_time;
    if (elapsed < MIN_SUBMISSION_TIME_MS) {
      logStep("Timing check failed - likely bot", { elapsed });
      errors.push("Please take your time filling out the form");
    }
  }

  return errors;
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

    const requestData = await req.json();
    logStep("Request parsed", { 
      company_name: requestData.company_name, 
      contact_email: requestData.contact_email, 
      tier_interest: requestData.tier_interest 
    });

    // Validate all inputs
    const validationErrors = validateInput(requestData);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({ error: validationErrors[0] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Initialize Supabase client with service role for insert
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Insert sponsor interest (sanitized)
    const { error } = await supabaseClient.from("sponsor_interest").insert({
      company_name: requestData.company_name.trim().slice(0, 200),
      contact_name: requestData.contact_name.trim().slice(0, 100),
      contact_email: requestData.contact_email.trim().toLowerCase().slice(0, 255),
      company_type: requestData.company_type?.trim().slice(0, 100) || null,
      message: requestData.message?.trim().slice(0, 2000) || null,
      tier_interest: requestData.tier_interest || null,
    });

    if (error) {
      logStep("Error inserting sponsor interest", { error });
      throw error;
    }

    logStep("Sponsor interest submitted successfully");

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
