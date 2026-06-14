import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, AlertTriangle, TrendingDown, TrendingUp, Zap,
  ArrowRight, RefreshCw, ChevronDown, ChevronUp, Users, Shield,
  Sparkles, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { invokeLLM } from '@/lib/anthropic';

const INITIAL_INSIGHTS = [
  {
    id: 1,
    severity: 'critical',
    category: 'Revenue Risk',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50 border-red-100',
    title: '3 enterprise deals showing risk signals',
    detail: 'Flutterwave ($120K), Paystack ($85K), and Access Bank ($67K) — zero contact in 14+ days. Competitor activity detected in 2 accounts. Action required now.',
    actions: [{ label: 'Take Action', primary: true, route: '/pipeline' }, { label: 'Review Deals', primary: false, route: '/pipeline' }],
    badge: 'Critical',
    badgeColor: 'bg-red-50 text-red-600 border-red-200',
    impact: '$272K at risk',
  },
  {
    id: 2,
    severity: 'warning',
    category: 'Sequence Intelligence',
    icon: TrendingDown,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 border-amber-100',
    title: 'Reply rates dropped 12% in fintech sequences',
    detail: '"Fintech CTO Outbound" and "Neobank Decision Makers" are underperforming. AI suggests a LinkedIn touchpoint on Day 4 and subject line personalization.',
    actions: [{ label: 'Fix Sequence', primary: true, route: '/outreach' }, { label: 'See Stats', primary: false, route: '/analytics' }],
    badge: 'Warning',
    badgeColor: 'bg-amber-50 text-amber-600 border-amber-200',
    impact: '2 sequences affected',
  },
  {
    id: 3,
    severity: 'opportunity',
    category: 'Opportunity Detection',
    icon: Zap,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50 border-violet-100',
    title: '47 contacts revisited pricing pages in 24h',
    detail: 'High buying intent detected across 47 contacts. Average: 2.8 visits per contact. AI recommends personalized follow-up or direct calendar link within 2 hours.',
    actions: [{ label: 'Prioritize', primary: true, route: '/contacts' }, { label: 'Generate Email', primary: false, route: '/ai-copilot' }],
    badge: 'High Intent',
    badgeColor: 'bg-violet-50 text-violet-600 border-violet-200',
    impact: '47 hot prospects',
  },
  {
    id: 4,
    severity: 'insight',
    category: 'Channel Intelligence',
    icon: TrendingUp,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/5 border-primary/10',
    title: 'LinkedIn outperforming email by 23% this month',
    detail: 'AI recommends switching 14 prospects in "Enterprise SaaS" to WhatsApp-first. Expected reply rate improvement: +18%. Channel rebalance can be auto-applied.',
    actions: [{ label: 'Auto-Optimize', primary: true, route: '/outreach' }, { label: 'See Analysis', primary: false, route: '/analytics' }],
    badge: 'AI Insight',
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    impact: '+18% reply rate',
  },
  {
    id: 5,
    severity: 'insight',
    category: 'AI Workflow',
    icon: Brain,
    iconColor: 'text-cyan-500',
    iconBg: 'bg-cyan-50 border-cyan-100',
    title: 'Re-engagement sequence ready for 67 cold contacts',
    detail: 'AI generated a personalized 5-step sequence for contacts inactive 30+ days. Tailored by industry and last touchpoint. Requires your approval to launch.',
    actions: [{ label: 'Approve & Launch', primary: true, route: '/outreach' }],
    badge: 'Awaiting Approval',
    badgeColor: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    impact: '67 cold contacts',
  },
  {
    id: 6,
    severity: 'warning',
    category: 'Team Intelligence',
    icon: Users,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50 border-orange-100',
    title: '2 reps over-indexing on low-fit accounts',
    detail: '34% of this week\'s outreach went to accounts with <30% ICP fit score. Reallocating to high-fit accounts is projected to improve conversion rate 2x.',
    actions: [{ label: 'Rebalance', primary: true, route: '/collaboration' }, { label: 'Review', primary: false, route: '/analytics' }],
    badge: 'Efficiency',
    badgeColor: 'bg-orange-50 text-orange-600 border-orange-200',
    impact: '2x conversion potential',
  },
];

const severityOrder = { critical: 0, warning: 1, opportunity: 2, insight: 3 };

