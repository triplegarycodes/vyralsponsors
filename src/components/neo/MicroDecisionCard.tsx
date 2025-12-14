import { motion } from "framer-motion";
import { NeoContext } from "@/hooks/useNeoContext";

interface Decision {
  id: string;
  question: string;
  optionA: { label: string; value: string };
  optionB: { label: string; value: string };
}

interface MicroDecisionCardProps {
  context: NeoContext;
  onDecision: (decisionId: string, choice: string) => void;
  onDismiss: () => void;
}

const getDecision = (context: NeoContext): Decision | null => {
  const { timeOfDay, taskLoad, sessionLength, completedTasks } = context;
  
  // Show decisions based on context
  if (sessionLength > 20 && completedTasks === 0) {
    return {
      id: "start-type",
      question: "How do you want to start?",
      optionA: { label: "Light win", value: "light" },
      optionB: { label: "Deep focus", value: "deep" },
    };
  }
  
  if (taskLoad === "heavy" && sessionLength > 30) {
    return {
      id: "continue-break",
      question: "Push 5 more minutes or stop clean?",
      optionA: { label: "Push 5 more", value: "continue" },
      optionB: { label: "Stop clean", value: "break" },
    };
  }
  
  if (timeOfDay === "evening" && completedTasks > 0) {
    return {
      id: "wind-down",
      question: "Create or review?",
      optionA: { label: "Create something", value: "create" },
      optionB: { label: "Review progress", value: "review" },
    };
  }
  
  return null;
};

export function MicroDecisionCard({ context, onDecision, onDismiss }: MicroDecisionCardProps) {
  const decision = getDecision(context);
  
  if (!decision) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="glass-card p-4 rounded-xl border border-accent/30"
    >
      <div className="flex justify-between items-start mb-3">
        <p className="text-sm font-medium text-foreground">{decision.question}</p>
        <button
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          Skip
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onDecision(decision.id, decision.optionA.value)}
          className="px-4 py-2.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 text-sm font-medium transition-all"
        >
          {decision.optionA.label}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onDecision(decision.id, decision.optionB.value)}
          className="px-4 py-2.5 rounded-lg bg-accent/20 hover:bg-accent/30 border border-accent/30 text-sm font-medium transition-all"
        >
          {decision.optionB.label}
        </motion.button>
      </div>
    </motion.div>
  );
}
