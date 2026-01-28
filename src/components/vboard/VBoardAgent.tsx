import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Lightbulb, 
  FileText, 
  Wand2, 
  Expand,
  Upload,
  X,
  Loader2,
  Heart,
  Compass,
  Calendar,
  PenTool,
  MessageCircle,
  Infinity as InfinityIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { moderateContent, moderateFilename, getSupportResources } from '@/lib/contentModeration';
import { toast } from 'sonner';

type AgentMode = 'brainstorm' | 'analyze' | 'prompt' | 'expand' | 'navigate' | 'plan' | 'create';

interface AgentResponse {
  response?: string;
  error?: string;
  blocked?: boolean;
  supportive?: boolean;
}

const modeConfig: Record<AgentMode, { 
  icon: React.ElementType; 
  label: string; 
  placeholder: string; 
  color: string;
  description: string;
}> = {
  brainstorm: {
    icon: Lightbulb,
    label: 'Brainstorm',
    placeholder: 'What would you like to brainstorm about? (e.g., "ideas for a short story about time travel")',
    color: 'text-yellow-400',
    description: 'Generate creative ideas',
  },
  plan: {
    icon: Calendar,
    label: 'Plan Day',
    placeholder: 'Tell me about your goals for today, or what you need to accomplish...',
    color: 'text-emerald-400',
    description: 'Organize your schedule',
  },
  navigate: {
    icon: Compass,
    label: 'Navigate',
    placeholder: 'What do you want to do? (e.g., "help me focus", "find creative tools", "track my progress")',
    color: 'text-sky-400',
    description: 'Get guided through Vyral',
  },
  create: {
    icon: PenTool,
    label: 'Create',
    placeholder: 'What would you like to create? (e.g., "a poem about the ocean", "journal prompts for gratitude")',
    color: 'text-rose-400',
    description: 'Safe content creation',
  },
  analyze: {
    icon: FileText,
    label: 'Analyze',
    placeholder: 'Describe what you\'d like analyzed, or upload a file below...',
    color: 'text-accent',
    description: 'Get insights on content',
  },
  prompt: {
    icon: Wand2,
    label: 'Get Prompt',
    placeholder: 'What kind of creative prompt would you like? (leave empty for a surprise!)',
    color: 'text-primary',
    description: 'Spark your imagination',
  },
  expand: {
    icon: Expand,
    label: 'Expand',
    placeholder: 'Paste your idea or writing here, and I\'ll help expand it...',
    color: 'text-violet-400',
    description: 'Develop your ideas',
  },
};

const quickActions = [
  { mode: 'plan' as AgentMode, label: 'Plan my day', prompt: 'Help me plan a productive day' },
  { mode: 'navigate' as AgentMode, label: 'What can I do?', prompt: 'What features and activities are available in Vyral?' },
  { mode: 'create' as AgentMode, label: 'Write something', prompt: 'Give me a creative writing prompt to get started' },
  { mode: 'brainstorm' as AgentMode, label: 'New ideas', prompt: 'Help me brainstorm something new and exciting' },
];

