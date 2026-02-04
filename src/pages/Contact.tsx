import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, MessageSquare, HelpCircle, Send, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const faqs = [{
  question: "What is VYRAL?",
  answer: "VYRAL is a safe, competitive digital platform built specifically for teens. We combine smart tools with ethical design to help you achieve your goals, connect with others, and grow—without the manipulative tactics of traditional social platforms."
}, {
  question: "Is VYRAL free to use?",
  answer: "VYRAL offers a free tier with core features. Premium features and merchandise are available for purchase, but we believe everyone should have access to tools that help them thrive."
}, {
  question: "What is Neo?",
  answer: "Neo is your AI companion within VYRAL. Think of Neo as a helpful guide that offers suggestions, answers questions, and helps you navigate the platform—without being pushy or invasive."
}, {
  question: "How do you protect user privacy?",
  answer: "Privacy is fundamental to VYRAL. We collect minimal data, never sell your information, and give you full control over your account. We're transparent about what we collect and why."
}, {
  question: "What is the Neo Band?",
  answer: "The Neo Band is our flagship wearable device. It syncs with your VYRAL account to track progress, send gentle reminders, and help you stay connected to your goals—all in a sleek, teen-friendly design."
}, {
  question: "How can I become a sponsor?",
  answer: "We welcome sponsors who share our values of teen empowerment and ethical technology. Visit our Sponsors page to learn about partnership opportunities and fill out an inquiry form."
}];
export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.functions.invoke("submit-contact-form", {
        body: formData
      });
      if (error) throw error;
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible."
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };
  return <Layout>
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Get in Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Have a question, feedback, or just want to say hi? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }}>
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Send a Message</h2>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))} placeholder="Your name" required className="mt-1.5 bg-background/50" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))} placeholder="you@example.com" required className="mt-1.5 bg-background/50" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={formData.subject} onChange={e => setFormData(prev => ({
                  ...prev,
                  subject: e.target.value
                }))} placeholder="What's this about?" required className="mt-1.5 bg-background/50" />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" value={formData.message} onChange={e => setFormData(prev => ({
                  ...prev,
                  message: e.target.value
                }))} placeholder="Tell us more..." required rows={5} className="mt-1.5 bg-background/50 resize-none" />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 h-12 font-semibold">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="mt-8 glass-card rounded-xl p-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email us at</p>
                  <a href="mailto:hello@vyral.app" className="text-foreground hover:text-primary transition-colors">triplegaryyt2027@gmail.com</a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Quick answers to common questions
                </p>
              </div>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => <AccordionItem key={index} value={`faq-${index}`} className="glass-card rounded-xl border-border/30 px-4">
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </Layout>;
}