import {
  Sparkles, Home, Users, List, Mail, Phone, MessageSquare, Megaphone, Radio,
  CheckSquare, BarChart3, Zap, GitBranch, Settings, Link2, TrendingUp,
  Brain, Play, Clock, AlertTriangle, CheckCircle2, Flame, Star, Shield,
  DollarSign, Calendar, ArrowUpRight, Filter, Search, Bell, ChevronRight
} from 'lucide-react';
import OrbinAILogo from '@/components/ui/OrbinAILogo.jsx';

/* ── Layer 0: Live Operation tiles ── */
const WORKFLOWS = [
  { label: 'Active Sequences', value: '12', sub: '3,840 prospects',   icon: Play,          color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500', pulse: true },
  { label: 'AI Optimizing',    value: '4',  sub: 'auto-tuning',        icon: Brain,         color: 'text-violet-600',  bg: 'bg-violet-50',  dot: 'bg-violet-400',  pulse: true },
  { label: 'Awaiting Approval',value: '2',  sub: 'AI drafts ready',    icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-50',   dot: 'bg-amber-400',   pulse: false },
  { label: 'Buying Signals',   value: '47', sub: 'detected today',     icon: TrendingUp,    color: 'text-orange-600',  bg: 'bg-orange-50',  dot: 'bg-orange-500',  pulse: true },
  { label: 'Delivery Risk',    value: '1',  sub: 'DMARC issue',        icon: AlertTriangle, color: 'text-red-500',     bg: 'bg-red-50',     dot: 'bg-red-500',     pulse: false },
  { label: 'Follow-Ups',       value: '83', sub: 'next 48h',           icon: CheckCircle2,  color: 'text-cyan-600',    bg: 'bg-cyan-50',    dot: 'bg-cyan-400',    pulse: false },
];

/* ── Layer 1: Next Best Actions ── */
const ACTIONS = [
  { urgency: 'critical', color: 'text-red-500',     bg: 'bg-red-50',     icon: Flame,    label: 'Critical',    title: 'Follow up with 3 stalled enterprise deals',          impact: '$272K at risk',    cta: 'Execute',    ctaStyle: 'bg-red-500 text-white' },
  { urgency: 'high',     color: 'text-orange-500',  bg: 'bg-orange-50',  icon: Star,     label: 'High Intent',  title: 'Prioritize 47 pricing-page revisitors',              impact: '47 prospects',     cta: 'Prioritize', ctaStyle: 'bg-orange-500 text-white' },
  { urgency: 'high',     color: 'text-emerald-600', bg: 'bg-emerald-50', icon: MessageSquare, label: 'Opportunity', title: 'Launch WhatsApp follow-up for 14 non-responders', impact: '+18% reply rate', cta: 'Launch',     ctaStyle: 'bg-emerald-600 text-white' },
];

/* ── Layer 2: AI Intelligence cards ── */
const INSIGHTS = [
  { severity: 'critical',    icon: AlertTriangle, color: 'text-red-500',     bg: 'bg-red-50',     badge: 'Critical',    badgeColor: 'bg-red-50 text-red-500',      title: '3 enterprise deals showing risk signals',              impact: '$272K at risk' },
  { severity: 'warning',     icon: TrendingUp,    color: 'text-amber-500',   bg: 'bg-amber-50',   badge: 'Warning',     badgeColor: 'bg-amber-50 text-amber-600',  title: 'Reply rates dropped 12% in fintech sequences',          impact: '2 sequences' },
  { severity: 'opportunity', icon: Zap,           color: 'text-violet-500',  bg: 'bg-violet-50',  badge: 'High Intent', badgeColor: 'bg-violet-50 text-violet-600',title: '47 contacts revisited pricing pages in 24h',            impact: '47 prospects' },
  { severity: 'insight',     icon: Brain,         color: 'text-cyan-500',    bg: 'bg-cyan-50',    badge: 'AI Ready',    badgeColor: 'bg-cyan-50 text-cyan-600',    title: 'Re-engagement sequence ready for 67 cold contacts',     impact: '67 contacts' },
];

/* ── Layer 3: Performance KPIs ── */
const KPIS = [
  { label: 'Pipeline',    value: '$2.4M', change: '+18%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Contacts',   value: '1,247', change: '+23%', icon: Users,      color: 'text-cyan-500',    bg: 'bg-cyan-50' },
  { label: 'Emails Sent',value: '8,903', change: '+12%', icon: Mail,       color: 'text-violet-500',  bg: 'bg-violet-50' },
  { label: 'Meetings',   value: '47',    change: '+8%',  icon: Calendar,   color: 'text-amber-500',   bg: 'bg-amber-50' },
];

const PIPELINE_STAGES = [
  { name: 'Prospecting', value: '$420K', pct: 100, color: '#2563eb' },
  { name: 'Qualified',   value: '$890K', pct: 75,  color: '#7c3aed' },
  { name: 'Proposal',    value: '$1.2M', pct: 55,  color: '#d97706' },
  { name: 'Negotiation', value: '$680K', pct: 35,  color: '#16a34a' },
];

/* SVG mini line chart */
const chartPts = [[0,80],[55,72],[110,68],[165,58],[220,47],[275,38],[330,28],[385,18],[440,9],[490,4]];
const lineStr  = chartPts.map(([x,y]) => `${x},${y}`).join(' ');
const areaStr  = `M0,90 ${chartPts.map(([x,y]) => `L${x},${y}`).join(' ')} L490,90 Z`;

/* ── Layer 4: Activity Feed items ── */
const ACTIVITIES = [
  { icon: Flame,    color: 'text-red-500',    bg: 'bg-red-50',    badge: 'Buying Signal', badgeColor: 'text-red-500',    headline: 'High-intent engagement detected',     time: '2m ago',  urgentLeft: true },
  { icon: Calendar, color: 'text-cyan-600',   bg: 'bg-cyan-50',   badge: 'Meeting',       badgeColor: 'text-cyan-600',   headline: 'Inbound meeting booked from outreach', time: '14m ago', urgentLeft: false },
  { icon: DollarSign,color:'text-violet-600', bg: 'bg-violet-50', badge: 'Pipeline',      badgeColor: 'text-violet-600', headline: 'Deal velocity accelerating',           time: '1h ago',  urgentLeft: false },
];

export default function HeroDashboardPreview() {
  return (
    <div className="relative max-w-5xl mx-auto mt-16">
      {/* Browser chrome */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 glow-green-sm">

        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-100 flex-shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 h-5 rounded-md mx-4 flex items-center px-3 bg-white border border-gray-200">
            <span className="text-[10px] text-gray-400">app.tryorbin.ai/dashboard</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-50 border border-green-200">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-700 font-medium">Live</span>
          </div>
        </div>

        {/* App shell */}
        <div className="flex bg-slate-50" style={{ height: 560 }}>

          {/* ── Sidebar ── */}
          <div className="hidden md:flex flex-col w-36 bg-white border-r border-slate-100 flex-shrink-0 py-3 px-2">
            {/* Logo */}
            <div className="flex items-center px-1 pb-3 mb-2 border-b border-slate-100" style={{ gap: 0 }}>
              <OrbinAILogo size={40} className="rounded flex-shrink-0" />
              <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap" style={{ marginLeft: '-11px' }}>Orbin</span>
              <span className="ml-auto text-[7px] px-1 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold border border-slate-200">BETA</span>
            </div>

            <div className="space-y-0.5 flex-1 overflow-hidden">
              {/* Home — active */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-emerald-50 border border-emerald-100">
                <Home className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] font-semibold text-emerald-700">Home</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md">
                <Sparkles className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] text-slate-500">AI Copilot</span>
                <span className="ml-auto text-[7px] px-1 py-0.5 rounded bg-violet-100 text-violet-600 font-semibold">AI</span>
              </div>

              <p className="text-[8px] uppercase tracking-widest text-slate-300 px-2 pt-2 pb-0.5">Prospect</p>
              {[['People', Users], ['Accounts', BarChart3], ['Lists', List]].map(([lbl, Icon]) => (
                <div key={lbl} className="flex items-center gap-2 px-2 py-1 rounded-md">
                  <Icon className="w-2.5 h-2.5 text-slate-400" />
                  <span className="text-[10px] text-slate-500">{lbl}</span>
                </div>
              ))}

              <p className="text-[8px] uppercase tracking-widest text-slate-300 px-2 pt-2 pb-0.5">Engagement</p>
              {[['Sequences', GitBranch], ['Emails', Mail], ['WhatsApp', MessageSquare], ['Campaigns', Megaphone], ['Tasks', CheckSquare]].map(([lbl, Icon]) => (
                <div key={lbl} className="flex items-center gap-2 px-2 py-1 rounded-md">
                  <Icon className="w-2.5 h-2.5 text-slate-400" />
                  <span className="text-[10px] text-slate-500">{lbl}</span>
                </div>
              ))}

              <p className="text-[8px] uppercase tracking-widest text-slate-300 px-2 pt-2 pb-0.5">Intelligence</p>
              {[['Analytics', BarChart3], ['Automations', Zap]].map(([lbl, Icon]) => (
                <div key={lbl} className="flex items-center gap-2 px-2 py-1 rounded-md">
                  <Icon className="w-2.5 h-2.5 text-slate-400" />
                  <span className="text-[10px] text-slate-500">{lbl}</span>
                </div>
              ))}

              <p className="text-[8px] uppercase tracking-widest text-slate-300 px-2 pt-2 pb-0.5">Pipeline</p>
              <div className="flex items-center gap-2 px-2 py-1 rounded-md">
                <TrendingUp className="w-2.5 h-2.5 text-slate-400" />
                <span className="text-[10px] text-slate-500">Pipeline</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-2 space-y-0.5">
              {[['Integrations', Link2], ['Settings', Settings]].map(([lbl, Icon]) => (
                <div key={lbl} className="flex items-center gap-2 px-2 py-1 rounded-md">
                  <Icon className="w-2.5 h-2.5 text-slate-400" />
                  <span className="text-[10px] text-slate-500">{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* TopBar */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-slate-100 flex-shrink-0" style={{ height: 40 }}>
              <div>
                <p className="text-[11px] font-bold text-slate-800 leading-none">GTM Command Center</p>
                <p className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                  AI operational · just now
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 h-5 px-2 rounded-md border border-slate-200 bg-white text-[9px] text-slate-400">
                  <Search className="w-2 h-2" /> Search anything...
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[9px] text-emerald-700 font-semibold">
                  <Sparkles className="w-2 h-2" /> Ask Orbin
                </div>
                <div className="relative">
                  <Bell className="w-3 h-3 text-slate-400" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="text-white text-[7px] font-bold">JD</span>
                </div>
              </div>
            </div>

            {/* Dashboard body — scrollable layers */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">

              {/* ── LAYER 0: Live Operations ── */}
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Live Operations</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {WORKFLOWS.map((w) => {
                    const Icon = w.icon;
                    return (
                      <div key={w.label} className="rounded-xl border border-slate-200 bg-white px-2 py-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 ${w.bg}`}>
                            <Icon className={`w-2.5 h-2.5 ${w.color}`} />
                          </div>
                          <span className={`w-1 h-1 rounded-full ${w.dot} ${w.pulse ? 'animate-pulse' : ''}`} />
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-none mb-0.5">{w.value}</p>
                        <p className="text-[8px] font-semibold text-slate-600 leading-tight">{w.label}</p>
                        <p className="text-[8px] text-slate-400 leading-tight mt-0.5">{w.sub}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── LAYER 1: Next Best Actions ── */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100"
                  style={{ background: 'linear-gradient(to right,#fff 60%,rgba(245,243,255,0.4))' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-sm">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-900">Next Best Actions</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600 border border-violet-200">6 queued</span>
                  </div>
                  <span className="text-[9px] text-slate-400">AI-prioritized · Sorted by impact</span>
                </div>
                {/* Rows */}
                <div className="divide-y divide-slate-50">
                  {ACTIONS.map((a) => {
                    const Icon = a.icon;
                    return (
                      <div key={a.title} className={`flex items-center gap-2 px-3 py-2 ${a.urgency === 'critical' ? 'border-l-2 border-l-red-400' : ''}`}>
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${a.bg}`}>
                          <Icon className={`w-3.5 h-3.5 ${a.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold text-slate-800 leading-snug truncate">{a.title}</p>
                          <span className={`text-[8px] font-bold px-1 py-0.5 rounded border ${a.urgency === 'critical' ? 'bg-red-50 text-red-500 border-red-200' : a.urgency === 'high' ? 'bg-orange-50 text-orange-500 border-orange-200' : 'bg-violet-50 text-violet-600 border-violet-200'}`}>{a.label}</span>
                          <span className="text-[8px] text-slate-400 ml-1">{a.impact}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${a.ctaStyle}`}>{a.cta}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── LAYER 2: AI Intelligence ── */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100"
                  style={{ background: 'linear-gradient(to right,#fff 50%,rgba(240,253,244,0.5))' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-sm">
                      <Brain className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-900">AI Intelligence</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-slate-400">monitoring continuously</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-emerald-200 text-[9px] font-semibold text-emerald-600 bg-emerald-50">
                    <Sparkles className="w-2.5 h-2.5" /> Ask Orbin AI
                  </div>
                </div>
                <div className="p-2.5 grid grid-cols-2 gap-2">
                  {INSIGHTS.map((ins) => {
                    const Icon = ins.icon;
                    return (
                      <div key={ins.title} className={`rounded-xl border p-2.5 ${ins.severity === 'critical' ? 'border-red-100 bg-red-50/20 border-l-2 border-l-red-400' : ins.severity === 'warning' ? 'border-amber-100 bg-amber-50/15' : 'border-slate-100 bg-slate-50/40'}`}>
                        <div className="flex items-start gap-2">
                          <div className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 ${ins.bg} border-transparent`}>
                            <Icon className={`w-3 h-3 ${ins.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <span className={`text-[8px] font-bold px-1 py-0.5 rounded border ${ins.badgeColor} border-current/20`}>{ins.badge}</span>
                              <span className="text-[8px] text-slate-400">{ins.impact}</span>
                            </div>
                            <p className="text-[10px] font-semibold text-slate-800 leading-snug line-clamp-2">{ins.title}</p>
                            <button className="mt-1.5 text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5">
                              Take Action <ChevronRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── LAYER 3: Performance ── */}
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Performance · Supporting metrics · Pipeline · Activity</p>
                {/* KPI strip */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {KPIS.map((k) => {
                    const Icon = k.icon;
                    return (
                      <div key={k.label} className="rounded-xl p-3 bg-white border border-slate-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[8px] text-slate-400 uppercase tracking-wider font-semibold">{k.label}</span>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center ${k.bg}`}>
                            <Icon className={`w-2.5 h-2.5 ${k.color}`} />
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-none mb-0.5">{k.value}</p>
                        <div className="flex items-center gap-0.5">
                          <TrendingUp className="w-2 h-2 text-emerald-500" />
                          <span className="text-[8px] font-semibold text-emerald-500">{k.change}</span>
                          <span className="text-[8px] text-slate-400"> / month</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Pipeline Growth mini chart */}
                  <div className="col-span-2 rounded-xl p-3 bg-white border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-[10px] font-bold text-slate-700">Pipeline Growth</p>
                        <p className="text-[8px] text-slate-400">Revenue YTD</p>
                      </div>
                      <div className="flex gap-1">
                        {['3M','6M','YTD'].map((t,i)=>(
                          <span key={t} className={`text-[8px] px-1.5 py-0.5 rounded font-semibold ${i===2?'bg-emerald-50 text-emerald-600 border border-emerald-200':'text-slate-400'}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <svg viewBox="0 0 490 90" className="w-full h-14" preserveAspectRatio="none">
                      {[0,22,45,67,90].map(y=>(
                        <line key={y} x1="0" y1={y} x2="490" y2={y} stroke="#f1f5f9" strokeWidth="0.8"/>
                      ))}
                      <path d={areaStr} fill="rgba(74,222,128,0.1)"/>
                      <polyline points={lineStr} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
                      <circle cx="490" cy="4" r="3" fill="#22c55e"/>
                    </svg>
                  </div>

                  {/* Pipeline Stages */}
                  <div className="rounded-xl p-3 bg-white border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-700 mb-2">Pipeline Stages</p>
                    <div className="space-y-2">
                      {PIPELINE_STAGES.map(s=>(
                        <div key={s.name}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[8px] font-semibold" style={{ color: s.color }}>{s.name}</span>
                            <span className="text-[8px] font-bold" style={{ color: s.color }}>{s.value}</span>
                          </div>
                          <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color, opacity: 0.6 }}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── LAYER 4: GTM Execution Stream ── */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-800">GTM Execution Stream</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5">View all <ChevronRight className="w-2.5 h-2.5"/></span>
                </div>
                {/* Filter strip */}
                <div className="flex items-center gap-1 px-3 py-1.5 border-b border-slate-50 overflow-hidden">
                  <Filter className="w-2.5 h-2.5 text-slate-300 flex-shrink-0" />
                  {['All','Signals','Meetings','LinkedIn','Pipeline','AI','Alerts'].map((f,i)=>(
                    <span key={f} className={`px-2 py-0.5 rounded-lg text-[8px] font-semibold whitespace-nowrap ${i===0?'bg-emerald-50 text-emerald-600 border border-emerald-200':'text-slate-400'}`}>{f}</span>
                  ))}
                </div>
                {/* Activity rows */}
                <div className="divide-y divide-slate-50">
                  {ACTIVITIES.map((a)=>{
                    const Icon = a.icon;
                    return (
                      <div key={a.headline} className={`flex items-start gap-2 px-3 py-2.5 ${a.urgentLeft?'border-l-2 border-l-red-400':''}`}>
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${a.bg} border-transparent`}>
                          <Icon className={`w-3 h-3 ${a.color}`}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <p className="text-[10px] font-bold text-slate-700 leading-tight truncate">{a.headline}</p>
                            <span className={`text-[8px] font-bold px-1 py-0.5 rounded flex-shrink-0 ${a.bg} ${a.badgeColor}`}>{a.badge}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] text-slate-300 flex-shrink-0">{a.time}</span>
                            <span className={`text-[9px] font-semibold flex items-center gap-0.5 ${a.color}`}>
                              Follow Up <ArrowUpRight className="w-2.5 h-2.5"/>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>{/* end dashboard body */}
          </div>{/* end main content */}
        </div>{/* end app shell */}
      </div>{/* end browser chrome */}

      <p className="text-center text-xs text-slate-500/50 mt-3">Illustrative preview — Orbin is currently in active development.</p>
    </div>
  );
}