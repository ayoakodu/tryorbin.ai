import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, GitBranch, BarChart3, CheckCircle2, Sparkles,
  ChevronRight, Target, Clock, Send, Plus, X,
  ArrowRight, Copy, RefreshCw, Check, ChevronDown,
  Mail, MessageSquare, Linkedin, Phone,
} from 'lucide-react';

/* ─── shared data ─────────────────────────────────────── */

const STEPS = [
  { id: 'discover',  icon: Search,    label: 'Discover',  title: 'Find your ideal prospects',                description: 'AI surfaces high-fit leads across African and emerging markets — enriched with firmographic data and intent signals.' },
  { id: 'sequence',  icon: GitBranch, label: 'Sequence',  title: 'Build personalised outreach sequences',    description: 'Orchestrate email, WhatsApp, and LinkedIn touchpoints with AI-drafted messaging tailored to each prospect.' },
  { id: 'pipeline',  icon: Target,    label: 'Pipeline',  title: 'Manage your revenue pipeline',             description: 'Track every deal from first touch to close in a unified workspace built for GTM teams.' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', title: 'Measure what drives revenue',              description: 'Campaign performance, engagement metrics, and pipeline velocity — all in one dashboard.' },
];

const COLORS = ['from-emerald-400 to-teal-500','from-violet-400 to-purple-500','from-amber-400 to-orange-500','from-cyan-400 to-blue-500','from-pink-400 to-rose-500'];

/* ─── Discover ────────────────────────────────────────── */

const BASE_CONTACTS = [
  { name: 'Amara Diallo',    company: 'Flutterwave', role: 'VP Revenue',     fit: 98, intent: 'High',   status: 'Contacted', phone: '+234 801 234 5678', linkedin: 'linkedin.com/in/amara-diallo' },
  { name: 'Tunde Okafor',    company: 'Paystack',    role: 'CTO',            fit: 94, intent: 'High',   status: 'Replied',   phone: '+234 802 345 6789', linkedin: 'linkedin.com/in/tunde-okafor' },
  { name: 'Chisom Eze',      company: 'Interswitch', role: 'Head of Sales',  fit: 91, intent: 'Medium', status: 'New',       phone: '+234 803 456 7890', linkedin: 'linkedin.com/in/chisom-eze' },
  { name: 'Yewande Adeyemi', company: 'Kuda Bank',   role: 'CEO',            fit: 89, intent: 'Medium', status: 'New',       phone: '+234 804 567 8901', linkedin: 'linkedin.com/in/yewande-adeyemi' },
  { name: 'David Mensah',    company: 'MTN Ghana',   role: 'CMO',            fit: 85, intent: 'Low',    status: 'New',       phone: '+233 201 234 5678', linkedin: 'linkedin.com/in/david-mensah' },
];

function DiscoverPane() {
  const [scanning,  setScanning]  = useState(false);
  const [visible,   setVisible]   = useState(BASE_CONTACTS.length);
  const [selected,  setSelected]  = useState(null);
  const [added,     setAdded]     = useState(new Set());
  const [toast,     setToast]     = useState('');

  const runScan = () => {
    setScanning(true);
    setVisible(0);
    let i = 0;
    const tick = () => {
      i++;
      setVisible(i);
      if (i < BASE_CONTACTS.length) setTimeout(tick, 300);
      else setScanning(false);
    };
    setTimeout(tick, 600);
  };

  const addToSequence = (name) => {
    setAdded(prev => new Set([...prev, name]));
    setToast(`${name.split(' ')[0]} added to sequence`);
    setTimeout(() => setToast(''), 2500);
  };

  const contacts = BASE_CONTACTS.slice(0, visible);

  return (
    <div className="space-y-2 relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute top-0 right-0 z-10 bg-emerald-600 text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
            <Check className="w-3 h-3" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Fintech CTOs hiring in Nigeria · Series B+</span>
        </div>
        <button onClick={runScan} disabled={scanning}
          className="flex items-center gap-1 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium hover:bg-emerald-100 transition-colors disabled:opacity-60">
          {scanning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {scanning ? 'Scanning…' : 'AI Filter'}
        </button>
      </div>

      {/* Contact list */}
      <AnimatePresence>
        {contacts.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            <div
              onClick={() => setSelected(selected === i ? null : i)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected === i ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center flex-shrink-0`}>
                <span className="text-[10px] font-bold text-white">{c.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800">{c.name}</p>
                <p className="text-[10px] text-slate-500">{c.role} · {c.company}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-400">Fit</p>
                  <p className="text-xs font-bold text-emerald-600">{c.fit}%</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c.intent === 'High' ? 'bg-red-50 text-red-600' : c.intent === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{c.intent}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${added.has(c.name) ? 'bg-emerald-50 text-emerald-700' : c.status === 'Replied' ? 'bg-blue-50 text-blue-600' : c.status === 'Contacted' ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-500'}`}>
                  {added.has(c.name) ? 'In Sequence' : c.status}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${selected === i ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Expanded detail */}
            <AnimatePresence>
              {selected === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="overflow-hidden">
                  <div className="mx-1 mb-1 p-3 bg-white border border-emerald-200 border-t-0 rounded-b-xl">
                    <div className="grid grid-cols-2 gap-2 mb-3 text-[10px] text-slate-500">
                      <div><span className="font-semibold text-slate-700">Phone:</span> {c.phone}</div>
                      <div><span className="font-semibold text-slate-700">LinkedIn:</span> <span className="text-blue-500">{c.linkedin}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); addToSequence(c.name); }}
                        disabled={added.has(c.name)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
                        {added.has(c.name) ? <><Check className="w-3 h-3" /> Added</> : <><Plus className="w-3 h-3" /> Add to Sequence</>}
                      </button>
                      <button onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[10px] hover:bg-slate-50 transition-colors">
                        <Mail className="w-3 h-3" /> Email
                      </button>
                      <button onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[10px] hover:bg-slate-50 transition-colors">
                        <MessageSquare className="w-3 h-3" /> WhatsApp
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sequence ────────────────────────────────────────── */

const SEQ_STEPS = [
  { day: 'Day 1',  type: 'Email',    icon: Mail,           subject: 'Quick question about your outbound motion', status: 'Sent',    opens: 4,
    copies: [
      '"Hi [First Name], I noticed [Company] is scaling its payments infrastructure — most CTOs I speak to at this stage are thinking about outbound motion. Quick question: how are you currently approaching pipeline generation?"',
      '"Hi [First Name], scaling a Series B payments business is no small feat — congrats on the growth. I help fintech GTM teams run structured outbound. Worth a quick chat to see if it applies to [Company]?"',
    ]},
  { day: 'Day 3',  type: 'LinkedIn', icon: Linkedin,        subject: 'Connection request + personalised note',    status: 'Pending', opens: null,
    copies: ['"Hi [First Name] — I work with revenue leaders at fintech companies across West Africa on outbound execution. Would love to connect and share what\'s working for similar teams."'] },
  { day: 'Day 6',  type: 'Email',    icon: Mail,           subject: 'Re: thought this would be useful',          status: 'Draft',   opens: null,
    copies: ['"[First Name], sharing a quick breakdown of how a Lagos-based fintech doubled their reply rate in 6 weeks using structured outbound. Attaching the one-pager — let me know if it\'s relevant for [Company]."'] },
  { day: 'Day 10', type: 'WhatsApp', icon: MessageSquare,   subject: 'Quick check-in via WhatsApp',               status: 'Draft',   opens: null,
    copies: ['"Hi [First Name], sent you an email last week about outbound execution for fintech teams. Just checking if it landed! Happy to share a quick voice note if easier."'] },
  { day: 'Day 14', type: 'Email',    icon: Mail,           subject: 'Closing the loop',                          status: 'Draft',   opens: null,
    copies: ['"[First Name], I\'ll keep this short — closing my loop on [Company]. If the timing isn\'t right, no worries at all. If there\'s ever a fit, I\'m here. Either way, best of luck with the scale-up."'] },
];

function SequencePane() {
  const [active,    setActive]    = useState(0);
  const [copyIdx,   setCopyIdx]   = useState(0);
  const [copied,    setCopied]    = useState(false);
  const [usedSteps, setUsedSteps] = useState(new Set());

  const step = SEQ_STEPS[active];
  const copies = step.copies;
  const copy = copies[copyIdx % copies.length];

  const regenerate = () => {
    setCopyIdx(n => n + 1);
    setCopied(false);
  };

  const useThis = () => {
    setCopied(true);
    setUsedSteps(prev => new Set([...prev, active]));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 p-3 bg-white rounded-xl border border-slate-200">
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

      {/* Steps */}
      <div className="space-y-1.5 mb-3">
        {SEQ_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <button key={i} onClick={() => { setActive(i); setCopyIdx(0); setCopied(false); }}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all text-left ${active === i ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${usedSteps.has(i) ? 'bg-emerald-100 text-emerald-700' : s.status === 'Sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {usedSteps.has(i) ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <Icon className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-slate-800 truncate">{s.subject}</p>
                <p className="text-[10px] text-slate-400">{s.day} · {s.type}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {s.opens !== null && <span className="text-[10px] text-blue-600 font-medium">{s.opens} opens</span>}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.status === 'Sent' ? 'bg-emerald-50 text-emerald-700' : s.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{s.status}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* AI copy preview */}
      <AnimatePresence mode="wait">
        <motion.div key={`${active}-${copyIdx}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span className="text-[10px] font-semibold text-emerald-700">AI-drafted copy</span>
            {copies.length > 1 && <span className="text-[10px] text-slate-400 ml-1">({(copyIdx % copies.length) + 1}/{copies.length})</span>}
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed italic mb-3">{copy}</p>
          <div className="flex gap-2">
            <button onClick={useThis}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-semibold hover:bg-emerald-700 transition-colors">
              {copied ? <><Check className="w-3 h-3" /> Used!</> : <><Check className="w-3 h-3" /> Use this</>}
            </button>
            {copies.length > 1 && (
              <button onClick={regenerate}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[10px] hover:bg-slate-100 transition-colors">
                <RefreshCw className="w-3 h-3" /> Regenerate
              </button>
            )}
            <button onClick={() => { navigator.clipboard?.writeText(copy.replace(/"/g, '')).catch(()=>{}); }}
              className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[10px] hover:bg-slate-100 transition-colors">
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Pipeline ────────────────────────────────────────── */

const INITIAL_STAGES = [
  { label: 'Prospecting', deals: [{ id: 1, name: 'Flutterwave', value: '$24k', days: 2, contact: 'Amara Diallo', next: 'Send intro email' }, { id: 2, name: 'Interswitch', value: '$18k', days: 5, contact: 'Chisom Eze', next: 'Follow-up call' }] },
  { label: 'Qualifying',  deals: [{ id: 3, name: 'Paystack',    value: '$31k', days: 8, contact: 'Tunde Okafor', next: 'Discovery call booked' }, { id: 4, name: 'Kuda Bank',   value: '$12k', days: 3, contact: 'Yewande Adeyemi', next: 'Send proposal draft' }] },
  { label: 'Demo',        deals: [{ id: 5, name: 'MTN Ghana',   value: '$55k', days: 14, contact: 'David Mensah', next: 'Demo scheduled for Thursday' }] },
  { label: 'Proposal',    deals: [{ id: 6, name: 'Jumia',       value: '$42k', days: 7,  contact: 'Emeka Obi',    next: 'Awaiting sign-off' }] },
];
const STAGE_LABELS = INITIAL_STAGES.map(s => s.label);

function PipelinePane() {
  const [stages,   setStages]   = useState(INITIAL_STAGES);
  const [selected, setSelected] = useState(null); // { stageIdx, dealIdx }
  const [moved,    setMoved]    = useState(null);

  const selectedDeal = selected
    ? stages[selected.stageIdx]?.deals[selected.dealIdx]
    : null;

  const moveToNext = () => {
    if (!selected) return;
    const { stageIdx, dealIdx } = selected;
    if (stageIdx >= stages.length - 1) return;
    const deal = stages[stageIdx].deals[dealIdx];
    setMoved(deal.id);
    setTimeout(() => {
      setStages(prev => {
        const next = prev.map(s => ({ ...s, deals: [...s.deals] }));
        next[stageIdx].deals.splice(dealIdx, 1);
        next[stageIdx + 1].deals.push(deal);
        return next;
      });
      setSelected({ stageIdx: stageIdx + 1, dealIdx: stages[stageIdx + 1].deals.length });
      setMoved(null);
    }, 500);
  };

  const stageOfDeal = selectedDeal
    ? stages.findIndex(s => s.deals.some(d => d.id === selectedDeal.id))
    : -1;

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {stages.map((stage, si) => (
          <div key={stage.label} className="flex-shrink-0 w-32">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate">{stage.label}</p>
              <span className="text-[10px] text-slate-400 ml-1 flex-shrink-0">{stage.deals.length}</span>
            </div>
            <div className="space-y-2 min-h-[60px]">
              <AnimatePresence>
                {stage.deals.map((deal, di) => (
                  <motion.div key={deal.id}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: moved === deal.id ? 0 : 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelected(selected?.stageIdx === si && selected?.dealIdx === di ? null : { stageIdx: si, dealIdx: di })}
                    className={`p-2.5 border rounded-xl cursor-pointer transition-all ${selected?.stageIdx === si && selected?.dealIdx === di ? 'border-emerald-400 bg-emerald-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'}`}>
                    <p className="text-[11px] font-semibold text-slate-800 mb-1 truncate">{deal.name}</p>
                    <p className="text-[10px] font-bold text-emerald-600">{deal.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-2.5 h-2.5 text-slate-300" />
                      <span className="text-[9px] text-slate-400">{deal.days}d</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Deal detail panel */}
      <AnimatePresence>
        {selectedDeal && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            className="mt-3 p-3 bg-white border border-emerald-200 rounded-xl">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-bold text-slate-800">{selectedDeal.name}</p>
                <p className="text-[10px] text-slate-500">{selectedDeal.contact} · {selectedDeal.value}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mb-3 p-2 bg-amber-50 border border-amber-100 rounded-lg">
              <ArrowRight className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <p className="text-[10px] text-amber-700 font-medium">Next: {selectedDeal.next}</p>
            </div>
            <div className="flex gap-2">
              {stageOfDeal < stages.length - 1 && (
                <button onClick={moveToNext}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-semibold hover:bg-emerald-700 transition-colors">
                  <ArrowRight className="w-3 h-3" /> Move to {STAGE_LABELS[stageOfDeal + 1]}
                </button>
              )}
              <button className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[10px] hover:bg-slate-50 transition-colors">
                <Mail className="w-3 h-3" /> Email
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[10px] hover:bg-slate-50 transition-colors">
                <Phone className="w-3 h-3" /> Call
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { l: 'Total Pipeline', v: '$182k' },
          { l: 'Avg Deal Size',  v: '$30k'  },
          { l: 'Win Rate',       v: '34%'   },
        ].map(s => (
          <div key={s.l} className="bg-white border border-slate-200 rounded-xl p-2.5 text-center">
            <p className="text-sm font-bold text-slate-800">{s.v}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Analytics ───────────────────────────────────────── */

const KPI_METRICS = [
  { label: 'Open Rate',        key: 'opens',    value: '38.4%', delta: '+4.2%', data: [42, 58, 71, 53, 89, 34, 61], color: '#3b82f6' },
  { label: 'Reply Rate',       key: 'replies',  value: '9.3%',  delta: '+1.1%', data: [8, 11, 15, 9, 19, 5, 12],   color: '#10b981' },
  { label: 'Meetings Booked',  key: 'meetings', value: '14',    delta: '+3',    data: [2, 3, 4, 2, 5, 1, 3],       color: '#8b5cf6' },
  { label: 'Pipeline Added',   key: 'pipeline', value: '$182k', delta: '+22%',  data: [18, 24, 31, 22, 44, 14, 29], color: '#f59e0b' },
];
const BAR_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'All time'];

function AnalyticsPane() {
  const [activeKpi,   setActiveKpi]   = useState(0);
  const [hoverBar,    setHoverBar]    = useState(null);
  const [dateRange,   setDateRange]   = useState(0);
  const [showRanges,  setShowRanges]  = useState(false);

  const kpi = KPI_METRICS[activeKpi];
  const max = Math.max(...kpi.data);

  return (
    <div className="space-y-3">
      {/* Date range picker */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Campaign Performance</p>
        <div className="relative">
          <button onClick={() => setShowRanges(v => !v)}
            className="flex items-center gap-1 text-[10px] text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1 hover:border-slate-300 transition-colors">
            {DATE_RANGES[dateRange]} <ChevronDown className="w-2.5 h-2.5" />
          </button>
          <AnimatePresence>
            {showRanges && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                {DATE_RANGES.map((r, i) => (
                  <button key={r} onClick={() => { setDateRange(i); setShowRanges(false); }}
                    className={`block w-full text-left px-3 py-1.5 text-[10px] transition-colors ${dateRange === i ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {r}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* KPI cards — clickable to switch chart */}
      <div className="grid grid-cols-2 gap-2">
        {KPI_METRICS.map((m, i) => (
          <button key={m.key} onClick={() => setActiveKpi(i)}
            className={`p-3 rounded-xl border text-left transition-all ${activeKpi === i ? 'border-emerald-300 bg-emerald-50/60 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <p className="text-sm font-bold text-slate-800">{m.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{m.label}</p>
            <p className="text-[10px] font-semibold text-emerald-600 mt-1">{m.delta} vs last week</p>
            {activeKpi === i && <div className="w-4 h-0.5 rounded-full mt-1.5" style={{ background: m.color }} />}
          </button>
        ))}
      </div>

      {/* Bar chart with hover tooltip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 relative">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-3">
          Daily {kpi.label} — {DATE_RANGES[dateRange]}
        </p>
        <div className="flex items-end gap-1.5 h-20">
          {kpi.data.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 relative"
              onMouseEnter={() => setHoverBar(i)} onMouseLeave={() => setHoverBar(null)}>
              {hoverBar === i && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-1 rounded whitespace-nowrap z-10">
                  {v}{kpi.key === 'pipeline' ? 'k' : kpi.key === 'opens' || kpi.key === 'replies' ? '%' : ''}
                </div>
              )}
              <motion.div
                key={`${activeKpi}-${dateRange}-${i}`}
                initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="w-full rounded-t-md transition-opacity"
                style={{ background: hoverBar === i ? kpi.color : `${kpi.color}55`, minHeight: 4 }} />
              <span className="text-[9px] text-slate-400">{BAR_DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Shell ───────────────────────────────────────────── */

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
      {/* Tab row */}
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

      {/* Layout */}
      <div className="grid md:grid-cols-5 gap-5">
        {/* Left: description + step nav */}
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

        {/* Right: mockup */}
        <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
            <div className="flex-1 ml-2 bg-white border border-slate-200 rounded-md px-2.5 py-1 text-[10px] text-slate-400">
              app.orbin.ai / {step.id}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={step.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <Pane />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => handleStepClick(i)}
            className={`transition-all rounded-full ${activeStep === i ? 'w-6 h-2 bg-emerald-500' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'}`} />
        ))}
      </div>
    </div>
  );
}
