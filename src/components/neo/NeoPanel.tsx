import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { NeoContext } from "@/hooks/useNeoContext";
import { DailyPulse } from "./DailyPulse";
import { SmartActions } from "./SmartActions";
import { MicroDecisionCard } from "./MicroDecisionCard";
import { NeoTip } from "./NeoTip";
import { useState } from "react";

interface NeoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context: NeoContext;
  dailyPulse: string;
  onModuleSwitch: (module: "vyra" | "vboard" | "zone") => void;
}

export function NeoPanel({ isOpen, onClose, context, dailyPulse, onModuleSwitch }: NeoPanelProps) {
  const [showDecision, setShowDecision] = useState(true);

  const handleAction = (action: { module: "vyra" | "vboard" | "zone" }) => {
    onModuleSwitch(action.module);
    onClose();
  };

  const handleDecision = (decisionId: string, choice: string) => {
    console.log("Decision made:", decisionId, choice);
    setShowDecision(false);
    
    // Route based on decision
    if (choice === "create" || choice === "deep") {
      onModuleSwitch("vboard");
    } else if (choice === "light" || choice === "continue") {
      onModuleSwitch("vyra");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 overflow-hidden"
          >
            <div className="h-full glass-card border-l border-primary/20 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold gradient-text">Neo</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <DailyPulse pulse={dailyPulse} />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Micro Decision (if applicable) */}
                <AnimatePresence>
                  {showDecision && (
                    <MicroDecisionCard
                      context={context}
                      onDecision={handleDecision}
                      onDismiss={() => setShowDecision(false)}
                    />
                  )}
                </AnimatePresence>

                {/* Smart Actions */}
                <SmartActions context={context} onAction={handleAction} />

                {/* Neo Tip */}
                <NeoTip context={context} />

                {/* Context Debug (development only) */}
                {import.meta.env.DEV && (
                  <details className="glass p-3 rounded-lg text-xs">
                    <summary className="cursor-pointer text-muted-foreground">Context Debug</summary>
                    <pre className="mt-2 text-muted-foreground overflow-auto">
                      {JSON.stringify(context, null, 2)}
                    </pre>
                  </details>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  Neo learns from your patterns to suggest better actions over time.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
