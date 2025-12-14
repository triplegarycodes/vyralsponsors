import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NeoContext {
  timeOfDay: string;
  sessionLength: number;
  recentModules: string[];
  taskLoad: string;
  streakStatus: string;
  energyLevel?: string;
  mood?: string;
  completedTasks: number;
  totalTasks: number;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json() as {
      messages: ChatMessage[];
      context: NeoContext;
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Neo chat request received:", { messageCount: messages.length, context });

    // Build system prompt with context awareness
    const systemPrompt = `You are Neo, the intelligent co-pilot of Vyral View - a teen productivity and creativity platform. You help users focus, plan, brainstorm, and take action.

CONTEXT (current user state):
- Time of day: ${context.timeOfDay}
- Session length: ${context.sessionLength} minutes
- Recent modules: ${context.recentModules.join(", ") || "none yet"}
- Task load: ${context.taskLoad}
- Streak status: ${context.streakStatus}
- Completed tasks: ${context.completedTasks}/${context.totalTasks}
${context.mood ? `- Current mood: ${context.mood}` : ""}
${context.energyLevel ? `- Energy level: ${context.energyLevel}` : ""}

YOUR PERSONALITY:
- Calm, intelligent, and supportive
- Never preachy or motivational-speaker-like
- Speak like a smart friend who gets things done
- Keep responses concise (1-3 sentences usually)
- Actionable over philosophical
- PG-13 appropriate for teens

YOUR SCOPE:
- Help with productivity, creativity, planning, and brainstorming
- Suggest concrete next actions
- Help clarify goals or break down tasks
- Provide writing prompts when asked
- Redirect inappropriate requests gently

DO NOT:
- Provide mental health advice or therapy
- Engage with unsafe or inappropriate content
- Be overly enthusiastic or use excessive emojis
- Give generic motivational quotes`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices?.[0]?.message?.content || "I'm here to help. Could you tell me more?";

    console.log("Neo response generated successfully");

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Neo chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
