import { motion } from "framer-motion";
import { User, Globe, Gamepad2, Palette, Rocket, Lock, ArrowRight, Sparkles, Shield, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const ecosystemApps = [
  {
    name: "VYRA",
    description: "Focus & productivity hub",
    icon: Rocket,
    status: "live",
    color: "from-primary to-accent",
  },
  {
    name: "VBoard",
    description: "Creative journaling",
    icon: Palette,
    status: "live",
    color: "from-accent to-primary",
  },
  {
    name: "Vyral Games",
    description: "Skill-building adventures",
    icon: Gamepad2,
    status: "coming",
    color: "from-rose-500 to-primary",
  },
  {
    name: "Vyral Connect",
    description: "Collaborative spaces",
    icon: Users,
    status: "coming",
    color: "from-primary to-sky-400",
  },
];

const communityStats = [
  { label: "Early Testers", value: "2.4K+", icon: Users },
  { label: "Ideas Shared", value: "12K+", icon: Sparkles },
  { label: "Countries", value: "47", icon: Globe },
];

export function ZoneModule() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      
      <div className="relative p-6 md:p-8">
        {/* Module Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/30"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Globe className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold gradient-text">ZONE</h2>
              <p className="text-muted-foreground text-sm">Social · Ecosystem · Discovery</p>
            </div>
          </div>
          <motion.div 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent/20 to-emerald-500/20 border border-accent/30"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">Safety First</span>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-border/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background" />
            <div className="relative p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-primary/20">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold">Your Profile</h3>
              </div>

              <div className="text-center mb-6">
                <motion.div 
                  className="relative w-24 h-24 mx-auto mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Glow ring */}
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-lg"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-primary/50">
                    <User className="w-10 h-10 text-primary-foreground" />
                  </div>
                  {/* Status dot */}
                  <motion.div 
                    className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                <div className="text-muted-foreground text-sm mb-4 px-3 py-1.5 rounded-full bg-muted/30 inline-block">Guest Preview</div>
                
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-full w-3/4 mx-auto" />
                  <div className="h-3 bg-muted/30 rounded-full w-1/2 mx-auto" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
                <motion.div 
                  className="text-center p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  <div className="font-display font-bold text-lg text-primary">7</div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </motion.div>
                <motion.div 
                  className="text-center p-2 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  <div className="font-display font-bold text-lg text-accent">24</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </motion.div>
                <motion.div 
                  className="text-center p-2 rounded-lg hover:bg-yellow-500/10 transition-colors cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-display font-bold text-lg">3</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                </motion.div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full mt-6 bg-gradient-to-r from-primary/20 to-accent/20 text-foreground hover:from-primary/30 hover:to-accent/30 border border-primary/30">
                  Create Full Profile
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Ecosystem Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-border/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background" />
            <div className="relative p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-semibold">Vyral Ecosystem</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {ecosystemApps.map((app, index) => {
                  const Icon = app.icon;
                  const isLive = app.status === "live";

                  return (
                    <motion.div
                      key={app.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ scale: isLive ? 1.02 : 1, y: isLive ? -2 : 0 }}
                      className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                        isLive
                          ? "bg-gradient-to-br from-primary/10 to-accent/5 border-primary/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                          : "bg-muted/20 border-border/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <motion.div 
                          className={`p-2.5 rounded-lg bg-gradient-to-br ${app.color} shadow-lg`}
                          animate={isLive ? { rotate: [0, 3, -3, 0] } : {}}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <Icon className="w-5 h-5 text-primary-foreground" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-semibold text-sm">{app.name}</h4>
                            {isLive ? (
                              <motion.span 
                                className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-accent/30 to-emerald-500/30 text-accent border border-accent/40"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                Live
                              </motion.span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                Coming Soon
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{app.description}</p>
                        </div>
                        {isLive && (
                          <ArrowRight className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      {!isLive && (
                        <div className="absolute top-3 right-3">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Community Stats */}
              <motion.div 
                className="p-5 rounded-xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 text-accent" />
                  </motion.div>
                  <span className="text-sm font-medium">Growing Community</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {communityStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div 
                        key={stat.label} 
                        className="text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <Icon className="w-4 h-4 text-primary/70" />
                          <span className="font-display font-bold text-xl gradient-text">{stat.value}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <p className="text-xs text-muted-foreground mt-5 text-center">
                Be part of something built for the long term. Discovery starts here.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
