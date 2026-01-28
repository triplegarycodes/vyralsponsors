import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle2, Circle, Flame, Target, Settings, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const sampleTasks = [
  { id: 1, text: "Complete morning review", completed: true },
  { id: 2, text: "Work on creative project", completed: false },
  { id: 3, text: "Review weekly goals", completed: false },
  { id: 4, text: "Plan tomorrow's priorities", completed: false },
];

interface VyraModuleProps {
  onTaskComplete?: () => void;
}

export function VyraModule({ onTaskComplete }: VyraModuleProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState(sampleTasks);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    const wasCompleted = task?.completed;
    
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    if (!wasCompleted && onTaskComplete) {
      onTaskComplete();
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="relative p-6 md:p-8">
        {/* Module Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Zap className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold gradient-text">VYRA</h2>
              <p className="text-muted-foreground text-sm">Focus · Productivity · Customization</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent/20 to-orange-500/20 border border-accent/30"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-5 h-5 text-accent" />
              <span className="font-semibold text-accent">7 day streak</span>
            </motion.div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Focus Timer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-border/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background" />
            <div className="relative p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold">Focus Session</h3>
              </div>

              <div className="text-center mb-6">
                <div className="relative inline-flex items-center justify-center w-48 h-48 mb-4">
                  {/* Outer glow */}
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl"
                    animate={{ scale: isRunning ? [1, 1.1, 1] : 1, opacity: isRunning ? [0.5, 0.8, 0.5] : 0.3 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="url(#timer-gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 88}
                      strokeDashoffset={2 * Math.PI * 88 * (1 - timeLeft / (25 * 60))}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="relative font-display text-4xl font-bold">{formatTime(timeLeft)}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {isRunning ? "Stay focused. You've got this." : "Ready to build momentum?"}
                </p>

                <div className="flex justify-center gap-3">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={() => setIsRunning(!isRunning)}
                      className="px-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25"
                    >
                      {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isRunning ? "Pause" : "Start"}
                    </Button>
                  </motion.div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTimeLeft(25 * 60);
                      setIsRunning(false);
                    }}
                    className="border-border hover:bg-muted"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Task List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-border/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold">Today's Focus</h3>
                </div>
                <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted/50">{completedCount}/{tasks.length}</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.button
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => toggleTask(task.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 text-left ${
                      task.completed
                        ? "bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30"
                        : "bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    {task.completed ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      </motion.div>
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                      {task.text}
                    </span>
                  </motion.button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-5 text-center">
                Turn intention into action. One task at a time.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
