import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Mail, Calendar, Zap, Target, 
  ArrowUpRight, BarChart3, Sparkles, ChevronRight,
  DollarSign, Activity, AlertCircle, CheckCircle2
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const pipelineData = [
  { month: 'Jan', value: 420000 }, { month: 'Feb', value: 580000 },
  { month: 'Mar', value: 720000 }, { month: 'Apr', value: 890000 },
  { month: 'May', value: 1100000 }, { month: 'Jun', value: 1350000 },
  { month: 'Jul', value: 1680000 }, { month: 'Aug', value: 1920000 },
  { month: 'Sep', value: 2100000 }, { month: 'Oct', value: 2380000 },
];

const activityData = [
  { day: 'M', emails: 42, calls: 8, meetings: 3 },
  { day: 'T', emails: 58, calls: 12, meetings: 5 },
  { day: 'W', emails: 35, calls: 6, meetings: 2 },
  { day: 'T', emails: 71, calls: 15, meetings: 7 },
  { day: 'F', emails: 63, calls: 10, meetings: 4 },
  { day: 'S', emails: 28, calls: 4, meetings: 1 },
  { day: 'S', emails: 18, calls: 2, meetings: 0 },
];

const aiInsights = [
  { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10', text: '3 deals show risk signals — last contact >14 days ago. Suggest sending a personalized follow-up now.', action: 'Take Action' },
  { icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', text: 'WhatsApp outreach converting 2.3x better than email this month — consider shifting more sequences to WhatsApp-first.', action: 'Optimize' },
  { icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-400/10', text: 'AI can auto-generate a re-engagement sequence for 47 cold contacts sitting in your pipeline.', action: 'Generate' },
  { icon: CheckCircle2, color: 'text-cyan-400', bg: 'bg-cyan-400/10', text: 'Your "Fintech CTO Outbound" sequence reply rate dropped 8% — AI suggests adding a LinkedIn touchpoint on Day 4.', action: 'Fix It' },
];

const recentActivities = [
  { type: 'email', text: 'Amara Diallo opened your email "Q3 Partnership Opportunity"', time: '2m ago', color: 'bg-primary' },
  { type: 'meeting', text: 'New meeting booked with Kemi Adeyemi — Yoco (Tomorrow 10am)', time: '14m ago', color: 'bg-cyan-500' },
  { type: 'deal', text: 'Deal "Paystack Integration" moved to Negotiation — $85,000', time: '1h ago', color: 'bg-violet-500' },
  { type: 'reply', text: 'Tunde Okafor replied to your LinkedIn message', time: '2h ago', color: 'bg-amber-500' },
  { type: 'ai', text: 'AI Copilot generated 5 personalized emails for Campaign #12', time: '3h ago', color: 'bg-primary' },
];

const pipelineStages = [
  { name: 'Prospecting', count: 47, value: '$420K', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400' },
  { name: 'Qualified', count: 23, value: '$890K', color: 'bg-violet-500/20 border-violet-500/30 text-violet-400' },
  { name: 'Proposal', count: 12, value: '$1.2M', color: 'bg-amber-500/20 border-amber-500/30 text-amber-400' },
  { name: 'Negotiation', count: 6, value: '$680K', color: 'bg-primary/20 border-primary/30 text-primary' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 text-xs">
        <p className="text-muted-foreground mb-1">{label}</p>
        <p className="font-bold text-primary">${(payload[0].value / 1000000).toFixed(2)}M</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <TopBar title="GTM Dashboard" subtitle="Your execution overview — activity, pipeline &amp; AI insights" />
      
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Pipeline', value: '$2.4M', change: '+18%', positive: true, icon: DollarSign, color: 'text-primary' },
            { label: 'Contacts Added', value: '1,247', change: '+23%', positive: true, icon: Users, color: 'text-cyan-400' },
            { label: 'Emails Sent', value: '8,903', change: '+12%', positive: true, icon: Mail, color: 'text-violet-400' },
            { label: 'Meetings Booked', value: '47', change: '+8%', positive: true, icon: Calendar, color: 'text-amber-400' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass rounded-xl p-5 hover:border-border transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold text-foreground mb-1">{stat.value}</p>
              <div className="flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="w-3 h-3" />
                <span>{stat.change} this month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Pipeline Chart */}
          <div className="lg:col-span-2 glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-foreground">Pipeline Growth</h3>
                <p className="text-xs text-muted-foreground">Revenue generated YTD</p>
              </div>
              <div className="flex gap-2">
                {['3M', '6M', 'YTD'].map(t => (
                  <button key={t} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${t === 'YTD' ? 'bg-primary/10 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={pipelineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pipelineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 76% 52%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(142 76% 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="hsl(142 76% 52%)" strokeWidth={2} fill="url(#pipelineGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pipeline Stages */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-bold text-foreground mb-4">Pipeline Stages</h3>
            <div className="space-y-3">
              {pipelineStages.map((stage) => (
                <div key={stage.name} className={`flex items-center justify-between p-3 rounded-lg border ${stage.color}`}>
                  <div>
                    <p className="text-xs font-semibold">{stage.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stage.count} deals</p>
                  </div>
                  <span className="text-sm font-bold">{stage.value}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs text-muted-foreground hover:text-primary" size="sm">
              View Full Pipeline <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* AI Insights + Activity */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* AI Insights */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-lg gradient-brand flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-black" />
              </div>
              <h3 className="font-bold">AI Revenue Insights</h3>
              <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            </div>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors group">
                  <div className={`w-8 h-8 rounded-lg ${insight.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <insight.icon className={`w-4 h-4 ${insight.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">{insight.text}</p>
                  </div>
                  <button className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">
                    {insight.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold">GTM Activity Feed</h3>
              <button className="text-xs text-muted-foreground hover:text-primary transition-colors">View all</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${a.color} mt-1.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">{a.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold">Team Activity This Week</h3>
              <p className="text-xs text-muted-foreground">Emails, calls, and meetings by day</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(224 71% 6%)', border: '1px solid hsl(223 47% 14%)', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="emails" fill="hsl(142 76% 36%)" radius={3} />
              <Bar dataKey="calls" fill="hsl(197 100% 56%)" radius={3} opacity={0.7} />
              <Bar dataKey="meetings" fill="hsl(258 90% 66%)" radius={3} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}