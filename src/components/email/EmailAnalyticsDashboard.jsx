import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Mail, MousePointerClick, Reply, AlertTriangle, ChevronDown, Users, X, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const DATA_BY_RANGE = {
  'Last 7 days': {
    kpis: { open: '38.4%', click: '17.1%', reply: '9.3%', bounce: '2.1%', openDelta: '+4.2%', clickDelta: '+1.8%', replyDelta: '+0.9%', bounceDelta: '-0.4%' },
    trend: [
      { day: 'Mon', opens: 42, clicks: 18, replies: 8,  bounces: 1 },
      { day: 'Tue', opens: 58, clicks: 22, replies: 11, bounces: 2 },
      { day: 'Wed', opens: 71, clicks: 31, replies: 15, bounces: 0 },
      { day: 'Thu', opens: 53, clicks: 24, replies: 9,  bounces: 3 },
      { day: 'Fri', opens: 89, clicks: 41, replies: 19, bounces: 1 },
      { day: 'Sat', opens: 34, clicks: 12, replies: 5,  bounces: 0 },
      { day: 'Sun', opens: 28, clicks: 9,  replies: 3,  bounces: 0 },
    ],
  },
  'Last 30 days': {
    kpis: { open: '41.2%', click: '19.4%', reply: '10.7%', bounce: '1.8%', openDelta: '+6.1%', clickDelta: '+3.2%', replyDelta: '+2.1%', bounceDelta: '-0.7%' },
    trend: [
      { day: 'W1', opens: 310, clicks: 130, replies: 58,  bounces: 7 },
      { day: 'W2', opens: 390, clicks: 155, replies: 72,  bounces: 5 },
      { day: 'W3', opens: 420, clicks: 178, replies: 85,  bounces: 9 },
      { day: 'W4', opens: 475, clicks: 201, replies: 91,  bounces: 4 },
    ],
  },
  'Last 90 days': {
    kpis: { open: '35.8%', click: '15.3%', reply: '8.1%', bounce: '2.9%', openDelta: '+1.3%', clickDelta: '+0.5%', replyDelta: '-0.3%', bounceDelta: '+0.2%' },
    trend: [
      { day: 'Jan', opens: 980,  clicks: 410, replies: 188, bounces: 28 },
      { day: 'Feb', opens: 1140, clicks: 470, replies: 210, bounces: 31 },
      { day: 'Mar', opens: 1320, clicks: 540, replies: 245, bounces: 24 },
    ],
  },
  'All time': {
    kpis: { open: '33.1%', click: '14.0%', reply: '7.5%', bounce: '3.4%', openDelta: 'baseline', clickDelta: 'baseline', replyDelta: 'baseline', bounceDelta: 'baseline' },
    trend: [
      { day: 'Q1', opens: 2800, clicks: 1100, replies: 490, bounces: 85 },
      { day: 'Q2', opens: 3400, clicks: 1350, replies: 590, bounces: 72 },
      { day: 'Q3', opens: 3900, clicks: 1580, replies: 680, bounces: 90 },
      { day: 'Q4', opens: 4200, clicks: 1720, replies: 740, bounces: 68 },
    ],
  },
};

const CAMPAIGN_DATA = [
  { name: 'Fintech Q2 Outreach',     sent: 340, opens: 121, clicks: 54, replies: 28, bounce: 4,  unsub: 2 },
  { name: 'West Africa Expansion',   sent: 210, opens: 88,  clicks: 31, replies: 15, bounce: 2,  unsub: 1 },
  { name: 'Enterprise Re-Engage',    sent: 180, opens: 71,  clicks: 24, replies: 10, bounce: 6,  unsub: 3 },
  { name: 'Warm Lead Follow-up',     sent: 95,  opens: 54,  clicks: 22, replies: 18, bounce: 0,  unsub: 0 },
  { name: 'Cold ICP — SaaS Africa',  sent: 450, opens: 134, clicks: 48, replies: 21, bounce: 12, unsub: 5 },
];

