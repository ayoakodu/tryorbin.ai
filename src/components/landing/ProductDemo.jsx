import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Mail, GitBranch, BarChart3, CheckCircle2,
  Sparkles, ChevronRight, Users, Target, TrendingUp,
  Play, Calendar, Clock, AlertCircle, Send, Star, Filter
} from 'lucide-react';

const STEPS = [
  {
    id: 'discover',
    icon: Search,
    label: 'Discover',
    title: 'Find your ideal prospects',
    description: 'AI surfaces high-fit leads across African and emerging markets — enriched with firmographic data and intent signals.',
  },
  {
    id: 'sequence',
    icon: GitBranch,
    label: 'Sequence',
    title: 'Build personalised outreach sequences',
    description: 'Orchestrate email, WhatsApp, and LinkedIn touchpoints with AI-drafted messaging tailored to each prospect.',
  },
  {
    id: 'pipeline',
    icon: Target,
    label: 'Pipeline',
    title: 'Manage your revenue pipeline',
    description: 'Track every deal from first touch to close in a unified workspace built for GTM teams.',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics',
    title: 'Measure what drives revenue',
    description: 'Campaign performance, engagement metrics, and pipeline velocity — all in one dashboard.',
  },
];

const DEMO_CONTACTS = [
  { name: 'Amara Diallo', company: 'Flutterwave', role: 'VP Revenue', fit: 98, intent: 'High', status: 'Contacted' },
  { name: 'Tunde Okafor', company: 'Paystack', role: 'CTO', fit: 94, intent: 'High', status: 'Replied' },
  { name: 'Chisom Eze', company: 'Interswitch', role: 'Head of Sales', fit: 91, intent: 'Medium', status: 'New' },
  { name: 'Yewande Adeyemi', company: 'Kuda Bank', role: 'CEO', fit: 89, intent: 'Medium', status: 'New' },
  { name: 'David Mensah', company: 'MTN Ghana', role: 'CMO', fit: 85, intent: 'Low', status: 'New' },
];

const DEMO_EMAILS = [
  { day: 'Day 1', type: 'Email', subject: 'Quick question about your outbound motion', status: 'Sent', opens: 4 },
  { day: 'Day 3', type: 'LinkedIn', subject: 'Connection request + note', status: 'Pending', opens: null },
  { day: 'Day 6', type: 'Email', subject: 'Re: thought this would be useful', status: 'Draft', opens: null },
  { day: 'Day 10', type: 'WhatsApp', subject: 'Quick check-in', status: 'Draft', opens: null },
  { day: 'Day 14', type: 'Email', subject: 'Closing the loop', status: 'Draft', opens: null },
];

const DEAL_STAGES = [
  { label: 'Prospecting', deals: [{ name: 'Flutterwave', value: '$24k', days: 2 }, { name: 'Interswitch', value: '$18k', days: 5 }] },
  { label: 'Qualifying', deals: [{ name: 'Paystack', value: '$31k', days: 8 }, { name: 'Kuda Bank', value: '$12k', days: 3 }] },
  { label: 'Demo', deals: [{ name: 'MTN Ghana', value: '$55k', days: 14 }] },
  { label: 'Proposal', deals: [{ name: 'Jumia', value: '$42k', days: 7 }] },
];

const CAMPAIGN_STATS = [
  { label: 'Open Rate', value: '38.4%', delta: '+4.2%', up: true, color: '#3b82f6' },
  { label: 'Reply Rate', value: '9.3%', delta: '+1.1%', up: true, color: '#10b981' },
  { label: 'Meetings Booked', value: '14', delta: '+3', up: true, color: '#8b5cf6' },
  { label: 'Pipeline Added', value: '$182k', delta: '+22%', up: true, color: '#f59e0b' },
];

