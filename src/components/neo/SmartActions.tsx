import { motion } from "framer-motion";
import { Timer, FileText, CheckSquare, Palette, Calendar, Zap } from "lucide-react";
import { NeoContext } from "@/hooks/useNeoContext";

interface SmartAction {
  id: string;
  label: string;
  icon: React.ElementType;
  module: "vyra" | "vboard" | "zone";
  description: string;
}

interface SmartActionsProps {
  context: NeoContext;
  onAction: (action: SmartAction) => void;
}

const allActions: SmartAction[] = [
  {
    id: "focus-sprint",
    label: "Start a 10-minute focus sprint",
    icon: Timer,
    module: "vyra",
    description: "Quick focused session",
  },
  {
    id: "brain-dump",
    label: "Dump ideas into a blank page",
    icon: FileText,
    module: "vboard",
    description: "Free-form writing",
  },
  {
    id: "quick-tasks",
    label: "Knock out 2 quick tasks",
    icon: CheckSquare,
    module: "vyra",
    description: "Clear small wins",
  },
  {
    id: "creative-mode",
    label: "Switch to creative mode",
    icon: Palette,
    module: "vboard",
    description: "Explore and create",
  },
  {
    id: "plan-tomorrow",
    label: "Plan tomorrow lightly",
    icon: Calendar,
    module: "vyra",
    description: "Set up for success",
  },
  {
    id: "energy-check",
    label: "Quick energy reset",
    icon: Zap,
    module: "zone",
    description: "Check in with yourself",
  },
];

const getRelevantActions = (context: NeoContext): SmartAction[] => {
  const { timeOfDay, taskLoad, mood, streakStatus } = context;
  
  // Priority scoring for actions based on context
  const scores: Record<string, number> = {};
  
  allActions.forEach(action => {
    let score = 50; // Base score
    
    // Time-based scoring
    if (timeOfDay === "morning" && action.id === "plan-tomorrow") score -= 20;
    if (timeOfDay === "evening" && action.id === "plan-tomorrow") score += 30;
    if (timeOfDay === "morning" && action.id === "focus-sprint") score += 20;
    
    // Mood-based scoring
    if (mood === "creative" && action.module === "vboard") score += 25;
    if (mood === "focused" && action.module === "vyra") score += 25;
    if (mood === "scattered" && action.id === "quick-tasks") score += 30;
    
    // Task load scoring
    if (taskLoad === "heavy" && action.id === "focus-sprint") score += 20;
    if (taskLoad === "light" && action.id === "brain-dump") score += 15;
    
    // Streak scoring
    if (streakStatus === "on-fire" && action.id === "focus-sprint") score += 15;
    
    scores[action.id] = score;
  });
  
  // Sort by score and return top 4
  return [...allActions]
    .sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
    .slice(0, 4);
};

export function SmartActions({ context, onAction }: SmartActionsProps) {
  const relevantActions = getRelevantActions(context);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relevantActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onAction(action)}
              className="group glass p-4 rounded-xl text-left hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {action.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
