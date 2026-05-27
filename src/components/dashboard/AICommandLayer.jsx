import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, AlertTriangle, TrendingDown, TrendingUp, Zap,
  ArrowRight, RefreshCw, ChevronDown, ChevronUp, Brain,
  Target, MessageCircle, Mail, Users, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const INSIGHTS = [
  {
    id: 1,
    severity: 'critical',
    category: 'Revenue Risk',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50 border-red-100',
    title: '3 enterprise deals showing risk signals',
    detail: 'Flutterwave ($120K), Paystack ($85K), and Access Bank ($67K) have had zero contact in 14+ days. Competitors are active in these accounts.',
    actions: [{ label: 'Take Action', primary: true }, { label: 'Review', primary: false }],
    badge: 'Critical',
    badgeColor: 'bg-red-50 text-red-600 border-red-200',
  },
  {
    id: 2,
    severity: 'warning',
    category: 'Sequence Intelligence',
    icon: TrendingDown,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 border-amber-100',
    title: 'Reply rates dropped 12% in fintech sequences',
    detail: '"Fintech CTO Outbound" and "Neobank Decision Makers" are underperforming. AI suggests adding a LinkedIn touchpoint on Day 4 and personalizing subject lines.',
    actions: [{ label: 'Fix Sequence', primary: true }, { label: 'View Stats', primary: false }],
    badge: 'Warning',
    badgeColor: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    id: 3,
    severity: 'opportunity',
    category: 'Opportunity Detection',
    icon: Zap,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50 border-violet-100',
    title: '47 contacts reopened pricing emails in the last 24h',
    detail: 'High buying intent detected. These contacts have viewed pricing 2+ times. AI recommends immediate personalized follow-up or a direct calendar link.',
    actions: [{ label: 'Prioritize', primary: true }, { label: 'Generate Email', primary: false }],
    badge: 'High Intent',
    badgeColor: 'bg-violet-50 text-violet-600 border-violet-200',
  },
  {
    id: 4,
    severity: 'insight',
    category: 'Channel Intelligence',
    icon: TrendingUp,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/5 border-primary/10',
    title: 'LinkedIn touchpoints outperforming email by 23%',
    detail: 'AI recommends switching 14 prospects in your "Enterprise SaaS" sequence to WhatsApp-first outreach. Expected reply rate improvement: +18%.',
    actions: [{ label: 'Optimize', primary: true }, { label: 'See Analysis', primary: false }],
    badge: 'AI Insight',
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    id: 5,
    severity: 'insight',
    category: 'AI Workflow',
    icon: Brain,
    iconColor: 'text-cyan-500',
    iconBg: 'bg-cyan-50 border-cyan-100',
    title: 'AI suggests generating a re-engagement sequence',
    detail: '67 cold contacts have been inactive for 30+ days. AI can auto-generate a 5-step re-engagement sequence tailored to their industry and last interaction.',
    actions: [{ label: 'Generate Sequence', primary: true }],
    badge: 'Automation',
    badgeColor: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  },
  {
    id: 6,
    severity: 'warning',
    category: 'Team Intelligence',
    icon: Users,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50 border-orange-100',
    title: '2 reps over-indexing on low-fit accounts',
    detail: 'Based on ICP scoring, 34% of outreach activity this week was directed at accounts with <30% fit score. Reallocating to high-fit accounts could improve conversion 2x.',
    actions: [{ label: 'Review Allocations', primary: true }],
    badge: 'Efficiency',
    badgeColor: 'bg-orange-50 text-orange-600 border-orange-200',
  },
];

const severityOrder = { critical: 0, warning: 1, opportunity: 2, insight: 3 };

export default function AICommandLayer({ isRefreshing }) {
  const [expanded, setExpanded] = useState(null);
  const [dismissed, setDismissed] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const visible = INSIGHTS
    .filter(i => !dismissed.includes(i.id))
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const displayed = showAll ? visible : visible.slice(0, 4);
  const criticalCount = visible.filter(i => i.severity === 'critical' || i.severity === 'warning').length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(22,163,74,0.04)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-emerald-50/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-sm">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-bold text-slate-900">AI Command Center</h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">Live intelligence · Updated just now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-[11px] font-semibold text-red-600">
              <AlertTriangle className="w-3 h-3" />
              {criticalCount} need attention
            </span>
          )}
          <button className={cn('p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors', isRefreshing && 'animate-spin')}>
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AnimatePresence>
          {displayed.map((insight, i) => {
            const Icon = insight.icon;
            const isExpanded = expanded === insight.id;
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  'rounded-xl border p-4 transition-all cursor-default group',
                  insight.severity === 'critical' ? 'border-red-100 bg-red-50/30 hover:bg-red-50/50' :
                  insight.severity === 'warning' ? 'border-amber-100 bg-amber-50/20 hover:bg-amber-50/40' :
                  'border-slate-100 bg-slate-50/40 hover:bg-slate-50/80'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0', insight.iconBg)}>
                    <Icon className={cn('w-4 h-4', insight.iconColor)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-md border', insight.badgeColor)}>
                          {insight.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{insight.category}</span>
                      </div>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : insight.id)}
                        className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
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
                          className="text-[11px] text-slate-500 leading-relaxed mb-3 overflow-hidden"
                        >
                          {insight.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {insight.actions.map((action, ai) => (
                        <button
                          key={ai}
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

      {/* Show more */}
      {visible.length > 4 && (
        <div className="px-4 pb-4">
          <button
            onClick={() => setShowAll(v => !v)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-200 text-[11px] font-medium text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            {showAll ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> {visible.length - 4} more insights</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}