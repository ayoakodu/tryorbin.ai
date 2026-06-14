import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { X, Sparkles, Loader2, Copy, ChevronRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AI_ACTIONS = [
  { key: 'dealSummary', label: 'Deal Summary & Status' },
  { key: 'nextAction', label: 'Recommend Next Action' },
  { key: 'riskAnalysis', label: 'Risk Analysis' },
  { key: 'followUp', label: 'Generate Follow-up Message' },
  { key: 'meetingPrep', label: 'Quick Meeting Prep' },
  { key: 'closeStrategy', label: 'Close Strategy' },
];

export default function DealCopilotPanel({ deal, currentStage, onClose }) {
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  // AI recommendation signal logic
  const getSignal = () => {
    if (deal.risk) return { type: 'warning', text: `At-risk deal: ${deal.notes || 'No recent activity detected. Immediate action recommended.'}` };
    if (deal.days > 14) return { type: 'warning', text: `No activity in ${deal.days} days. Deal may be going cold — suggest re-engagement.` };
    if (deal.probability >= 75) return { type: 'success', text: `High probability (${deal.probability}%). Focus on closing motions and removing blockers.` };
    return null;
  };

  const signal = getSignal();

  const generate = async (key) => {
    setLoading(true);
    setActiveKey(key);
    const prompts = {
      dealSummary: `Write a concise deal summary for a GTM team:
Deal: ${deal.title}
Company: ${deal.company}
Contact: ${deal.contact}
Value: $${deal.value.toLocaleString()}
Stage: ${currentStage}
Probability: ${deal.probability}%
Days since last activity: ${deal.days}
Risk flag: ${deal.risk ? 'YES' : 'No'}
Notes: ${deal.notes || 'None'}

Provide: current status assessment, key risks, and what's needed to advance. 3-4 sentences.`,

      nextAction: `You are a B2B sales AI copilot. Based on this deal's situation, recommend the single best next action:
Deal: ${deal.title} at ${deal.company} (${currentStage} stage)
Value: $${deal.value.toLocaleString()}, Probability: ${deal.probability}%
Days stale: ${deal.days}, At risk: ${deal.risk}
Notes: ${deal.notes || 'None'}

Return: one specific, time-bound next action. Include channel (call/email/WhatsApp), timing, and what to say or do. 2 sentences.`,

      riskAnalysis: `Analyze the risk profile of this deal and suggest mitigation:
Deal: ${deal.title}, Company: ${deal.company}
Stage: ${currentStage}, Probability: ${deal.probability}%, Value: $${deal.value.toLocaleString()}
Days since activity: ${deal.days}, Risk flag: ${deal.risk}
Notes: "${deal.notes || 'none'}"

Identify: top 2-3 risk factors and specific mitigation steps. Be concise and actionable.`,

      followUp: `Write a follow-up message for a stale deal:
Contact: ${deal.contact} at ${deal.company}
Deal: ${deal.title} ($${deal.value.toLocaleString()})
Last touch: ${deal.days} days ago
Stage: ${currentStage}
${deal.notes ? `Context: ${deal.notes}` : ''}

Write a short, warm re-engagement message (WhatsApp or email). Reference the last interaction context. No hard sell. 3-4 sentences.`,

      meetingPrep: `Generate a quick meeting prep brief for ${deal.title} with ${deal.contact} at ${deal.company}:
Deal value: $${deal.value.toLocaleString()}, Stage: ${currentStage}, Probability: ${deal.probability}%
Notes: ${deal.notes || 'None'}

Include:
- 2 key objectives for this meeting
- 2 discovery or qualification questions
- 1 likely objection + response
- Suggested close or next step`,

      closeStrategy: `Build a close strategy for this deal:
${deal.title} — ${deal.company} — $${deal.value.toLocaleString()} — ${currentStage} stage — ${deal.probability}% probability

Provide:
- Recommended close approach (challenger/consultative/etc.)
- Key stakeholder considerations
- 2 close-driving actions this week
- What success looks like in the next 14 days`,
    };

    const res = await base44.integrations.Core.InvokeLLM({ prompt: prompts[key] });
    setResult({ key, content: res });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
        className="w-full max-w-md bg-card border-l border-border flex flex-col h-full overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-6 h-6 rounded-lg gradient-brand flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-black" />
              </div>
              <p className="font-bold text-sm text-foreground">Orbin Copilot</p>
            </div>
            <p className="text-xs text-muted-foreground">{deal.title} · {deal.company}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Deal Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Value', value: `$${(deal.value / 1000).toFixed(0)}K`, color: 'text-primary' },
              { label: 'Probability', value: `${deal.probability}%`, color: 'text-cyan-400' },
              { label: 'Last Activity', value: deal.days > 0 ? `${deal.days}d ago` : 'Today', color: deal.days > 14 ? 'text-amber-400' : 'text-muted-foreground' },
            ].map(s => (
              <div key={s.label} className="text-center p-2.5 rounded-lg bg-secondary/50 border border-border/20">
                <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Signal */}
          {signal && (
            <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${signal.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-primary/5 border-primary/20'}`}>
              {signal.type === 'warning'
                ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                : <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />}
              <p className={`text-xs leading-relaxed ${signal.type === 'warning' ? 'text-amber-200' : 'text-foreground'}`}>{signal.text}</p>
            </div>
          )}

          {/* AI Actions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Generate with AI</p>
            </div>
            <div className="space-y-2">
              {AI_ACTIONS.map(action => (
                <button key={action.key} onClick={() => generate(action.key)} disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/30 hover:border-primary/30 text-sm transition-all text-left group">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                  {loading && activeKey === action.key
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />}
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
        </div>
      </motion.div>
    </div>
  );
}