export function VBoardAgent() {
  const [mode, setMode] = useState<AgentMode>('brainstorm');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const filenameCheck = moderateFilename(file.name);
    if (!filenameCheck.isClean) {
      toast.error('This file name contains inappropriate content.');
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error('File is too large. Please use files under 1MB.');
      return;
    }

    const allowedTypes = ['text/plain', 'text/markdown', 'application/json', 'text/csv'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|md|json|csv)$/i)) {
      toast.error('Please upload a text file (.txt, .md, .json, or .csv)');
      return;
    }

    try {
      const text = await file.text();
      
      const contentCheck = moderateContent(text);
      if (!contentCheck.isClean) {
        if (contentCheck.severity === 'critical') {
          setShowSupport(true);
          toast.error(contentCheck.message || 'This file contains sensitive content.');
        } else {
          toast.error('This file contains inappropriate content and cannot be analyzed.');
        }
        return;
      }

      setUploadedFile(file);
      setFileContent(text);
      toast.success(`File "${file.name}" ready for analysis!`);
    } catch {
      toast.error('Could not read this file. Please try another.');
    }
  }, []);

  const handleSubmit = useCallback(async (overrideInput?: string) => {
    const effectiveInput = overrideInput || input;
    
    if (!effectiveInput.trim() && !fileContent && mode !== 'prompt') {
      toast.error('Please enter something to work with.');
      return;
    }

    if (effectiveInput.trim()) {
      const inputCheck = moderateContent(effectiveInput);
      if (!inputCheck.isClean) {
        if (inputCheck.severity === 'critical') {
          setShowSupport(true);
          setResponse(inputCheck.message || '');
        } else {
          toast.error(inputCheck.message || 'Please use appropriate language.');
        }
        return;
      }
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const { data, error } = await supabase.functions.invoke<AgentResponse>('vboard-agent', {
        body: {
          type: mode,
          input: effectiveInput.trim() || 'surprise me',
          fileContent: fileContent?.slice(0, 5000),
        },
      });

      if (error) {
        console.error('Agent error:', error);
        toast.error('Something went wrong. Please try again.');
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.supportive) {
        setShowSupport(true);
      }

      setResponse(data?.response || 'No response generated.');
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Failed to connect. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, [input, fileContent, mode]);

  const handleQuickAction = useCallback((action: typeof quickActions[0]) => {
    setMode(action.mode);
    setInput(action.prompt);
    handleSubmit(action.prompt);
  }, [handleSubmit]);

  const clearFile = useCallback(() => {
    setUploadedFile(null);
    setFileContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (value.length > 0 && value.length % 20 === 0) {
      const check = moderateContent(value);
      if (!check.isClean && check.severity === 'low') {
        toast.warning('Let\'s keep things positive! 💙', { duration: 2000 });
      }
    }
    
    setInput(value);
  }, []);

  const config = modeConfig[mode];
  const ModeIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      
      <div className="relative">
        {/* Header */}
        <div className="p-5 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <div>
              <h3 className="font-display font-bold text-base gradient-text">Neo Creative Agent</h3>
              <p className="text-xs text-muted-foreground">Your AI creative partner</p>
            </div>
          </div>
          
          {/* Unlimited badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
            <InfinityIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Unlimited</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-border/20 bg-secondary/20">
          <p className="text-xs text-muted-foreground mb-3">Quick start:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickAction(action)}
                disabled={isLoading}
                className="gap-1.5 text-xs bg-background/50 hover:bg-primary/20 border border-border/50 hover:border-primary/30"
              >
                <MessageCircle className="w-3 h-3" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="p-4 border-b border-border/20">
          <p className="text-xs text-muted-foreground mb-3">What would you like to do?</p>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(modeConfig) as AgentMode[]).map((m) => {
              const Icon = modeConfig[m].icon;
              const isActive = mode === m;
              return (
                <Button
                  key={m}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMode(m)}
                  className={`gap-1.5 transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary/30 to-accent/30 text-foreground border border-primary/40 shadow-lg shadow-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${modeConfig[m].color}`} />
                  {modeConfig[m].label}
                </Button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{config.description}</p>
        </div>

        {/* Input Area */}
        <div className="p-5 space-y-4">
          <div className="relative">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder={config.placeholder}
              className="min-h-[120px] bg-background/60 border-border/50 resize-none pr-12 text-sm focus:border-primary/50 focus:ring-primary/20"
              disabled={isLoading}
            />
            <ModeIcon className={`absolute right-4 top-4 w-5 h-5 ${config.color} opacity-60`} />
          </div>

          {/* File Upload (for Analyze mode) */}
          {mode === 'analyze' && (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.json,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {uploadedFile ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-accent/10 rounded-xl border border-accent/30">
                  <FileText className="w-4 h-4 text-accent" />
                  <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFile}
                    className="h-7 w-7 p-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 w-full border-dashed hover:bg-accent/10 hover:border-accent/40"
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4" />
                  Upload a file to analyze (.txt, .md, .json, .csv)
                </Button>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={() => handleSubmit()}
            disabled={isLoading || (!input.trim() && !fileContent && mode !== 'prompt')}
            className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium shadow-lg shadow-primary/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Neo is thinking...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {mode === 'prompt' ? 'Generate Prompt' : `${config.label}`}
              </>
            )}
          </Button>
        </div>

        {/* Response Area */}
        <AnimatePresence mode="wait">
          {response && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border/30"
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <motion.div 
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                  </motion.div>
                  <span className="text-sm font-medium gradient-text">Neo says:</span>
                </div>
                <div className="bg-gradient-to-br from-secondary/60 to-background rounded-xl p-5 border border-border/40 shadow-inner">
                  <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                    {response}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Support Resources Modal */}
      <AnimatePresence>
        {showSupport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowSupport(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-secondary to-background rounded-2xl p-6 max-w-md w-full border border-primary/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/40">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">You're Not Alone</h3>
                  <p className="text-sm text-muted-foreground">Help is available 24/7</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                If you're going through a tough time, please reach out to someone who can help. Your feelings are valid, and there are people who care.
              </p>

              <div className="space-y-3">
                {getSupportResources().map((resource, i) => (
                  <div key={i} className="p-4 bg-background/50 rounded-xl border border-border/40">
                    <div className="font-medium text-sm">{resource.name}</div>
                    <div className="text-primary font-mono text-sm">{resource.contact}</div>
                    <div className="text-xs text-muted-foreground mt-1">{resource.description}</div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setShowSupport(false)}
                className="w-full mt-5 bg-primary/20 hover:bg-primary/30 border border-primary/30"
                variant="outline"
              >
                I understand
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
