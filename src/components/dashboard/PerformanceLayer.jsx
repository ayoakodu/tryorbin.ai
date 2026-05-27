import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Users, Mail, Calendar, TrendingUp,
  ChevronRight, MoreHorizontal, Eye, EyeOff, GripVertical
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
  { id: 'pipeline', label: 'Total Pipeline', value: '$2.4M', change: '+18%', positive: true, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'contacts', label: 'Contacts Added', value: '1,247', change: '+23%', positive: true, icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'emails',   label: 'Emails Sent',    value: '8,903', change: '+12%', positive: true, icon: Mail, color: 'text-violet-500', bg: 'bg-violet-50' },
  { id: 'meetings', label: 'Meetings Booked', value: '47',   change: '+8%',  positive: true, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50' },
];

const PIPELINE_STAGES = [
  { name: 'Prospecting', count: 47, value: '$420K', bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb', pct: 100 },
  { name: 'Qualified',   count: 23, value: '$890K', bg: '#f5f3ff', border: '#ddd6fe', text: '#7c3aed', pct: 75 },
  { name: 'Proposal',    count: 12, value: '$1.2M', bg: '#fffbeb', border: '#fde68a', text: '#d97706', pct: 55 },
  { name: 'Negotiation', count: 6,  value: '$680K', bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a', pct: 35 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg px-3 py-2 text-xs shadow-md bg-white border border-slate-100">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="font-bold text-emerald-600">${(payload[0].value / 1000000).toFixed(2)}M</p>
      </div>
    );
  }
  return null;
};

export default function PerformanceLayer({ isCustomizing, hiddenWidgets, onToggleWidget }) {
  const [activePeriod, setActivePeriod] = useState('YTD');

  return (
    <div className="space-y-4">
      {/* KPI Strip */}
      {!hiddenWidgets.includes('kpis') && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {KPI_CARDS.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                'relative group rounded-xl p-4 bg-white border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all',
                isCustomizing && 'ring-2 ring-dashed ring-slate-200'
              )}
            >
              {isCustomizing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl z-10 gap-3">
                  <button onClick={() => onToggleWidget(stat.id)} className="flex items-center gap-1.5 text-[11px] font-medium text-red-500 hover:text-red-600 border border-red-200 bg-red-50 px-2.5 py-1 rounded-lg">
                    <EyeOff className="w-3 h-3" /> Hide
                  </button>
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold leading-tight">{stat.label}</span>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.color)} />
                </div>
              </div>
              <p className="text-xl font-bold text-slate-800 mb-1">{stat.value}</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[11px] font-semibold text-emerald-500">{stat.change}</span>
                <span className="text-[11px] text-slate-400">this month</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Pipeline Growth */}
        {!hiddenWidgets.includes('pipeline_chart') && (
          <div className={cn('lg:col-span-2 rounded-xl p-5 bg-white border border-slate-200 hover:shadow-sm transition-shadow', isCustomizing && 'ring-2 ring-dashed ring-slate-200')}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-bold text-slate-800">Pipeline Growth</h3>
                  {isCustomizing && (
                    <button onClick={() => onToggleWidget('pipeline_chart')} className="text-[10px] font-medium text-red-400 hover:text-red-500 flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">Revenue generated YTD</p>
              </div>
              <div className="flex gap-1">
                {['3M', '6M', 'YTD'].map(t => (
                  <button key={t} onClick={() => setActivePeriod(t)}
                    className={cn('px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all',
                      activePeriod === t ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={pipelineData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 76% 52%)" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="hsl(142 76% 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="hsl(142 76% 45%)" strokeWidth={2} fill="url(#pGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pipeline Stages */}
        {!hiddenWidgets.includes('pipeline_stages') && (
          <div className={cn('rounded-xl p-5 bg-white border border-slate-200 hover:shadow-sm transition-shadow', isCustomizing && 'ring-2 ring-dashed ring-slate-200')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold text-slate-800">Pipeline Stages</h3>
              {isCustomizing && (
                <button onClick={() => onToggleWidget('pipeline_stages')} className="text-[10px] font-medium text-red-400 hover:text-red-500 flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="space-y-2.5">
              {PIPELINE_STAGES.map(stage => (
                <div key={stage.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold" style={{ color: stage.text }}>{stage.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{stage.count} deals</span>
                      <span className="text-[11px] font-bold" style={{ color: stage.text }}>{stage.value}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${stage.pct}%`, background: stage.text, opacity: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-1 w-full justify-center mt-4 text-[11px] text-slate-400 hover:text-emerald-600 transition-colors font-medium">
              View Full Pipeline <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Activity Chart */}
      {!hiddenWidgets.includes('activity_chart') && (
        <div className={cn('rounded-xl p-5 bg-white border border-slate-200 hover:shadow-sm transition-shadow', isCustomizing && 'ring-2 ring-dashed ring-slate-200')}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">Team Activity This Week</h3>
                <p className="text-[11px] text-slate-400">Emails · Calls · Meetings</p>
              </div>
              {isCustomizing && (
                <button onClick={() => onToggleWidget('activity_chart')} className="text-[10px] font-medium text-red-400 hover:text-red-500 flex items-center gap-1 ml-2">
                  <EyeOff className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: 'Emails', color: 'bg-emerald-400' },
                { label: 'Calls',  color: 'bg-cyan-400' },
                { label: 'Meetings', color: 'bg-violet-400' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={cn('w-2 h-2 rounded-full', l.color)} />
                  <span className="text-[10px] text-slate-400 font-medium">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={activityData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }} barGap={2}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="emails"   fill="hsl(142 76% 45%)" radius={[3,3,0,0]} />
              <Bar dataKey="calls"    fill="hsl(197 100% 50%)" radius={[3,3,0,0]} opacity={0.75} />
              <Bar dataKey="meetings" fill="hsl(258 90% 66%)" radius={[3,3,0,0]} opacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}