import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ArrowRight, CheckCircle2,
  MessageCircle, Users, Shield, Flame, RefreshCw,
  ChevronRight, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ACTIONS = [
  {
    id: 1,
    urgency: 'critical',
    icon: Flame,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    title: 'Follow up with 3 stalled enterprise deals',
    context: 'Flutterwave, Paystack, Access Bank · 14+ days silent · Competitor activity detected',
    cta: 'Execute',
    ctaStyle: 'bg-red-500 hover:bg-red-600 text-white',
    secondaryCta: 'Review',
    urgencyLabel: 'Critical',
    urgencyColor: 'bg-red-50 text-red-500 border-red-200',
    estimatedImpact: '$272K at risk',
    route: '/pipeline',
    secondaryRoute: '/pipeline',
  },
  {
    id: 2,
    urgency: 'high',
    icon: Star,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50',
    title: 'Prioritize 47 pricing-page revisitors',
    context: 'High buying intent detected · Avg. 2.8 visits in last 24h · Ready to convert',
    cta: 'Prioritize',
    ctaStyle: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondaryCta: 'Generate Email',
    urgencyLabel: 'High Intent',
    urgencyColor: 'bg-orange-50 text-orange-500 border-orange-200',
    estimatedImpact: '47 hot prospects',
    route: '/contacts',
    secondaryRoute: '/ai-copilot',
  },
  {
    id: 3,
    urgency: 'high',
    icon: MessageCircle,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    title: 'Launch WhatsApp follow-up for 14 non-responders',
    context: 'Email open rate stalled · AI detected WhatsApp converting 2.3x better this month',
    cta: 'Launch',
    ctaStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    secondaryCta: 'Preview',
    urgencyLabel: 'Opportunity',
    urgencyColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    estimatedImpact: '+18% reply rate',
    route: '/whatsapp',
    secondaryRoute: '/whatsapp',
  },
  {
    id: 4,
    urgency: 'medium',
    icon: Zap,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50',
    title: 'Approve AI-generated re-engagement sequence',
    context: '5-step sequence ready for 67 cold contacts · Personalized by industry and last interaction',
    cta: 'Approve',
    ctaStyle: 'bg-violet-600 hover:bg-violet-700 text-white',
    secondaryCta: 'Edit First',
    urgencyLabel: 'AI Ready',
    urgencyColor: 'bg-violet-50 text-violet-600 border-violet-200',
    estimatedImpact: '67 cold contacts',
    route: '/outreach',
    secondaryRoute: '/outreach',
  },
  {
    id: 5,
    urgency: 'medium',
    icon: Shield,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    title: 'Fix inbox placement issue — DMARC misconfigured',
    context: 'Policy set to "none" · Estimated 8% of emails going to spam · Affecting 3 campaigns',
    cta: 'Fix Now',
    ctaStyle: 'bg-amber-500 hover:bg-amber-600 text-white',
    secondaryCta: 'Learn More',
    urgencyLabel: 'Needs Attention',
    urgencyColor: 'bg-amber-50 text-amber-600 border-amber-200',
    estimatedImpact: '~720 emails affected',
    route: '/deliverability',
    secondaryRoute: '/deliverability',
  },
  {
    id: 6,
    urgency: 'low',
    icon: Users,
    iconColor: 'text-cyan-500',
    iconBg: 'bg-cyan-50',
    title: 'Re-engage 12 warm prospects showing activity',
    context: 'Opened emails 2–3x without replying · Re-engagement window closing in 48h',
    cta: 'Re-engage',
    ctaStyle: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    secondaryCta: 'Schedule',
    urgencyLabel: 'Momentum',
    urgencyColor: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    estimatedImpact: '12 warm leads',
    route: '/contacts',
    secondaryRoute: '/outreach',
  },
];

const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export default function NextBestActions() {
  const [completed, setCompleted] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const active = ACTIONS
    .filter(a => !completed.includes(a.id))
    .sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

  const displayed = showAll ? active : active.slice(0, 4);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100"
        style={{ background: 'linear-gradient(to right, #fff 60%, rgba(245,243,255,0.4))' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {active.filter(a => a.urgency === 'critical').length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-bold text-slate-900">Next Best Actions</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200">
                {active.length} queued
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">AI-prioritized execution queue · Sorted by impact</p>
          </div>
        </div>
        <button
          onClick={() => setCompleted([])}
          className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors">
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Action rows */}
      <div className="divide-y divide-slate-50">
        <AnimatePresence>
          {displayed.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6, height: 0 }}
                transition={{ delay: i * 0.04, duration: 0.18 }}
                className={cn(
                  'flex items-center gap-4 px-5 py-4 group hover:bg-slate-50/70 transition-colors',
                  action.urgency === 'critical' && 'border-l-2 border-l-red-400'
                )}
              >
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', action.iconBg)}>
                  <Icon className={cn('w-4 h-4', action.iconColor)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md border', action.urgencyColor)}>
                      {action.urgencyLabel}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{action.estimatedImpact}</span>
                  </div>
                  <p className="text-[12px] font-semibold text-slate-800 leading-snug">{action.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug truncate">{action.context}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(action.secondaryRoute)}
                    className="text-[11px] text-slate-400 font-medium hover:text-slate-600 transition-colors whitespace-nowrap hidden group-hover:block">
                    {action.secondaryCta}
                  </button>
                  <button
                    onClick={() => navigate(action.route)}
                    className={cn(
                      'flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm whitespace-nowrap',
                      action.ctaStyle
                    )}
                  >
                    {action.cta}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setCompleted(c => [...c, action.id])}
                    className="p-1.5 rounded-lg text-slate-200 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
                    title="Mark done"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {active.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-300" />
            <p className="text-[12px] font-semibold text-slate-500">Action queue cleared</p>
            <p className="text-[11px] text-slate-400">AI is monitoring for new priorities</p>
            <button onClick={() => setCompleted([])} className="text-[11px] text-emerald-600 hover:underline mt-1">Reset queue</button>
          </div>
        )}
      </div>

      {active.length > 4 && (
        <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">{active.length - 4} more actions queued</span>
          <button
            onClick={() => setShowAll(v => !v)}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {showAll ? 'Show less' : 'View all'} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
