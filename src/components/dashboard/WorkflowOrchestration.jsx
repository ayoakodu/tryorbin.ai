import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Brain, AlertTriangle, CheckCircle2, Clock,
  TrendingUp, MessageCircle, Mail, Wifi, Play, Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';

const WORKFLOWS = [
  {
    id: 1,
    label: 'Active Sequences',
    value: '12',
    sub: '3,840 prospects',
    status: 'running',
    icon: Play,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
    pulse: true,
    route: '/outreach',
  },
  {
    id: 2,
    label: 'AI Optimizing',
    value: '4',
    sub: 'sequences auto-tuning',
    status: 'active',
    icon: Brain,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    dot: 'bg-violet-400',
    pulse: true,
    route: '/ai-copilot',
  },
  {
    id: 3,
    label: 'Awaiting Approval',
    value: '2',
    sub: 'AI drafts ready',
    status: 'pending',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    dot: 'bg-amber-400',
    pulse: false,
    route: '/outreach',
  },
  {
    id: 4,
    label: 'Buying Signals',
    value: '47',
    sub: 'detected today',
    status: 'hot',
    icon: TrendingUp,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    dot: 'bg-orange-500',
    pulse: true,
    route: '/contacts',
  },
  {
    id: 5,
    label: 'Deliverability Risk',
    value: '1',
    sub: 'DMARC misconfigured',
    status: 'risk',
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    dot: 'bg-red-500',
    pulse: false,
    route: '/deliverability',
  },
  {
    id: 6,
    label: 'Follow-Ups Scheduled',
    value: '83',
    sub: 'next 48 hours',
    status: 'scheduled',
    icon: CheckCircle2,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    dot: 'bg-cyan-400',
    pulse: false,
    route: '/tasks',
  },
];

export default function WorkflowOrchestration() {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
      {WORKFLOWS.map((w, i) => {
        const Icon = w.icon;
        return (
          <motion.button
            key={w.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(w.route)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 hover:border-primary/40 hover:shadow-md hover:bg-primary/[0.02] transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform', w.bg)}>
                <Icon className={cn('w-3.5 h-3.5', w.color)} />
              </div>
              <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', w.dot, w.pulse && 'animate-pulse')} />
            </div>
            <p className="text-base font-bold text-slate-800 leading-none mb-0.5 group-hover:text-primary transition-colors">{w.value}</p>
            <p className="text-[10px] font-semibold text-slate-600 leading-tight">{w.label}</p>
            <p className="text-[10px] text-slate-400 leading-tight mt-0.5 hidden sm:block">{w.sub}</p>
          </motion.button>
        );
      })}
    </div>
  );
}