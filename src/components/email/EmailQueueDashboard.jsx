import { useState } from 'react';
import { Clock, Send, AlertTriangle, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUEUE_ITEMS = [
  { id: 1, to: 'amara.diallo@flutterwave.com',   subject: 'Q3 Partnership Follow-up',      status: 'queued',  scheduledFor: 'In 2 min',    sequence: 'Fintech Q2',    retries: 0 },
  { id: 2, to: 'kemi.adeyemi@yoco.com',           subject: 'Meeting prep — RVNU walkthrough', status: 'sending', scheduledFor: 'Now',          sequence: 'West Africa',   retries: 0 },
  { id: 3, to: 'tunde.okafor@paystack.com',       subject: 'Enterprise plan follow-up',     status: 'retrying',scheduledFor: 'Retry #2',     sequence: 'Enterprise',    retries: 2 },
  { id: 4, to: 'nadia.hassan@cellulant.io',       subject: 'Intro from Ahmed',              status: 'failed',  scheduledFor: '—',            sequence: 'Cold ICP',      retries: 3 },
  { id: 5, to: 'chioma.eze@opay.ng',             subject: 'Product demo request',           status: 'queued',  scheduledFor: 'In 12 min',    sequence: 'Warm Lead',     retries: 0 },
  { id: 6, to: 'ade.adewale@teamapt.com',         subject: 'Cold intro — GTM platform',     status: 'queued',  scheduledFor: 'In 25 min',    sequence: 'Cold ICP',      retries: 0 },
  { id: 7, to: 'femi.ojo@sterling.ng',            subject: 'Re: Proposal review',           status: 'sent',    scheduledFor: '2 min ago',    sequence: 'Warm Lead',     retries: 0 },
];

const STATUS_CONFIG = {
  queued:   { label: 'Queued',   color: 'text-blue-600',    bg: 'bg-blue-50',    icon: Clock },
  sending:  { label: 'Sending',  color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Loader2, spin: true },
  retrying: { label: 'Retrying', color: 'text-amber-600',   bg: 'bg-amber-50',   icon: RefreshCw },
  failed:   { label: 'Failed',   color: 'text-red-600',     bg: 'bg-red-50',     icon: XCircle },
  sent:     { label: 'Sent',     color: 'text-slate-500',   bg: 'bg-slate-50',   icon: CheckCircle2 },
};

export default function EmailQueueDashboard() {
  const [filter, setFilter] = useState('all');

  const counts = Object.fromEntries(Object.keys(STATUS_CONFIG).map(k => [k, QUEUE_ITEMS.filter(i => i.status === k).length]));
  const visible = filter === 'all' ? QUEUE_ITEMS : QUEUE_ITEMS.filter(i => i.status === filter);

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(STATUS_CONFIG).map(([k, s]) => {
          const StatusIcon = s.icon;
          return (
            <button key={k} onClick={() => setFilter(filter === k ? 'all' : k)}
              className={cn('rounded-xl border p-3 text-left transition-all', filter === k ? cn(s.bg, 'border-current/30') : 'bg-white border-slate-200 hover:border-slate-300')}>
              <StatusIcon className={cn('w-4 h-4 mb-2', s.color, s.spin && 'animate-spin')} />
              <p className={cn('text-lg font-bold', s.color)}>{counts[k]}</p>
              <p className="text-[10px] text-slate-500">{s.label}</p>
            </button>
          );
        })}
      </div>

      {/* Queue table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Send className="w-4 h-4 text-primary" />
            Sending Queue
            <span className="text-[11px] text-slate-400 font-normal">({visible.length} emails)</span>
          </h3>
          <div className="flex gap-1 text-[11px]">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">{counts.queued + counts.sending} pending</span>
          </div>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wide text-[10px]">
              <th className="px-4 py-2.5 text-left font-semibold">Recipient</th>
              <th className="px-4 py-2.5 text-left font-semibold">Subject</th>
              <th className="px-4 py-2.5 text-left font-semibold">Sequence</th>
              <th className="px-4 py-2.5 text-left font-semibold">Status</th>
              <th className="px-4 py-2.5 text-left font-semibold">Scheduled</th>
              <th className="px-4 py-2.5 text-left font-semibold">Retries</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((item) => {
              const s = STATUS_CONFIG[item.status];
              const StatusIcon = s.icon;
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-700 font-medium truncate max-w-[180px]">{item.to}</td>
                  <td className="px-4 py-3 text-slate-600 truncate max-w-[200px]">{item.subject}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">{item.sequence}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full text-[10px] font-semibold', s.color, s.bg)}>
                      <StatusIcon className={cn('w-3 h-3', s.spin && 'animate-spin')} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{item.scheduledFor}</td>
                  <td className="px-4 py-3">
                    {item.retries > 0 ? (
                      <span className={cn('font-semibold', item.retries >= 3 ? 'text-red-500' : 'text-amber-500')}>{item.retries}x</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}