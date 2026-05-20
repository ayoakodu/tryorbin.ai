import { Sparkles, Mail, MessageSquare, TrendingUp, Zap, Circle, ChevronRight, Users, BarChart3, GitBranch, Target, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';

const sidebarItems = [
  { label: 'Home', active: true },
  { label: 'AI Copilot', ai: true },
  { label: 'People' },
  { label: 'Accounts' },
  { label: 'Sequences' },
  { label: 'WhatsApp' },
  { label: 'Campaigns' },
  { label: 'Pipeline' },
  { label: 'Analytics' },
];

const kpis = [
  { label: 'Total Pipeline', value: '$2.4M', change: '+18%', color: 'text-emerald-400', icon: TrendingUp },
  { label: 'Emails Sent', value: '8,903', change: '+12%', color: 'text-cyan-400', icon: Mail },
  { label: 'WA Engaged', value: '1,247', change: '+23%', color: 'text-violet-400', icon: MessageSquare },
  { label: 'Meetings', value: '47', change: '+8%', color: 'text-amber-400', icon: Target },
];

const pipelineStages = [
  { label: 'Prospecting', deals: 47, value: '$420K', color: 'bg-blue-500/20 border-blue-500/30 text-blue-300' },
  { label: 'Qualified', deals: 23, value: '$890K', color: 'bg-violet-500/20 border-violet-500/30 text-violet-300' },
  { label: 'Proposal', deals: 12, value: '$1.2M', color: 'bg-amber-500/20 border-amber-500/30 text-amber-300' },
  { label: 'Negotiation', deals: 6, value: '$680K', color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' },
];

const activityFeed = [
  { icon: Mail, color: 'text-cyan-400', text: 'Amara Diallo opened "Q3 Partnership Opp"', time: '2m ago' },
  { icon: MessageSquare, color: 'text-emerald-400', text: 'WhatsApp reply from Kemi Adeyemi · Yoco', time: '5m ago' },
  { icon: CheckCircle2, color: 'text-amber-400', text: 'Meeting booked — James Osei · Flutterwave', time: '12m ago' },
  { icon: Zap, color: 'text-violet-400', text: 'AI sequence auto-enrolled 14 new leads', time: '18m ago' },
];

const chartBars = [28, 42, 35, 55, 48, 72, 65, 88, 76, 94, 82, 100];
const chartMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function HeroDashboardPreview() {
  return (
    <div className="relative max-w-5xl mx-auto mt-24">
      {/* Browser Chrome */}
      <div className="glass rounded-2xl overflow-hidden border border-border/60 glow-green shadow-2xl" style={{ background: '#0d1424' }}>
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10" style={{ background: '#0a0f1c' }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-primary/50" />
          </div>
          <div className="flex-1 h-6 rounded-md mx-4 flex items-center px-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <span className="text-xs text-slate-400">app.uservnu.io — Early Access Preview</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs text-primary font-medium">In Development</span>
          </div>
        </div>

        {/* App Shell */}
        <div className="flex h-[420px] md:h-[480px] overflow-hidden">

          {/* Sidebar */}
          <div className="hidden md:flex flex-col w-44 border-r border-white/8 flex-shrink-0 py-3 px-2 gap-0.5" style={{ background: '#080d1a' }}>
            {/* Logo */}
            <div className="flex items-center gap-2 px-2 pb-3 mb-1 border-b border-white/8">
              <div className="w-5 h-5 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Zap className="w-3 h-3 text-primary" />
              </div>
              <span className="text-xs font-bold text-white">RVNU</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-semibold">BETA</span>
            </div>
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  item.active
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Circle className={`w-1.5 h-1.5 flex-shrink-0 ${item.active ? 'text-primary fill-primary' : 'text-slate-600'}`} />
                {item.label}
                {item.ai && (
                  <span className="ml-auto text-[9px] px-1 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30 font-semibold">AI</span>
                )}
              </div>
            ))}
            {/* AI Credits */}
            <div className="mt-auto px-2 pt-2 border-t border-white/8">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400">AI Credits</span>
                <span className="text-[10px] text-slate-300 font-medium">730/1000</span>
              </div>
              <div className="w-full h-1 rounded-full bg-white/10">
                <div className="h-1 rounded-full bg-primary" style={{ width: '73%' }} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden flex flex-col" style={{ background: '#0d1424' }}>
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/8 flex-shrink-0" style={{ background: '#0a0f1c' }}>
              <div>
                <p className="text-xs font-semibold text-white leading-none">GTM Dashboard</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Your execution overview — activity, pipeline & AI insights</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 h-6 px-2.5 rounded-md border border-white/10 text-[10px] text-slate-400" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  Search anything...
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] text-primary font-medium">
                  <Sparkles className="w-2.5 h-2.5" /> Ask AI
                </div>
              </div>
            </div>

            {/* Dashboard Body */}
            <div className="flex-1 overflow-hidden p-3 grid grid-cols-12 gap-3">

              {/* Left column */}
              <div className="col-span-12 md:col-span-8 flex flex-col gap-3">

                {/* KPI Cards */}
                <div className="grid grid-cols-4 gap-2">
                  {kpis.map((kpi) => (
                    <div key={kpi.label} className="rounded-xl p-2.5 border border-white/8" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-slate-400 uppercase tracking-wide">{kpi.label}</span>
                        <kpi.icon className={`w-2.5 h-2.5 ${kpi.color}`} />
                      </div>
                      <p className={`text-sm font-bold ${kpi.color}`}>{kpi.value}</p>
                      <p className="text-[9px] text-emerald-400 font-medium mt-0.5 flex items-center gap-0.5">
                        <ArrowUpRight className="w-2 h-2" />{kpi.change} this month
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pipeline Growth Chart */}
                <div className="rounded-xl border border-white/8 p-3 flex-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[11px] font-semibold text-white">Pipeline Growth</p>
                      <p className="text-[9px] text-slate-400">Revenue generated YTD</p>
                    </div>
                    <div className="flex gap-1">
                      {['3M', '6M', 'YTD'].map((t, i) => (
                        <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${i === 2 ? 'bg-primary/20 text-primary border border-primary/30' : 'text-slate-500'}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  {/* Chart */}
                  <div className="flex items-end gap-1 h-20">
                    {chartBars.map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div
                          className="w-full rounded-sm"
                          style={{
                            height: `${(h / 100) * 64}px`,
                            background: i === chartBars.length - 1
                              ? 'rgba(74,222,128,0.8)'
                              : `rgba(74,222,128,${0.15 + (h / 100) * 0.3})`,
                          }}
                        />
                        <span className="text-[7px] text-slate-600">{chartMonths[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insights + Activity Feed row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* AI Revenue Insights */}
                  <div className="rounded-xl border border-primary/20 p-3" style={{ background: 'rgba(74,222,128,0.04)' }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3 h-3 text-primary animate-pulse-glow" />
                      <span className="text-[10px] font-semibold text-primary">AI Revenue Insights</span>
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex gap-2 p-2 rounded-lg border border-amber-500/20" style={{ background: 'rgba(245,158,11,0.06)' }}>
                        <span className="text-[9px] text-amber-300 leading-relaxed">⚠ 3 deals show risk signals — last contact &gt;14 days ago. Suggest personalized follow-up now.</span>
                      </div>
                      <div className="flex gap-2 p-2 rounded-lg border border-primary/20" style={{ background: 'rgba(74,222,128,0.06)' }}>
                        <span className="text-[9px] text-emerald-300 leading-relaxed">✦ Lagos fintech segment shows 34% higher reply rate on WhatsApp vs email this week.</span>
                      </div>
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="rounded-xl border border-white/8 p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-white">GTM Activity Feed</span>
                      <span className="text-[9px] text-primary cursor-pointer">View all</span>
                    </div>
                    <div className="space-y-2">
                      {activityFeed.map((item, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <item.icon className={`w-2.5 h-2.5 mt-0.5 flex-shrink-0 ${item.color}`} />
                          <div className="min-w-0">
                            <p className="text-[9px] text-slate-300 leading-tight truncate">{item.text}</p>
                            <p className="text-[8px] text-slate-500 mt-0.5">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="hidden md:flex md:col-span-4 flex-col gap-3">

                {/* Pipeline Stages */}
                <div className="rounded-xl border border-white/8 p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-white">Pipeline Stages</span>
                  </div>
                  <div className="space-y-1.5">
                    {pipelineStages.map((stage) => (
                      <div key={stage.label} className={`flex items-center justify-between rounded-lg px-2.5 py-2 border ${stage.color}`}>
                        <div>
                          <p className="text-[10px] font-medium">{stage.label}</p>
                          <p className="text-[9px] opacity-70">{stage.deals} deals</p>
                        </div>
                        <span className="text-[10px] font-bold">{stage.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center mt-2 gap-1 text-[9px] text-slate-500 cursor-pointer hover:text-primary transition-colors">
                    View Full Pipeline <ChevronRight className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Active Sequences */}
                <div className="rounded-xl border border-white/8 p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <GitBranch className="w-3 h-3 text-violet-400" />
                    <span className="text-[10px] font-semibold text-white">Active Sequences</span>
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">12 live</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Lagos Fintech CTOs', channel: 'Email + WA', progress: 74, enrolled: 142 },
                      { name: 'Kenya SMB Outbound', channel: 'LinkedIn', progress: 51, enrolled: 89 },
                      { name: 'SA Enterprise Q3', channel: 'Multi-channel', progress: 38, enrolled: 56 },
                    ].map((seq) => (
                      <div key={seq.name}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[9px] text-slate-300 font-medium truncate">{seq.name}</span>
                          <span className="text-[8px] text-slate-500 flex-shrink-0 ml-1">{seq.enrolled} enrolled</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1 rounded-full bg-white/10">
                            <div className="h-1 rounded-full bg-primary/70" style={{ width: `${seq.progress}%` }} />
                          </div>
                          <span className="text-[8px] text-slate-400">{seq.progress}%</span>
                        </div>
                        <span className="text-[8px] text-slate-500">{seq.channel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Follow-up Suggestion */}
                <div className="rounded-xl border border-primary/25 p-3 flex-1" style={{ background: 'rgba(74,222,128,0.05)' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3 h-3 text-primary animate-pulse-glow" />
                    <span className="text-[10px] font-semibold text-primary">AI Suggestion</span>
                  </div>
                  <p className="text-[9px] text-slate-300 leading-relaxed mb-2">
                    "Send a personalized WhatsApp follow-up to <span className="text-white font-semibold">Amara Diallo</span> at Paystack — she opened your email 3x but hasn't replied."
                  </p>
                  <div className="flex gap-1.5">
                    <div className="flex-1 py-1 rounded-md bg-primary/15 border border-primary/30 text-[9px] text-primary text-center font-semibold cursor-pointer">Send Now</div>
                    <div className="flex-1 py-1 rounded-md border border-white/10 text-[9px] text-slate-400 text-center cursor-pointer">Later</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground/50 mt-3">Illustrative preview — RVNU is currently in active development.</p>
    </div>
  );
}