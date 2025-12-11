import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function NeoOrb() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Outer pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-accent/30"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Rotating rings */}
      <motion.div
        className="absolute inset-4 rounded-full border border-dashed border-accent/40"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-8 rounded-full border border-primary/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Glow backdrop */}
      <motion.div
        className="absolute inset-12 rounded-full bg-gradient-radial from-accent/40 via-accent/10 to-transparent blur-2xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Core */}
      <motion.div
        className="absolute inset-16 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 backdrop-blur-sm border border-accent/50 flex items-center justify-center"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          boxShadow: "0 0 60px 20px hsl(var(--accent) / 0.3), inset 0 0 30px hsl(var(--accent) / 0.2)",
        }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Bot size={60} className="text-accent" />
        </motion.div>
      </motion.div>

      {/* Orbiting particles */}
      {[0, 120, 240].map((angle, i) => (
        <motion.div
          key={angle}
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        >
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-accent"
            style={{
              top: "5%",
              left: "50%",
              transform: `translateX(-50%) rotate(${angle}deg)`,
              boxShadow: "0 0 15px 5px hsl(var(--accent) / 0.5)",
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        </motion.div>
      ))}

      {/* Glitch effect */}
      <motion.div
        className="absolute inset-16 rounded-full bg-accent/10"
        animate={{
          opacity: [0, 0.5, 0],
          x: [-2, 2, -2],
          scaleX: [1, 1.02, 1],
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
      />
    </div>
  );
}
