import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LayoutDashboard, PenTool, TreePine, Target, Users, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { NeonButton } from "@/components/ui/NeonButton";
const modules = [{
  id: "board",
  title: "Board",
  tagline: "Your Personal Quest System",
  description: "Transform chaos into clarity. Board turns your tasks, schedules, and calendars into an interactive quest—complete with AI-assisted suggestions, quick-add gestures, and streak tracking that actually motivates.",
  icon: <LayoutDashboard size={32} />,
  color: "violet",
  gradient: "from-violet-500/20 to-purple-600/20",
  borderColor: "border-violet-500/30",
  iconBg: "bg-violet-500/20",
  iconColor: "text-violet-400",
  features: ["AI-powered task suggestions", "Drag-and-drop scheduling", "Streak tracking & rewards", "Calendar integration", "Quick-add gestures", "Priority intelligence"]
}, {
  id: "skryb",
  title: "Skryb",
  tagline: "Creative Journaling Reimagined",
  description: "Your thoughts deserve a beautiful home. Skryb combines creative journaling with emotional tracking, giving you a teen-friendly timeline of your inner world—no judgment, just growth.",
  icon: <PenTool size={32} />,
  color: "cyan",
  gradient: "from-cyan-500/20 to-blue-600/20",
  borderColor: "border-cyan-500/30",
  iconBg: "bg-cyan-500/20",
  iconColor: "text-cyan-400",
  features: ["Mood tracking & patterns", "Voice-to-text journaling", "Memory timeline view", "Prompt suggestions", "Private & secure", "Reflection insights"]
}, {
  id: "tree",
  title: "Tree",
  tagline: "Watch Yourself Grow",
  description: "Your progress, visualized as a living digital organism. Tree evolves based on your streaks, habits, and daily actions—turning abstract growth into something you can actually see and feel.",
  icon: <TreePine size={32} />,
  color: "green",
  gradient: "from-green-500/20 to-emerald-600/20",
  borderColor: "border-green-500/30",
  iconBg: "bg-green-500/20",
  iconColor: "text-green-400",
  features: ["Living progress visualization", "Habit-linked evolution", "Milestone celebrations", "Growth statistics", "Seasonal themes", "Shareable progress"]
}, {
  id: "kor",
  title: "Kor",
  tagline: "Your Command Center",
  description: "The central hub for everything that matters. Track projects, set meaningful goals, analyze your stats, and see your entire journey unfold in one powerful dashboard.",
  icon: <Target size={32} />,
  color: "orange",
  gradient: "from-orange-500/20 to-amber-600/20",
  borderColor: "border-orange-500/30",
  iconBg: "bg-orange-500/20",
  iconColor: "text-orange-400",
  features: ["Project management", "Goal setting & tracking", "Analytics dashboard", "Milestone mapping", "Progress reports", "Cross-module insights"]
}, {
  id: "zone",
  title: "Zone",
  tagline: "Your Safe Social Space",
  description: "Connect with peers who get it. Zone is a moderated community designed specifically for teens—collaborate on projects, share wins, and express yourself in a genuinely safe environment.",
  icon: <Users size={32} />,
  color: "pink",
  gradient: "from-pink-500/20 to-rose-600/20",
  borderColor: "border-pink-500/30",
  iconBg: "bg-pink-500/20",
  iconColor: "text-pink-400",
  features: ["Safe, moderated spaces", "Project collaboration", "Achievement sharing", "Group challenges", "Mentor connections", "Anonymous support"]
}];
const Modules = () => {
  return <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-display font-semibold uppercase tracking-wider text-primary border border-primary/30 rounded-full bg-primary/10">
              The Ecosystem
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Five Modules.{" "}
              <span className="gradient-text">Infinite Possibilities.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Each module is designed to work standalone or together—giving you the 
              flexibility to build your perfect productivity stack.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Module Details */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            {modules.map((module, index) => <motion.div key={module.id} initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: "-100px"
          }} transition={{
            duration: 0.6
          }} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                {/* Content */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`inline-flex items-center gap-3 p-3 rounded-xl ${module.iconBg} ${module.iconColor} mb-6`}>
                    {module.icon}
                    <span className="font-display font-bold text-lg">{module.title}</span>
                  </div>
                  
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {module.tagline}
                  </h2>
                  
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {module.features.map(feature => <div key={feature} className="gap-2 text-sm flex items-center justify-center">
                        <CheckCircle2 className={module.iconColor} size={16} />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>)}
                  </div>
                </div>

                {/* Visual */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <motion.div whileHover={{
                scale: 1.02
              }} className={`aspect-[4/3] rounded-3xl bg-gradient-to-br ${module.gradient} border ${module.borderColor} flex items-center justify-center relative overflow-hidden`}>
                    {/* Placeholder for mockup */}
                    <div className="absolute inset-0 grid-bg opacity-30" />
                    <div className={`${module.iconColor} opacity-30`}>
                      {module.icon && <div className="scale-[4]">{module.icon}</div>}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 p-4 glass rounded-xl">
                      <p className="text-xs text-muted-foreground text-center">
                        Mockup coming soon
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="max-w-2xl mx-auto text-center">
            <Sparkles className="mx-auto text-primary mb-6" size={40} />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to experience VYRAL?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join the waitlist to be among the first to try all five modules.
            </p>
            <Link to="/support">
              <NeonButton size="lg">
                <Sparkles size={18} />
                Join the Waitlist
              </NeonButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>;
};
export default Modules;