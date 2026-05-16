import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Mail, DollarSign, Target, Sparkles, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 82000, pipeline: 320000 },
  { month: 'Feb', revenue: 106000, pipeline: 410000 },
  { month: 'Mar', revenue: 134000, pipeline: 520000 },
  { month: 'Apr', revenue: 158000, pipeline: 680000 },
  { month: 'May', revenue: 192000, pipeline: 840000 },
  { month: 'Jun', revenue: 228000, pipeline: 1020000 },
];

const funnelData = [
  { stage: 'Visitors', count: 12400, rate: 100 },
  { stage: 'Leads', count: 1860, rate: 15 },
  { stage: 'Qualified', count: 558, rate: 4.5 },
  { stage: 'Opportunities', count: 167, rate: 1.35 },
  { stage: 'Closed Won', count: 42, rate: 0.34 },
];

const channelData = [
  { channel: 'Outbound Email', leads: 340, deals: 28, revenue: 420000 },
  { channel: 'LinkedIn', leads: 210, deals: 19, revenue: 285000 },
  { channel: 'WhatsApp', leads: 180, deals: 22, revenue: 330000 },
  { channel: 'Inbound', leads: 420, deals: 31, revenue: 465000 },
  { channel: 'Referral', leads: 90, deals: 18, revenue: 540000 },
];

const sourceData = [
  { name: 'Outbound', value: 32, color: '#4ade80' },
  { name: 'Inbound', value: 28, color: '#22d3ee' },
  { name: 'LinkedIn', value: 20, color: '#818cf8' },
  { name: 'Referral', value: 14, color: '#f59e0b' },
  { name: 'Other', value: 6, color: '#6b7280' },
];