const BAR_DATA = [42, 58, 71, 53, 89, 34, 61];
const BAR_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function DiscoverPane() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Fintech CTOs hiring in Nigeria · Series B+</span>
        </div>
        <div className="flex items-center gap-1 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium">
          <Sparkles className="w-3 h-3" /> AI Filter
        </div>
      </div>
      {DEMO_CONTACTS.map((c, i) => (
        <motion.div key={c.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
          onClick={() => setSelected(selected === i ? null : i)}
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected === i ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-white">{c.name[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800">{c.name}</p>
            <p className="text-[10px] text-slate-500">{c.role} · {c.company}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-[10px] text-slate-400">Fit score</p>
              <p className="text-xs font-bold text-emerald-600">{c.fit}%</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.intent === 'High' ? 'bg-red-50 text-red-600' : c.intent === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{c.intent}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.status === 'Replied' ? 'bg-emerald-50 text-emerald-700' : c.status === 'Contacted' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{c.status}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SequencePane() {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 p-3 bg-white rounded-xl border border-slate-200">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800">Fintech CTO Q3 Outreach</p>
          <p className="text-[10px] text-slate-500">5 steps · 14 days · 48 prospects enrolled</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-600 font-medium">Active</span>
        </div>
      </div>
      <div className="space-y-2">
        {DEMO_EMAILS.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            onClick={() => setActive(i)}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${active === i ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${step.status === 'Sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-800 truncate">{step.subject}</p>
              <p className="text-[10px] text-slate-400">{step.day} · {step.type}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {step.opens !== null && <span className="text-[10px] text-blue-600 font-medium">{step.opens} opens</span>}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${step.status === 'Sent' ? 'bg-emerald-50 text-emerald-700' : step.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{step.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
      {active === 0 && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span className="text-[10px] font-semibold text-emerald-700">AI-drafted copy</span>
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed italic">"Hi [First Name], I noticed [Company] is scaling its payments infrastructure — most CTOs I speak to at this stage are thinking about outbound motion. Quick question: how are you currently approaching..."</p>
        </motion.div>
      )}
    </div>
  );
}

function PipelinePane() {
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DEAL_STAGES.map((stage) => (
          <div key={stage.label} className="flex-shrink-0 w-36">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{stage.label}</p>
              <span className="text-[10px] text-slate-400">{stage.deals.length}</span>
            </div>
            <div className="space-y-2">
              {stage.deals.map((deal, i) => (
                <motion.div key={deal.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer">
                  <p className="text-[11px] font-semibold text-slate-800 mb-1">{deal.name}</p>
                  <p className="text-[10px] font-bold text-emerald-600">{deal.value}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Clock className="w-2.5 h-2.5 text-slate-300" />
                    <span className="text-[9px] text-slate-400">{deal.days}d</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[{ l: 'Total Pipeline', v: '$182k' }, { l: 'Avg Deal Size', v: '$30k' }, { l: 'Win Rate', v: '34%' }].map(s => (
          <div key={s.l} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
            <p className="text-base font-bold text-slate-800">{s.v}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPane() {
  const max = Math.max(...BAR_DATA);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {CAMPAIGN_STATS.map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3">
            <p className="text-base font-bold text-slate-800">{s.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
            <p className="text-[10px] font-semibold text-emerald-600 mt-1">{s.delta} vs last week</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-3">Daily Opens — This Week</p>
        <div className="flex items-end gap-1.5 h-20">
          {BAR_DATA.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }} transition={{ delay: i * 0.06, duration: 0.4 }}
                className="w-full rounded-t-md" style={{ background: i === 4 ? '#10b981' : '#d1fae5', minHeight: 4 }} />
              <span className="text-[9px] text-slate-400">{BAR_DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PANES = { discover: DiscoverPane, sequence: SequencePane, pipeline: PipelinePane, analytics: AnalyticsPane };

export default function ProductDemo({ onViewed }) {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];
  const Pane = PANES[step.id];

  const handleStepClick = (i) => {
    setActiveStep(i);
    if (typeof onViewed === 'function') onViewed();
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Step tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl mb-6">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <button key={s.id} onClick={() => handleStepClick(i)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${activeStep === i ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${activeStep === i ? 'text-emerald-600' : ''}`} />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main demo area */}
      <div className="grid md:grid-cols-5 gap-5">
        {/* Left description */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={step.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.25 }}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
                <step.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{step.description}</p>
              <div className="space-y-2">
                {STEPS.map((s, i) => (
                  <button key={s.id} onClick={() => handleStepClick(i)}
                    className={`flex items-center gap-2 text-xs transition-colors ${activeStep === i ? 'text-emerald-700 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}>
                    {activeStep > i
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      : <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${activeStep === i ? 'text-emerald-600' : 'text-slate-300'}`} />}
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right mockup */}
        <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-hidden">
          {/* Fake browser chrome */}
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
            <div className="flex-1 ml-2 bg-white border border-slate-200 rounded-md px-2.5 py-1 text-[10px] text-slate-400">app.orbin.ai / {step.id}</div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={step.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Pane />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 mt-6">
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => handleStepClick(i)}
            className={`transition-all rounded-full ${activeStep === i ? 'w-6 h-2 bg-emerald-500' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'}`} />
        ))}
      </div>
    </div>
  );
}
