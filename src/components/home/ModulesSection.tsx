import { 
  LayoutDashboard, 
  PenTool, 
  TreePine, 
  Target, 
  Users 
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ModuleCard } from "@/components/ui/ModuleCard";

const modules = [
  {
    title: "Board",
    description: "Transform your tasks, schedules, and calendars into a personal quest. AI-powered suggestions, quick-add gestures, and streak tracking keep you on top of everything.",
    icon: <LayoutDashboard size={28} />,
    color: "violet" as const,
  },
  {
    title: "Skryb",
    description: "Creative journaling meets emotional intelligence. Track your moods, capture thoughts, and watch your inner world unfold on a beautiful teen-friendly timeline.",
    icon: <PenTool size={28} />,
    color: "cyan" as const,
  },
  {
    title: "Tree",
    description: "Watch your personal growth come alive. A living digital organism that evolves based on your streaks, habits, and daily actions—your progress, visualized.",
    icon: <TreePine size={28} />,
    color: "green" as const,
  },
  {
    title: "Kor",
    description: "Your central command hub for projects, goals, and stats. Track everything that matters, set meaningful targets, and see your journey unfold.",
    icon: <Target size={28} />,
    color: "orange" as const,
  },
  {
    title: "Zone",
    description: "A safe, moderated social space designed for teens. Collaborate on projects, share wins, express yourself, and connect with others on the same journey.",
    icon: <Users size={28} />,
    color: "pink" as const,
  },
];

export function ModulesSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <SectionHeading
          badge="The Ecosystem"
          title={
            <>
              Five Modules.{" "}
              <span className="gradient-text">One System.</span>
            </>
          }
          description="Each module is designed to work alone or together—giving you the flexibility to build your perfect productivity stack."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.title}
              {...module}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
