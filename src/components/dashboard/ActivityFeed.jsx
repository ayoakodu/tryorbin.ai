import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Calendar, DollarSign, Linkedin, Sparkles,
  Shield, Zap, ChevronRight, Filter, MoreHorizontal, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ACTIVITIES = [
  {
    id: 1, type: 'email',
    icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100',
    text: 'Amara Diallo opened "Q3 Partnership Opportunity" — 3rd open in 24h',
    meta: 'Flutterwave · Viewed pricing page',
    time: '2m ago', action: 'Follow up',
    badge: 'Hot', badgeColor: 'bg-red-50 text-red-500 border-red-100',
  },
  {
    id: 2, type: 'meeting',
    icon: Calendar, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100',
    text: 'Meeting booked with Kemi Adeyemi — Yoco (Tomorrow 10am)',
    meta: 'Inbound · Via calendar link',
    time: '14m ago', action: 'Prep',
    badge: 'Meeting', badgeColor: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  },
  {
    id: 3, type: 'deal',
    icon: DollarSign, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100',
    text: 'Deal "Paystack Integration" moved to Negotiation — $85,000',
    meta: 'Stage change · 3 days in Proposal',
    time: '1h ago', action: 'View deal',
    badge: 'Pipeline', badgeColor: 'bg-violet-50 text-violet-600 border-violet-100',
  },
  {
    id: 4, type: 'linkedin',
    icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100',
    text: 'Tunde Okafor replied to your LinkedIn message',
    meta: 'Sequence: Fintech CTO Outbound · Day 3',
    time: '2h ago', action: 'Reply',
    badge: 'LinkedIn', badgeColor: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    id: 5, type: 'ai',
    icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100',
    text: 'AI generated 5 personalized emails for "Neobank Decision Makers"',
    meta: 'Campaign #12 · Ready to send',
    time: '3h ago', action: 'Review',
    badge: 'AI Action', badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    id: 6, type: 'deliverability',
    icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100',
    text: 'DMARC policy is set to "none" — inbox placement at risk',
    meta: 'domain: yourdomain.com',
    time: '4h ago', action: 'Fix',
    badge: 'Alert', badgeColor: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    id: 7, type: 'sequence',
    icon: Zap, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200',
    text: '14 prospects enrolled in "Enterprise SaaS Outbound" sequence',
    meta: 'Auto-enrolled by AI scoring',
    time: '5h ago', action: null,
    badge: 'Sequence', badgeColor: 'bg-slate-50 text-slate-500 border-slate-200',
  },
];

const FILTER_TYPES = [
  { id: 'all',           label: 'All' },
  { id: 'email',         label: 'Email' },
  { id: 'meeting',       label: 'Meetings' },
  { id: 'linkedin',      label: 'LinkedIn' },
  { id: 'ai',            label: 'AI' },
  { id: 'deliverability',label: 'Alerts' },
  { id: 'deal',          label: 'Pipeline' },
];

export default function ActivityFeed() {
  const [filter, setFilter] = useState('all');
  const [collapsed, setCollapsed] = useState(false);

  const visible = ACTIVITIES.filter(a => filter === 'all' || a.type === filter);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <h3 className="text-[13px] font-bold text-slate-800">GTM Activity Feed</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setCollapsed(v => !v)}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors">
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
          <button className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Filter strip */}
            <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-slate-50 overflow-x-auto scrollbar-none">
              <Filter className="w-3 h-3 text-slate-300 flex-shrink-0 mr-1" />
              {FILTER_TYPES.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
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

            {/* Activity list */}
            <div className="divide-y divide-slate-50">
              <AnimatePresence>
                {visible.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors group"
                    >
                      <div className={cn('w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5', a.bg)}>
                        <Icon className={cn('w-3.5 h-3.5', a.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[12px] text-slate-700 font-medium leading-snug">{a.text}</p>
                          <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-md border flex-shrink-0 ml-2', a.badgeColor)}>
                            {a.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-[11px] text-slate-400">{a.meta}</p>
                          <span className="text-[10px] text-slate-300">{a.time}</span>
                          {a.action && (
                            <button className="ml-auto text-[11px] font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-emerald-700">
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