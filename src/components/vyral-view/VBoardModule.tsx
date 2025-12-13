import { useState } from "react";
import { motion } from "framer-motion";
import { PenLine, Tag, Calendar, Sparkles, Plus, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  reflection: "bg-neon-pink/20 text-[hsl(320,90%,60%)] border-neon-pink/30",
  dreams: "bg-neon-cyan/20 text-accent border-neon-cyan/30",
  vision: "bg-primary/20 text-primary border-primary/30",
};

export function VBoardModule() {
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedNote, setSelectedNote] = useState<number | null>(null);

  return (
    <div className="glass-card p-6 md:p-8">
      {/* Module Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold gradient-text mb-2">VBoard</h2>
          <p className="text-muted-foreground">Creative · Reflection · Ideas</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Entry</span>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Journal Writing Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-secondary/30 rounded-2xl p-6 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <PenLine className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">Today's Canvas</h3>
            <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <Textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="What's on your mind today? Write freely..."
            className="min-h-[200px] bg-background/50 border-border/50 resize-none focus:border-primary/50 text-base"
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1">
                <Tag className="w-4 h-4" />
                Add Tags
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent gap-1">
                <Sparkles className="w-4 h-4" />
                AI Prompt
              </Button>
            </div>
            <Button 
              size="sm" 
              className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
              disabled={!journalEntry.trim()}
            >
              Save Entry
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Creativity without pressure. Your thoughts, your pace.
          </p>
        </motion.div>

        {/* Notes Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/30 rounded-2xl p-6 border border-border/50"
        >
          <h3 className="font-display font-semibold mb-4">Recent Notes</h3>

          <div className="space-y-3">
            {sampleNotes.map((note, index) => (
              <motion.button
                key={note.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => setSelectedNote(note.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
                  selectedNote === note.id
                    ? "bg-primary/10 border-primary/30"
                    : "bg-muted/20 border-border/30 hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{note.title}</h4>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
          <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-dashed border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-medium">Timeline View</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Available with full access. See your journey unfold.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
