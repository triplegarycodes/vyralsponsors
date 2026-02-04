import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Zap, 
  Clock, 
  Heart, 
  Users, 
  Sparkles,
  Target,
  Eye
} from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Every feature is designed with teen safety as the foundation. No exceptions, no compromises.",
  },
  {
    icon: Zap,
    title: "Competitive Edge",
    description: "We believe healthy competition drives growth. VYRAL channels that energy productively.",
  },
  {
    icon: Clock,
    title: "Time-Aware",
    description: "Teens are busy. VYRAL respects your time with focused, intentional experiences.",
  },
  {
    icon: Heart,
    title: "Genuine Care",
    description: "Built by teens, for teens. We understand the real challenges you face.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Your voice shapes VYRAL. We listen, adapt, and grow together.",
  },
  {
    icon: Sparkles,
    title: "Ethical Design",
    description: "No dark patterns, no manipulation. Just tools that genuinely help.",
  },
];

const team = [
  {
    name: "The Founders",
    role: "Vision & Direction",
    description: "A group of teens who saw a gap in the digital landscape and decided to fill it.",
  },
  {
    name: "Neo",
    role: "AI Companion",
    description: "Your personal guide through the VYRAL ecosystem—calm, helpful, never pushy.",
  },
  {
    name: "You",
    role: "The Community",
    description: "VYRAL is nothing without its users. You're part of this story.",
  },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Our Story
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Built </span>
              <span className="gradient-text">By Teens,</span>
              <br />
              <span className="text-foreground">For Teens</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              VYRAL started with a simple question: What if there was a digital space 
              that actually understood what teens need—not what algorithms think they want?
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Our Mission
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Empowering the Next Generation
              </h2>
              <p className="text-muted-foreground text-lg">
                We're not here to maximize your screen time. We're here to help you 
                achieve your goals, connect meaningfully, and grow into the person 
                you want to be.
              </p>
              <p className="text-muted-foreground">
                VYRAL combines smart technology with ethical design to create tools 
                that actually work for you—not against you. Whether it's staying on 
                track with goals, exploring new interests, or connecting with others 
                who share your vision, VYRAL is your platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">
                    Our Vision
                  </span>
                </div>
                <blockquote className="text-xl md:text-2xl font-display font-medium text-foreground">
                  "A digital world where teens thrive—not just survive."
                </blockquote>
                <p className="text-muted-foreground">
                  We imagine a future where technology serves human potential, 
                  where every teen has access to tools that help them learn, 
                  grow, and achieve their dreams.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              What We Stand For
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These aren't just words on a page. They're the principles that guide 
              every decision we make.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              The VYRAL Family
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're more than a company. We're a movement.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-2xl font-bold gradient-text">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg">
                  {member.name}
                </h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="relative">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Ready to Join the Movement?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Whether you're a student looking for tools, a sponsor wanting to make 
                a difference, or just curious—there's a place for you here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/shop"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Explore Shop
                </a>
                <a
                  href="/sponsors"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary/30 text-foreground font-semibold rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Become a Sponsor
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
