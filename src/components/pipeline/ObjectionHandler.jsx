import { useState } from 'react';
import { Sparkles, Loader2, X, MessageSquare, Copy, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

const commonObjections = [
  "We already have a CRM",
  "We don't have budget right now",
  "We need to involve more stakeholders",
  "Can you send me more information?",
  "We're happy with our current solution",
  "This isn't a priority right now",
];

export default function ObjectionHandler({ deal, onClose }) {
  const [selected, setSelected] = useState('');
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    const objection = custom || selected;
    if (!objection) return;
    setLoading(true);
    setResponse(null);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a B2B sales expert in African and emerging markets.
      
Generate a concise, empathetic objection handling response for this situation:
Company: ${deal?.company || 'a prospect'}
Contact: ${deal?.contact || 'the prospect'}
Objection: "${objection}"

Return a JSON with:
- acknowledge: 1 sentence showing you understand their concern
- reframe: 1-2 sentences reframing the objection positively
- response: 2-3 sentence direct response addressing the objection
- close: 1 sentence closing question to move forward`,
      response_json_schema: {
        type: 'object',
        properties: {
          acknowledge: { type: 'string' },
          reframe: { type: 'string' },
          response: { type: 'string' },
          close: { type: 'string' }
        }
      }
    });
    setResponse(result);
    setLoading(false);
  };

  const copyAll = () => {
    if (!response) return;
    const text = `${response.acknowledge} ${response.reframe} ${response.response} ${response.close}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card rounded-2xl border border-border/60 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Objection Handler</h3>
              <p className="text-[11px] text-muted-foreground">AI-powered responses for {deal?.company || 'your prospect'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Common Objections</p>
            <div className="grid grid-cols-2 gap-2">
              {commonObjections.map(obj => (
                <button key={obj} onClick={() => { setSelected(obj); setCustom(''); }}
                  className={`text-left p-2.5 rounded-lg text-xs border transition-colors ${
                    selected === obj
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'bg-secondary/40 border-border/30 text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}>
                  {obj}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Custom Objection</p>
            <input
              value={custom}
              onChange={e => { setCustom(e.target.value); setSelected(''); }}
              placeholder="Type the objection you heard..."
              className="w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
            />
          </div>

          <Button onClick={handleGenerate} disabled={loading || (!selected && !custom.trim())}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Generating response...' : 'Generate AI Response'}
          </Button>

          {response && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">AI Response Framework</p>
                <button onClick={copyAll}
                  className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy all'}
                </button>
              </div>
              {[
                { label: 'Acknowledge', color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20', text: response.acknowledge },
                { label: 'Reframe', color: 'text-violet-400', bg: 'bg-violet-500/5 border-violet-500/20', text: response.reframe },
                { label: 'Response', color: 'text-primary', bg: 'bg-primary/5 border-primary/20', text: response.response },
                { label: 'Close', color: 'text-cyan-400', bg: 'bg-cyan-500/5 border-cyan-500/20', text: response.close },
              ].map(item => (
                <div key={item.label} className={`p-3 rounded-xl border ${item.bg}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${item.color} mb-1`}>{item.label}</p>
                  <p className="text-xs text-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}