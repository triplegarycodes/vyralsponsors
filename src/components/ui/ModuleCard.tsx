import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: "violet" | "cyan" | "pink" | "orange" | "green";
  delay?: number;
}

const colorStyles = {
  violet: {
    gradient: "from-purple-500/20 to-violet-600/20",
    border: "border-purple-500/30 hover:border-purple-500/60",
    glow: "group-hover:shadow-[0_0_40px_hsl(263_70%_58%/0.3)]",
    icon: "text-purple-400",
  },
  cyan: {
    gradient: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30 hover:border-cyan-500/60",
    glow: "group-hover:shadow-[0_0_40px_hsl(185_80%_50%/0.3)]",
    icon: "text-cyan-400",
  },
  pink: {
    gradient: "from-pink-500/20 to-rose-600/20",
    border: "border-pink-500/30 hover:border-pink-500/60",
    glow: "group-hover:shadow-[0_0_40px_hsl(320_70%_50%/0.3)]",
    icon: "text-pink-400",
  },
  orange: {
    gradient: "from-orange-500/20 to-amber-600/20",
    border: "border-orange-500/30 hover:border-orange-500/60",
    glow: "group-hover:shadow-[0_0_40px_hsl(30_70%_50%/0.3)]",
    icon: "text-orange-400",
  },
  green: {
    gradient: "from-green-500/20 to-emerald-600/20",
    border: "border-green-500/30 hover:border-green-500/60",
    glow: "group-hover:shadow-[0_0_40px_hsl(150_70%_50%/0.3)]",
    icon: "text-green-400",
  },
};

export function ModuleCard({ title, description, icon, color, delay = 0 }: ModuleCardProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Link to="/modules" className="block group">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`relative p-6 rounded-2xl border bg-gradient-to-br ${styles.gradient} ${styles.border} ${styles.glow} transition-all duration-500 overflow-hidden`}
        >
          {/* Background Glow */}
          <div className="absolute -inset-px bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl bg-background/50 flex items-center justify-center mb-4 ${styles.icon}`}>
            {icon}
          </div>

          {/* Content */}
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
            <span>Learn More</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
