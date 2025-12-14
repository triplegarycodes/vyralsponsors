import { useState, useEffect, useMemo, useCallback } from "react";

export interface NeoContext {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  sessionLength: number; // minutes since page load
  recentModules: string[];
  taskLoad: "light" | "moderate" | "heavy";
  streakStatus: "none" | "building" | "strong" | "on-fire";
  energyLevel?: "low" | "medium" | "high";
  mood?: "focused" | "creative" | "reflective" | "scattered";
  completedTasks: number;
  totalTasks: number;
  lastActivity?: string;
}

export interface NeoSuggestion {
  id: string;
  type: "action" | "tip" | "decision";
  content: string;
  action?: () => void;
  module?: "vyra" | "vboard" | "zone";
  priority: number;
}

const getTimeOfDay = (): NeoContext["timeOfDay"] => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

const getDailyPulse = (context: NeoContext): string => {
  const { timeOfDay, taskLoad, streakStatus, mood, completedTasks } = context;
  
  // Priority-based pulse messages
  if (streakStatus === "on-fire") return "Momentum day";
  if (mood === "scattered") return "Drift detected";
  if (taskLoad === "light" && completedTasks > 0) return "Recovery mode";
  if (mood === "creative") return "Creative spike";
  if (timeOfDay === "morning" && taskLoad === "moderate") return "Focus window open";
  if (taskLoad === "heavy") return "Deep work mode";
  if (timeOfDay === "evening") return "Wind-down time";
  if (completedTasks === 0 && taskLoad === "light") return "Fresh start";
  
  return "Ready when you are";
};

export function useNeoContext() {
  const [sessionStart] = useState(() => Date.now());
  const [recentModules, setRecentModules] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(5);
  const [mood, setMood] = useState<NeoContext["mood"]>();
  const [energyLevel, setEnergyLevel] = useState<NeoContext["energyLevel"]>();
  const [lastActivity, setLastActivity] = useState<string>();
  const [sessionLength, setSessionLength] = useState(0);

  // Update session length every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionLength(Math.floor((Date.now() - sessionStart) / 60000));
    }, 60000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const trackModuleVisit = useCallback((module: string) => {
    setRecentModules(prev => {
      const updated = [module, ...prev.filter(m => m !== module)].slice(0, 5);
      return updated;
    });
    setLastActivity(`Visited ${module}`);
  }, []);

  const trackTaskComplete = useCallback(() => {
    setCompletedTasks(prev => prev + 1);
    setLastActivity("Completed a task");
  }, []);

  const updateMood = useCallback((newMood: NeoContext["mood"]) => {
    setMood(newMood);
  }, []);

  const updateEnergy = useCallback((newEnergy: NeoContext["energyLevel"]) => {
    setEnergyLevel(newEnergy);
  }, []);

  const context: NeoContext = useMemo(() => {
    const taskRatio = totalTasks > 0 ? completedTasks / totalTasks : 0;
    
    let taskLoad: NeoContext["taskLoad"] = "light";
    if (totalTasks - completedTasks > 5) taskLoad = "heavy";
    else if (totalTasks - completedTasks > 2) taskLoad = "moderate";

    let streakStatus: NeoContext["streakStatus"] = "none";
    if (completedTasks >= 5) streakStatus = "on-fire";
    else if (completedTasks >= 3) streakStatus = "strong";
    else if (completedTasks >= 1) streakStatus = "building";

    return {
      timeOfDay: getTimeOfDay(),
      sessionLength,
      recentModules,
      taskLoad,
      streakStatus,
      energyLevel,
      mood,
      completedTasks,
      totalTasks,
      lastActivity,
    };
  }, [sessionLength, recentModules, completedTasks, totalTasks, energyLevel, mood, lastActivity]);

  const dailyPulse = useMemo(() => getDailyPulse(context), [context]);

  return {
    context,
    dailyPulse,
    trackModuleVisit,
    trackTaskComplete,
    updateMood,
    updateEnergy,
    setTotalTasks,
  };
}
