import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NeonButton } from "@/components/ui/NeonButton";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
});

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
    
    const validation = waitlistSchema.safeParse({ email, name });
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
        .insert([{ email, name: name || null, source }]);

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
      console.error("Waitlist error:", error);
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
        className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30"
      >
        <CheckCircle2 className="text-primary" size={24} />
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
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            maxLength={100}
          />
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <NeonButton type="submit" disabled={isLoading} className="shrink-0">
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Join Waitlist"
          )}
        </NeonButton>
      </div>
    </form>
  );
}
