import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    let event: Stripe.Event;

    if (webhookSecret && signature) {
      // Verify webhook signature
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      logStep("Webhook signature verified");
    } else {
      // For testing without signature verification
      event = JSON.parse(body) as Stripe.Event;
      logStep("Processing without signature verification (test mode)");
    }

    logStep("Event received", { type: event.type, id: event.id });

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session completed", { 
          sessionId: session.id, 
          paymentStatus: session.payment_status 
        });

        if (session.payment_status === "paid") {
          // Update order status
          const { error: updateError } = await supabaseClient
            .from("orders")
            .update({ 
              payment_status: "paid",
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq("stripe_session_id", session.id);

          if (updateError) {
            logStep("Error updating order", { error: updateError });
            // If order doesn't exist, create it
            const metadata = session.metadata || {};
            const { data: product } = await supabaseClient
              .from("products")
              .select("*")
              .eq("id", metadata.product_id)
              .maybeSingle();

            if (product) {
              const { error: insertError } = await supabaseClient.from("orders").insert({
                product_id: product.id,
                purchaser_email: session.customer_email || session.customer_details?.email || "",
                purchaser_name: metadata.purchaser_name || null,
                amount_cents: session.amount_total || product.price_cents,
                currency: session.currency || "usd",
                payment_status: "paid",
                stripe_session_id: session.id,
                stripe_payment_intent_id: session.payment_intent as string,
                metadata: { tier: metadata.tier },
              });

              if (insertError) {
                logStep("Error creating order", { error: insertError });
              } else {
                logStep("Order created from webhook");
              }
            }
          } else {
            logStep("Order updated to paid");
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logStep("Payment failed", { paymentIntentId: paymentIntent.id });

        // Update any orders with this payment intent
        const { error } = await supabaseClient
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        if (error) {
          logStep("Error updating failed order", { error });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        logStep("Charge refunded", { chargeId: charge.id });

        // Update order status
        const { error } = await supabaseClient
          .from("orders")
          .update({ payment_status: "refunded" })
          .eq("stripe_payment_intent_id", charge.payment_intent as string);

        if (error) {
          logStep("Error updating refunded order", { error });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
