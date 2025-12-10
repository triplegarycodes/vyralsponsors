import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NeonButton } from "@/components/ui/NeonButton";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email address").max(255),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

interface ContactFormProps {
  submissionType?: string;
}

export function ContactForm({ submissionType = "general" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Invalid input",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("contact_submissions").insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject || null,
          message: formData.message,
          submission_type: submissionType,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 rounded-2xl glass-card"
      >
        <CheckCircle2 className="mx-auto text-primary mb-4" size={48} />
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Message Received!
        </h3>
        <p className="text-muted-foreground">
          Thanks for reaching out. We'll be in touch soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            maxLength={255}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Subject
        </label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        >
          <option value="">Select a topic</option>
          <option value="general">General Inquiry</option>
          <option value="sponsorship">Sponsorship</option>
          <option value="partnership">Partnership</option>
          <option value="feedback">Feedback</option>
          <option value="press">Press / Media</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          maxLength={2000}
          className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
          placeholder="Tell us what's on your mind..."
        />
      </div>

      <NeonButton type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            <Send size={18} />
            Send Message
          </>
        )}
      </NeonButton>
    </form>
  );
}
