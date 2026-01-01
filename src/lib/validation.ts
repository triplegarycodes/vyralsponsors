import { z } from "zod";

/**
 * Common validation schemas for forms
 */

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email is too long");

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name is too long");

export const messageSchema = z
  .string()
  .trim()
  .min(10, "Message must be at least 10 characters")
  .max(2000, "Message is too long");

export const urlSchema = z
  .string()
  .trim()
  .url("Please enter a valid URL")
  .max(500, "URL is too long")
  .optional()
  .or(z.literal(""));

// Contact form schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().max(100).optional(),
  message: messageSchema,
});

// Sponsor interest schema
export const sponsorInterestSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(200, "Company name is too long"),
  contact_name: nameSchema,
  contact_email: emailSchema,
  company_type: z.string().max(100).optional(),
  message: z.string().trim().max(2000).optional(),
  tier_interest: z.string().optional(),
  // Honeypot field - should always be empty
  website_url: z.string().max(0, "Invalid submission").optional(),
});

// Waitlist schema
export const waitlistSchema = z.object({
  email: emailSchema,
  name: z.string().trim().max(100).optional(),
  role: z.enum(["student", "parent", "educator", "sponsor", "other"]).optional(),
  source: z.string().max(50).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type SponsorInterestData = z.infer<typeof sponsorInterestSchema>;
export type WaitlistData = z.infer<typeof waitlistSchema>;