const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'];

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
  const [sortCol, setSortCol] = useState('sent');
  const [sortDir, setSortDir] = useState('desc');
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  const { kpis, trend } = DATA_BY_RANGE[dateRange];

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const sortedCampaigns = [...CAMPAIGN_DATA].sort((a, b) => {
    const v = sortDir === 'asc' ? 1 : -1;
    return (a[sortCol] > b[sortCol] ? 1 : -1) * v;
  });

  const kpiCards = [
    { label: 'Open Rate',   value: kpis.open,   delta: kpis.openDelta,   icon: Mail,             color: 'text-blue-600',    bg: 'bg-blue-50',    chartKey: 'opens' },
    { label: 'Click Rate',  value: kpis.click,  delta: kpis.clickDelta,  icon: MousePointerClick, color: 'text-violet-600', bg: 'bg-violet-50',  chartKey: 'clicks' },
    { label: 'Reply Rate',  value: kpis.reply,  delta: kpis.replyDelta,  icon: Reply,            color: 'text-emerald-600', bg: 'bg-emerald-50', chartKey: 'replies' },
    { label: 'Bounce Rate', value: kpis.bounce, delta: kpis.bounceDelta, icon: AlertTriangle,    color: 'text-amber-600',   bg: 'bg-amber-50',   chartKey: 'bounces' },
  ];

  return (
    <div className="space-y-5">
      {/* Header + date range */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">Email Analytics</h2>
        <div className="relative">
          <button onClick={() => setShowRangeMenu(v => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:border-slate-300 transition-colors">
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
        {kpiCards.map(({ label, value, delta, icon: KpiIcon, color, bg, chartKey }) => {
          const isBaseline = delta === 'baseline';
          const isUp = delta.startsWith('+');
          const isActive = chartView === chartKey;
          return (
            <button key={label} onClick={() => setChartView(chartKey)}
              className={cn(
                'text-left rounded-xl border p-4 transition-all hover:shadow-md',
                isActive ? 'border-primary/40 ring-2 ring-primary/20 bg-primary/[0.02]' : 'bg-white border-slate-200 hover:border-slate-300'
              )}>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', bg)}>
                <KpiIcon className={cn('w-4 h-4', color)} />
              </div>
              <p className="text-xl font-bold text-slate-800">{value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
              <p className={cn('text-[10px] font-semibold mt-1', isBaseline ? 'text-slate-400' : isUp ? 'text-emerald-600' : 'text-red-500')}>
                {isBaseline ? '— all time baseline' : `${delta} vs prev. period`}
              </p>
            </button>
          );
        })}
      </div>

      {/* Trend chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Engagement Trend</h3>
          <div className="flex gap-1 flex-wrap">
            {['opens', 'clicks', 'replies', 'bounces'].map(v => (
              <button key={v} onClick={() => setChartView(v)}
                className={cn('px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors', chartView === v ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:text-slate-700')}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
            <Area type="monotone" dataKey={chartView} stroke="#16a34a" strokeWidth={2} fill="url(#areaGrad)"
              dot={{ r: 3, fill: '#16a34a', strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-slate-800">Campaign Performance</h3>
          <span className="text-[10px] text-slate-400 ml-1">Click a row to expand · Click a header to sort</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide text-[10px]">
                {[
                  { key: 'name', label: 'Campaign' },
                  { key: 'sent', label: 'Sent' },
                  { key: 'opens', label: 'Opens' },
                  { key: 'clicks', label: 'Clicks' },
                  { key: 'replies', label: 'Replies' },
                  { key: 'bounce', label: 'Bounces' },
                  { key: 'unsub', label: 'Unsubs' },
                ].map(({ key, label }) => (
                  <th key={key} onClick={() => handleSort(key)}
                    className="px-4 py-2.5 text-left font-semibold cursor-pointer hover:text-slate-700 select-none">
                    {label}
                    {sortCol === key && <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedCampaigns.map((c) => {
                const openRate = Math.round((c.opens / c.sent) * 100);
                const clickRate = Math.round((c.clicks / c.sent) * 100);
                const replyRate = Math.round((c.replies / c.sent) * 100);
                const bounceRate = Math.round((c.bounce / c.sent) * 100);
                const isExpanded = expandedCampaign === c.name;
                const barData = [
                  { label: 'Opens',   value: openRate,   fill: '#3b82f6' },
                  { label: 'Clicks',  value: clickRate,  fill: '#8b5cf6' },
                  { label: 'Replies', value: replyRate,  fill: '#16a34a' },
                  { label: 'Bounces', value: bounceRate, fill: '#f59e0b' },
                ];
                return (
                  <>
                    <tr key={c.name}
                      onClick={() => setExpandedCampaign(isExpanded ? null : c.name)}
                      className={cn('cursor-pointer transition-colors', isExpanded ? 'bg-primary/5' : 'hover:bg-slate-50')}>
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
                    {isExpanded && (
                      <tr key={`${c.name}-detail`}>
                        <td colSpan={7} className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                          <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-700 mb-3">{c.name} — Rate Breakdown</p>
                              <ResponsiveContainer width="100%" height={100}>
                                <BarChart data={barData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                  <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
                                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {barData.map((entry, i) => (
                                      <Cell key={i} fill={entry.fill} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-3 flex-shrink-0 text-[11px]">
                              {[
                                { label: 'Sent',    value: c.sent,    color: 'text-slate-700' },
                                { label: 'Opens',   value: `${c.opens} (${openRate}%)`,   color: 'text-blue-600' },
                                { label: 'Clicks',  value: `${c.clicks} (${clickRate}%)`, color: 'text-violet-600' },
                                { label: 'Replies', value: `${c.replies} (${replyRate}%)`,color: 'text-emerald-600' },
                                { label: 'Bounces', value: `${c.bounce} (${bounceRate}%)`,color: c.bounce > 5 ? 'text-red-500' : 'text-amber-500' },
                                { label: 'Unsubs',  value: c.unsub,   color: 'text-slate-500' },
                              ].map(({ label, value, color }) => (
                                <div key={label}>
                                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
                                  <p className={cn('font-bold', color)}>{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
