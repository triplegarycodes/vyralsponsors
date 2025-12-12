import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[SUBMIT-SPONSOR-INTEREST] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { company_name, contact_name, contact_email, company_type, message, tier_interest } = await req.json();
    logStep("Request parsed", { company_name, contact_email, tier_interest });

    // Validate required fields
    if (!company_name || !contact_name || !contact_email) {
      throw new Error("Company name, contact name, and email are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact_email)) {
      throw new Error("Invalid email format");
    }

    // Initialize Supabase client with service role for insert
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Insert sponsor interest
    const { error } = await supabaseClient.from("sponsor_interest").insert({
      company_name: company_name.trim().slice(0, 200),
      contact_name: contact_name.trim().slice(0, 100),
      contact_email: contact_email.trim().toLowerCase().slice(0, 255),
      company_type: company_type?.trim().slice(0, 100) || null,
      message: message?.trim().slice(0, 2000) || null,
      tier_interest: tier_interest || null,
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
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
