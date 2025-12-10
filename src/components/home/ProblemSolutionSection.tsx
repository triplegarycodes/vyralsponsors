import { motion } from "framer-motion";
import { 
  Brain, 
  Zap, 
  Shield, 
  ArrowRight,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const problems = [
  {
    icon: <AlertTriangle className="text-destructive" size={24} />,
    title: "Burnout",
    description: "Endless homework, social pressure, and zero downtime crushing your energy.",
  },
  {
    icon: <AlertTriangle className="text-destructive" size={24} />,
    title: "Chaos",
    description: "Scattered notes, forgotten deadlines, and a million apps that don't talk to each other.",
  },
  {
    icon: <AlertTriangle className="text-destructive" size={24} />,
    title: "Distraction",
    description: "The constant pull of social media, notifications, and digital noise.",
  },
];

const solutions = [
  {
    icon: <Brain className="text-primary" size={24} />,
    title: "Mental Clarity",
    description: "Journaling and mood tracking help you understand your mind.",
  },
  {
    icon: <Zap className="text-accent" size={24} />,
    title: "Focused Action",
    description: "AI-powered task management that adapts to how you work.",
  },
  {
    icon: <Shield className="text-green-400" size={24} />,
    title: "Safe Space",
    description: "A moderated environment designed for teen wellbeing.",
  },
];

export function ProblemSolutionSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading
          badge="The Reality"
          title={
            <>
              From Chaos to{" "}
              <span className="gradient-text">Clarity</span>
            </>
          }
          description="We get it. Being a teen today is overwhelming. VYRAL was built to change that."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="font-display text-xl font-semibold text-destructive/80 flex items-center gap-2">
              <AlertTriangle size={20} />
              The Problem
            </h3>
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl bg-destructive/5 border border-destructive/20"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    {problem.icon}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground mb-1">
                      {problem.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              <ArrowRight size={48} className="text-primary" />
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 text-primary blur-sm"
              >
                <ArrowRight size={48} />
              </motion.div>
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 lg:col-start-2 lg:row-start-1"
          >
            <h3 className="font-display text-xl font-semibold text-primary flex items-center gap-2">
              <Sparkles size={20} />
              The VYRAL Solution
            </h3>
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl glass-card"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {solution.icon}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground mb-1">
                      {solution.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {solution.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
