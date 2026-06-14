import { TrendingUp, Flame, ShieldCheck, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';

const WARMUP_DATA = [
  { day: 1, sent: 5,  delivered: 5,  score: 45 },
  { day: 3, sent: 8,  delivered: 8,  score: 51 },
  { day: 5, sent: 12, delivered: 11, score: 58 },
  { day: 7, sent: 18, delivered: 17, score: 64 },
  { day: 10, sent: 25, delivered: 24, score: 71 },
  { day: 14, sent: 35, delivered: 33, score: 78 },
  { day: 18, sent: 50, delivered: 48, score: 85 },
  { day: 21, sent: 65, delivered: 62, score: 89 },
  { day: 25, sent: 80, delivered: 78, score: 93 },
];

const MAILBOXES = [
  { email: 'outreach@orbin-ai.io', phase: 'Complete',    day: 30, totalDays: 30, score: 93, status: 'complete',  dailyCap: 80  },
  { email: 'sales@orbin-ai.io',    phase: 'Complete',    day: 30, totalDays: 30, score: 88, status: 'complete',  dailyCap: 100 },
  { email: 'hello@orbin-ai.io',    phase: 'Warming',     day: 18, totalDays: 30, score: 74, status: 'warming',   dailyCap: 30  },
  { email: 'noreply@orbin-ai.io',  phase: 'Paused',      day: 5,  totalDays: 30, score: 41, status: 'paused',    dailyCap: 0   },
];

const STATUS_STYLE = {
  complete: { color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle2 },
  warming:  { color: 'text-amber-600',   bg: 'bg-amber-100',   icon: Flame },
  paused:   { color: 'text-slate-500',   bg: 'bg-slate-100',   icon: Clock },
};

const ReputationGauge = ({ score }) => {
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#f59e0b' : '#ef4444';
  const pct = (score / 100) * 100;
  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-slate-500">Reputation Score</span>
        <span className="text-[13px] font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-slate-700">Day {label}</p>
      <p className="text-slate-600">Score: <span className="font-bold text-emerald-600">{payload[0]?.value}</span></p>
    </div>
  );
};

export default function MailboxWarmupDashboard() {
  return (
    <div className="space-y-5">
      {/* Score trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-slate-800">Warmup Progress — hello@orbin-ai.io</h3>
          <span className="ml-auto text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">Day 18/30</span>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={WARMUP_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="warmGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} label={{ value: 'Day', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} fill="url(#warmGrad)" dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mailbox cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MAILBOXES.map((m) => {
          const s = STATUS_STYLE[m.status];
          const StatusIcon = s.icon;
          const pct = (m.day / m.totalDays) * 100;
          return (
            <div key={m.email} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', s.bg)}>
                  <StatusIcon className={cn('w-4 h-4', s.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{m.email}</p>
                  <p className="text-[10px] text-slate-400">{m.phase} · Day {m.day}/{m.totalDays}</p>
                </div>
                <span className="text-[10px] text-slate-500">Cap: {m.dailyCap > 0 ? `${m.dailyCap}/day` : 'Paused'}</span>
              </div>

              {/* Warmup progress */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500">Warmup Progress</span>
                  <span className="text-[10px] font-semibold text-slate-700">{Math.round(pct)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <ReputationGauge score={m.score} />
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <p className="text-xs font-bold text-amber-800">Warmup Recommendations</p>
        </div>
        {[
          'hello@orbin-ai.io is at Day 18/30 — limit sending to 30 emails/day until warmup completes.',
          'noreply@orbin-ai.io warmup is paused. Resume to avoid reputation decay.',
          'Maintain >95% deliverability across warmed mailboxes before increasing volume.',
        ].map((r, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
            <p className="text-[11px] text-amber-700 leading-relaxed">{r}</p>
          </div>
        ))}
      </div>
    </div>
  );
}