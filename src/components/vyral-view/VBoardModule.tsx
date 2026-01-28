import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Tag, Calendar, Plus, ChevronRight, Lock, Sparkles, Palette, BookOpen, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VBoardAgent } from "@/components/vboard/VBoardAgent";
import { moderateContent } from "@/lib/contentModeration";
import { toast } from "sonner";

const sampleNotes = [
  {
    id: 1,
    title: "Project Ideas",
    preview: "Building something that matters...",
    date: "Today",
    tags: ["creative", "goals"],
  },
  {
    id: 2,
    title: "Weekly Reflection",
    preview: "What went well this week and what I learned...",
    date: "Yesterday",
    tags: ["reflection"],
  },
  {
    id: 3,
    title: "Dream Board",
    preview: "Places I want to go, things I want to build...",
    date: "3 days ago",
    tags: ["dreams", "vision"],
  },
];

const tagColors: Record<string, string> = {
  creative: "bg-accent/20 text-accent border-accent/30",
  goals: "bg-primary/20 text-primary border-primary/30",
  reflection: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  dreams: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  vision: "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

const features = [
  { icon: Lightbulb, label: "Brainstorming", description: "Generate new ideas" },
  { icon: BookOpen, label: "Journaling", description: "Reflect and grow" },
];

export function VBoardModule() {
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [showAgent, setShowAgent] = useState(true); // Default to showing agent

  const handleJournalChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (value.length > 0 && value.length % 30 === 0) {
      const check = moderateContent(value);
      if (!check.isClean) {
        if (check.severity === 'critical') {
          toast.error(check.message, { duration: 5000 });
        } else if (check.severity !== 'none') {
          toast.warning("Let's keep our writing positive and respectful 💙", { duration: 2000 });
        }
      }
    }
    
    setJournalEntry(value);
  }, []);

  const handleSaveEntry = useCallback(() => {
    if (!journalEntry.trim()) return;
    
    const check = moderateContent(journalEntry);
    if (!check.isClean) {
      toast.error(check.message || "Please review your entry for inappropriate content.");
      return;
    }
    
    toast.success("Entry saved! ✨");
    setJournalEntry("");
  }, [journalEntry]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/8 via-transparent to-transparent" />
      
      <div className="relative p-6 md:p-8">
        {/* Module Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/30"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Palette className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold gradient-text">VBoard</h2>
              <p className="text-muted-foreground text-sm">Creative · Reflection · Ideas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Feature pills */}
            <div className="hidden md:flex items-center gap-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-xs"
                  >
                    <Icon className="w-3 h-3 text-accent" />
                    <span className="text-muted-foreground">{feature.label}</span>
                  </motion.div>
                );
              })}
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Entry</span>
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Journal Writing Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-border/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background" />
              <div className="relative p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <PenLine className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold">Today's Canvas</h3>
                  <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1 px-3 py-1 rounded-full bg-muted/50">
                    <Calendar className="w-3 h-3" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <Textarea
                  value={journalEntry}
                  onChange={handleJournalChange}
                  placeholder="What's on your mind today? Write freely..."
                  className="min-h-[180px] bg-background/60 border-border/50 resize-none focus:border-primary/50 focus:ring-primary/20 text-base"
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1">
                      <Tag className="w-4 h-4" />
                      Add Tags
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`gap-1 transition-colors ${showAgent ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-accent'}`}
                      onClick={() => setShowAgent(!showAgent)}
                    >
                      <Sparkles className="w-4 h-4" />
                      {showAgent ? 'Hide Neo' : 'Ask Neo'}
                    </Button>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary/20 to-accent/20 text-foreground hover:from-primary/30 hover:to-accent/30 border border-primary/30"
                      disabled={!journalEntry.trim()}
                      onClick={handleSaveEntry}
                    >
                      Save Entry
                    </Button>
                  </motion.div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Creativity without pressure. Your thoughts, your pace.
                </p>
              </div>
            </motion.div>

            {/* AI Agent Panel */}
            <AnimatePresence>
              {showAgent && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <VBoardAgent />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notes Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-border/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background" />
            <div className="relative p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                Recent Notes
              </h3>

              <div className="space-y-3">
                {sampleNotes.map((note, index) => (
                  <motion.button
                    key={note.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => setSelectedNote(note.id)}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
                      selectedNote === note.id
                        ? "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 shadow-lg shadow-primary/10"
                        : "bg-muted/20 border-border/30 hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{note.title}</h4>
                      <ChevronRight className={`w-4 h-4 transition-colors ${selectedNote === note.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{note.preview}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {note.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${tagColors[tag] || "bg-muted text-muted-foreground"}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{note.date}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Locked Feature Preview */}
              <motion.div 
                className="mt-6 p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-dashed border-primary/20"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-medium">Timeline View</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Available with full access. See your journey unfold.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
