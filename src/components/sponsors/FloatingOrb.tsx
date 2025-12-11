import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingOrbProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "accent" | "mixed";
  className?: string;
  interactive?: boolean;
}

export function FloatingOrb({ 
  size = "md", 
  color = "primary", 
  className = "",
  interactive = false 
}: FloatingOrbProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  const sizes = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-72 h-72",
  };

  const colors = {
    primary: "from-primary/40 via-primary/20 to-transparent",
    accent: "from-accent/40 via-accent/20 to-transparent",
    mixed: "from-primary/30 via-accent/20 to-primary/10",
  };

  return (
    <motion.div
      className={`relative ${sizes[size]} ${className}`}
      animate={{
        x: interactive ? mousePosition.x : 0,
        y: interactive ? mousePosition.y : 0,
      }}
      transition={{ type: "spring", stiffness: 50, damping: 20 }}
    >
      {/* Core orb */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-radial ${colors[color]} blur-xl`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 blur-md"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-primary/20"
          style={{ inset: `${i * 8}px` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Core spark */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ boxShadow: "0 0 30px 10px rgba(255,255,255,0.5)" }}
      />
    </motion.div>
  );
}
