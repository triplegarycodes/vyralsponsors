import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X } from "lucide-react";
import { NeoContext } from "@/hooks/useNeoContext";
import { useState, useEffect, useMemo } from "react";

interface NeoTipProps {
  context: NeoContext;
  isLoading?: boolean;
  aiTip?: string | null;
}

const getContextualTip = (context: NeoContext): string | null => {
  const { taskLoad, sessionLength, completedTasks, streakStatus, mood, recentModules } = context;
  
  // Only show tips when genuinely relevant
  if (mood === "scattered" && sessionLength > 10) {
    return "You've been bouncing between tasks. One 7-minute timer might help you land.";
  }
  
  if (streakStatus === "on-fire" && completedTasks >= 5) {
    return "Strong momentum. Consider capturing what's working before switching contexts.";
  }
  
  if (taskLoad === "heavy" && sessionLength > 45) {
    return "You've been at it for a while. A quick reset now prevents a bigger crash later.";
  }
  
  if (completedTasks === 0 && sessionLength > 15) {
    return "Starting is often the hardest part. Pick the smallest task and just begin.";
  }
  
  if (recentModules.length > 3 && sessionLength < 10) {
    return "Lots of exploration. When you're ready, pick one module and settle in.";
  }
  
  return null;
};

export function NeoTip({ context, isLoading, aiTip }: NeoTipProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastTip, setLastTip] = useState<string | null>(null);
  
  const contextualTip = useMemo(() => getContextualTip(context), [context]);
  const displayTip = aiTip || contextualTip;
  
  // Reset dismissed state when tip changes
  useEffect(() => {
    if (displayTip && displayTip !== lastTip) {
      setIsDismissed(false);
      setLastTip(displayTip);
    }
  }, [displayTip, lastTip]);
  
  if (isDismissed || (!displayTip && !isLoading)) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="glass p-4 rounded-xl border border-primary/20 bg-primary/5"
      >
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="p-2 rounded-lg bg-primary/20 shrink-0"
          >
            <Lightbulb className="w-4 h-4 text-primary" />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">Neo is thinking...</span>
              </div>
            ) : (
              <p className="text-sm text-foreground leading-relaxed">
                {displayTip}
              </p>
            )}
          </div>
          
          {!isLoading && (
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded hover:bg-muted/50 transition-colors shrink-0"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
