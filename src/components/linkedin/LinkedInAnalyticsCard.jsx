import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Clock, SkipForward, AlertTriangle, Loader2, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATS = [
  { key: 'completed', label: 'Completed',  color: 'text-emerald-600', bg: 'bg-emerald-50',  Icon: CheckCircle2 },
  { key: 'pending',   label: 'Pending',    color: 'text-blue-500',    bg: 'bg-blue-50',     Icon: Clock        },
  { key: 'overdue',   label: 'Overdue',    color: 'text-red-500',     bg: 'bg-red-50',      Icon: AlertTriangle},
  { key: 'snoozed',   label: 'Snoozed',    color: 'text-amber-500',   bg: 'bg-amber-50',    Icon: Clock        },
  { key: 'skipped',   label: 'Skipped',    color: 'text-slate-400',   bg: 'bg-slate-50',    Icon: SkipForward  },
];

export default function LinkedInAnalyticsCard() {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['linkedin-tasks-analytics'],
    queryFn: () => base44.entities.LinkedInTask.list('-updated_date', 200),
    staleTime: 60_000,
  });

  const now = new Date();
  const counts = {
    completed: tasks.filter(t => t.status === 'completed').length,
    pending:   tasks.filter(t => t.status === 'pending' && new Date(t.due_date) >= now).length,
    overdue:   tasks.filter(t => t.status === 'pending' && t.due_date && new Date(t.due_date) < now).length,
    snoozed:   tasks.filter(t => t.status === 'snoozed').length,
    skipped:   tasks.filter(t => t.status === 'skipped').length,
  };

  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((counts.completed / total) * 100) : 0;

  // Connection request specific
  const connReqs   = tasks.filter(t => t.task_type === 'send_connection_request');
  const accepted   = connReqs.filter(t => t.task_result === 'accepted').length;
  const sentConns  = connReqs.filter(t => t.status === 'completed').length;
  const acceptRate = sentConns > 0 ? Math.round((accepted / sentConns) * 100) : 0;

  const replies    = tasks.filter(t => t.task_result === 'replied').length;
  const responseRate = total > 0 ? Math.round((replies / total) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="text-center py-8 text-[12px] text-slate-400">
        No LinkedIn tasks yet. Add LinkedIn steps to your sequences to track activity here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
          <Linkedin className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <h4 className="text-[12px] font-bold text-foreground">LinkedIn Task Activity</h4>
        <span className="text-[10px] text-muted-foreground ml-auto">{total} total tasks</span>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-5 gap-2">
        {STATS.map(({ key, label, color, bg, Icon }) => (
          <div key={key} className={cn('rounded-xl px-3 py-2.5 text-center border border-transparent', bg)}>
            <Icon className={cn('w-3.5 h-3.5 mx-auto mb-1', color)} />
            <p className={cn('text-[14px] font-bold tabular-nums', color)}>{counts[key]}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Completion Rate', value: `${completionRate}%`, sub: `${counts.completed}/${total} done` },
          { label: 'Accept Rate',     value: `${acceptRate}%`,     sub: `${accepted}/${sentConns} accepted` },
          { label: 'Response Rate',   value: `${responseRate}%`,   sub: `${replies} replies` },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 px-3 py-2.5">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{m.label}</p>
            <p className="text-[16px] font-bold text-foreground mt-0.5">{m.value}</p>
            <p className="text-[10px] text-slate-400">{m.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}