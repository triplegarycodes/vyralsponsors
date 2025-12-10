import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Heart, Zap } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Ready to{" "}
              <span className="gradient-text">Level Up?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Join thousands of teens who are taking control of their lives. 
              Be part of something built different.
            </p>
          </motion.div>

          {/* CTA Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: <Sparkles className="text-primary" size={28} />,
                title: "Join the Movement",
                description: "Be among the first to experience VYRAL",
                link: "/support",
                primary: true,
              },
              {
                icon: <Heart className="text-pink-400" size={28} />,
                title: "Support the Project",
                description: "Help us build the future of teen growth",
                link: "/support",
                primary: false,
              },
              {
                icon: <Zap className="text-accent" size={28} />,
                title: "Become an Early Tester",
                description: "Get exclusive beta access and shape the product",
                link: "/support",
                primary: false,
              },
            ].map((cta, index) => (
              <motion.div
                key={cta.title}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-6 rounded-2xl ${
                  cta.primary
                    ? "bg-primary/20 border-2 border-primary/50 neon-glow"
                    : "glass-card"
                }`}
              >
                <div className="mb-4">{cta.icon}</div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {cta.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {cta.description}
                </p>
                <Link to={cta.link}>
                  <NeonButton
                    variant={cta.primary ? "primary" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    Get Started
                  </NeonButton>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-muted-foreground text-sm"
          >
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-background"
                />
              ))}
            </div>
            <span>Join the growing community</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
