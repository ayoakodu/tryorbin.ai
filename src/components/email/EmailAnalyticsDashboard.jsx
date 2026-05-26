import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Mail, MousePointerClick, Reply, AlertTriangle, Ban, Users, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const TREND_DATA = [
  { day: 'Mon', opens: 42, clicks: 18, replies: 8, bounces: 1 },
  { day: 'Tue', opens: 58, clicks: 22, replies: 11, bounces: 2 },
  { day: 'Wed', opens: 71, clicks: 31, replies: 15, bounces: 0 },
  { day: 'Thu', opens: 53, clicks: 24, replies: 9,  bounces: 3 },
  { day: 'Fri', opens: 89, clicks: 41, replies: 19, bounces: 1 },
  { day: 'Sat', opens: 34, clicks: 12, replies: 5,  bounces: 0 },
  { day: 'Sun', opens: 28, clicks: 9,  replies: 3,  bounces: 0 },
];

const CAMPAIGN_DATA = [
  { name: 'Fintech Q2 Outreach',     sent: 340, opens: 121, clicks: 54, replies: 28, bounce: 4,  unsub: 2 },
  { name: 'West Africa Expansion',   sent: 210, opens: 88,  clicks: 31, replies: 15, bounce: 2,  unsub: 1 },
  { name: 'Enterprise Re-Engage',    sent: 180, opens: 71,  clicks: 24, replies: 10, bounce: 6,  unsub: 3 },
  { name: 'Warm Lead Follow-up',     sent: 95,  opens: 54,  clicks: 22, replies: 18, bounce: 0,  unsub: 0 },
  { name: 'Cold ICP — SaaS Africa',  sent: 450, opens: 134, clicks: 48, replies: 21, bounce: 12, unsub: 5 },
];

const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'];

function KPI({ label, value, sub, icon: KpiIcon, color, bg }) {
  return (
  <div className="bg-white rounded-xl border border-slate-200 p-4">
    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', bg)}>
      <KpiIcon className={cn('w-4 h-4', color)} />
    </div>
    <p className="text-xl font-bold text-slate-800">{value}</p>
    <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
    {sub && <p className={cn('text-[10px] font-semibold mt-1', sub.up ? 'text-emerald-600' : 'text-red-500')}>{sub.label}</p>}
  </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.key} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.stroke }} />
          <span className="text-slate-600 capitalize">{p.dataKey}:</span>
          <span className="font-semibold text-slate-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function EmailAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('Last 7 days');
  const [showRangeMenu, setShowRangeMenu] = useState(false);
  const [chartView, setChartView] = useState('opens');

  return (
    <div className="space-y-5">
      {/* Header + date range */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">Email Analytics</h2>
        <div className="relative">
          <button
            onClick={() => setShowRangeMenu(v => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:border-slate-300 transition-colors"
          >
            {dateRange} <ChevronDown className="w-3 h-3" />
          </button>
          {showRangeMenu && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              {DATE_RANGES.map(r => (
                <button key={r} onClick={() => { setDateRange(r); setShowRangeMenu(false); }}
                  className={cn('block w-full text-left px-4 py-2 text-xs transition-colors', dateRange === r ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50')}>
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Open Rate"       value="38.4%"  icon={Mail}             color="text-blue-600"    bg="bg-blue-50"    sub={{ label: '↑ 4.2% vs last week', up: true }} />
        <KPI label="Click Rate"      value="17.1%"  icon={MousePointerClick} color="text-violet-600" bg="bg-violet-50"  sub={{ label: '↑ 1.8%', up: true }} />
        <KPI label="Reply Rate"      value="9.3%"   icon={Reply}            color="text-emerald-600" bg="bg-emerald-50" sub={{ label: '↑ 0.9%', up: true }} />
        <KPI label="Bounce Rate"     value="2.1%"   icon={AlertTriangle}    color="text-amber-600"   bg="bg-amber-50"   sub={{ label: '↓ 0.4%', up: true }} />
      </div>

      {/* Trend chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Engagement Trend</h3>
          <div className="flex gap-1">
            {['opens', 'clicks', 'replies', 'bounces'].map(v => (
              <button key={v} onClick={() => setChartView(v)}
                className={cn('px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors', chartView === v ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:text-slate-700')}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={chartView} stroke="#16a34a" strokeWidth={2} fill="url(#areaGrad)" dot={{ r: 3, fill: '#16a34a', strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-slate-800">Campaign Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide text-[10px]">
                {['Campaign', 'Sent', 'Opens', 'Clicks', 'Replies', 'Bounces', 'Unsubs'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CAMPAIGN_DATA.map((c) => {
                const openRate = Math.round((c.opens / c.sent) * 100);
                const replyRate = Math.round((c.replies / c.sent) * 100);
                return (
                  <tr key={c.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-[180px] truncate">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.sent}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-blue-600">{c.opens}</span>
                      <span className="text-slate-400 ml-1">({openRate}%)</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.clicks}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-emerald-600">{c.replies}</span>
                      <span className="text-slate-400 ml-1">({replyRate}%)</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('font-semibold', c.bounce > 5 ? 'text-red-500' : 'text-amber-500')}>{c.bounce}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{c.unsub}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}