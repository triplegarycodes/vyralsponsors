import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NeonButton } from "@/components/ui/NeonButton";
import { useToast } from "@/hooks/use-toast";
import { waitlistSchema } from "@/lib/validation";
import { normalizeError, logError } from "@/lib/errors";

interface WaitlistFormProps {
  source?: string;
  showName?: boolean;
}

export function WaitlistForm({ source = "homepage", showName = false }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = waitlistSchema.safeParse({ email, name: name || undefined, source });
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
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email: email.trim().toLowerCase(), name: name.trim() || null, source }]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already signed up!",
            description: "This email is already on the waitlist.",
          });
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast({
          title: "You're in!",
          description: "Welcome to the VYRAL movement.",
        });
      }
    } catch (error) {
      logError("WaitlistForm", error);
      toast({
        title: "Something went wrong",
        description: normalizeError(error),
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
        className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30"
      >
        <CheckCircle2 className="text-primary" size={24} aria-hidden="true" />
        <div>
          <p className="font-semibold text-foreground">You're on the list!</p>
          <p className="text-sm text-muted-foreground">
            We'll be in touch when it's time.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showName && (
        <div>
          <label htmlFor="waitlist-name" className="sr-only">Your name (optional)</label>
          <input
            id="waitlist-name"
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            maxLength={100}
            autoComplete="name"
          />
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <label htmlFor="waitlist-email" className="sr-only">Email address</label>
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} aria-hidden="true" />
          <input
            id="waitlist-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
            autoComplete="email"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <NeonButton type="submit" disabled={isLoading} className="shrink-0">
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} aria-label="Loading" />
          ) : (
            "Join Waitlist"
          )}
        </NeonButton>
      </div>
    </form>
  );
}
