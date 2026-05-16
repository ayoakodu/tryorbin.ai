import { useState } from 'react';
import { Sparkles, Loader2, Calendar, User, DollarSign, X, ClipboardList } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function MeetingPrepPanel({ deal, onClose }) {
  const [loading, setLoading] = useState(false);
  const [prep, setPrep] = useState(null);

  const generate = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a concise meeting prep brief for this B2B sales deal:
Deal: "${deal.title}"
Company: ${deal.company}
Contact: ${deal.contact}
Value: $${deal.value?.toLocaleString()}
Stage: ${deal.stage || 'Proposal'}
Notes: ${deal.notes || 'None'}

Return a JSON object with:
- summary: 1 sentence deal context
- key_questions: array of 3 discovery questions to ask
- objections: array of 2 likely objections + 1-sentence responses
- next_step: recommended next action after the meeting`,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          key_questions: { type: 'array', items: { type: 'string' } },
          objections: { type: 'array', items: { type: 'object', properties: { objection: { type: 'string' }, response: { type: 'string' } } } },
          next_step: { type: 'string' }
        }
      }
    });
    setPrep(result);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card rounded-2xl border border-border/60 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Meeting Prep</h3>
              <p className="text-[11px] text-muted-foreground">{deal.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {/* Deal snapshot */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: User, label: deal.contact, sub: 'Contact' },
              { icon: DollarSign, label: `$${(deal.value || 0).toLocaleString()}`, sub: 'Value' },
              { icon: Calendar, label: deal.close_date || 'TBD', sub: 'Close Date' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-secondary/50 text-center">
                <item.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs font-semibold text-foreground truncate">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>

          {!prep ? (
            <Button onClick={generate} disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generating prep brief...' : 'Generate AI Meeting Prep'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground leading-relaxed">{prep.summary}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Key Questions to Ask</p>
                <div className="space-y-2">
                  {prep.key_questions?.map((q, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/40">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 rounded px-1 py-0.5 mt-0.5 flex-shrink-0">Q{i + 1}</span>
                      <p className="text-xs text-foreground">{q}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Likely Objections</p>
                <div className="space-y-2">
                  {prep.objections?.map((o, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-secondary/40 border border-border/20">
                      <p className="text-xs font-semibold text-amber-400 mb-1">"{o.objection}"</p>
                      <p className="text-[11px] text-muted-foreground">{o.response}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                <p className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1">Recommended Next Step</p>
                <p className="text-xs text-foreground">{prep.next_step}</p>
              </div>

              <Button onClick={generate} variant="outline" size="sm" className="w-full text-xs gap-1.5 border-border/60">
                <Sparkles className="w-3 h-3" /> Regenerate
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}