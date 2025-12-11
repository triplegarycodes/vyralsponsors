import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SponsorshipTierCard } from "@/components/sponsors/SponsorshipTierCard";
import { FloatingOrb } from "@/components/sponsors/FloatingOrb";
import { ImpactMetric } from "@/components/sponsors/ImpactMetric";
import { NeoOrb } from "@/components/sponsors/NeoOrb";
import { NeonButton } from "@/components/ui/NeonButton";
import { ContactForm } from "@/components/forms/ContactForm";
import {
  Sparkles,
  Flame,
  Zap,
  Crown,
  Globe,
  Users,
  TrendingUp,
  Heart,
  Shield,
  Brain,
  MessageSquare,
  Lightbulb,
  ShoppingBag,
  Watch,
  Shirt,
  Palette,
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const sponsorshipTiers = [
  {
    name: "Spark",
    tagline: "Entry-level support for individuals passionate about teen innovation.",
    price: "$25",
    priceNote: "One-time contribution",
    icon: <Sparkles className="text-primary" size={32} />,
    perks: [
      "Early access to VYRAL newsletters",
      "1 exclusive limited-edition merch drop",
      "Digital supporter badge for social sharing",
      "Name listed on official Supporters Wall",
      "Access to private Discord community",
    ],
    glowColor: "primary",
  },
  {
    name: "Ignite",
    tagline: "Perfect for educators, small businesses, and youth organizations.",
    price: "$199",
    priceNote: "Per semester or campaign",
    icon: <Flame className="text-orange-400" size={32} />,
    perks: [
      "Everything in Spark tier",
      "VYRAL app access for up to 10 teens",
      "Classroom analytics dashboard",
      "2 exclusive physical merch items",
      "Featured sponsor spotlight on app",
      "Private sponsor-only webinar access",
      "Quarterly impact reports",
    ],
    glowColor: "orange",
    featured: true,
  },
  {
    name: "Inferno",
    tagline: "Premium brand partnership for maximum visibility and impact.",
    price: "$999",
    priceNote: "Annual partnership",
    icon: <Zap className="text-accent" size={32} />,
    perks: [
      "Everything in Ignite tier",
      "VYRAL app access for up to 50 teens",
      "Custom Tree evolution cosmetic unlock",
      "Logo in sponsor constellation view",
      "Early-feature beta testing access",
      "Physical Neo Band prototypes",
      "Press release and PR feature inclusion",
      "Direct line to founding team",
    ],
    glowColor: "accent",
  },
  {
    name: "Cosmic Partner",
    tagline: "Enterprise-level investment in the future of teen productivity.",
    price: "$4,999+",
    priceNote: "Custom enterprise package",
    icon: <Crown className="text-pink-400" size={32} />,
    perks: [
      "Everything in Inferno tier",
      "Co-branded Vybe UI reskin",
      "R&D collaboration opportunities",
      "Dedicated sponsor microsite",
      "Early adoption pipeline access",
      "Student innovation grant contribution",
      "Yearly comprehensive impact report",
      "Board advisory opportunities",
      "Custom integration discussions",
    ],
    glowColor: "pink",
  },
];

const impactMetrics = [
  { value: 50000, suffix: "+", label: "Teens to reach in Year 1", icon: <Users size={28} /> },
  { value: 85, suffix: "%", label: "Projected engagement rate", icon: <TrendingUp size={28} /> },
  { value: 73, suffix: "%", label: "Mental wellness improvement", icon: <Heart size={28} /> },
  { value: 200, suffix: "+", label: "Educators onboarded", icon: <Brain size={28} /> },
];

const merchItems = [
  {
    name: "Neo Band",
    description: "Wearable smart companion. Gentle haptic nudges for habits, streaks, and wellness check-ins.",
    icon: <Watch size={32} />,
  },
  {
    name: '"Loading Future → ERROR. Future = Now"',
    description: "Premium oversized hoodie. Statement piece for forward-thinking teens.",
    icon: <Shirt size={32} />,
  },
  {
    name: "Vybe Reskins",
    description: "Unlock custom UI themes. Neon, cyberpunk, minimal, nature—express your style.",
    icon: <Palette size={32} />,
  },
  {
    name: "Vyra Cards",
    description: "Collectible achievement cards. Trade, collect, and showcase your journey.",
    icon: <CreditCard size={32} />,
  },
];

const Sponsors = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px]"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <FloatingOrb size="lg" color="mixed" interactive />
          </motion.div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
        </div>

        {/* Glitch particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: [0, (Math.random() - 0.5) * 50],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 mb-6 text-xs font-display font-semibold uppercase tracking-wider text-primary border border-primary/30 rounded-full bg-primary/10"
            >
              Become a Sponsor
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
            >
              Fuel the Future of{" "}
              <span className="gradient-text glitch">Teen Innovation</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Partner with VYRAL to transform how the next generation approaches 
              productivity, mental wellness, and personal growth. Your support 
              directly powers tools that help teens thrive.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href="#tiers">
                <NeonButton size="lg">
                  <Sparkles size={18} />
                  View Sponsorship Tiers
                </NeonButton>
              </a>
              <a href="#contact">
                <NeonButton size="lg" variant="outline">
                  Contact Our Team
                  <ArrowRight size={18} />
                </NeonButton>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Why Sponsors Matter */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading
            badge="Why It Matters"
            title={
              <>
                Teens Deserve <span className="gradient-text">Better</span>
              </>
            }
          />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  The Crisis is Real
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Teen burnout is at an all-time high. Between academic pressure, social 
                  media overload, and a lack of accessible mental health resources, young 
                  people are struggling more than ever to find balance, purpose, and genuine 
                  productivity systems that work for them.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-card">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  Traditional Tools Fail Teens
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Productivity apps are designed by adults, for adults. They ignore how 
                  teens actually think, learn, and grow. They're boring, condescending, 
                  or exploitative—harvesting data instead of nurturing potential.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-card border-2 border-primary/30">
                <h3 className="font-display text-xl font-semibold text-primary mb-3">
                  VYRAL Changes Everything
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We're building a complete ecosystem—by teens, for teens—that combines 
                  habit formation, creative expression, emotional intelligence, and safe 
                  social connection. Every feature is designed to empower, not exploit.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: <Brain size={24} />, label: "Mental Clarity", color: "text-violet-400" },
                { icon: <Heart size={24} />, label: "Emotional Support", color: "text-pink-400" },
                { icon: <Shield size={24} />, label: "Privacy First", color: "text-green-400" },
                { icon: <Zap size={24} />, label: "Real Productivity", color: "text-accent" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-2xl glass-card text-center"
                >
                  <div className={`${item.color} mb-3 flex justify-center`}>{item.icon}</div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section id="tiers" className="py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-6">
          <SectionHeading
            badge="Sponsorship Tiers"
            title={
              <>
                Choose Your <span className="gradient-text">Impact Level</span>
              </>
            }
            description="Every contribution fuels the movement. Select the tier that matches your capacity to support teen innovation."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipTiers.map((tier, index) => (
              <SponsorshipTierCard
                key={tier.name}
                {...tier}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Comparison note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-muted-foreground text-sm mt-12"
          >
            All tiers include tax-deductible receipts where applicable. Custom packages available for unique needs.
          </motion.p>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading
            badge="Projected Impact"
            title={
              <>
                Numbers That <span className="neon-text-cyan">Matter</span>
              </>
            }
            description="Real projections based on our beta testing, market research, and commitment to teen wellbeing."
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => (
              <ImpactMetric
                key={metric.label}
                {...metric}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Neo Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-display font-semibold uppercase tracking-wider text-accent border border-accent/30 rounded-full bg-accent/10">
                Meet Neo
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                The AI That <span className="neon-text-cyan">Gets Teens</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Neo isn't just another chatbot. It's a supportive AI companion trained to 
                understand the teen experience—offering guidance on tasks, habits, emotional 
                reflection, budgeting, and learning without being preachy or patronizing.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <MessageSquare size={20} />, title: "Natural Conversations", desc: "Talks like a friend, not a robot" },
                  { icon: <Lightbulb size={20} />, title: "Smart Recommendations", desc: "Personalized to your patterns and goals" },
                  { icon: <Shield size={20} />, title: "Privacy Guaranteed", desc: "Your conversations stay yours—always" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <NeoOrb />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Merch + Future Tech */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeading
            badge="Future Tech"
            title={
              <>
                <span className="gradient-text">VYRAL</span> Gear & Collectibles
              </>
            }
            description="Exclusive physical and digital items that extend the VYRAL experience into the real world."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="p-6 rounded-2xl glass-card h-full"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground text-sm">
              Sponsors at Ignite tier and above receive exclusive early access to all merch drops.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-24 md:py-32 relative scroll-mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* CTA Block */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to <span className="gradient-text">Make an Impact?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're an individual supporter, educator, business, or enterprise 
                partner—there's a place for you in the VYRAL mission. Let's build the 
                future of teen productivity together.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Support the Mission",
                  "Become a Partner",
                  "Sponsor a Teen Group",
                ].map((action, i) => (
                  <motion.div
                    key={action}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="text-primary" size={20} />
                    <span className="text-foreground font-medium">{action}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#tiers">
                  <NeonButton size="lg">
                    <Sparkles size={18} />
                    Choose Your Tier
                  </NeonButton>
                </a>
                <Link to="/support">
                  <NeonButton size="lg" variant="outline">
                    Join Waitlist
                  </NeonButton>
                </Link>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl glass-card"
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Partner Inquiries
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Custom packages, enterprise solutions, or questions? Reach out directly.
              </p>
              <ContactForm submissionType="sponsorship" />
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sponsors;
