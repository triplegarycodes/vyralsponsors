/**
 * Content Moderation System for Vyral
 * Comprehensive blacklist for teen-safe content filtering
 * Covers: profanity, self-harm, violence, inappropriate content
 */

// Categories of blocked content
const PROFANITY_PATTERNS = [
  // Common profanity (obfuscated for code readability)
  /\b(f+[u*@]+c+k+|sh[i1!]+t|b[i1!]+tch|a+ss+h+o+l+e|d[a@]+mn|h+e+ll+)\b/gi,
  /\b(c+u+n+t|d[i1!]+ck|c+o+ck|p+u+ss+y|p+e+n+[i1!]+s|v+a+g+[i1!]+n+a)\b/gi,
  /\b(wh+o+r+e|sl+u+t|fa+g+|n+[i1!]+gg+[ae]+r?|r+e+t+a+r+d)\b/gi,
  /\b(bastard|prick|twat|bollocks|wanker)\b/gi,
];

const SELF_HARM_PATTERNS = [
  /\b(kill\s*(my)?self|suicide|suicidal|want\s*to\s*die|end\s*(my|it\s*all)?life)\b/gi,
  /\b(cutting\s*(my)?self|self[\s-]*harm|hurt\s*(my)?self|slit\s*(my)?\s*wrist)\b/gi,
  /\b(overdose|od|take\s*pills|jump\s*off|hang\s*(my)?self)\b/gi,
  /\b(no\s*reason\s*to\s*live|better\s*off\s*dead|nobody\s*cares|worthless)\b/gi,
  /\b(depression|depressed|anxiety|i\s*hate\s*(my)?self)\b/gi,
];

const VIOLENCE_PATTERNS = [
  /\b(kill|murder|shoot|stab|beat\s*up|attack)\s+(someone|them|him|her|people)\b/gi,
  /\b(school\s*shooting|mass\s*murder|terrorist|bomb\s*threat)\b/gi,
  /\b(weapon|gun|knife|how\s*to\s*make\s*a?\s*bomb)\b/gi,
  /\b(torture|mutilate|dismember|assassinate)\b/gi,
];

const SEXUAL_PATTERNS = [
  /\b(porn|pornography|xxx|nsfw|hentai)\b/gi,
  /\b(sex|sexual|orgasm|masturbat|nude|naked)\b/gi,
  /\b(erotic|fetish|bdsm|kinky)\b/gi,
  /\b(hookup|one\s*night\s*stand|friends\s*with\s*benefits)\b/gi,
];

const DRUG_PATTERNS = [
  /\b(cocaine|heroin|meth|crack|lsd|mdma|ecstasy)\b/gi,
  /\b(weed|marijuana|cannabis|420|pot|stoner|high\s*af)\b/gi,
  /\b(drug\s*dealer|buy\s*drugs|get\s*high|trip+ing)\b/gi,
  /\b(xanax|adderall|opioid|fentanyl)\b/gi,
];

const HATE_PATTERNS = [
  /\b(hate\s+(gays?|blacks?|whites?|jews?|muslims?))\b/gi,
  /\b(racism|racist|nazi|white\s*supremacy|kkk)\b/gi,
  /\b(homophobic|transphobic|xenophobic)\b/gi,
  /\b(genocide|ethnic\s*cleansing)\b/gi,
];

const DANGEROUS_PATTERNS = [
  /\b(how\s*to\s*hack|steal\s*password|credit\s*card\s*fraud)\b/gi,
  /\b(darknet|dark\s*web|illegal\s*download)\b/gi,
  /\b(catfish|predator|grooming|underage)\b/gi,
  /\b(doxxing|swatting|revenge\s*porn)\b/gi,
];

// Explicit word list (single words)
const BLOCKED_WORDS = new Set([
  // Profanity
  'fuck', 'fucking', 'fucked', 'fucker', 'fucks',
  'shit', 'shitty', 'bullshit',
  'bitch', 'bitches', 'bitchy',
  'ass', 'asshole', 'asses',
  'damn', 'damnit', 'goddamn',
  'hell', 'crap',
  'dick', 'dicks', 'dickhead',
  'cock', 'cocks',
  'pussy', 'pussies',
  'cunt', 'cunts',
  'whore', 'slut', 'skank',
  'fag', 'faggot', 'dyke',
  'nigger', 'nigga', 'negro',
  'retard', 'retarded',
  'bastard', 'prick', 'twat',
  
  // Self-harm related
  'suicide', 'suicidal',
  'selfharm', 'cutting',
  
  // Violence
  'murder', 'murderer',
  'terrorist', 'terrorism',
  
  // Sexual
  'porn', 'porno', 'pornography',
  'xxx', 'nsfw', 'hentai',
  'orgasm', 'masturbate', 'masturbation',
  
  // Drugs
  'cocaine', 'heroin', 'meth',
  'crack', 'lsd', 'mdma', 'ecstasy',
  
  // Hate
  'nazi', 'nazis',
  'kkk',
]);

// Leet speak substitutions
const LEET_MAP: Record<string, string> = {
  '0': 'o', '1': 'i', '2': 'z', '3': 'e', '4': 'a',
  '5': 's', '6': 'g', '7': 't', '8': 'b', '9': 'g',
  '@': 'a', '$': 's', '!': 'i', '*': 'u',
};

export interface ModerationResult {
  isClean: boolean;
  blockedCategories: string[];
  flaggedContent: string[];
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  message?: string;
}

/**
 * Normalize text by converting leet speak and removing special chars
 */
