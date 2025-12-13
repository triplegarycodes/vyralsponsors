import { motion } from "framer-motion";
import { User, Globe, Gamepad2, Palette, Rocket, Lock, ArrowRight, Sparkles, Shield, Users } from "lucide-react";
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
    color: "from-neon-pink to-primary",
  },
  {
    name: "Vyral Connect",
    description: "Collaborative spaces",
    icon: Users,
    status: "coming",
    color: "from-primary to-neon-cyan",
  },
];

const communityStats = [
  { label: "Early Testers", value: "2.4K+" },
  { label: "Ideas Shared", value: "12K+" },
  { label: "Countries", value: "47" },
];

export function ZoneModule() {
  return (
    <div className="glass-card p-6 md:p-8">
      {/* Module Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold gradient-text mb-2">ZONE</h2>
          <p className="text-muted-foreground">Social · Ecosystem · Discovery</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent font-medium">Safety First</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-secondary/30 rounded-2xl p-6 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">Your Profile</h3>
          </div>

          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="text-muted-foreground text-sm mb-4">Guest Preview</div>
            <div className="space-y-2">
              <div className="h-3 bg-muted/50 rounded-full w-3/4 mx-auto" />
              <div className="h-3 bg-muted/30 rounded-full w-1/2 mx-auto" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
            <div className="text-center">
              <div className="font-display font-bold text-lg text-primary">7</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-lg text-accent">24</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-lg text-foreground">3</div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
          </div>

          <Button className="w-full mt-6 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
            Create Full Profile
          </Button>
        </motion.div>

        {/* Ecosystem Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-secondary/30 rounded-2xl p-6 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-primary" />
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
                  className={`relative p-4 rounded-xl border transition-all duration-300 ${
                    isLive
                      ? "bg-primary/5 border-primary/30 hover:border-primary/50"
                      : "bg-muted/20 border-border/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${app.color}`}>
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-semibold text-sm">{app.name}</h4>
                        {isLive ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
                            Live
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{app.description}</p>
                    </div>
                    {isLive && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  {!isLive && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Community Stats */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Growing Community</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {communityStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display font-bold text-xl gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Be part of something built for the long term. Discovery starts here.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
