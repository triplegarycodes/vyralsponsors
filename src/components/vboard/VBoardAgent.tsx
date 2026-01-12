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
  AlertCircle,
  Heart,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useVBoardTrials } from '@/hooks/useVBoardTrials';
import { moderateContent, moderateFilename, getSupportResources } from '@/lib/contentModeration';
import { toast } from 'sonner';

type AgentMode = 'brainstorm' | 'analyze' | 'prompt' | 'expand';

interface AgentResponse {
  response?: string;
  error?: string;
  blocked?: boolean;
  supportive?: boolean;
}

const modeConfig: Record<AgentMode, { icon: React.ElementType; label: string; placeholder: string; color: string }> = {
  brainstorm: {
    icon: Lightbulb,
    label: 'Brainstorm',
    placeholder: 'What would you like to brainstorm about? (e.g., "ideas for a short story about time travel")',
    color: 'text-yellow-400',
  },
  analyze: {
    icon: FileText,
    label: 'Analyze',
    placeholder: 'Describe what you\'d like analyzed, or upload a file below...',
    color: 'text-accent',
  },
  prompt: {
    icon: Wand2,
    label: 'Get Prompt',
    placeholder: 'What kind of creative prompt would you like? (leave empty for a surprise!)',
    color: 'text-primary',
  },
  expand: {
    icon: Expand,
    label: 'Expand',
    placeholder: 'Paste your idea or writing here, and I\'ll help expand it...',
    color: 'text-neon-pink',
  },
};

export function VBoardAgent() {
  const [mode, setMode] = useState<AgentMode>('brainstorm');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { trialsRemaining, canUse, isLoading: trialsLoading, consumeTrial } = useVBoardTrials();

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check filename for inappropriate content
    const filenameCheck = moderateFilename(file.name);
    if (!filenameCheck.isClean) {
      toast.error('This file name contains inappropriate content.');
      return;
    }

    // Check file size (max 1MB for text files)
    if (file.size > 1024 * 1024) {
      toast.error('File is too large. Please use files under 1MB.');
      return;
    }

    // Only allow text files
    const allowedTypes = ['text/plain', 'text/markdown', 'application/json', 'text/csv'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|md|json|csv)$/i)) {
      toast.error('Please upload a text file (.txt, .md, .json, or .csv)');
      return;
    }

    try {
      const text = await file.text();
      
      // Check content for inappropriate material
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

  const handleSubmit = useCallback(async () => {
    // Check if we have input or file
    if (!input.trim() && !fileContent && mode !== 'prompt') {
      toast.error('Please enter something to work with.');
      return;
    }

    // Check trials
    if (!canUse) {
      toast.error('You\'ve used all your preview trials. Sign up for full access!');
      return;
    }

    // Check input for inappropriate content
    if (input.trim()) {
      const inputCheck = moderateContent(input);
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
      // Consume a trial
      const trialConsumed = await consumeTrial();
      if (!trialConsumed) {
        toast.error('Could not process your request. Please try again.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke<AgentResponse>('vboard-agent', {
        body: {
          type: mode,
          input: input.trim() || 'surprise me',
          fileContent: fileContent?.slice(0, 5000), // Limit file content
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
  }, [input, fileContent, mode, canUse, consumeTrial]);

  const clearFile = useCallback(() => {
    setUploadedFile(null);
    setFileContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Real-time content check
    if (value.length > 0 && value.length % 20 === 0) { // Check every 20 chars
      const check = moderateContent(value);
      if (!check.isClean && check.severity === 'low') {
        // Soft warning for mild issues
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
      className="bg-gradient-to-br from-secondary/40 to-background rounded-2xl border border-border/50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm">Creative Agent</h3>
            <p className="text-xs text-muted-foreground">Your AI creative partner</p>
          </div>
        </div>
        
        {/* Trial Counter */}
        <div className="flex items-center gap-2">
          {trialsLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trialsRemaining > 1 ? 'bg-primary/20 text-primary' : 
              trialsRemaining === 1 ? 'bg-yellow-500/20 text-yellow-400' : 
              'bg-destructive/20 text-destructive'
            }`}>
              <Zap className="w-3 h-3" />
              {trialsRemaining} trial{trialsRemaining !== 1 ? 's' : ''} left
            </div>
          )}
        </div>
      </div>

      {/* Mode Selector */}
      <div className="p-4 border-b border-border/30">
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
                className={`gap-1.5 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${modeConfig[m].color}`} />
                {modeConfig[m].label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder={config.placeholder}
            className="min-h-[100px] bg-background/50 border-border/50 resize-none pr-10"
            disabled={isLoading || !canUse}
          />
          <ModeIcon className={`absolute right-3 top-3 w-5 h-5 ${config.color} opacity-50`} />
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
              <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg border border-accent/30">
                <FileText className="w-4 h-4 text-accent" />
                <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 w-full border-dashed"
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
          onClick={handleSubmit}
          disabled={isLoading || !canUse || (!input.trim() && !fileContent && mode !== 'prompt')}
          className="w-full gap-2 bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {mode === 'prompt' ? 'Generate Prompt' : `${config.label} This`}
            </>
          )}
        </Button>

        {/* No trials warning */}
        {!canUse && !trialsLoading && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/30">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">
              You've used all 3 preview trials. Sign up for unlimited access!
            </p>
          </div>
        )}
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
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Neo says:</span>
              </div>
              <div className="prose prose-sm prose-invert max-w-none">
                <div className="bg-background/50 rounded-xl p-4 border border-border/30 whitespace-pre-wrap text-sm leading-relaxed">
                  {response}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-secondary rounded-2xl p-6 max-w-md w-full border border-border/50 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">You're Not Alone</h3>
                  <p className="text-sm text-muted-foreground">Help is available 24/7</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                If you're going through a tough time, please reach out to someone who can help. Your feelings are valid, and there are people who care.
              </p>

              <div className="space-y-3">
                {getSupportResources().map((resource, i) => (
                  <div key={i} className="p-3 bg-background/50 rounded-lg border border-border/30">
                    <div className="font-medium text-sm">{resource.name}</div>
                    <div className="text-primary font-mono text-sm">{resource.contact}</div>
                    <div className="text-xs text-muted-foreground mt-1">{resource.description}</div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setShowSupport(false)}
                className="w-full mt-4"
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