export default function AICommandLayer({ isRefreshing }) {
  const [expanded, setExpanded] = useState(null);
  const [dismissed, setDismissed] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const navigate = useNavigate();

  const visible = INITIAL_INSIGHTS
    .filter(i => !dismissed.includes(i.id))
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const displayed = showAll ? visible : visible.slice(0, 4);
  const criticalCount = visible.filter(i => i.severity === 'critical' || i.severity === 'warning').length;

  const refreshAI = async () => {
    setAiLoading(true);
    setAiSummary(null);
    try {
      const result = await invokeLLM(`You are Orbin AI, a GTM execution copilot for B2B revenue teams in Africa.

Current pipeline snapshot:
- 3 enterprise deals at risk: Flutterwave ($120K), Paystack ($85K), Access Bank ($67K) — 14+ days no contact
- Reply rates dropped 12% in fintech sequences this week
- 47 contacts with high buying intent (pricing page revisits)
- WhatsApp converting 2.3x better than email this month
- DMARC policy set to "none" — ~8% of emails hitting spam
- 67 cold contacts ready for re-engagement sequence
- 2 reps spending 34% of outreach on low-ICP-fit accounts

Give me ONE sharp, specific GTM insight or recommendation I should act on RIGHT NOW. Be direct and actionable. 2-3 sentences max.`);
      setAiSummary(result);
    } catch {
      setAiSummary('Unable to generate insight — check your API key configuration.');
    }
    setAiLoading(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 0 20px rgba(22,163,74,0.04)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 gap-3"
        style={{ background: 'linear-gradient(to right, #fff 50%, rgba(240,253,244,0.5))' }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs sm:text-[13px] font-bold text-slate-900 whitespace-nowrap">AI Intelligence</h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">monitoring continuously</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight hidden sm:block">Revenue risks · Opportunities · Sequence health · Channel signals</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {criticalCount > 0 && (
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-[11px] font-semibold text-red-600">
              <AlertTriangle className="w-3 h-3" />
              {criticalCount} require action
            </span>
          )}
          <button
            onClick={refreshAI}
            disabled={aiLoading}
            className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors whitespace-nowrap', aiLoading && 'opacity-60 cursor-not-allowed')}>
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{aiLoading ? 'Analyzing...' : 'Ask Orbin AI'}</span>
          </button>
        </div>
      </div>

      {/* AI Summary Banner */}
      <AnimatePresence>
        {(aiLoading || aiSummary) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-emerald-100 bg-emerald-50/50"
          >
            <div className="flex items-start gap-3 px-5 py-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin text-emerald-600" /> : <Sparkles className="w-3 h-3 text-emerald-600" />}
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Orbin AI Insight</p>
                <p className="text-[12px] text-slate-700 leading-relaxed">
                  {aiLoading ? 'Analyzing your pipeline and GTM signals...' : aiSummary}
                </p>
              </div>
              {aiSummary && (
                <button onClick={() => setAiSummary(null)} className="ml-auto text-slate-300 hover:text-slate-500 text-[10px] flex-shrink-0">✕</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insights */}
      <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <AnimatePresence>
          {displayed.map((insight, i) => {
            const Icon = insight.icon;
            const isExpanded = expanded === insight.id;
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  'rounded-xl border p-3.5 transition-all group',
                  insight.severity === 'critical'
                    ? 'border-red-100 bg-red-50/20 hover:bg-red-50/40 border-l-2 border-l-red-400'
                    : insight.severity === 'warning'
                      ? 'border-amber-100 bg-amber-50/15 hover:bg-amber-50/30'
                      : 'border-slate-100 bg-slate-50/40 hover:bg-white'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5', insight.iconBg)}>
                    <Icon className={cn('w-3.5 h-3.5', insight.iconColor)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wide', insight.badgeColor)}>
                          {insight.badge}
                        </span>
                        <span className="text-[10px] text-slate-400">{insight.category}</span>
                        {insight.impact && (
                          <span className="text-[10px] font-semibold text-slate-500">· {insight.impact}</span>
                        )}
                      </div>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : insight.id)}
                        className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0"
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    <p className="text-[12px] font-semibold text-slate-800 leading-snug mb-2">{insight.title}</p>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="text-[11px] text-slate-500 leading-relaxed mb-2.5 overflow-hidden"
                        >
                          {insight.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center gap-2">
                      {insight.actions.map((action, ai) => (
                        <button key={ai}
                          onClick={() => navigate(action.route)}
                          className={cn(
                            'flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all',
                            action.primary
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                              : 'text-slate-500 hover:text-slate-700 hover:bg-white border border-slate-200'
                          )}
                        >
                          {action.label}
                          {action.primary && <ArrowRight className="w-3 h-3" />}
                        </button>
                      ))}
                      <button
                        onClick={() => setDismissed(d => [...d, insight.id])}
                        className="ml-auto text-[10px] text-slate-300 hover:text-slate-400 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {visible.length > 4 && (
        <div className="px-4 pb-4">
          <button
            onClick={() => setShowAll(v => !v)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-slate-200 text-[11px] font-medium text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            {showAll
              ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
              : <><ChevronDown className="w-3.5 h-3.5" /> {visible.length - 4} more signals</>}
          </button>
        </div>
      )}
    </div>
  );
}
