import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CreditCard, Shield, CheckCircle2 } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: {
    name: string;
    tierKey: string;
    price: string;
    priceNote?: string;
  };
}

export function CheckoutModal({ isOpen, onClose, tier }: CheckoutModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          tier: tier.tierKey,
          email: email.trim().toLowerCase(),
          name: name.trim() || undefined,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe Checkout in new tab
        window.open(data.url, "_blank");
        toast({
          title: "Redirecting to checkout",
          description: "A new tab will open for secure payment processing.",
        });
        onClose();
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast({
        title: "Checkout failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="glass-card rounded-3xl p-8 border border-primary/20 shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                >
                  <CreditCard className="text-primary" size={28} />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-1">
                  {tier.name} Tier
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-display text-3xl font-black gradient-text">
                    {tier.price}
                  </span>
                  {tier.priceNote && (
                    <span className="text-muted-foreground text-sm">
                      {tier.priceNote}
                    </span>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleCheckout} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Your Name (Optional)
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-muted/50 border-muted-foreground/20"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-muted/50 border-muted-foreground/20"
                    required
                    maxLength={255}
                  />
                </div>

                {/* Security note */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <Shield size={14} className="text-green-400 shrink-0" />
                  <span>
                    Secure payment powered by Stripe. Your card details are never stored on our servers.
                  </span>
                </div>

                {/* CTA */}
                <NeonButton
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Continue to Payment
                    </>
                  )}
                </NeonButton>
              </form>

              {/* Footer */}
              <p className="text-center text-xs text-muted-foreground mt-6">
                By proceeding, you agree to our terms of service. All purchases are optional and support the VYRAL mission.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
