import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
}

export function GlitchText({ children, className = "", as: Tag = "span" }: GlitchTextProps) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      whileHover="hover"
    >
      <Tag className="relative z-10">{children}</Tag>
      
      {/* Glitch Layers */}
      <motion.span
        className="absolute inset-0 text-accent opacity-0"
        variants={{
          hover: {
            opacity: [0, 0.8, 0],
            x: [-2, 2, -2],
            transition: { duration: 0.3, repeat: Infinity }
          }
        }}
        aria-hidden
      >
        {children}
      </motion.span>
      
      <motion.span
        className="absolute inset-0 text-primary opacity-0"
        variants={{
          hover: {
            opacity: [0, 0.8, 0],
            x: [2, -2, 2],
            transition: { duration: 0.3, repeat: Infinity, delay: 0.1 }
          }
        }}
        aria-hidden
      >
        {children}
      </motion.span>
    </motion.div>
  );
}
