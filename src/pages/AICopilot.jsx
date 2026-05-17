import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { 
  Sparkles, Send, Zap, ChevronRight, Copy, 
  RefreshCw, ThumbsUp, ThumbsDown, Loader2,
  MessageSquare, TrendingUp, Users, Mail, BarChart3,
  ClipboardList, BookOpen
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const suggestionPrompts = [
  { icon: Mail, text: 'Write a 5-step outbound email sequence for fintech CTOs in Nigeria focused on cost reduction', category: 'Sequences' },
  { icon: MessageSquare, text: 'Generate a WhatsApp outreach message for a Series B CEO in East Africa', category: 'WhatsApp' },
  { icon: TrendingUp, text: 'Which deals in my pipeline show risk signals and what should I do about them? Give me a ranked priority list with specific next actions.', category: 'Pipeline' },
  { icon: BarChart3, text: 'Analyze my outbound campaign and suggest 3 specific improvements to increase reply rate by at least 20%', category: 'Campaigns' },
  { icon: Users, text: 'Write a personalized first line for the Head of Sales at Flutterwave based on their recent product launches', category: 'Personalization' },
  { icon: Sparkles, text: 'Generate objection handling responses for "We already have a CRM" in the African market context', category: 'Objections' },
  { icon: RefreshCw, text: 'Prepare me for a discovery call with the VP of Engineering at a Nigerian fintech company. Give me key questions, likely objections, and a recommended talk track.', category: 'Meeting Prep' },
  { icon: Zap, text: 'My deal at Andela has gone cold — they haven\'t responded in 3 weeks. Write a re-engagement message for WhatsApp and email.', category: 'Re-engagement' },
];

const initialMessages = [
  {
    role: 'assistant',
    content: `Hello! I'm **RVNU AI**, your GTM execution copilot. 

I'm embedded throughout your workflows and can help you execute faster:
- ✉️ **Sequences** — Write multichannel outbound sequences, follow-ups, and WhatsApp messages
- 🎯 **Personalization** — Generate personalized first lines, company summaries, and outreach angles
- 📊 **Pipeline** — Analyze deal risk, suggest next actions, generate deal summaries
- 🚀 **Campaigns** — Build campaign briefs, analyze performance, recommend optimizations
- 💬 **Objection Handling** — Respond to common objections with market-aware replies
- ⚡ **Automation** — Design workflow triggers and engagement automations

What would you like to execute today?`,
  }
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-black" />
        </div>
      )}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-xs font-bold text-muted-foreground">You</span>
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-xl px-4 py-3 text-xs leading-relaxed ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'glass border border-border/40 text-foreground'
        }`}>
          {msg.loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-muted-foreground text-xs">RVNU AI is thinking...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
              __html: msg.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/🎯|✉️|📊|🔮|⚡/g, match => match)
            }} />
          )}
        </div>
        {!isUser && !msg.loading && (
          <div className="flex gap-1.5 px-1">
            <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
              <Copy className="w-3 h-3" />
            </button>
            <button className="p-1 rounded text-muted-foreground hover:text-primary transition-colors">
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors">
              <ThumbsDown className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AICopilot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input;
    if (!userText.trim() || loading) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);
    
    const loadingId = Date.now();
    setMessages(prev => [...prev, { role: 'assistant', content: '', loading: true, id: loadingId }]);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are RVNU AI, an expert GTM execution copilot for B2B revenue teams in Africa and emerging markets.

You specialize in: multichannel outbound sequences (email, WhatsApp, LinkedIn, SMS), personalized messaging, pipeline analysis, campaign optimization, deal risk assessment, objection handling, WhatsApp GTM workflows, meeting prep, re-engagement strategies, and sales automation.

Key principles:
- Be specific and actionable, never generic
- Tailor all advice for African and emerging market contexts (Nigeria, Ghana, Kenya, South Africa, Egypt, etc.)
- WhatsApp is a PRIMARY sales channel — treat it accordingly
- Focus on execution speed and concrete next steps
- Use markdown bold (**text**) for emphasis
- Structure responses clearly with sections when helpful
- For meeting prep: include talk track, key questions, likely objections, and recommended next step
- For objection handling: acknowledge → reframe → respond → close
- For pipeline risk: rank deals by urgency and give specific follow-up copy

User request: ${userText}`,
    });

    setMessages(prev => prev.map(m => 
      m.id === loadingId ? { role: 'assistant', content: response, loading: false } : m
    ));
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8fafc' }}>
      <TopBar title="AI Copilot" subtitle="Your always-on GTM intelligence engine" />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Prompts */}
        <div className="hidden lg:flex w-64 flex-col border-r border-border/30 p-4 gap-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Prompts</p>
          <div className="space-y-2">
            {suggestionPrompts.map((p, i) => (
              <button key={i} onClick={() => sendMessage(p.text)}
                className="w-full text-left p-3 rounded-xl bg-secondary/40 hover:bg-secondary/80 transition-colors group">
                <div className="flex items-center gap-2 mb-1.5">
                  <p.icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">{p.category}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors line-clamp-2">
                  {p.text}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-auto p-3 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">AI Credits</span>
            </div>
            <div className="w-full bg-border rounded-full h-1.5 mb-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '73%' }} />
            </div>
            <p className="text-[10px] text-muted-foreground">730 / 1,000 credits used</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/30">
            <div className="glass rounded-xl p-3 border border-border/40 focus-within:border-primary/40 transition-colors">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask RVNU AI anything — write outbound emails, analyze pipeline, build ICPs..."
                className="bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 min-h-[60px]"
                rows={3}
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                <div className="flex gap-2 flex-wrap">
                {['Write sequence', 'WhatsApp message', 'Meeting prep', 'Objection handling', 'Pipeline risk', 'Re-engagement'].map(t => (
                  <button key={t} onClick={() => setInput(t)}
                    className="text-xs text-muted-foreground hover:text-primary px-2.5 py-1 rounded-md bg-secondary/50 hover:bg-primary/10 transition-colors">
                    {t}
                  </button>
                ))}
                </div>
                <Button onClick={() => sendMessage()} disabled={!input.trim() || loading} size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Send
                </Button>
              </div>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-2">
              RVNU AI may make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}