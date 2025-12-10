import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { 
  Bot, 
  MessageSquare, 
  Lightbulb, 
  Heart, 
  Shield, 
  Zap,
  Brain,
  Smile,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { NeonButton } from "@/components/ui/NeonButton";

const capabilities = [
  {
    icon: <MessageSquare size={24} />,
    title: "Natural Conversations",
    description: "Talk like you would with a friend. Neo understands context, slang, and emotions.",
  },
  {
    icon: <Lightbulb size={24} />,
    title: "Smart Suggestions",
    description: "Get personalized recommendations based on your goals, habits, and patterns.",
  },
  {
    icon: <Heart size={24} />,
    title: "Emotional Support",
    description: "Neo is trained to recognize when you're struggling and offer appropriate support.",
  },
  {
    icon: <Shield size={24} />,
    title: "Privacy First",
    description: "Your conversations are private. Neo doesn't share your data with anyone.",
  },
  {
    icon: <Brain size={24} />,
    title: "Learns Your Patterns",
    description: "The more you use VYRAL, the better Neo understands how to help you.",
  },
  {
    icon: <Zap size={24} />,
    title: "Quick Actions",
    description: "Add tasks, log moods, or start journaling with simple voice commands.",
  },
];

const personality = [
  {
    trait: "Supportive, not preachy",
    description: "Neo encourages without lecturing. Think cool older sibling, not strict parent.",
  },
  {
    trait: "Honest, not harsh",
    description: "When you need a reality check, Neo delivers it with care.",
  },
  {
    trait: "Fun, not fake",
    description: "Genuine humor and personality—not corporate-approved positivity.",
  },
  {
    trait: "Present, not pushy",
    description: "Available when you need it, quiet when you don't.",
  },
];

const Neo = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-display font-semibold uppercase tracking-wider text-accent border border-accent/30 rounded-full bg-accent/10">
                Meet Neo
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Your AI{" "}
                <span className="neon-text-cyan">Companion</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Neo isn't just another chatbot. It's a supportive guide designed specifically 
                for the teen experience—understanding your world, your challenges, and your language.
              </p>
              <Link to="/support">
                <NeonButton size="lg">
                  <Bot size={18} />
                  Experience Neo
                </NeonButton>
              </Link>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative mx-auto w-72 h-72 md:w-96 md:h-96">
                {/* Outer Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-accent/30"
                />
                
                {/* Middle Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 rounded-full border border-accent/20"
                />

                {/* Inner Glow */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 blur-3xl" />
                
                {/* Core */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-16 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center"
                >
                  <Bot size={80} className="text-accent" />
                </motion.div>

                {/* Orbiting Elements */}
                {[
                  { icon: <Smile size={16} />, delay: 0 },
                  { icon: <Heart size={16} />, delay: 3 },
                  { icon: <Lightbulb size={16} />, delay: 6 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                      delay: item.delay,
                    }}
                    className="absolute inset-0"
                  >
                    <div
                      className="absolute w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent"
                      style={{
                        top: "5%",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      {item.icon}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <SectionHeading
            badge="What Neo Can Do"
            title={
              <>
                Smarter Than Your Average <span className="gradient-text">Assistant</span>
              </>
            }
            description="Neo is built to understand the teen experience and provide meaningful support."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl glass-card h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 text-accent">
                    {cap.icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {cap.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personality */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading
            badge="Neo's Personality"
            title={
              <>
                Designed to <span className="neon-text-cyan">Get You</span>
              </>
            }
            description="Neo's personality was crafted with teen input to feel genuinely helpful, not annoying."
          />

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {personality.map((item, index) => (
              <motion.div
                key={item.trait}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-accent/5 border border-accent/20"
              >
                <h3 className="font-display text-lg font-semibold text-accent mb-2">
                  {item.trait}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <SectionHeading
            badge="How Neo Helps"
            title={
              <>
                Across the Entire <span className="gradient-text">Ecosystem</span>
              </>
            }
            description="Neo works seamlessly with every VYRAL module to enhance your experience."
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Board",
                description: "Get smart task suggestions and schedule optimizations.",
              },
              {
                step: "02",
                title: "Skryb",
                description: "Receive prompts and insights based on your journaling.",
              },
              {
                step: "03",
                title: "Tree",
                description: "Neo celebrates your growth and suggests next steps.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="font-display text-5xl font-bold gradient-text mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <TrendingUp className="mx-auto text-accent mb-6" size={40} />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to meet Neo?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join the waitlist and be among the first to experience AI support designed just for teens.
            </p>
            <Link to="/support">
              <NeonButton size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Bot size={18} />
                Join the Waitlist
              </NeonButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Neo;
