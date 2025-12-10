import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { 
  Rocket, 
  Globe, 
  Users, 
  Sparkles, 
  Target, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { NeonButton } from "@/components/ui/NeonButton";

const phases = [
  {
    phase: "Phase 1",
    title: "Foundation",
    status: "In Progress",
    items: [
      "Core module development",
      "Neo AI training",
      "Beta testing program",
      "Community building",
    ],
  },
  {
    phase: "Phase 2",
    title: "Expansion",
    status: "Upcoming",
    items: [
      "Mobile apps (iOS & Android)",
      "Financial literacy tools",
      "Parent dashboard",
      "School partnerships",
    ],
  },
  {
    phase: "Phase 3",
    title: "Ecosystem",
    status: "Future",
    items: [
      "VYRAL marketplace",
      "Creator tools",
      "Global community features",
      "Advanced AI capabilities",
    ],
  },
];

const beliefs = [
  {
    title: "Teens deserve better tools",
    description: "Not watered-down adult apps, but systems designed for how teens actually think and work.",
  },
  {
    title: "Growth should feel natural",
    description: "Personal development shouldn't feel like homework. It should be engaging, rewarding, and fun.",
  },
  {
    title: "Privacy is non-negotiable",
    description: "In a world that exploits young people's data, we're building something different.",
  },
  {
    title: "Community matters",
    description: "Real connections with peers who understand your journey make all the difference.",
  },
];

const Vision = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-display font-semibold uppercase tracking-wider text-primary border border-primary/30 rounded-full bg-primary/10">
              The Vision
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Building the Future of{" "}
              <span className="gradient-text">Teen Growth</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              VYRAL isn't just an app—it's a movement. We're creating a world where every 
              teen has access to the tools they need to understand themselves, build habits, 
              and grow into who they want to be.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Believe */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading
            badge="What We Believe"
            title={
              <>
                Our <span className="gradient-text">Philosophy</span>
              </>
            }
          />

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {beliefs.map((belief, index) => (
              <motion.div
                key={belief.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl glass-card"
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {belief.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {belief.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <SectionHeading
            badge="The Roadmap"
            title={
              <>
                Where We're <span className="gradient-text">Going</span>
              </>
            }
            description="A transparent look at our development journey."
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className={`p-6 rounded-2xl h-full ${
                  index === 0 
                    ? "bg-primary/10 border-2 border-primary/30" 
                    : "glass-card"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-sm font-semibold text-primary">
                      {phase.phase}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      phase.status === "In Progress" 
                        ? "bg-green-500/20 text-green-400"
                        : phase.status === "Upcoming"
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    {phase.title}
                  </h3>
                  
                  <ul className="space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={16} />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Bigger Picture */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                The Bigger Picture
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  VYRAL is just the beginning. We envision a future where teens everywhere 
                  have access to tools that help them thrive—not just survive the pressure 
                  of modern adolescence.
                </p>
                <p>
                  From mental health support to financial literacy, from creative expression 
                  to meaningful social connections—we're building an ecosystem that grows 
                  with you.
                </p>
                <p>
                  This isn't about making teens more "productive" by adult standards. It's 
                  about giving you the power to define what growth means for you.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: <Globe size={32} />, label: "Global Reach" },
                { icon: <Users size={32} />, label: "Million+ Teens" },
                { icon: <Sparkles size={32} />, label: "Continuous Innovation" },
                { icon: <Target size={32} />, label: "Impact Driven" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-2xl glass-card text-center"
                >
                  <div className="text-primary mb-3 flex justify-center">
                    {item.icon}
                  </div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Rocket className="mx-auto text-primary mb-6" size={40} />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Be Part of the Journey
            </h2>
            <p className="text-muted-foreground mb-8">
              Join us in building something that actually matters. Your voice helps shape the future of VYRAL.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/support">
                <NeonButton size="lg">
                  <Sparkles size={18} />
                  Join the Movement
                </NeonButton>
              </Link>
              <Link to="/about">
                <NeonButton size="lg" variant="outline">
                  Learn Our Story
                  <ArrowRight size={18} />
                </NeonButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Vision;
