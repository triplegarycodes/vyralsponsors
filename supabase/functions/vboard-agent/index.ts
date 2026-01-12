import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Content moderation patterns (server-side validation)
const BLOCKED_PATTERNS = [
  // Profanity
  /\b(f+[u*@]+c+k+|sh[i1!]+t|b[i1!]+tch|a+ss+h+o+l+e)\b/gi,
  /\b(c+u+n+t|d[i1!]+ck|wh+o+r+e|sl+u+t|fa+g+|n+[i1!]+gg+)\b/gi,
  // Self-harm (highest priority - trigger supportive response)
  /\b(kill\s*(my)?self|suicide|suicidal|want\s*to\s*die|end\s*(my)?life)\b/gi,
  /\b(cutting\s*(my)?self|self[\s-]*harm|hurt\s*(my)?self)\b/gi,
  // Violence
  /\b(kill|murder|shoot|stab)\s+(someone|them|him|her|people)\b/gi,
  /\b(school\s*shooting|mass\s*murder|terrorist)\b/gi,
  // Sexual
  /\b(porn|pornography|xxx|nsfw|hentai|orgasm|masturbat)\b/gi,
  // Drugs
  /\b(cocaine|heroin|meth|crack|lsd|mdma|ecstasy)\b/gi,
  // Hate
  /\b(hate\s+(gays?|blacks?|whites?|jews?|muslims?))\b/gi,
  /\b(nazi|white\s*supremacy|kkk)\b/gi,
];

const SELF_HARM_PATTERNS = [
  /\b(kill\s*(my)?self|suicide|suicidal|want\s*to\s*die)\b/gi,
  /\b(cutting\s*(my)?self|self[\s-]*harm|hurt\s*(my)?self)\b/gi,
  /\b(no\s*reason\s*to\s*live|better\s*off\s*dead|worthless)\b/gi,
];

interface AgentRequest {
  type: 'brainstorm' | 'analyze' | 'prompt' | 'expand';
  input: string;
  context?: string;
  fileContent?: string;
}

function checkContent(text: string): { blocked: boolean; isSelfHarm: boolean } {
  const normalizedText = text.toLowerCase();
  
  // Check for self-harm first
  for (const pattern of SELF_HARM_PATTERNS) {
    if (pattern.test(normalizedText)) {
      return { blocked: true, isSelfHarm: true };
    }
  }
  
  // Check other blocked content
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(normalizedText)) {
      return { blocked: true, isSelfHarm: false };
    }
  }
  
  return { blocked: false, isSelfHarm: false };
}

function getSelfHarmResponse(): string {
  return `I noticed you might be going through a difficult time. That's really brave to share, and I want you to know that your feelings are valid.

If you're struggling, please reach out to someone who can help:

🆘 **Crisis Text Line**: Text HOME to 741741
📞 **988 Suicide & Crisis Lifeline**: Call or text 988
💙 **Teen Line**: 1-800-852-8336 (6pm-10pm PT)

You're not alone, and there are people who care about you and want to help. Would you like to talk about something else that might help you feel better?`;
}

function getBlockedContentResponse(): string {
  return `I can't help with that topic. Let's focus on something creative and positive instead! 

Here are some ideas:
• What's a project or hobby you're excited about?
• Tell me about a goal you're working toward
• What's something that made you smile recently?

I'm here to help with brainstorming, creative writing, analyzing ideas, and more! ✨`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, input, context, fileContent } = await req.json() as AgentRequest;
    
    console.log(`VBoard Agent request - Type: ${type}, Input length: ${input?.length || 0}`);

    // Validate input
    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please provide some input to work with.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check content moderation for input
    const inputCheck = checkContent(input);
    if (inputCheck.blocked) {
      console.log('Blocked content detected in input');
      return new Response(
        JSON.stringify({ 
          response: inputCheck.isSelfHarm ? getSelfHarmResponse() : getBlockedContentResponse(),
          blocked: true,
          supportive: inputCheck.isSelfHarm
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check file content if provided
    if (fileContent) {
      const fileCheck = checkContent(fileContent);
      if (fileCheck.blocked) {
        console.log('Blocked content detected in file');
        return new Response(
          JSON.stringify({ 
            response: fileCheck.isSelfHarm ? getSelfHarmResponse() : 
              "This file contains content that I can't analyze. Please try a different file with appropriate content.",
            blocked: true,
            supportive: fileCheck.isSelfHarm
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get API key
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('AI service not configured');
    }

    // Build system prompt based on request type
    let systemPrompt = `You are Neo, a friendly and creative AI agent within VBoard - a digital canvas for teens to explore ideas, write, and create.

Your personality:
- Warm, encouraging, and supportive
- Creative and imaginative
- Concise but helpful (keep responses under 300 words unless expanding content)
- Never preachy or condescending
- Use occasional emojis naturally (not excessively)

CRITICAL RULES:
- NEVER discuss violence, self-harm, drugs, sexual content, or hate speech
- If asked about inappropriate topics, redirect to something positive
- Keep everything teen-appropriate and safe
- Focus on creativity, growth, learning, and positive expression
- Be supportive but never give medical, legal, or professional advice`;

    let userPrompt = '';

    switch (type) {
      case 'brainstorm':
        systemPrompt += `\n\nYou're helping brainstorm ideas. Generate 3-5 creative, actionable ideas based on the user's input. Format them as a numbered list with brief explanations.`;
        userPrompt = `Help me brainstorm ideas about: ${input}${context ? `\n\nContext: ${context}` : ''}`;
        break;

      case 'analyze':
        systemPrompt += `\n\nYou're analyzing content creatively. Provide thoughtful observations, themes, and creative insights. Be constructive and encouraging.`;
        userPrompt = fileContent 
          ? `Analyze this content creatively:\n\n${fileContent.slice(0, 5000)}\n\nUser's focus: ${input}`
          : `Analyze this idea or content: ${input}`;
        break;

      case 'prompt':
        systemPrompt += `\n\nYou're providing a creative writing prompt. Generate an inspiring, thought-provoking prompt that sparks imagination. Keep it open-ended but evocative.`;
        userPrompt = input.trim() 
          ? `Create a writing prompt inspired by: ${input}` 
          : 'Give me a creative writing prompt for today';
        break;

      case 'expand':
        systemPrompt += `\n\nYou're helping expand on an idea or piece of writing. Add depth, explore angles, suggest directions, and help develop the concept further. Be creative but stay true to the original spirit.`;
        userPrompt = `Help me expand on this:\n\n${input}`;
        break;

      default:
        userPrompt = input;
    }

    // Call AI gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Whoa, slow down! Too many requests. Try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content || '';

    // Final content check on AI response
    const responseCheck = checkContent(aiResponse);
    if (responseCheck.blocked) {
      console.warn('AI response contained blocked content, filtering');
      aiResponse = "I came up with something, but it wasn't quite right. Let me try a different approach - what specific aspect would you like to explore?";
    }

    console.log(`VBoard Agent response generated - Length: ${aiResponse.length}`);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('VBoard Agent error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Something went wrong. Please try again.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
