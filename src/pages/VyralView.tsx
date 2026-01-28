import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { VyraModule } from "@/components/vyral-view/VyraModule";
import { VBoardModule } from "@/components/vyral-view/VBoardModule";
import { ZoneModule } from "@/components/vyral-view/ZoneModule";
import { NeoPresence } from "@/components/neo/NeoPresence";
import { NeoPanel } from "@/components/neo/NeoPanel";
import { NeoChat } from "@/components/neo/NeoChat";
import { DailyPulse } from "@/components/neo/DailyPulse";
import { useNeoContext } from "@/hooks/useNeoContext";
import { Zap, Palette, Users, Sparkles } from "lucide-react";

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
  const [isNeoPanelOpen, setIsNeoPanelOpen] = useState(false);
  const [isNeoChatOpen, setIsNeoChatOpen] = useState(false);
  
  const {
    context,
    dailyPulse,
    trackModuleVisit,
    trackTaskComplete,
  } = useNeoContext();

  useEffect(() => {
    trackModuleVisit(activeModule);
  }, [activeModule, trackModuleVisit]);

  const handleModuleSwitch = (module: ModuleKey) => {
    setActiveModule(module);
  };

  const handleNeoClick = () => {
    if (isNeoChatOpen) {
      setIsNeoChatOpen(false);
    } else if (isNeoPanelOpen) {
      setIsNeoPanelOpen(false);
      setIsNeoChatOpen(true);
    } else {
      setIsNeoPanelOpen(true);
    }
  };

  return (
    <Layout>
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/3 to-accent/3 rounded-full blur-[150px]" />
      </div>

      <div className="relative min-h-screen pt-24 pb-16">
        {/* Hero Section with Daily Pulse */}
        <section className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Neo's Daily Pulse */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <DailyPulse pulse={dailyPulse} />
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-6 shadow-lg shadow-primary/10"
            >
              <motion.span 
                className="w-2 h-2 bg-accent rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-medium text-foreground/90">Live Preview</span>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </motion.div>

            <motion.h1 
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                VYRAL VIEW
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              This is Vyral. You can use it right now. And this is only the beginning.
            </motion.p>
          </motion.div>
        </section>

        {/* Module Tabs */}
        <section className="container mx-auto px-4 mb-8">
          <div className="flex justify-center">
            <motion.div 
              className="relative p-1.5 rounded-2xl bg-gradient-to-r from-primary/20 via-background to-accent/20 border border-primary/20 shadow-xl shadow-primary/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex gap-1 bg-background/80 backdrop-blur-sm rounded-xl p-1">
                {modules.map((module, index) => {
                  const Icon = module.icon;
                  const isActive = activeModule === module.key;
                  
                  return (
                    <motion.button
                      key={module.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      onClick={() => setActiveModule(module.key)}
                      className={`relative px-5 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-module-bg"
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl border border-primary/30"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className="relative z-10 flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-primary/20' : ''}`}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                        </div>
                        <div className="text-left hidden sm:block">
                          <div className="font-display font-semibold text-sm">{module.name}</div>
                          <div className="text-xs opacity-70">{module.tagline.split(" · ")[0]}</div>
                        </div>
                        <div className="font-display font-semibold text-sm sm:hidden">{module.name}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Active Module Display */}
        <section className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeModule === "vyra" && <VyraModule onTaskComplete={trackTaskComplete} />}
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
            className="relative overflow-hidden rounded-3xl border border-primary/20"
          >
            {/* CTA Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
            
            <div className="relative p-8 md:p-12 text-center max-w-3xl mx-auto">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-6"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Early Access</span>
              </motion.div>
              
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to build your <span className="gradient-text">momentum</span>?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Join the waitlist for full access and be part of something built for the long term.
              </p>
              <motion.a
                href="/support"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary/30"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-4 h-4" />
                Join the Waitlist
              </motion.a>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Neo Presence (floating orb) */}
      <NeoPresence
        context={context}
        onClick={handleNeoClick}
        isActive={isNeoPanelOpen || isNeoChatOpen}
      />

      {/* Neo Panel (smart actions, tips, decisions) */}
      <NeoPanel
        isOpen={isNeoPanelOpen}
        onClose={() => setIsNeoPanelOpen(false)}
        context={context}
        dailyPulse={dailyPulse}
        onModuleSwitch={handleModuleSwitch}
      />

      {/* Neo Chat (secondary, on-demand) */}
      <NeoChat
        isOpen={isNeoChatOpen}
        onClose={() => setIsNeoChatOpen(false)}
        context={context}
      />
    </Layout>
  );
}
