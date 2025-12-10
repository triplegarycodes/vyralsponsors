import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import { ContactForm } from "@/components/forms/ContactForm";
import { 
  Sparkles, 
  Heart, 
  Zap, 
  MessageSquare,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react";

const supportTiers = [
  {
    title: "Early Tester",
    description: "Get exclusive beta access and help shape the product",
    icon: <Zap className="text-accent" size={28} />,
    perks: ["Beta access", "Exclusive Discord role", "Input on features"],
  },
  {
    title: "Supporter",
    description: "Help fund development and get extra perks",
    icon: <Heart className="text-pink-400" size={28} />,
    perks: ["All Early Tester perks", "Name in credits", "Exclusive merch drops"],
  },
  {
    title: "Champion",
    description: "Maximum impact on VYRAL's development",
    icon: <Sparkles className="text-primary" size={28} />,
    perks: ["All Supporter perks", "1-on-1 with founders", "Lifetime premium"],
  },
];

const socials = [
  { name: "Twitter", icon: <Twitter size={24} />, url: "#" },
  { name: "Instagram", icon: <Instagram size={24} />, url: "#" },
  { name: "YouTube", icon: <Youtube size={24} />, url: "#" },
];

const Support = () => {
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
              Join the Movement
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Support{" "}
              <span className="gradient-text">VYRAL</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Be part of something built different. Join the waitlist, support development, 
              or just reach out—we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl glass-card border-2 border-primary/20"
            >
              <div className="text-center mb-8">
                <Sparkles className="mx-auto text-primary mb-4" size={40} />
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Join the Waitlist
                </h2>
                <p className="text-muted-foreground">
                  Be among the first to experience VYRAL when we launch.
                </p>
              </div>
              <WaitlistForm source="support-page" showName />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support Tiers */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <SectionHeading
            badge="Support Options"
            title={
              <>
                Ways to <span className="gradient-text">Get Involved</span>
              </>
            }
            description="Every level of support helps us build something incredible."
          />

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {supportTiers.map((tier, index) => (
              <motion.div
                key={tier.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-2xl h-full ${
                    index === 2 
                      ? "bg-primary/10 border-2 border-primary/30" 
                      : "glass-card"
                  }`}
                >
                  <div className="mb-4">{tier.icon}</div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {tier.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {tier.description}
                  </p>
                  <ul className="space-y-2">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-muted-foreground text-sm mt-8"
          >
            Detailed sponsorship tiers coming soon. Reach out below to discuss partnership opportunities.
          </motion.p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <MessageSquare className="text-accent mb-4" size={32} />
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground">
                  Questions, ideas, or just want to say hi? We'd love to hear from you.
                </p>
              </div>
              <ContactForm submissionType="support" />
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Connect */}
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Connect With Us
                </h3>
                <div className="flex gap-4">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Quick Answers
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      When does VYRAL launch?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We're in active development. Join the waitlist to be first in line!
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      Is VYRAL free?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Core features will be free. Premium features TBD.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      How can I contribute?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Join the waitlist, spread the word, or reach out about partnerships!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Support;
