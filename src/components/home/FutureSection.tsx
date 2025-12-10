import { motion } from "framer-motion";
import { 
  Flame, 
  Palette, 
  Brain, 
  Users, 
  Coins, 
  Rocket 
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  {
    icon: <Flame size={24} />,
    title: "Habit Systems",
    description: "Build routines that stick with gamified streaks and AI nudges.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: <Palette size={24} />,
    title: "Creative Space",
    description: "Journal, sketch, and express yourself in a judgment-free zone.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    icon: <Brain size={24} />,
    title: "Emotional Clarity",
    description: "Understand your moods and patterns with intuitive tracking.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    icon: <Users size={24} />,
    title: "Social Support",
    description: "Connect with peers who get it in a safe, moderated community.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: <Coins size={24} />,
    title: "Financial Literacy",
    description: "Learn money basics with tools designed for teen budgets.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: <Rocket size={24} />,
    title: "Project Building",
    description: "Turn ideas into reality with goal tracking and milestone maps.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
];

export function FutureSection() {
  return (
    <section className="py-24 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading
          badge="The Vision"
          title={
            <>
              The Future of{" "}
              <span className="gradient-text">Teen Growth</span>
            </>
          }
          description="A complete ecosystem designed around what actually matters to teens—not what adults think should matter."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-6 rounded-2xl glass-card h-full"
              >
                <div className={`w-12 h-12 rounded-xl ${pillar.bg} flex items-center justify-center mb-4 ${pillar.color}`}>
                  {pillar.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
