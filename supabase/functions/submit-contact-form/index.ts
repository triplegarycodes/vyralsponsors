import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: 5 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;
const MIN_SUBMISSION_TIME_MS = 2000; // Minimum time to fill form (bot protection)

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
  console.log(`[SUBMIT-CONTACT] ${step}${detailsStr}`);
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation function
const validateInput = (data: Record<string, unknown>): string[] => {
  const errors: string[] = [];

  // Name validation
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!name) {
    errors.push("Name is required");
  } else if (name.length > 100) {
    errors.push("Name is too long (max 100 characters)");
  }

  // Email validation
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (!email) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email)) {
    errors.push("Invalid email format");
  } else if (email.length > 255) {
    errors.push("Email is too long (max 255 characters)");
  }

  // Message validation
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  if (!message) {
    errors.push("Message is required");
  } else if (message.length > 2000) {
    errors.push("Message is too long (max 2000 characters)");
  }

  // Subject validation (optional)
  const subject = typeof data.subject === 'string' ? data.subject.trim() : '';
  if (subject && subject.length > 100) {
    errors.push("Subject is too long (max 100 characters)");
  }

  // Honeypot check - if this field has a value, it's likely a bot
  const honeypot = typeof data.website_url === 'string' ? data.website_url.trim() : '';
  if (honeypot.length > 0) {
    errors.push("Invalid submission");
  }

  // Timing check - if form was filled too fast, likely a bot
  const formStartTime = typeof data.formStartTime === 'number' ? data.formStartTime : 0;
  if (formStartTime > 0) {
    const elapsed = Date.now() - formStartTime;
    if (elapsed < MIN_SUBMISSION_TIME_MS) {
      errors.push("Please take your time filling the form");
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
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
    );
  }

  try {
    logStep("Function started");

    const data = await req.json();
    logStep("Request parsed", { hasName: !!data.name, hasEmail: !!data.email });

    // Validate input server-side
    const validationErrors = validateInput(data);
    if (validationErrors.length > 0) {
      logStep("Validation failed", { errors: validationErrors });
      return new Response(
        JSON.stringify({ error: validationErrors[0] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Sanitize and prepare data
    const sanitizedData = {
      name: String(data.name).trim().slice(0, 100),
      email: String(data.email).trim().toLowerCase().slice(0, 255),
      subject: data.subject ? String(data.subject).trim().slice(0, 100) : null,
      message: String(data.message).trim().slice(0, 2000),
      submission_type: data.submission_type ? String(data.submission_type).slice(0, 50) : 'general',
    };

    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Insert into database
    const { error } = await supabaseClient
      .from("contact_submissions")
      .insert(sanitizedData);

    if (error) {
      logStep("Database error", { error: error.message });
      return new Response(
        JSON.stringify({ error: "Unable to submit your message. Please try again." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    logStep("Contact form submitted successfully");

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
