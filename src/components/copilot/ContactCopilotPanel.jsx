import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { X, Sparkles, Loader2, Copy, ChevronRight, Mail, Phone, MessageCircle, Linkedin, MapPin, Globe, AlertTriangle, Clock, CheckCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  qualified: 'bg-primary/20 text-primary border-primary/30',
  nurturing: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  converted: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  lost: 'bg-destructive/20 text-destructive border-destructive/30',
};

const AI_ACTIONS = [
  { key: 'nextAction', label: 'Suggest Next Action', icon: ChevronRight },
  { key: 'summary', label: 'Prospect Summary', icon: Sparkles },
  { key: 'firstLine', label: 'Personalized First Line', icon: Mail },
  { key: 'email', label: 'Cold Email Draft', icon: Mail },
  { key: 'whatsapp', label: 'WhatsApp Message', icon: MessageCircle },
  { key: 'callPrep', label: 'Call Prep Brief', icon: Phone },
];

function WhatsAppTimeline({ contact }) {
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['whatsapp-timeline', contact.id || contact.email],
    queryFn: () => base44.entities.WhatsAppMessage.filter({ contact_name: `${contact.first_name} ${contact.last_name}` }, '-timestamp', 50),
    initialData: [],
  });

  if (isLoading) return <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;

  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No WhatsApp conversations recorded yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Messages sent via the WhatsApp inbox will appear here.</p>
      </div>
    );
  }

  const totalSent = messages.filter(m => m.direction === 'sent').length;
  const totalReceived = messages.filter(m => m.direction === 'received').length;
  const avgReplyTime = messages.filter(m => m.reply_time_minutes).reduce((s, m, _, arr) => s + m.reply_time_minutes / arr.length, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Sent', value: totalSent, color: 'text-primary' },
          { label: 'Received', value: totalReceived, color: 'text-cyan-400' },
          { label: 'Avg Reply', value: avgReplyTime ? `${Math.round(avgReplyTime)}m` : '—', color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="p-2 rounded-lg bg-secondary/50 text-center">
            <p className={`text-base font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.direction === 'sent' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${
              msg.direction === 'sent' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'glass border border-border/40 text-foreground rounded-bl-sm'
            }`}>
              <p className="leading-relaxed">{msg.content}</p>
              <div className="flex items-center gap-1 mt-1 justify-end">
                <span className={`text-[9px] ${msg.direction === 'sent' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
                {msg.direction === 'sent' && (
                  msg.status === 'read' ? <CheckCheck className="w-2.5 h-2.5 text-primary-foreground/80" /> : <Check className="w-2.5 h-2.5 text-primary-foreground/60" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContactCopilotPanel({ contact, onClose }) {
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('ai');
  const { toast } = useToast();

  // AI recommendation logic based on contact signals
  const getRecommendationContext = () => {
    const daysSinceContact = contact.last_contacted
      ? Math.floor((Date.now() - new Date(contact.last_contacted)) / (1000 * 60 * 60 * 24))
      : null;

    if (contact.intent_signal === 'hot' && contact.status === 'qualified') {
      return 'High intent, qualified. Prioritize immediately — suggest meeting CTA.';
    }
    if (daysSinceContact && daysSinceContact > 7 && contact.status === 'contacted') {
      return `No response in ${daysSinceContact} days. Suggest follow-up with adjusted messaging angle.`;
    }
    if (contact.status === 'nurturing') {
      return 'In nurture stage. Suggest value-add content or re-engagement touch.';
    }
    if (contact.status === 'converted') {
      return 'Already converted. Consider upsell or expansion play.';
    }
    return 'New or cold contact. Suggest personalized first outreach.';
  };

  const generate = async (key) => {
    setLoading(true);
    setActiveKey(key);
    const rec = getRecommendationContext();
    const name = `${contact.first_name} ${contact.last_name}`;
    const role = `${contact.title} at ${contact.company}`;
    const ctx = `${contact.industry || 'technology'} industry, ${contact.country || 'Africa'}`;

    const prompts = {
      nextAction: `You are a GTM AI copilot. Based on this contact's data, recommend the single best next action:
Contact: ${name}, ${role}
Status: ${contact.status}, Intent: ${contact.intent_signal}, Score: ${contact.lead_score || 'unknown'}
Context signal: ${rec}
Respond with: a specific, concrete next action (1-2 sentences). Include the channel and timing.`,

      summary: `Write a concise GTM prospect summary for ${name}, ${role} (${ctx}).
Include: likely role priorities, typical pain points for a ${contact.title}, buying triggers to watch for, and best outreach angle.
Keep it 4-5 sentences, practical and actionable.`,

      firstLine: `Generate a personalized cold email first line for ${name}, ${role} (${ctx}).
Make it specific, relevant, conversational, and non-generic. Reference their role and industry context. 1 sentence only.`,

      email: `Write a cold outreach email for ${name}, ${role} (${ctx}).
Product context: B2B GTM execution platform for African revenue teams — helps with multichannel outreach, WhatsApp workflows, and pipeline management.
Format: SUBJECT: [subject line]\n\nBODY: [2-3 paragraph email body]. Make it personalized, not generic. No fluff.`,

      whatsapp: `Write a WhatsApp outreach message for ${contact.first_name} at ${contact.company} (${ctx}).
Be warm, direct, and professional. 2-3 sentences. Use 1 relevant emoji. No salesy language. Reference something specific about their role or company.`,

      callPrep: `Generate a call prep brief for a discovery call with ${name}, ${role} (${ctx}).
Include:
- 3 discovery questions tailored to their role
- 2 likely objections and how to handle them
- Best opening line to build rapport
- Key value props to highlight
Keep it concise and scannable.`,
    };

    const res = await base44.integrations.Core.InvokeLLM({ prompt: prompts[key] });
    setResult({ key, content: res });
    setLoading(false);
  };

  const rec = getRecommendationContext();
  const isSignal = rec !== 'New or cold contact. Suggest personalized first outreach.';

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
        className="w-full max-w-md bg-card border-l border-border flex flex-col h-full overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              {contact.first_name[0]}{contact.last_name[0]}
            </div>
            <div>
              <p className="font-semibold text-sm">{contact.first_name} {contact.last_name}</p>
              <p className="text-xs text-muted-foreground">{contact.title} · {contact.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/30 px-4 gap-1 flex-shrink-0">
          {[['ai', 'AI Copilot'], ['whatsapp', 'WhatsApp']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`text-xs px-3 py-2.5 font-medium transition-colors border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'whatsapp' && <WhatsAppTimeline contact={contact} />}

          {activeTab === 'ai' && <>
          {/* Contact Details */}
          <div className="glass rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Details</p>
            {[
              { icon: Mail, value: contact.email },
              { icon: Phone, value: contact.phone || '—' },
              { icon: MapPin, value: contact.country || '—' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs">
                <item.icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{item.value}</span>
                {item.value !== '—' && (
                  <button onClick={() => { navigator.clipboard.writeText(item.value); toast({ title: 'Copied!' }); }}
                    className="ml-auto text-muted-foreground hover:text-primary">
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[contact.status]}`}>{contact.status}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${contact.intent_signal === 'hot' ? 'bg-red-500/10 text-red-400 border-red-500/20' : contact.intent_signal === 'warm' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-secondary text-muted-foreground border-border'}`}>
                {contact.intent_signal || 'unknown'} intent
              </span>
              {contact.lead_score && <span className="text-[10px] text-muted-foreground ml-auto">Score: <strong className="text-primary">{contact.lead_score}</strong></span>}
            </div>
          </div>

          {/* AI Signal */}
          {isSignal && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 leading-relaxed">{rec}</p>
            </div>
          )}

          {/* AI Actions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">AI Copilot</p>
            </div>
            <div className="space-y-2">
              {AI_ACTIONS.map(action => (
                <button key={action.key} onClick={() => generate(action.key)} disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/30 hover:border-primary/30 text-sm transition-all text-left group">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                  {loading && activeKey === action.key
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  }
                </button>
              ))}
            </div>
          </div>

          {/* AI Result */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-primary">{AI_ACTIONS.find(a => a.key === result.key)?.label}</p>
                <button onClick={() => { navigator.clipboard.writeText(result.content); toast({ title: 'Copied!' }); }}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{result.content}</p>
            </motion.div>
          )}
          </>}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-border/30 flex gap-2 flex-shrink-0">
          <Button size="sm" className="flex-1 gap-1.5 bg-primary text-primary-foreground text-xs">
            <Mail className="w-3.5 h-3.5" /> Email
          </Button>
          <Button size="sm" variant="outline" className="flex-1 gap-1.5 border-border/60 text-xs">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </Button>
          {contact.linkedin_url && (
            <Button size="sm" variant="outline" className="px-3 border-border/60" asChild>
              <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}