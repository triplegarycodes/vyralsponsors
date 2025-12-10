import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bot, MessageSquare, Lightbulb, Heart } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

const features = [
  {
    icon: <MessageSquare size={20} />,
    title: "Always There",
    description: "Chat anytime, no judgment",
  },
  {
    icon: <Lightbulb size={20} />,
    title: "Smart Guidance",
    description: "Personalized suggestions",
  },
  {
    icon: <Heart size={20} />,
    title: "Understands You",
    description: "Learns your patterns",
  },
];

export function NeoSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            {/* Neo Avatar */}
            <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80">
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
              />
              
              {/* Inner Glow */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl" />
              
              {/* Core */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center"
              >
                <Bot size={80} className="text-primary" />
              </motion.div>

              {/* Orbiting Particles */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 2,
                  }}
                  className="absolute inset-0"
                >
                  <div
                    className="absolute w-3 h-3 rounded-full bg-accent"
                    style={{
                      top: "10%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-display font-semibold uppercase tracking-wider text-accent border border-accent/30 rounded-full bg-accent/10">
              Meet Neo
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Your{" "}
              <span className="neon-text-cyan">AI Companion</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Neo isn't just another chatbot. It's a supportive guide that understands 
              the teen experience—helping you navigate stress, celebrate wins, and 
              stay on track without being preachy or annoying.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2 text-accent">
                    {feature.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <Link to="/neo">
              <NeonButton variant="outline">
                Learn About Neo
              </NeonButton>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
