import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface Sponsor3DCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function Sponsor3DCard({ children, className, glowColor = "primary" }: Sponsor3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glowColors = {
    primary: "shadow-[0_0_60px_hsl(var(--primary)/0.4)]",
    accent: "shadow-[0_0_60px_hsl(var(--accent)/0.4)]",
    pink: "shadow-[0_0_60px_hsl(320_70%_50%/0.4)]",
    orange: "shadow-[0_0_60px_hsl(30_80%_50%/0.4)]",
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-2xl transition-shadow duration-300",
        glowColors[glowColor as keyof typeof glowColors] || glowColors.primary,
        className
      )}
    >
      {/* Glitch border effect */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary via-accent to-primary opacity-50 blur-sm" />
      
      {/* Card content */}
      <div
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
        className="relative h-full rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 overflow-hidden"
      >
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(var(--primary)/0.1)_2px,hsl(var(--primary)/0.1)_4px)]" />
        </div>
        
        {/* Glitch flicker */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 pointer-events-none"
          animate={{ opacity: [0, 0.3, 0, 0.2, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        
        {children}
      </div>
    </motion.div>
  );
}
