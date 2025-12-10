import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Users, Target, Heart, Zap, Shield, Sparkles } from "lucide-react";

const values = [
  {
    icon: <Users size={24} />,
    title: "By Teens, For Teens",
    description: "Built by people who actually understand what it's like to be a teenager today.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: <Heart size={24} />,
    title: "Wellbeing First",
    description: "Every feature is designed with mental health and balance in mind.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    icon: <Shield size={24} />,
    title: "Safe & Private",
    description: "Your data is yours. We never sell it, share it, or exploit it.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: <Zap size={24} />,
    title: "Actually Useful",
    description: "No fluff, no gimmicks. Tools that genuinely help you grow.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const About = () => {
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
              Our Story
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Built by teens who{" "}
              <span className="gradient-text">get it.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              VYRAL isn't another productivity app made by adults who forgot what it's 
              like to be young. It's a movement created by teens who are living the 
              same challenges—and building the solution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our <span className="gradient-text">Mission</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We're on a mission to revolutionize how teens approach personal growth. 
                  Not with boring apps, not with condescending advice, but with tools 
                  that actually fit into our lives.
                </p>
                <p>
                  VYRAL combines habit-building, creative expression, emotional intelligence, 
                  and social connection into one seamless ecosystem. It's everything you 
                  need to level up—designed the way you'd want it.
                </p>
                <p>
                  We believe every teen deserves access to tools that help them thrive, 
                  not just survive. That's why we're building VYRAL.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 border-2 border-dashed border-primary/20 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Target size={120} className="text-primary/50" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <SectionHeading
            badge="What We Stand For"
            title={
              <>
                Core <span className="gradient-text">Values</span>
              </>
            }
            description="The principles that guide everything we build."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl glass-card h-full text-center"
                >
                  <div className={`w-14 h-14 rounded-xl ${value.bg} flex items-center justify-center mx-auto mb-4 ${value.color}`}>
                    {value.icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Sparkles className="mx-auto text-accent mb-6" size={48} />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              The Vision
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              We're not just building an app—we're building a movement. A world where 
              every teen has the tools to understand themselves, build healthy habits, 
              and grow into the person they want to be.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              VYRAL is the first step toward that future. And we're just getting started.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
