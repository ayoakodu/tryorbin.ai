import { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Mail, MessageCircle, Target,
  Sparkles, Loader2, AlertTriangle, CheckCircle2, Users,
  BarChart3, Reply, Calendar, MousePointerClick, Send
} from 'lucide-react';
import LinkedInAnalyticsCard from '@/components/linkedin/LinkedInAnalyticsCard';

// Channel performance comparison
const channelPerformanceData = [
  { channel: 'Email', openRate: 66, replyRate: 22, meetingRate: 3.2, sent: 1240 },
  { channel: 'WhatsApp', openRate: 91, replyRate: 28, meetingRate: 5.8, sent: 890 },
  { channel: 'LinkedIn', openRate: 54, replyRate: 18, meetingRate: 2.1, sent: 340 },
  { channel: 'SMS', openRate: 88, replyRate: 14, meetingRate: 1.4, sent: 260 },
];

// Time-of-day performance
const timeOfDayData = [
  { hour: '6am', replies: 4 }, { hour: '7am', replies: 9 }, { hour: '8am', replies: 22 },
  { hour: '9am', replies: 38 }, { hour: '10am', replies: 51 }, { hour: '11am', replies: 47 },
  { hour: '12pm', replies: 29 }, { hour: '1pm', replies: 18 }, { hour: '2pm', replies: 34 },
  { hour: '3pm', replies: 43 }, { hour: '4pm', replies: 39 }, { hour: '5pm', replies: 21 },
  { hour: '6pm', replies: 11 },
];

// Campaign performance trend (weekly)
const campaignTrendData = [
  { week: 'W1', sent: 320, opened: 198, replied: 45, meetings: 8 },
  { week: 'W2', sent: 410, opened: 267, replied: 61, meetings: 11 },
  { week: 'W3', sent: 380, opened: 228, replied: 53, meetings: 9 },
  { week: 'W4', sent: 520, opened: 364, replied: 87, meetings: 16 },
  { week: 'W5', sent: 490, opened: 318, replied: 79, meetings: 14 },
  { week: 'W6', sent: 610, opened: 427, replied: 102, meetings: 19 },
];

// Engagement funnel
const funnelStages = [
  { stage: 'Sent', value: 2730, pct: 100, color: 'hsl(142 76% 52%)' },
  { stage: 'Delivered', value: 2676, pct: 98, color: 'hsl(142 76% 46%)' },
  { stage: 'Opened', value: 1802, pct: 66, color: 'hsl(197 100% 56%)' },
  { stage: 'Replied', value: 427, pct: 15.6, color: 'hsl(262 80% 65%)' },
  { stage: 'Meeting', value: 77, pct: 2.8, color: 'hsl(38 92% 50%)' },
];

// Step performance for selected sequence
const stepPerformanceData = [
  { step: 'Step 1', sent: 142, opened: 98, replied: 31, dropoff: 31 },
  { step: 'Step 2', sent: 111, opened: 72, replied: 18, dropoff: 20 },
  { step: 'Step 3', sent: 93, opened: 54, replied: 12, dropoff: 35 },
  { step: 'Step 4', sent: 58, opened: 31, replied: 8, dropoff: 38 },
  { step: 'Step 5', sent: 36, opened: 18, replied: 5, dropoff: 38 },
];

// Campaign dashboard table
const campaignTableData = [
  { name: 'Fintech CTO Outbound — Nigeria', channel: 'multi', sent: 142, openRate: 62.7, replyRate: 21.8, positiveReply: 8.5, meetings: 8, status: 'active' },
  { name: 'SMB Decision Maker — WhatsApp', channel: 'whatsapp', sent: 89, openRate: 91.0, replyRate: 24.7, positiveReply: 11.2, meetings: 5, status: 'active' },
  { name: 'Inbound Lead Nurture', channel: 'email', sent: 234, openRate: 66.7, replyRate: 28.6, positiveReply: 14.1, meetings: 19, status: 'active' },
  { name: 'Re-engagement — Cold Leads', channel: 'email', sent: 47, openRate: 38.3, replyRate: 17.0, positiveReply: 4.3, meetings: 2, status: 'paused' },
];

