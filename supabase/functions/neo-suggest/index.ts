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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { context, type } = await req.json() as {
      context: NeoContext;
      type: "tip" | "prompt";
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("AI service unavailable");
    }

    console.log("Neo suggestion request:", { type, context });

    let systemPrompt: string;
    let userPrompt: string;

    if (type === "tip") {
      systemPrompt = `You are Neo, an ambient AI assistant for a teen productivity app. Generate a single, actionable micro-tip based on the user's current context. Keep it to 1-2 sentences max. Be specific and practical, not motivational.`;
      
      userPrompt = `Current context:
- Time: ${context.timeOfDay}
- Session: ${context.sessionLength} min
- Tasks: ${context.completedTasks}/${context.totalTasks} done
- Load: ${context.taskLoad}
- Streak: ${context.streakStatus}
${context.mood ? `- Mood: ${context.mood}` : ""}

Generate a relevant, actionable tip (or return empty string if no tip is warranted).`;
    } else {
      systemPrompt = `You are Neo, helping with creative writing. Generate a single, evocative writing prompt that sparks curiosity and invites exploration. Keep it to 1 sentence. Make it interesting for teens.`;
      
      userPrompt = `Context: ${context.timeOfDay}, user has been here ${context.sessionLength} minutes${context.mood ? `, feeling ${context.mood}` : ""}.

Generate one creative writing prompt.`;
    }

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
          { role: "user", content: userPrompt },
        ],
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ suggestion: null, error: "Rate limited" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content?.trim() || null;

    console.log("Neo suggestion generated:", suggestion);

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Neo suggestion error:", error);
    return new Response(
      JSON.stringify({ suggestion: null, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