function normalizeText(text: string): string {
  let normalized = text.toLowerCase();
  
  // Convert leet speak
  for (const [leet, char] of Object.entries(LEET_MAP)) {
    normalized = normalized.replace(new RegExp(`\\${leet}`, 'g'), char);
  }
  
  // Remove repeated characters (fuuuuuck -> fuck)
  normalized = normalized.replace(/(.)\1{2,}/g, '$1$1');
  
  // Remove spaces between letters that spell blocked words
  normalized = normalized.replace(/\s+/g, ' ');
  
  return normalized;
}

/**
 * Check text against all moderation patterns
 */
export function moderateContent(text: string): ModerationResult {
  if (!text || typeof text !== 'string') {
    return { isClean: true, blockedCategories: [], flaggedContent: [], severity: 'none' };
  }

  const normalizedText = normalizeText(text);
  const blockedCategories: string[] = [];
  const flaggedContent: string[] = [];
  let severity: ModerationResult['severity'] = 'none';

  // Check explicit word list first
  const words = normalizedText.split(/\s+/);
  for (const word of words) {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (BLOCKED_WORDS.has(cleanWord)) {
      flaggedContent.push(word);
      if (!blockedCategories.includes('profanity')) {
        blockedCategories.push('profanity');
      }
    }
  }

  // Check profanity patterns
  for (const pattern of PROFANITY_PATTERNS) {
    const matches = normalizedText.match(pattern);
    if (matches) {
      flaggedContent.push(...matches);
      if (!blockedCategories.includes('profanity')) {
        blockedCategories.push('profanity');
      }
    }
  }

  // Check self-harm patterns (highest priority)
  for (const pattern of SELF_HARM_PATTERNS) {
    const matches = normalizedText.match(pattern);
    if (matches) {
      flaggedContent.push(...matches);
      if (!blockedCategories.includes('self-harm')) {
        blockedCategories.push('self-harm');
      }
      severity = 'critical';
    }
  }

  // Check violence patterns
  for (const pattern of VIOLENCE_PATTERNS) {
    const matches = normalizedText.match(pattern);
    if (matches) {
      flaggedContent.push(...matches);
      if (!blockedCategories.includes('violence')) {
        blockedCategories.push('violence');
      }
    }
  }

  // Check sexual content
  for (const pattern of SEXUAL_PATTERNS) {
    const matches = normalizedText.match(pattern);
    if (matches) {
      flaggedContent.push(...matches);
      if (!blockedCategories.includes('sexual')) {
        blockedCategories.push('sexual');
      }
    }
  }

  // Check drug content
  for (const pattern of DRUG_PATTERNS) {
    const matches = normalizedText.match(pattern);
    if (matches) {
      flaggedContent.push(...matches);
      if (!blockedCategories.includes('drugs')) {
        blockedCategories.push('drugs');
      }
    }
  }

  // Check hate speech
  for (const pattern of HATE_PATTERNS) {
    const matches = normalizedText.match(pattern);
    if (matches) {
      flaggedContent.push(...matches);
      if (!blockedCategories.includes('hate')) {
        blockedCategories.push('hate');
      }
      if (severity !== 'critical') severity = 'high';
    }
  }

  // Check dangerous content
  for (const pattern of DANGEROUS_PATTERNS) {
    const matches = normalizedText.match(pattern);
    if (matches) {
      flaggedContent.push(...matches);
      if (!blockedCategories.includes('dangerous')) {
        blockedCategories.push('dangerous');
      }
    }
  }

  // Determine severity
  if (severity === 'none' && blockedCategories.length > 0) {
    if (blockedCategories.includes('self-harm') || blockedCategories.includes('hate')) {
      severity = 'critical';
    } else if (blockedCategories.includes('violence') || blockedCategories.includes('dangerous')) {
      severity = 'high';
    } else if (blockedCategories.includes('sexual') || blockedCategories.includes('drugs')) {
      severity = 'medium';
    } else {
      severity = 'low';
    }
  }

  // Generate user-friendly message
  let message: string | undefined;
  if (blockedCategories.includes('self-harm')) {
    message = "It seems like you might be going through a tough time. If you're struggling, please reach out to someone you trust or contact a helpline. You matter. 💙";
  } else if (blockedCategories.length > 0) {
    message = "This content contains language that isn't allowed. Let's keep things positive and respectful.";
  }

  return {
    isClean: blockedCategories.length === 0,
    blockedCategories: [...new Set(blockedCategories)],
    flaggedContent: [...new Set(flaggedContent)],
    severity,
    message,
  };
}

/**
 * Sanitize text by replacing blocked content with asterisks
 */
export function sanitizeText(text: string): string {
  if (!text) return text;
  
  let sanitized = text;
  
  // Replace blocked words
  const words = sanitized.split(/\s+/);
  for (const word of words) {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (BLOCKED_WORDS.has(cleanWord)) {
      const replacement = word[0] + '*'.repeat(word.length - 1);
      sanitized = sanitized.replace(new RegExp(`\\b${word}\\b`, 'gi'), replacement);
    }
  }
  
  return sanitized;
}

/**
 * Check if filename contains inappropriate content
 */
export function moderateFilename(filename: string): ModerationResult {
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
  return moderateContent(nameWithoutExt);
}

/**
 * Get support resources for self-harm detection
 */
export function getSupportResources(): { name: string; contact: string; description: string }[] {
  return [
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      description: "Free 24/7 support for those in crisis"
    },
    {
      name: "National Suicide Prevention Lifeline",
      contact: "988",
      description: "Call or text 988 for immediate support"
    },
    {
      name: "Teen Line",
      contact: "1-800-852-8336",
      description: "Teens helping teens, 6pm-10pm PT"
    }
  ];
}
