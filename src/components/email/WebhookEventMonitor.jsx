import { useState } from 'react';
import { Activity, CheckCircle2, AlertTriangle, RefreshCw, XCircle, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const EVENTS = [
  { id: 1, event: 'email.delivered',   source: 'Mailgun',  status: 'processed', timestamp: '30s ago',    retries: 0, payload: '{"messageId":"abc123","to":"amara@fw.io"}' },
  { id: 2, event: 'email.opened',      source: 'Tracking', status: 'processed', timestamp: '2 min ago',  retries: 0, payload: '{"event":"open","recipient":"kemi@yoco.com"}' },
  { id: 3, event: 'email.bounced',     source: 'Mailgun',  status: 'processed', timestamp: '5 min ago',  retries: 0, payload: '{"event":"bounce","code":550}' },
  { id: 4, event: 'email.clicked',     source: 'Tracking', status: 'processed', timestamp: '8 min ago',  retries: 0, payload: '{"url":"https://orbin-ai.io/demo","recipient":"tunde@paystack.com"}' },
  { id: 5, event: 'email.failed',      source: 'Mailgun',  status: 'failed',    timestamp: '12 min ago', retries: 3, payload: '{"error":"SMTP timeout","messageId":"xyz789"}' },
  { id: 6, event: 'sequence.enrolled', source: 'Internal', status: 'processed', timestamp: '20 min ago', retries: 0, payload: '{"contactId":"c_001","sequenceId":"s_fintech"}' },
  { id: 7, event: 'email.unsubscribed',source: 'Tracking', status: 'processed', timestamp: '1 hr ago',   retries: 0, payload: '{"email":"noreply@domain.co"}' },
  { id: 8, event: 'email.delivered',   source: 'SendGrid', status: 'retrying',  timestamp: '1 hr ago',   retries: 1, payload: '{"messageId":"def456"}' },
];

const STATUS_CONFIG = {
  processed: { label: 'Processed', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  failed:    { label: 'Failed',    color: 'text-red-600',     bg: 'bg-red-50',     icon: XCircle },
  retrying:  { label: 'Retrying',  color: 'text-amber-600',   bg: 'bg-amber-50',   icon: RefreshCw },
  pending:   { label: 'Pending',   color: 'text-blue-600',    bg: 'bg-blue-50',    icon: Clock },
};

const EVENT_COLOR = {
  'email.delivered':    'text-emerald-700 bg-emerald-50',
  'email.opened':       'text-blue-700 bg-blue-50',
  'email.clicked':      'text-violet-700 bg-violet-50',
  'email.bounced':      'text-red-700 bg-red-50',
  'email.failed':       'text-red-700 bg-red-100',
  'email.unsubscribed': 'text-amber-700 bg-amber-50',
  'sequence.enrolled':  'text-slate-700 bg-slate-100',
};

export default function WebhookEventMonitor() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const visible = EVENTS.filter(e =>
    e.event.includes(search) || e.source.toLowerCase().includes(search.toLowerCase()) || e.status.includes(search)
  );

  const counts = {
    processed: EVENTS.filter(e => e.status === 'processed').length,
    failed: EVENTS.filter(e => e.status === 'failed').length,
    retrying: EVENTS.filter(e => e.status === 'retrying').length,
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Processed', value: counts.processed, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
          { label: 'Failed',    value: counts.failed,    color: 'text-red-600',     bg: 'bg-red-50',     icon: XCircle },
          { label: 'Retrying',  value: counts.retrying,  color: 'text-amber-600',   bg: 'bg-amber-50',   icon: RefreshCw },
        ].map((s) => {
          const SIcon = s.icon;
          return (
            <div key={s.label} className={cn('rounded-xl border border-slate-200 p-4 flex items-center gap-3', s.bg)}>
              <SIcon className={cn('w-5 h-5', s.color)} />
              <div>
                <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
                <p className="text-[11px] text-slate-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <Input placeholder="Search events…" className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Event table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-slate-800">Event Activity Feed</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {visible.map((e) => {
            const s = STATUS_CONFIG[e.status];
            const StatusIcon = s.icon;
            const isExpanded = expanded === e.id;
            return (
              <div key={e.id}>
                <button
                  className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : e.id)}
                >
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap', EVENT_COLOR[e.event] || 'bg-slate-100 text-slate-600')}>
                    {e.event}
                  </span>
                  <span className="text-[11px] text-slate-500 flex-1">{e.source}</span>
                  <span className={cn('flex items-center gap-1 text-[10px] font-semibold', s.color, s.bg, 'px-2 py-0.5 rounded-full')}>
                    <StatusIcon className="w-3 h-3" />
                    {s.label}
                  </span>
                  {e.retries > 0 && <span className="text-[10px] text-amber-500 font-medium">{e.retries} retry</span>}
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{e.timestamp}</span>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-3">
                    <div className="bg-slate-900 rounded-lg px-3 py-2.5">
                      <code className="text-[11px] font-mono text-emerald-400">{e.payload}</code>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {visible.length === 0 && (
            <div className="px-5 py-8 text-center text-slate-400 text-xs">No events found</div>
          )}
        </div>
      </div>
    </div>
  );
}