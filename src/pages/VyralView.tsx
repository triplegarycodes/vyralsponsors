import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { VyraModule } from "@/components/vyral-view/VyraModule";
import { VBoardModule } from "@/components/vyral-view/VBoardModule";
import { ZoneModule } from "@/components/vyral-view/ZoneModule";
import { Zap, Palette, Users } from "lucide-react";

type ModuleKey = "vyra" | "vboard" | "zone";

const modules = [
  {
    key: "vyra" as ModuleKey,
    name: "VYRA",
    tagline: "Focus · Productivity · Customization",
    description: "Your control center for daily momentum.",
    icon: Zap,
    gradient: "from-primary to-accent",
  },
  {
    key: "vboard" as ModuleKey,
    name: "VBoard",
    tagline: "Creative · Reflection · Ideas",
    description: "A private space for thinking and building.",
    icon: Palette,
    gradient: "from-accent to-primary",
  },
  {
    key: "zone" as ModuleKey,
    name: "ZONE",
    tagline: "Social · Ecosystem · Discovery",
    description: "The connective layer of Vyral.",
    icon: Users,
    gradient: "from-primary via-accent to-primary",
  },
];

export default function VyralView() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("vyra");

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6"
            >
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Live Preview</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="gradient-text">VYRAL VIEW</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              This is Vyral. You can use it right now. And this is only the beginning.
            </p>
          </motion.div>
        </section>

        {/* Module Tabs */}
        <section className="container mx-auto px-4 mb-8">
          <div className="flex justify-center">
            <div className="glass rounded-2xl p-2 flex gap-2">
              {modules.map((module, index) => {
                const Icon = module.icon;
                const isActive = activeModule === module.key;
                
                return (
                  <motion.button
                    key={module.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => setActiveModule(module.key)}
                    className={`relative px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left hidden sm:block">
                      <div className="font-display font-semibold text-sm">{module.name}</div>
                      <div className="text-xs opacity-70">{module.tagline.split(" · ")[0]}</div>
                    </div>
                    <div className="font-display font-semibold text-sm sm:hidden">{module.name}</div>
                    
                    {isActive && (
                      <motion.div
                        layoutId="module-indicator"
                        className="absolute inset-0 border-2 border-primary/50 rounded-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Active Module Display */}
        <section className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeModule === "vyra" && <VyraModule />}
              {activeModule === "vboard" && <VBoardModule />}
              {activeModule === "zone" && <ZoneModule />}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Bottom CTA */}
        <section className="container mx-auto px-4 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 text-center max-w-3xl mx-auto"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Ready to build your momentum?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join the waitlist for full access and be part of something built for the long term.
            </p>
            <a
              href="/support"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 neon-glow"
            >
              Join the Waitlist
            </a>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
}
