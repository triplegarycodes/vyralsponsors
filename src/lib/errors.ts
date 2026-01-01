/**
 * Supabase error normalization utility
 * Converts technical errors into user-friendly messages
 */

interface SupabaseError {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  // Auth errors
  "invalid_credentials": "Invalid email or password. Please try again.",
  "user_not_found": "No account found with this email.",
  "email_taken": "This email is already registered.",
  "weak_password": "Password must be at least 6 characters.",
  "invalid_email": "Please enter a valid email address.",
  
  // Database errors
  "23505": "This record already exists.",
  "23503": "This operation references data that doesn't exist.",
  "42501": "You don't have permission to perform this action.",
  "PGRST301": "Request timeout. Please try again.",
  
  // Rate limiting
  "rate_limit_exceeded": "Too many requests. Please wait a moment.",
  "429": "Too many requests. Please try again later.",
  
  // Network errors
  "fetch_error": "Network error. Please check your connection.",
  "FetchError": "Unable to connect. Please check your internet.",
  
  // Generic
  "unexpected": "Something went wrong. Please try again.",
};

export function normalizeError(error: unknown): string {
  if (!error) return ERROR_MESSAGES.unexpected;
  
  // Handle string errors
  if (typeof error === "string") {
    const lower = error.toLowerCase();
    for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
      if (lower.includes(key.toLowerCase())) {
        return message;
      }
    }
    // If it's a user-friendly message already, return it
    if (error.length < 100 && !error.includes("Error:")) {
      return error;
    }
    return ERROR_MESSAGES.unexpected;
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Check for known error patterns
    for (const [key, userMessage] of Object.entries(ERROR_MESSAGES)) {
      if (message.includes(key.toLowerCase())) {
        return userMessage;
      }
    }
    
    // Network errors
    if (message.includes("fetch") || message.includes("network")) {
      return ERROR_MESSAGES.fetch_error;
    }
    
    return ERROR_MESSAGES.unexpected;
  }
  
  // Handle Supabase error objects
  const supaError = error as SupabaseError;
  if (supaError.code && ERROR_MESSAGES[supaError.code]) {
    return ERROR_MESSAGES[supaError.code];
  }
  
  if (supaError.message) {
    // Check if it's already user-friendly
    if (supaError.message.length < 100 && !supaError.message.includes("PostgrestError")) {
      return supaError.message;
    }
  }
  
  return ERROR_MESSAGES.unexpected;
}

/**
 * Safe error logging - strips sensitive info in production
 */
export function logError(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  } else {
    // In production, log minimal info
    console.error(`[${context}] Error occurred`);
  }
}
