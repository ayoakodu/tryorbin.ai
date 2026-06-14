import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign, Users, Mail, Calendar, TrendingUp, ChevronRight, EyeOff
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils';

const pipelineData = [
  { month: 'Jan', value: 420000 }, { month: 'Feb', value: 580000 },
  { month: 'Mar', value: 720000 }, { month: 'Apr', value: 890000 },
  { month: 'May', value: 1100000 }, { month: 'Jun', value: 1350000 },
  { month: 'Jul', value: 1680000 }, { month: 'Aug', value: 1920000 },
  { month: 'Sep', value: 2100000 }, { month: 'Oct', value: 2380000 },
];

const activityData = [
  { day: 'Mon', emails: 42, calls: 8, meetings: 3 },
  { day: 'Tue', emails: 58, calls: 12, meetings: 5 },
  { day: 'Wed', emails: 35, calls: 6, meetings: 2 },
  { day: 'Thu', emails: 71, calls: 15, meetings: 7 },
  { day: 'Fri', emails: 63, calls: 10, meetings: 4 },
  { day: 'Sat', emails: 28, calls: 4, meetings: 1 },
  { day: 'Sun', emails: 18, calls: 2, meetings: 0 },
];

const KPI_CARDS = [
  { id: 'pipeline', label: 'Pipeline', value: '$2.4M', change: '+18%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'contacts', label: 'Contacts',  value: '1,247', change: '+23%', icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'emails',   label: 'Emails Sent', value: '8,903', change: '+12%', icon: Mail, color: 'text-violet-500', bg: 'bg-violet-50' },
  { id: 'meetings', label: 'Meetings', value: '47', change: '+8%', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50' },
];

const PIPELINE_STAGES = [
  { name: 'Prospecting', count: 47, value: '$420K', text: '#2563eb', pct: 100 },
  { name: 'Qualified',   count: 23, value: '$890K', text: '#7c3aed', pct: 75 },
  { name: 'Proposal',    count: 12, value: '$1.2M', text: '#d97706', pct: 55 },
  { name: 'Negotiation', count: 6,  value: '$680K', text: '#16a34a', pct: 35 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs shadow-md bg-white border border-slate-100">
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p className="font-bold text-emerald-600">${(payload[0].value / 1000000).toFixed(2)}M</p>
    </div>
  );
};

const periodSlice = { '3M': 3, '6M': 6, 'YTD': 10 };

export default function PerformanceLayer({ hiddenWidgets = [], onToggleWidget, isCustomizing }) {
  const [activePeriod, setActivePeriod] = useState('YTD');
  const navigate = useNavigate();
  const chartData = pipelineData.slice(-periodSlice[activePeriod]);

  return (
    <div className="space-y-3">
      {/* KPI Strip — compact */}
      {!hiddenWidgets.includes('kpis') && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {KPI_CARDS.map((stat, i) => (
            <motion.div key={stat.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="relative rounded-xl p-4 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{stat.label}</span>
                <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-3 h-3', stat.color)} />
                </div>
              </div>
              <p className="text-lg font-bold text-slate-800 leading-none mb-1">{stat.value}</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-semibold text-emerald-500">{stat.change}</span>
                <span className="text-[10px] text-slate-400">/ month</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts — reduced height, side by side */}
      <div className="grid lg:grid-cols-3 gap-3">
        {/* Pipeline chart */}
        {!hiddenWidgets.includes('pipeline_chart') && (
          <div className="lg:col-span-2 rounded-xl p-4 bg-white border border-slate-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-[12px] font-bold text-slate-700">Pipeline Growth</h3>
                <p className="text-[10px] text-slate-400">Revenue YTD</p>
              </div>
              <div className="flex gap-1">
                {['3M', '6M', 'YTD'].map(t => (
                  <button key={t} onClick={() => setActivePeriod(t)}
                    className={cn('px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all',
                      activePeriod === t ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'text-slate-400 hover:text-slate-600')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={chartData} margin={{ top: 2, right: 2, left: -26, bottom: 0 }}>
                <defs>
                  <linearGradient id="pGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 76% 52%)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="hsl(142 76% 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="hsl(142 76% 45%)" strokeWidth={1.5} fill="url(#pGrad2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pipeline Stages */}
        {!hiddenWidgets.includes('pipeline_stages') && (
          <div className="rounded-xl p-4 bg-white border border-slate-200 hover:shadow-sm transition-shadow">
            <h3 className="text-[12px] font-bold text-slate-700 mb-3">Pipeline Stages</h3>
            <div className="space-y-2.5">
              {PIPELINE_STAGES.map(stage => (
                <div key={stage.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold" style={{ color: stage.text }}>{stage.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400">{stage.count}</span>
                      <span className="text-[10px] font-bold" style={{ color: stage.text }}>{stage.value}</span>
                    </div>
                  </div>
                  <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${stage.pct}%`, background: stage.text, opacity: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/pipeline')} className="flex items-center gap-1 w-full justify-center mt-3.5 text-[10px] text-slate-400 hover:text-emerald-600 transition-colors font-semibold">
              View Pipeline <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Activity Chart — compact */}
      {!hiddenWidgets.includes('activity_chart') && (
        <div className="rounded-xl p-4 bg-white border border-slate-200 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[12px] font-bold text-slate-700">Team Activity</h3>
              <p className="text-[10px] text-slate-400">Emails · Calls · Meetings · This week</p>
            </div>
            <div className="flex items-center gap-3">
              {[{ label: 'Emails', color: 'bg-emerald-400' }, { label: 'Calls', color: 'bg-cyan-400' }, { label: 'Meetings', color: 'bg-violet-400' }].map(l => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className={cn('w-1.5 h-1.5 rounded-full', l.color)} />
                  <span className="text-[10px] text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={activityData} margin={{ top: 0, right: 0, left: -26, bottom: 0 }} barGap={1}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 10 }} />
              <Bar dataKey="emails"   fill="hsl(142 76% 45%)" radius={[2,2,0,0]} />
              <Bar dataKey="calls"    fill="hsl(197 100% 50%)" radius={[2,2,0,0]} opacity={0.7} />
              <Bar dataKey="meetings" fill="hsl(258 90% 66%)"  radius={[2,2,0,0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}