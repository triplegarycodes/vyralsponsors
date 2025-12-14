import { motion } from "framer-motion";
import { Activity, Flame, Sparkles, Wind, Target, Moon, Sunrise } from "lucide-react";

interface DailyPulseProps {
  pulse: string;
}

const pulseIcons: Record<string, React.ElementType> = {
  "Momentum day": Flame,
  "Recovery mode": Wind,
  "Creative spike": Sparkles,
  "Drift detected": Activity,
  "Focus window open": Target,
  "Deep work mode": Target,
  "Wind-down time": Moon,
  "Fresh start": Sunrise,
  "Ready when you are": Activity,
};

const pulseColors: Record<string, string> = {
  "Momentum day": "from-orange-500/20 to-amber-500/20 border-orange-500/30",
  "Recovery mode": "from-sky-500/20 to-cyan-500/20 border-sky-500/30",
  "Creative spike": "from-violet-500/20 to-fuchsia-500/20 border-violet-500/30",
  "Drift detected": "from-rose-500/20 to-pink-500/20 border-rose-500/30",
  "Focus window open": "from-primary/20 to-accent/20 border-primary/30",
  "Deep work mode": "from-primary/20 to-violet-500/20 border-primary/30",
  "Wind-down time": "from-indigo-500/20 to-purple-500/20 border-indigo-500/30",
  "Fresh start": "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  "Ready when you are": "from-primary/20 to-accent/20 border-primary/30",
};

export function DailyPulse({ pulse }: DailyPulseProps) {
  const Icon = pulseIcons[pulse] || Activity;
  const colorClass = pulseColors[pulse] || pulseColors["Ready when you are"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${colorClass} border backdrop-blur-sm`}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon className="w-4 h-4" />
      </motion.div>
      <span className="text-sm font-medium">{pulse}</span>
    </motion.div>
  );
}
