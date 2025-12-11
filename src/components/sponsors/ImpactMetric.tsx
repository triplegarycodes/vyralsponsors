import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ReactNode } from "react";

interface ImpactMetricProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: ReactNode;
  delay?: number;
}

export function ImpactMetric({ 
  value, 
  suffix = "", 
  prefix = "", 
  label, 
  icon,
  delay = 0 
}: ImpactMetricProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary"
      >
        {icon}
      </motion.div>
      
      <div className="font-display text-4xl md:text-5xl font-black gradient-text mb-2">
        {prefix}{displayValue.toLocaleString()}{suffix}
      </div>
      
      <p className="text-muted-foreground text-sm">{label}</p>
    </motion.div>
  );
}