const CustomTooltip = ({ active, payload, label }) => {
if (active && payload && payload.length) {
  return (
    <div className="rounded-lg px-3 py-2 text-xs shadow-md" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <p className="text-muted-foreground mb-1 font-medium">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const channelIcon = { multi: BarChart3, whatsapp: MessageCircle, email: Mail };
const channelColor = { multi: 'text-amber-400', whatsapp: 'text-primary', email: 'text-blue-400' };
const statusBadge = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function Analytics() {
  const [aiInsights, setAiInsights] = useState([
    { type: 'warning', text: 'WhatsApp sequences have 91% open rate vs 66% for email — consider shifting more prospects to WhatsApp touchpoints.' },
    { type: 'success', text: 'Step 1 drives 73% of all replies. Invest in optimizing your first touchpoint subject lines and hooks.' },
    { type: 'warning', text: 'Re-engagement campaign reply rate dropped to 17%. Adjust messaging angle — try a "break-up" email approach.' },
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const totalSent = campaignTableData.reduce((s, c) => s + c.sent, 0);
  const avgOpenRate = (campaignTableData.reduce((s, c) => s + c.openRate, 0) / campaignTableData.length).toFixed(1);
  const avgReplyRate = (campaignTableData.reduce((s, c) => s + c.replyRate, 0) / campaignTableData.length).toFixed(1);
  const totalMeetings = campaignTableData.reduce((s, c) => s + c.meetings, 0);

  const refreshAIInsights = async () => {
    setAiLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a GTM campaign analytics AI. Analyze these outbound campaign metrics and detect issues based on these rules:\n- Low open rate (<40%) → flag subject line issue\n- High open + low reply (<10% reply despite >60% open) → flag weak CTA or message mismatch\n- Drop-off >35% at any step → flag step optimisation needed\n- Channel with highest engagement → recommend replicating its targeting pattern\n- Any campaign with reply rate <18% → recommend pause or revision\n\nCampaign Data:\n- Total Sent: ${totalSent}, Avg Open Rate: ${avgOpenRate}%, Avg Reply Rate: ${avgReplyRate}%, Total Meetings: ${totalMeetings}\n- WhatsApp: 91% open, 28% reply | Email: 66% open, 22% reply | LinkedIn: 54% open, 18% reply\n- Best step: Step 1 (73% of replies) | Dropoff: 31% step 2, 35% step 3\n- Re-engagement campaign: 38% open, 17% reply rate — UNDERPERFORMING\n- Peak reply hours: 10am–11am and 3pm–4pm\n\nReturn exactly 4 insights. Each must reference a specific metric. JSON: insights array with type ("success"|"warning"|"danger") and text.`,
        response_json_schema: {
          type: 'object', properties: {
            insights: {
              type: 'array',
              items: { type: 'object', properties: { type: { type: 'string' }, text: { type: 'string' } } }
            }
          }
        }
      });
      if (result?.insights?.length) setAiInsights(result.insights);
    } catch {
      // Silently keep existing insights if AI refresh fails
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <TopBar title="Analytics" subtitle="Campaign performance — sequences, engagement, and pipeline visibility" />

      <div className="p-6 space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Sent', value: totalSent.toLocaleString(), icon: Send, color: 'text-foreground', sub: 'across all campaigns' },
            { label: 'Avg Open Rate', value: `${avgOpenRate}%`, icon: Mail, color: 'text-cyan-400', sub: '+4.2% vs last month' },
            { label: 'Avg Reply Rate', value: `${avgReplyRate}%`, icon: Reply, color: 'text-primary', sub: 'positive signal threshold' },
            { label: 'Meetings Booked', value: totalMeetings, icon: Calendar, color: 'text-amber-400', sub: 'from sequences' },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</span>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className={`text-base font-bold mb-1 ${k.color}`}>{k.value}</p>
              <p className="text-[10px] text-muted-foreground">{k.sub}</p>
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
              <h3 className="font-bold text-sm text-foreground">AI Campaign Insights</h3>
              <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">Based on real data</span>
            </div>
            <Button size="sm" variant="outline" onClick={refreshAIInsights} disabled={aiLoading}
              className="border-primary/30 text-primary hover:bg-primary/10 text-xs gap-1.5">
              {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {aiLoading ? 'Analyzing...' : 'Refresh AI'}
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className={`p-3 rounded-xl border text-xs leading-relaxed flex gap-2.5 ${
                insight.type === 'danger' ? 'bg-red-50 border-red-200 text-red-700' :
                insight.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                {insight.type === 'danger'
                  ? <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  : insight.type === 'warning'
                  ? <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  : <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />}
                <p>{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex gap-1 flex-wrap">
          {[['overview', 'Overview'], ['channels', 'Channel Performance'], ['sequences', 'Sequence Performance'], ['campaigns', 'Campaign Dashboard']].map(([val, label]) => (
            <button key={val} onClick={() => setActiveTab(val)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${activeTab === val ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'channels' && (
          <div className="space-y-5">
            {/* Channel comparison bar chart */}
            <div className="glass rounded-xl p-5">
              <h3 className="font-bold text-sm mb-1 text-foreground">Channel Performance Comparison</h3>
              <p className="text-xs text-muted-foreground mb-4">Open Rate, Reply Rate & Meeting Rate by channel</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={channelPerformanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="channel" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="openRate" name="Open Rate %" fill="hsl(197 100% 56%)" radius={3} opacity={0.85} />
                  <Bar dataKey="replyRate" name="Reply Rate %" fill="hsl(142 76% 52%)" radius={3} />
                  <Bar dataKey="meetingRate" name="Meeting Rate %" fill="hsl(38 92% 50%)" radius={3} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Channel summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {channelPerformanceData.map((ch) => (
                <div key={ch.channel} className="glass rounded-xl p-4">
                  <p className="text-sm font-bold text-foreground mb-2">{ch.channel}</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Sent</span><span className="font-medium">{ch.sent.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Open Rate</span><span className="text-cyan-400 font-mono font-bold">{ch.openRate}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Reply Rate</span><span className="text-primary font-mono font-bold">{ch.replyRate}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Meeting Rate</span><span className="text-amber-400 font-mono font-bold">{ch.meetingRate}%</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Time-of-day performance */}
            <div className="glass rounded-xl p-5">
              <h3 className="font-bold text-sm mb-1 text-foreground">Best Time to Send</h3>
              <p className="text-xs text-muted-foreground mb-4">Reply volume by hour of day — schedule sends around peak windows</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={timeOfDayData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="replies" name="Replies" radius={3}>
                    {timeOfDayData.map((entry, index) => (
                      <Cell key={index} fill={entry.replies >= 40 ? 'hsl(142 76% 36%)' : entry.replies >= 25 ? 'hsl(197 100% 40%)' : 'hsl(215 16% 82%)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-muted-foreground mt-2">Green = peak window · Blue = above average · Dark = off-peak</p>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <>
            {/* Campaign Trend Line Chart */}
            <div className="glass rounded-xl p-5">
              <h3 className="font-bold text-sm mb-1 text-foreground">Campaign Performance Trend</h3>
              <p className="text-xs text-muted-foreground mb-4">Weekly — Sent, Opened, Replied, Meetings</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={campaignTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="sent" name="Sent" stroke="hsl(215 20% 55%)" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="opened" name="Opened" stroke="hsl(197 100% 56%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="replied" name="Replied" stroke="hsl(142 76% 52%)" strokeWidth={2.5} dot={{ fill: 'hsl(142 76% 52%)', r: 3 }} />
                  <Line type="monotone" dataKey="meetings" name="Meetings" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Engagement Funnel */}
            <div className="glass rounded-xl p-5">
              <h3 className="font-bold text-sm mb-1 text-foreground">Engagement Funnel</h3>
              <p className="text-xs text-muted-foreground mb-5">Sent → Delivered → Opened → Replied → Meeting</p>
              <div className="space-y-3">
                {funnelStages.map((stage, i) => (
                  <div key={stage.stage} className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground w-20 text-right flex-shrink-0">{stage.stage}</span>
                    <div className="flex-1 bg-secondary rounded-full h-7 overflow-hidden relative">
                      <div className="h-full rounded-full flex items-center justify-between px-3 transition-all duration-500"
                        style={{ width: `${Math.max(stage.pct, 8)}%`, background: stage.color, opacity: 0.85 }}>
                        <span className="text-[11px] font-bold text-black">{stage.value.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-14 text-right">
                      <span className="text-xs font-mono font-bold" style={{ color: stage.color }}>{stage.pct}%</span>
                    </div>
                    {i > 0 && (
                      <div className="w-16 text-right hidden lg:block">
                        <span className="text-[10px] text-muted-foreground">
                          -{(funnelStages[i - 1].pct - stage.pct).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'sequences' && (
          <div className="space-y-4">
            {/* LinkedIn Activity */}
            <div className="glass rounded-xl p-5">
              <LinkedInAnalyticsCard />
            </div>

            {/* Step Performance Bar Chart */}
            <div className="glass rounded-xl p-5">
              <h3 className="font-bold text-sm mb-1 text-foreground">Step-by-Step Performance</h3>
              <p className="text-xs text-muted-foreground mb-4">Fintech CTO Outbound — Nigeria · Sent, Opened, Replied per step</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stepPerformanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="step" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sent" name="Sent" fill="hsl(215 16% 75%)" radius={3} />
                  <Bar dataKey="opened" name="Opened" fill="hsl(197 100% 56%)" radius={3} opacity={0.8} />
                  <Bar dataKey="replied" name="Replied" fill="hsl(142 76% 52%)" radius={3} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Step metrics table */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border/30">
                <h3 className="font-bold text-sm text-foreground">Step Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30">
                      {['Step', 'Sent', 'Opened', 'Open Rate', 'Replied', 'Reply Rate', 'Drop-off'].map(h => (
                        <th key={h} className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stepPerformanceData.map((row, i) => {
                      const openRate = ((row.opened / row.sent) * 100).toFixed(1);
                      const replyRate = ((row.replied / row.sent) * 100).toFixed(1);
                      const isBest = row.replied === Math.max(...stepPerformanceData.map(r => r.replied));
                      return (
                        <tr key={row.step} className="border-b border-border/20 hover:bg-secondary/30">
                          <td className="py-3 px-4 text-xs font-medium text-foreground flex items-center gap-2">
                            {row.step}
                            {isBest && <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 rounded-full font-medium">Best</span>}
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{row.sent}</td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{row.opened}</td>
                          <td className="py-3 px-4 text-xs font-medium text-cyan-400">{openRate}%</td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{row.replied}</td>
                          <td className="py-3 px-4 text-xs font-medium text-primary">{replyRate}%</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs font-medium ${row.dropoff > 30 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                              {row.dropoff}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="glass rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border/30">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">Campaign Dashboard</h3>
                <p className="text-xs text-muted-foreground">
                  Tracking: open, reply, positive reply, meetings · Data from connected integrations
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    {['Campaign', 'Channel', 'Sent', 'Open Rate', 'Reply Rate', '+ve Reply', 'Meetings', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaignTableData.map((row, i) => {
                    const Ch = channelIcon[row.channel] || Mail;
                    return (
                      <tr key={i} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="text-xs font-medium text-foreground truncate max-w-[200px]">{row.name}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className={`flex items-center gap-1 ${channelColor[row.channel]}`}>
                            <Ch className="w-3.5 h-3.5" />
                            <span className="text-xs capitalize">{row.channel}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-muted-foreground">{row.sent}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${row.openRate}%` }} />
                            </div>
                            <span className="text-xs font-mono text-cyan-400">{row.openRate}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${row.replyRate * 3}%` }} />
                            </div>
                            <span className="text-xs font-mono text-primary">{row.replyRate}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-violet-400">{row.positiveReply}%</td>
                        <td className="py-3.5 px-4 text-xs font-bold text-amber-400">{row.meetings}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-border/20">
              <p className="text-[10px] text-muted-foreground">
                * Open and reply tracking require Gmail or Outlook integration. Data shown reflects available tracking signals. Metrics degrade gracefully when integration is not connected.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
