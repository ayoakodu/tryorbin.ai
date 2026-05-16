import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, Globe, Loader2, Copy, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AIPersonalizePanel({ onInsert, onClose }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    const data = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this company website URL: ${url}

Research the company and return a structured analysis for a B2B sales rep in Africa/emerging markets.

Return a JSON with:
- company_name: string
- summary: 2-3 sentence company summary
- key_talking_points: array of 3-4 strings (specific things worth mentioning in outreach)
- personalization_angles: array of 3 strings (specific hooks/angles to personalize messages)
- suggested_opener: a 1-2 sentence personalized opening line for a cold outreach message`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          company_name: { type: 'string' },
          summary: { type: 'string' },
          key_talking_points: { type: 'array', items: { type: 'string' } },
          personalization_angles: { type: 'array', items: { type: 'string' } },
          suggested_opener: { type: 'string' },
        }
      }
    });
    setResult(data);
    setLoading(false);
  };

  const copy = (text) => navigator.clipboard.writeText(text);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30 bg-primary/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-black" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">AI Personalisation Engine</p>
              <p className="text-[10px] text-muted-foreground">Analyze a website to generate tailored talking points</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* URL Input */}
        <div className="p-4 border-b border-border/20">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && analyze()}
                placeholder="https://company.com"
                className="pl-9 text-sm bg-secondary/50 border-border/60"
              />
            </div>
            <Button onClick={analyze} disabled={loading || !url.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap gap-1.5">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
          {loading && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" /> Researching company online...
            </p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
            {/* Company Summary */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                {result.company_name}
              </p>
              <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
            </div>

            {/* Suggested Opener */}
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-primary">Suggested Opening Line</p>
                <div className="flex gap-1.5">
                  <button onClick={() => copy(result.suggested_opener)} className="p-1 rounded hover:bg-primary/20 text-primary transition-colors">
                    <Copy className="w-3 h-3" />
                  </button>
                  {onInsert && (
                    <button onClick={() => onInsert(result.suggested_opener)}
                      className="text-[10px] px-2 py-0.5 rounded bg-primary text-primary-foreground font-semibold">
                      Insert
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-foreground italic">"{result.suggested_opener}"</p>
            </div>

            {/* Talking Points */}
            <div>
              <button onClick={() => setExpanded(expanded === 'talking' ? null : 'talking')}
                className="flex items-center justify-between w-full text-left">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Talking Points</p>
                {expanded === 'talking' ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              {expanded === 'talking' && (
                <ul className="mt-2 space-y-1.5">
                  {result.key_talking_points?.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-primary font-bold mt-0.5">·</span>
                      <span className="flex-1">{pt}</span>
                      <button onClick={() => copy(pt)} className="text-muted-foreground hover:text-foreground flex-shrink-0 mt-0.5">
                        <Copy className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Personalization Angles */}
            <div>
              <button onClick={() => setExpanded(expanded === 'angles' ? null : 'angles')}
                className="flex items-center justify-between w-full text-left">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personalization Angles</p>
                {expanded === 'angles' ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              {expanded === 'angles' && (
                <ul className="mt-2 space-y-1.5">
                  {result.personalization_angles?.map((angle, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-cyan-400 font-bold mt-0.5">·</span>
                      <span className="flex-1">{angle}</span>
                      <button onClick={() => { onInsert && onInsert(angle); }} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground hover:text-foreground flex-shrink-0">
                        Use
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="p-6 text-center">
            <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Enter a company URL to generate personalized talking points, company insights, and suggested message openers.</p>
          </div>
        )}
      </div>
    </div>
  );
}