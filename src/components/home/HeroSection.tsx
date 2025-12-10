import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, Sparkles, Zap } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px]"
        />
        
        {/* Floating Orbs */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-primary/30 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated V Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              <motion.div
                className="font-display text-8xl md:text-9xl font-black gradient-text"
                whileHover={{ scale: 1.05 }}
              >
                V
              </motion.div>
              {/* Glitch Effect */}
              <motion.div
                className="absolute inset-0 font-display text-8xl md:text-9xl font-black text-accent opacity-0"
                animate={{
                  opacity: [0, 0.5, 0],
                  x: [-5, 5, -5],
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                V
              </motion.div>
              {/* Glow Ring */}
              <motion.div
                className="absolute -inset-4 border-2 border-primary/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Main Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
          >
            VYRAL.{" "}
            <span className="gradient-text glitch">Built Different.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Level up your life—one habit, one moment, one win at a time. 
            The next-gen productivity ecosystem built by teens, for teens.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/support">
              <NeonButton size="lg" variant="primary">
                <Sparkles size={18} />
                Join the Movement
              </NeonButton>
            </Link>
            <Link to="/modules">
              <NeonButton size="lg" variant="outline">
                <Zap size={18} />
                Explore Modules
              </NeonButton>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex items-center justify-center gap-8 md:gap-16"
          >
            {[
              { value: "5", label: "Modules" },
              { value: "∞", label: "Possibilities" },
              { value: "1", label: "You" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-3xl md:text-4xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-wider">Scroll to Begin</span>
          <ChevronDown size={20} className="text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
