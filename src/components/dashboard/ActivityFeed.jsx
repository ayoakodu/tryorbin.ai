import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Calendar, DollarSign, TrendingUp, Brain,
  Shield, Zap, ChevronRight, Filter, ArrowUpRight,
  MessageCircle, Star, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ACTIVITIES = [
  {
    id: 1, type: 'email',
    icon: Flame, color: 'text-red-500', bg: 'bg-red-50 border-red-100',
    headline: 'High-intent engagement detected',
    text: 'Amara Diallo at Flutterwave revisited pricing page 3× in 24h — buying signal elevated',
    meta: 'Flutterwave · $120K deal · Senior Decision-Maker',
    time: '2m ago', action: 'Follow Up Now',
    urgency: 'critical',
    badge: 'Buying Signal', badgeColor: 'bg-red-50 text-red-500 border-red-200',
  },
  {
    id: 2, type: 'meeting',
    icon: Calendar, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100',
    headline: 'Inbound meeting booked from outreach',
    text: 'Kemi Adeyemi (Yoco) booked via calendar link — credited to "Fintech Outbound" sequence',
    meta: 'Tomorrow 10:00am WAT · Sequence: Fintech CTO · Day 7 conversion',
    time: '14m ago', action: 'Prepare Brief',
    urgency: 'high',
    badge: 'Meeting', badgeColor: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  },
  {
    id: 3, type: 'deal',
    icon: DollarSign, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100',
    headline: 'Deal velocity accelerating',
    text: '"Paystack Integration" advanced to Negotiation — deal moved 2 stages in 5 days',
    meta: '$85,000 · 3 days in Proposal → Negotiation · Rep: Emeka O.',
    time: '1h ago', action: 'View Deal',
    urgency: 'high',
    badge: 'Pipeline', badgeColor: 'bg-violet-50 text-violet-600 border-violet-100',
  },
  {
    id: 4, type: 'linkedin',
    icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100',
    headline: 'Buying signal from fintech decision-maker',
    text: 'Tunde Okafor (Head of Growth, MTN Fintech) replied to LinkedIn message — asked for pricing',
    meta: 'Sequence: Enterprise SaaS · Day 3 LinkedIn touchpoint · High-fit ICP',
    time: '2h ago', action: 'Reply',
    urgency: 'high',
    badge: 'Hot Lead', badgeColor: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    id: 5, type: 'ai',
    icon: Brain, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100',
    headline: 'AI completed personalization batch',
    text: '5 hyper-personalized emails generated for "Neobank DM" campaign — ready for your review',
    meta: 'Campaign #12 · 5 drafts · Avg. personalization score: 94/100',
    time: '3h ago', action: 'Review Drafts',
    urgency: 'medium',
    badge: 'AI Ready', badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    id: 6, type: 'deliverability',
    icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100',
    headline: 'Deliverability risk detected',
    text: 'DMARC policy set to "none" — estimated 8% of outbound emails routing to spam',
    meta: 'Affects 3 active campaigns · yourdomain.com · Fix time: ~5 min',
    time: '4h ago', action: 'Fix Now',
    urgency: 'medium',
    badge: 'Risk Alert', badgeColor: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    id: 7, type: 'sequence',
    icon: Zap, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200',
    headline: 'AI auto-enrolled high-fit prospects',
    text: '14 prospects scored above 80 ICP fit auto-enrolled in "Enterprise SaaS Outbound"',
    meta: 'AI scoring model · Criteria: Fintech, 200+ employees, Series B+ · Sequence starts tomorrow',
    time: '5h ago', action: null,
    urgency: 'low',
    badge: 'Sequence', badgeColor: 'bg-slate-50 text-slate-500 border-slate-200',
  },
];

const FILTERS = [
  { id: 'all',           label: 'All' },
  { id: 'email',         label: 'Signals' },
  { id: 'meeting',       label: 'Meetings' },
  { id: 'linkedin',      label: 'LinkedIn' },
  { id: 'deal',          label: 'Pipeline' },
  { id: 'ai',            label: 'AI' },
  { id: 'deliverability',label: 'Alerts' },
  { id: 'sequence',      label: 'Sequences' },
];

const urgencyBorder = { critical: 'border-l-2 border-l-red-400', high: 'border-l-2 border-l-amber-300', medium: '', low: '' };

export default function ActivityFeed() {
  const [filter, setFilter] = useState('all');
  const [collapsed, setCollapsed] = useState(false);

  const visible = ACTIVITIES.filter(a => filter === 'all' || a.type === filter);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-bold text-slate-800">GTM Execution Stream</h3>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCollapsed(v => !v)}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors">
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
          <button className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {/* Filter strip */}
            <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-slate-50 overflow-x-auto">
              <Filter className="w-3 h-3 text-slate-300 flex-shrink-0 mr-0.5" />
              {FILTERS.map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap flex-shrink-0',
                    filter === f.id
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-transparent'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Activity items */}
            <div className="divide-y divide-slate-50">
              <AnimatePresence>
                {visible.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={cn(
                        'flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors group',
                        urgencyBorder[a.urgency]
                      )}
                    >
                      <div className={cn('w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5', a.bg)}>
                        <Icon className={cn('w-3.5 h-3.5', a.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <p className="text-[11px] font-bold text-slate-700 leading-tight">{a.headline}</p>
                          <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-md border flex-shrink-0', a.badgeColor)}>
                            {a.badge}
                          </span>
                        </div>
                        <p className="text-[12px] text-slate-600 leading-snug mb-1">{a.text}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-[11px] text-slate-400 truncate flex-1">{a.meta}</p>
                          <span className="text-[10px] text-slate-300 flex-shrink-0">{a.time}</span>
                          {a.action && (
                            <button className="text-[11px] font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-emerald-700 flex-shrink-0">
                              {a.action} <ArrowUpRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {visible.length === 0 && (
                <p className="text-[12px] text-slate-400 text-center py-8 italic">No activity in this category</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}