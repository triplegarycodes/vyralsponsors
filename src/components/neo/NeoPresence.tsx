import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { NeoContext } from "@/hooks/useNeoContext";

interface NeoPresenceProps {
  context: NeoContext;
  onClick: () => void;
  isActive?: boolean;
}

export function NeoPresence({ context, onClick, isActive }: NeoPresenceProps) {
  // Determine orb color based on context
  const getOrbColor = () => {
    if (context.mood === "creative") return "from-accent to-primary";
    if (context.streakStatus === "on-fire") return "from-orange-500 to-amber-400";
    if (context.taskLoad === "heavy") return "from-primary to-violet-500";
    return "from-primary/80 to-accent/80";
  };

  const getPulseIntensity = () => {
    if (context.streakStatus === "on-fire") return [1, 1.15, 1];
    if (isActive) return [1, 1.1, 1];
    return [1, 1.05, 1];
  };

  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 blur-xl"
        animate={{ scale: getPulseIntensity(), opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Orbiting particles */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute w-2 h-2 rounded-full bg-accent"
          style={{ top: "-4px", left: "50%", transform: "translateX(-50%)", boxShadow: "0 0 10px hsl(var(--accent))" }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-primary"
          style={{ bottom: "-2px", left: "50%", transform: "translateX(-50%)", boxShadow: "0 0 8px hsl(var(--primary))" }}
        />
      </motion.div>

      {/* Main orb */}
      <motion.div
        className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${getOrbColor()} backdrop-blur-sm border border-accent/50 flex items-center justify-center`}
        animate={{ scale: getPulseIntensity() }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          boxShadow: isActive
            ? "0 0 40px 10px hsl(var(--accent) / 0.4), inset 0 0 20px hsl(var(--accent) / 0.2)"
            : "0 0 30px 5px hsl(var(--primary) / 0.3), inset 0 0 15px hsl(var(--primary) / 0.1)",
        }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Bot className="w-6 h-6 text-primary-foreground" />
        </motion.div>
      </motion.div>

      {/* Tooltip on hover */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
      >
        <div className="glass px-3 py-1.5 rounded-lg text-sm text-foreground">
          {isActive ? "Close Neo" : "Open Neo"}
        </div>
      </motion.div>
    </motion.button>
  );
}