const teamData = [
  { name: 'Amara D.', emails: 342, calls: 48, meetings: 12, deals: 4 },
  { name: 'Tunde O.', emails: 289, calls: 62, meetings: 9, deals: 3 },
  { name: 'Chioma E.', emails: 418, calls: 35, meetings: 15, deals: 6 },
  { name: 'Kweku M.', emails: 195, calls: 28, meetings: 7, deals: 2 },
  { name: 'Kefilwe M.', emails: 267, calls: 44, meetings: 11, deals: 4 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 text-xs border border-border/60">
        <p className="text-muted-foreground mb-1 font-medium">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {p.name}: {typeof p.value === 'number' && p.value > 1000 ? `$${(p.value / 1000).toFixed(0)}K` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [aiInsights, setAiInsights] = useState([
    { type: 'warning', text: 'WhatsApp channel has 22% higher conversion than email but receives 47% less investment. Consider reallocating budget.' },
    { type: 'success', text: 'Chioma E. is your top performer with 6 deals won. Replicate her outreach patterns across the team.' },
    { type: 'warning', text: 'Lead-to-qualified conversion dropped to 4.5% this month. Review qualification criteria and sequence messaging.' },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const refreshAIInsights = async () => {
    setAiLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a GTM analytics AI. Based on this performance data, generate exactly 3 actionable insights:
- Revenue: $228K MTD (+19%)  
- Pipeline: $1.02M (+31%)
- Top channel: WhatsApp (91% open rate)
- Team top performer: Chioma E. (15 meetings, 6 deals)
- Funnel: 15% lead conversion, 4.5% qualified rate
- Channels: Email (340 leads), LinkedIn (210), WhatsApp (180), Inbound (420), Referral (90)

Return JSON with insights array, each having: type ("success" or "warning"), text (1-2 sentences, specific and actionable).`,
      response_json_schema: {
        type: 'object', properties: {
          insights: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, text: { type: 'string' } } } }
        }
      }
    });
    if (result?.insights?.length) setAiInsights(result.insights);
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Analytics" subtitle="Execution performance — sequences, campaigns, WhatsApp, and pipeline" />

      <div className="p-6 space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Revenue (MTD)', value: '$228K', change: '+19%', positive: true, icon: DollarSign },
            { label: 'New Leads', value: '1,247', change: '+23%', positive: true, icon: Users },
            { label: 'Pipeline Generated', value: '$1.02M', change: '+31%', positive: true, icon: TrendingUp },
            { label: 'CAC', value: '$1,240', change: '-8%', positive: true, icon: Target },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</span>
                <k.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-black text-foreground mb-1">{k.value}</p>
              <div className={`flex items-center gap-1 text-xs font-medium ${k.positive ? 'text-primary' : 'text-destructive'}`}>
                {k.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{k.change} vs last month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Insights Panel */}
        <div className="glass rounded-xl p-5 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-black" />
              </div>
              <h3 className="font-bold text-sm text-foreground">AI Performance Insights</h3>
            </div>
            <Button size="sm" variant="outline" onClick={refreshAIInsights} disabled={aiLoading}
              className="border-primary/30 text-primary hover:bg-primary/10 text-xs gap-1.5">
              {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {aiLoading ? 'Analyzing...' : 'Refresh AI'}
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className={`p-3 rounded-xl border text-xs leading-relaxed flex gap-2.5 ${insight.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-200' : 'bg-primary/5 border-primary/20 text-foreground'}`}>
                {insight.type === 'warning'
                  ? <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  : <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                }
                <p>{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue + Funnel Row */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass rounded-xl p-5">
            <h3 className="font-bold mb-4 text-foreground">Revenue vs Pipeline</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 76% 52%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(142 76% 52%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pipGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(197 100% 56%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(197 100% 56%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="pipeline" name="Pipeline" stroke="hsl(197 100% 56%)" strokeWidth={1.5} fill="url(#pipGrad)" />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(142 76% 52%)" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-xl p-5">
            <h3 className="font-bold mb-4 text-foreground">Pipeline by Source</h3>
            <div className="flex justify-center mb-4">
              <PieChart width={160} height={160}>
                <Pie data={sourceData} cx={80} cy={80} innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {sourceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-2">
              {sourceData.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-xs text-muted-foreground">{s.name}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funnel + Channel */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-5">
            <h3 className="font-bold mb-5 text-foreground">Conversion Funnel</h3>
            <div className="space-y-3">
              {funnelData.map((stage, i) => (
                <div key={stage.stage} className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-24 text-right">{stage.stage}</span>
                  <div className="flex-1 bg-secondary rounded-full h-6 overflow-hidden relative">
                    <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${stage.rate}%`, minWidth: '12%', background: `hsl(${142 - i * 12} 76% 52%)` }}>
                      <span className="text-[10px] font-bold text-black">{stage.count.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground w-10">{stage.rate}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <h3 className="font-bold mb-4 text-foreground">Channel Attribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={channelData} layout="vertical" margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="channel" tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ background: 'hsl(224 71% 6%)', border: '1px solid hsl(223 47% 14%)', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="leads" name="Leads" fill="hsl(142 76% 36%)" radius={3} />
                <Bar dataKey="deals" name="Deals" fill="hsl(197 100% 56%)" radius={3} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Performance */}
        <div className="glass rounded-xl p-5">
          <h3 className="font-bold mb-4 text-foreground">Team Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  {['Rep', 'Emails', 'Calls', 'Meetings', 'Deals Won', 'Rank'].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamData.sort((a, b) => b.deals - a.deals).map((rep, i) => (
                  <tr key={rep.name} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{rep.name[0]}</div>
                        <span className="text-sm font-medium">{rep.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-muted-foreground">{rep.emails}</td>
                    <td className="py-3 px-3 text-sm text-muted-foreground">{rep.calls}</td>
                    <td className="py-3 px-3 text-sm text-muted-foreground">{rep.meetings}</td>
                    <td className="py-3 px-3 text-sm font-bold text-primary">{rep.deals}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${i === 0 ? 'bg-amber-400/20 text-amber-400' : 'text-muted-foreground'}`}>#{i + 1}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}