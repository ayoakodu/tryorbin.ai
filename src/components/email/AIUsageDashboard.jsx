import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sparkles, Zap, Clock, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const USAGE_DATA = [
  { day: 'Mon', generations: 24, tokens: 8400 },
  { day: 'Tue', generations: 31, tokens: 11200 },
  { day: 'Wed', generations: 18, tokens: 6300 },
  { day: 'Thu', generations: 42, tokens: 15100 },
  { day: 'Fri', generations: 38, tokens: 13600 },
  { day: 'Sat', generations: 8,  tokens: 2800 },
  { day: 'Sun', generations: 5,  tokens: 1750 },
];

const HISTORY = [
  { id: 1, type: 'Email Draft',      model: 'GPT-4o mini',  tokens: 480,  time: '2 min ago',    status: 'success' },
  { id: 2, type: 'Subject Line',     model: 'GPT-4o mini',  tokens: 120,  time: '8 min ago',    status: 'success' },
  { id: 3, type: 'LinkedIn Message', model: 'GPT-4o mini',  tokens: 310,  time: '15 min ago',   status: 'success' },
  { id: 4, type: 'Email Draft',      model: 'Claude Sonnet',tokens: 920,  time: '1 hr ago',     status: 'success' },
  { id: 5, type: 'Sequence Step',    model: 'GPT-4o mini',  tokens: 260,  time: '2 hr ago',     status: 'fallback' },
  { id: 6, type: 'AI Reply',         model: 'GPT-4o mini',  tokens: 540,  time: '4 hr ago',     status: 'success' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-slate-600">Generations: <span className="font-bold text-emerald-600">{payload[0]?.value}</span></p>
    </div>
  );
};

export default function AIUsageDashboard() {
  const totalGenerations = USAGE_DATA.reduce((a, d) => a + d.generations, 0);
  const totalTokens = USAGE_DATA.reduce((a, d) => a + d.tokens, 0);

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Generations (7d)', value: totalGenerations, icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Tokens Used',      value: `${(totalTokens/1000).toFixed(1)}k`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Avg Latency',      value: '1.2s', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Success Rate',     value: '97%',  icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((k) => {
          const KIcon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', k.bg)}>
                <KIcon className={cn('w-4 h-4', k.color)} />
              </div>
              <p className="text-xl font-bold text-slate-800">{k.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-slate-800">AI Generation Volume</h3>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={USAGE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="generations" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Generation history */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Generation Log</h3>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wide text-[10px]">
              <th className="px-4 py-2.5 text-left font-semibold">Type</th>
              <th className="px-4 py-2.5 text-left font-semibold">Model</th>
              <th className="px-4 py-2.5 text-left font-semibold">Tokens</th>
              <th className="px-4 py-2.5 text-left font-semibold">Time</th>
              <th className="px-4 py-2.5 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {HISTORY.map((h) => (
              <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">{h.type}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] font-semibold rounded-full">{h.model}</span>
                </td>
                <td className="px-4 py-3 text-slate-600 font-mono">{h.tokens.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-400">{h.time}</td>
                <td className="px-4 py-3">
                  {h.status === 'success' ? (
                    <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3 h-3" /> Success</span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600"><AlertTriangle className="w-3 h-3" /> Fallback</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}