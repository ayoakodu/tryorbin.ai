import { Sparkles, Home, Users, List, Mail, Phone, MessageSquare, Megaphone, Radio, CheckSquare, BarChart3, Zap, GitBranch, Settings, Link2, TrendingUp, ChevronRight, Search, Bell, ArrowUpRight } from 'lucide-react';

const kpis = [
  { label: 'TOTAL PIPELINE', value: '$2.4M', change: '+18% this month', icon: '💲', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { label: 'CONTACTS ADDED', value: '1,247', change: '+23% this month', icon: '👤', iconBg: 'bg-purple-50', iconColor: 'text-purple-500' },
  { label: 'EMAILS SENT', value: '8,903', change: '+12% this month', icon: '✉', iconBg: 'bg-blue-50', iconColor: 'text-blue-400' },
  { label: 'MEETINGS BOOKED', value: '47', change: '+8% this month', icon: '📅', iconBg: 'bg-orange-50', iconColor: 'text-orange-400' },
];

const pipelineStages = [
  { label: 'Prospecting', deals: '47 deals', value: '$420K', bg: 'bg-blue-50', labelColor: 'text-blue-600', valueColor: 'text-blue-700' },
  { label: 'Qualified', deals: '23 deals', value: '$890K', bg: 'bg-purple-50', labelColor: 'text-purple-600', valueColor: 'text-purple-700' },
  { label: 'Proposal', deals: '12 deals', value: '$1.2M', bg: 'bg-yellow-50', labelColor: 'text-yellow-700', valueColor: 'text-yellow-700' },
  { label: 'Negotiation', deals: '6 deals', value: '$680K', bg: 'bg-green-50', labelColor: 'text-green-700', valueColor: 'text-green-700' },
];

const activityFeed = [
  { dot: 'bg-gray-400', text: 'Amara Diallo opened your email "Q3 Partnership Opportunity"', time: '2m ago' },
  { dot: 'bg-gray-400', text: 'New meeting booked with Kemi Adeyemi — Yoco (Tomorrow 10am)', time: '14m ago' },
  { dot: 'bg-gray-400', text: 'Deal moved to Negotiation: Flutterwave Enterprise Q3', time: '31m ago' },
];

// SVG line chart points — mimics the growing curve in the screenshot
const chartPoints = [
  [0, 85], [50, 82], [100, 78], [150, 72], [200, 65], [250, 55],
  [300, 48], [350, 38], [400, 28], [450, 18], [490, 8],
];

const pointsStr = chartPoints.map(([x, y]) => `${x},${y}`).join(' ');
const areaStr = `M0,95 ` + chartPoints.map(([x, y]) => `L${x},${y}`).join(' ') + ` L490,95 Z`;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

export default function HeroDashboardPreview() {
  return (
    <div className="relative max-w-5xl mx-auto mt-16">
      {/* Browser Chrome */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 glow-green-sm">
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 bg-gray-100">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 h-5 rounded-md mx-4 flex items-center px-3 bg-white border border-gray-200">
            <span className="text-[10px] text-gray-400">app.uservnu.io</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-50 border border-green-200">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-700 font-medium">Preview</span>
          </div>
        </div>

        {/* App Shell */}
        <div className="flex h-[460px] overflow-hidden bg-gray-50">

          {/* Sidebar */}
          <div className="hidden md:flex flex-col w-40 bg-white border-r border-gray-100 flex-shrink-0 py-3 px-2">
            {/* Logo */}
            <div className="flex items-center gap-1.5 px-2 pb-3 mb-2 border-b border-gray-100">
              <div className="w-5 h-5 rounded flex items-center justify-center bg-green-500">
                <span className="text-white font-black text-[8px]">RV</span>
              </div>
              <span className="text-[11px] font-bold text-gray-800">RVNU</span>
              <span className="ml-auto text-[7px] px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-semibold border border-gray-200">BETA</span>
            </div>

            {/* Nav */}
            <div className="space-y-0.5 flex-1">
              {/* Home - active */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-green-50 border border-green-100">
                <Home className="w-3 h-3 text-green-600" />
                <span className="text-[10px] font-semibold text-green-700">Home</span>
              </div>
              {/* AI Copilot */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md">
                <Sparkles className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-500">AI Copilot</span>
                <span className="ml-auto text-[7px] px-1 py-0.5 rounded bg-violet-100 text-violet-600 font-semibold">AI</span>
              </div>

              <p className="text-[8px] uppercase tracking-widest text-gray-300 px-2 pt-1.5 pb-0.5">Prospect</p>
              {/** @type {Array<[string, React.ElementType]>} */}
              {[['People', Users], ['Accounts', BarChart3], ['Lists', List]].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50">
                  <Icon className="w-2.5 h-2.5 text-gray-400" />
                  <span className="text-[10px] text-gray-500">{label}</span>
                </div>
              ))}

              <p className="text-[8px] uppercase tracking-widest text-gray-300 px-2 pt-1.5 pb-0.5">Engagement</p>
              {[['Sequences', GitBranch], ['Emails', Mail], ['Calls', Phone], ['WhatsApp', MessageSquare], ['Campaigns', Megaphone], ['Broadcasts', Radio], ['Tasks', CheckSquare]].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50">
                  <Icon className="w-2.5 h-2.5 text-gray-400" />
                  <span className="text-[10px] text-gray-500">{label}</span>
                </div>
              ))}

              <p className="text-[8px] uppercase tracking-widest text-gray-300 px-2 pt-1.5 pb-0.5">Intelligence</p>
              {[['Analytics', BarChart3], ['Automations', Zap]].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50">
                  <Icon className="w-2.5 h-2.5 text-gray-400" />
                  <span className="text-[10px] text-gray-500">{label}</span>
                </div>
              ))}

              <p className="text-[8px] uppercase tracking-widest text-gray-300 px-2 pt-1.5 pb-0.5">Pipeline & Workspace</p>
              <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50">
                <TrendingUp className="w-2.5 h-2.5 text-gray-400" />
                <span className="text-[10px] text-gray-500">Pipeline</span>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-100 pt-2 space-y-0.5">
              {[['Integrations', Link2], ['Settings', Settings]].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-2 px-2 py-1 rounded-md">
                  <Icon className="w-2.5 h-2.5 text-gray-400" />
                  <span className="text-[10px] text-gray-500">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 px-2 py-1 rounded-md">
                <Sparkles className="w-2.5 h-2.5 text-green-500" />
                <span className="text-[10px] text-gray-600 font-medium">AI Credits</span>
              </div>
              <div className="px-2">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[8px] text-gray-400">730 / 1000 used</span>
                </div>
                <div className="w-full h-1 rounded-full bg-gray-100">
                  <div className="h-1 rounded-full bg-green-400" style={{ width: '73%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-100 flex-shrink-0">
              <div>
                <p className="text-xs font-bold text-gray-800 leading-none">GTM Dashboard</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Your execution overview — activity, pipeline & AI insights</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 h-6 px-2.5 rounded-md border border-gray-200 bg-white text-[10px] text-gray-400">
                  <Search className="w-2.5 h-2.5" /> Search anything...
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 border border-green-200 text-[10px] text-green-700 font-semibold">
                  <Sparkles className="w-2.5 h-2.5" /> Ask AI
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bell className="w-3 h-3 text-gray-400" />
                </div>
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">JD</span>
                </div>
              </div>
            </div>

            {/* Dashboard Body */}
            <div className="flex-1 overflow-hidden p-3 grid grid-cols-12 gap-3">

              {/* Left column (8 cols) */}
              <div className="col-span-12 md:col-span-8 flex flex-col gap-3">

                {/* KPI Cards */}
                <div className="grid grid-cols-4 gap-2">
                  {kpis.map((kpi) => (
                    <div key={kpi.label} className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[8px] text-gray-400 font-semibold tracking-wide">{kpi.label}</span>
                        <div className={`w-5 h-5 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
                          <span className="text-[9px]">{kpi.icon}</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-800">{kpi.value}</p>
                      <p className="text-[9px] text-green-600 font-medium mt-0.5 flex items-center gap-0.5">
                        <ArrowUpRight className="w-2 h-2" />{kpi.change}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pipeline Growth Chart */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[11px] font-bold text-gray-800">Pipeline Growth</p>
                      <p className="text-[9px] text-gray-400">Revenue generated YTD</p>
                    </div>
                    <div className="flex gap-1">
                      {['3M', '6M', 'YTD'].map((t, i) => (
                        <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded font-medium cursor-pointer ${i === 2 ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* SVG Line Chart */}
                  <div className="relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-20 flex flex-col justify-between text-[7px] text-gray-300 pr-1">
                      {['2400K', '1800K', '1200K', '600K', '$0K'].map(l => <span key={l}>{l}</span>)}
                    </div>
                    <div className="pl-8">
                      <svg viewBox="0 0 490 95" className="w-full h-20" preserveAspectRatio="none">
                        {/* Grid lines */}
                        {[0, 23, 47, 70, 95].map(y => (
                          <line key={y} x1="0" y1={y} x2="490" y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
                        ))}
                        {/* Area fill */}
                        <path d={areaStr} fill="rgba(74,222,128,0.08)" />
                        {/* Line */}
                        <polyline
                          points={pointsStr}
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                        {/* End dot */}
                        <circle cx="490" cy="8" r="3" fill="#22c55e" />
                      </svg>
                      {/* X-axis labels */}
                      <div className="flex justify-between mt-0.5">
                        {months.map(m => <span key={m} className="text-[7px] text-gray-300">{m}</span>)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights + Activity Feed row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* AI Revenue Insights */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Sparkles className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-700">AI Revenue Insights</span>
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                    <div className="flex gap-2 p-2 rounded-lg border border-amber-100 bg-amber-50">
                      <div className="w-4 h-4 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-[8px]">⚠</span>
                      </div>
                      <span className="text-[9px] text-gray-600 leading-relaxed">3 deals show risk signals — last contact &gt;14 days ago. Suggest sending a personalized follow-up now.</span>
                    </div>
                  </div>

                  {/* GTM Activity Feed */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-700">GTM Activity Feed</span>
                      <span className="text-[9px] text-green-600 cursor-pointer font-medium">View all</span>
                    </div>
                    <div className="space-y-2">
                      {activityFeed.map((item, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-[9px] text-gray-600 leading-tight">{item.text}</p>
                            <p className="text-[8px] text-gray-400 mt-0.5">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column (4 cols) */}
              <div className="hidden md:flex md:col-span-4 flex-col gap-3">

                {/* Pipeline Stages */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex-1">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold text-gray-800">Pipeline Stages</span>
                  </div>
                  <div className="space-y-2">
                    {pipelineStages.map((stage) => (
                      <div key={stage.label} className={`flex items-center justify-between rounded-lg px-2.5 py-2 ${stage.bg}`}>
                        <div>
                          <p className={`text-[10px] font-semibold ${stage.labelColor}`}>{stage.label}</p>
                          <p className="text-[9px] text-gray-400">{stage.deals}</p>
                        </div>
                        <span className={`text-[11px] font-bold ${stage.valueColor}`}>{stage.value}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full flex items-center justify-center mt-3 gap-1 text-[9px] text-gray-400 hover:text-green-600 transition-colors border-t border-gray-50 pt-2">
                    View Full Pipeline <ChevronRight className="w-2.5 h-2.5" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-slate-500/50 mt-3">Illustrative preview — RVNU is currently in active development.</p>
    </div>
  );
}