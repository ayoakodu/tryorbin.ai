import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Sparkles, Check, Mail, MessageCircle, Linkedin, Phone, Users, Building2, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RVNULogo from '@/components/ui/RVNULogo';

// ─── Step 1 ───────────────────────────────────────────────────────────────────

const prompts = [
  { label: 'Find fintech startups hiring sales reps in Kenya', icon: '🇰🇪' },
  { label: 'Find B2B SaaS companies expanding across Africa', icon: '🌍' },
  { label: 'Find logistics companies using digital payments', icon: '🚚' },
  { label: 'Find YC-backed African startups', icon: '🚀' },
  { label: 'Find companies using Paystack or Flutterwave', icon: '💳' },
  { label: 'Find high-growth startups hiring SDRs', icon: '📈' },
];

const mockAccounts = [
  { name: 'Moove Africa', industry: 'Mobility', country: 'Nigeria', signal: 'Hiring SDRs', tier: 'High Fit', score: 94 },
  { name: 'Copia Global', industry: 'E-commerce', country: 'Kenya', signal: 'Series B', tier: 'High Fit', score: 91 },
  { name: 'Paymob', industry: 'Fintech', country: 'Egypt', signal: 'Flutterwave', tier: 'High Fit', score: 88 },
  { name: 'Lipa Later', industry: 'BNPL', country: 'Kenya', signal: 'Growth signal', tier: 'Medium Fit', score: 76 },
  { name: 'Chipper Cash', industry: 'Payments', country: 'Ghana', signal: 'YC-backed', tier: 'High Fit', score: 89 },
];

function Step1() {
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handleSelect = (p) => {
    setSelected(p);
    setProcessing(true);
    setDone(false);
    setTimeout(() => { setProcessing(false); setDone(true); }, 1800);
  };

  return (
    <div className="flex flex-col md:flex-row gap-0 h-full overflow-hidden">
      <div className="md:w-[300px] flex-shrink-0 border-r border-slate-200 p-4 flex flex-col gap-3 overflow-hidden">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-emerald-600 uppercase mb-1.5">
            <Sparkles className="w-3 h-3" /> R1 · Prompt
          </div>
          <h2 className="text-base font-bold text-emerald-600 leading-snug mb-1">Describe Your Ideal Customers</h2>
          <p className="text-[11px] text-slate-500 leading-relaxed">Use AI to discover and prioritize companies across Africa based on your ideal customer profile.</p>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Choose a Prompt</p>
          <div className="space-y-1">
            {prompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSelect(p)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg border transition-all duration-150 flex items-start gap-2 ${
                  selected?.label === p.label
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700'
                }`}
              >
                <span className="text-sm leading-none mt-0.5 flex-shrink-0">{p.icon}</span>
                <span className="text-[11px] leading-relaxed">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col overflow-hidden">
        {!selected && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">Select a prompt to begin</p>
            <p className="text-xs text-slate-400 mt-1">Choose from the options on the left</p>
          </div>
        )}

        {selected && processing && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              <span className="text-sm text-emerald-700 font-medium">RVNU AI is discovering accounts…</span>
            </div>
            <div className="w-full max-w-sm space-y-1.5">
              {['Parsing ICP criteria', 'Scanning African markets', 'Enriching signals', 'Ranking by fit score'].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" style={{ animationDelay: `${i * 0.2}s` }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {selected && done && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-semibold text-emerald-700">5 accounts discovered · sorted by fit score</span>
            </div>
            <div className="space-y-1.5">
              {mockAccounts.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 transition-all"
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-800 leading-tight">{a.name}</p>
                    <p className="text-[10px] text-slate-400">{a.industry} · {a.country}</p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${a.tier === 'High Fit' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {a.tier}
                  </span>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">#{a.score}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 hidden md:block flex-shrink-0">{a.signal}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

const workflowStages = [
  { label: 'Discover', status: 'completed', icon: '🔍' },
  { label: 'Enrich', status: 'completed', icon: '⚡' },
  { label: 'Segment', status: 'completed', icon: '🗂️' },
  { label: 'Qualify', status: 'active', icon: '✅' },
  { label: 'Prioritize', status: 'pending', icon: '🏆' },
];

const accounts2 = [
  { name: 'Moove Africa', fit: 94, engage: 87, hiring: true, growth: 'High', tier: 1 },
  { name: 'Chipper Cash', fit: 89, engage: 82, hiring: true, growth: 'High', tier: 1 },
  { name: 'Copia Global', fit: 91, engage: 79, hiring: false, growth: 'Medium', tier: 1 },
  { name: 'Lipa Later', fit: 76, engage: 68, hiring: true, growth: 'Medium', tier: 2 },
  { name: 'Paymob', fit: 88, engage: 74, hiring: false, growth: 'High', tier: 1 },
];

function Step2() {
  return (
    <div className="flex flex-col md:flex-row gap-0 h-full overflow-hidden">
      <div className="md:w-[300px] flex-shrink-0 border-r border-slate-200 p-4 flex flex-col gap-3 overflow-hidden">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-emerald-600 uppercase mb-1.5">
            <Sparkles className="w-3 h-3" /> R2 · Orchestration
          </div>
          <h2 className="text-base font-bold text-emerald-600 leading-snug mb-1">AI Qualification & Prioritization</h2>
          <p className="text-[11px] text-slate-500 leading-relaxed">RVNU automatically enriches, segments, qualifies, and prioritizes accounts so your team focuses on the highest-value opportunities.</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Workflow Stages</p>
          <div className="space-y-1">
            {workflowStages.map((s, i) => (
              <div key={i} className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border ${
                s.status === 'completed' ? 'border-emerald-200 bg-emerald-50' :
                s.status === 'active' ? 'border-emerald-400 bg-emerald-100' :
                'border-slate-200 bg-white text-slate-400'
              }`}>
                <span className="text-sm">{s.icon}</span>
                <span className={`text-[11px] font-medium ${s.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{s.label}</span>
                <span className="ml-auto">
                  {s.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  {s.status === 'active' && <Loader2 className="w-3 h-3 text-emerald-600 animate-spin" />}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Ranked Accounts</p>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">AI Prioritizing…</span>
        </div>
        <div className="space-y-1.5 flex-1">
          {accounts2.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-2.5 h-2.5 text-emerald-600" />
                  </div>
                  <span className="font-semibold text-[11px] text-slate-800">{a.name}</span>
                  {a.tier === 1 && <span className="text-[9px] px-1 py-0.5 bg-amber-100 text-amber-700 rounded font-semibold">T1</span>}
                </div>
                <span className="text-[11px] font-bold text-emerald-600">{a.fit}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] mb-1.5">
                <div className="bg-slate-50 rounded-md p-1 text-center">
                  <p className="font-semibold text-slate-700">{a.engage}%</p>
                  <p className="text-slate-400 text-[9px]">Engage.</p>
                </div>
                <div className="bg-slate-50 rounded-md p-1 text-center">
                  <p className={`font-semibold ${a.hiring ? 'text-emerald-600' : 'text-slate-400'}`}>{a.hiring ? 'Yes' : 'No'}</p>
                  <p className="text-slate-400 text-[9px]">Hiring SDRs</p>
                </div>
                <div className="bg-slate-50 rounded-md p-1 text-center">
                  <p className={`font-semibold ${a.growth === 'High' ? 'text-emerald-600' : 'text-amber-500'}`}>{a.growth}</p>
                  <p className="text-slate-400 text-[9px]">Growth</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-0.5">
                <motion.div
                  className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-0.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${a.fit}%` }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

const channels = [
  { icon: Mail, label: 'Email', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', steps: ['Cold intro', 'Follow-up #1', 'Value add', 'Break-up'] },
  { icon: MessageCircle, label: 'WhatsApp', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', steps: ['Voice note intro', 'PDF share', 'Check-in'] },
  { icon: Linkedin, label: 'LinkedIn', color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-200', steps: ['Connection req', 'Message #1', 'Engage post'] },
  { icon: Phone, label: 'SMS', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200', steps: ['Warm intro', 'Meeting link'] },
];

function Step3() {
  const [activeChannel, setActiveChannel] = useState(0);
  return (
    <div className="flex flex-col md:flex-row gap-0 h-full overflow-hidden">
      <div className="md:w-[300px] flex-shrink-0 border-r border-slate-200 p-4 flex flex-col gap-3 overflow-hidden">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-emerald-600 uppercase mb-1.5">
            <Sparkles className="w-3 h-3" /> R3 · Execution
          </div>
          <h2 className="text-base font-bold text-emerald-600 leading-snug mb-1">Launch Multichannel Outreach</h2>
          <p className="text-[11px] text-slate-500 leading-relaxed">Execute campaigns across multiple channels from one unified workspace. AI drafts every message, your team reviews and activates.</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Channels</p>
          <div className="space-y-1">
            {channels.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveChannel(i)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border transition-all ${
                  activeChannel === i ? `${c.border} ${c.bg}` : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <c.icon className={`w-3.5 h-3.5 ${c.color} flex-shrink-0`} />
                <span className="text-[11px] font-medium text-slate-700">{c.label}</span>
                <span className="ml-auto text-[10px] text-slate-400">{channels[i].steps.length} steps</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto p-2.5 rounded-xl bg-slate-900 border border-slate-700">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px] font-semibold text-emerald-400">Team Workspace</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">Shared campaign visibility, team assignment, and Slack-style collaboration for revenue teams.</p>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-2.5 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(() => { const C = channels[activeChannel]; return <C.icon className={`w-3.5 h-3.5 ${C.color}`} />; })()}
            <span className="text-[11px] font-semibold text-slate-800">{channels[activeChannel].label} Sequence — Moove Africa</span>
          </div>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Active
          </span>
        </div>

        <div className="space-y-1.5 flex-1">
          {channels[activeChannel].steps.map((step, i) => (
            <motion.div
              key={`${activeChannel}-${i}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-slate-200 bg-white"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold text-emerald-700">{i + 1}</span>
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-slate-700">{step}</p>
                <p className="text-[10px] text-slate-400">AI-generated · Day {i === 0 ? 1 : i * 3}</p>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {i === 0 ? 'Sent' : 'Queued'}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex-shrink-0">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Campaign Stats</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[['5 accounts', 'Enrolled'], ['62%', 'Open Rate'], ['3 replies', 'Received']].map(([v, l]) => (
              <div key={l} className="bg-white rounded-lg p-1.5 border border-slate-200">
                <p className="text-[11px] font-bold text-emerald-600">{v}</p>
                <p className="text-[10px] text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

const bullets = [
  'AI-assisted GTM workflows',
  'Multichannel outreach execution',
  'Unified revenue workspace',
  'Built for African revenue teams',
];

function Step4({ onClose }) {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-4 text-center max-w-lg mx-auto">
      <RVNULogo size={48} className="rounded-xl mb-4 shadow-lg" />
      <h2 className="text-lg font-bold text-emerald-600 mb-2 leading-snug">The Future of GTM Execution for African Revenue Teams</h2>
      <p className="text-sm text-slate-500 mb-4 leading-relaxed">Join the waitlist and get early access to RVNU — the AI-native GTM execution platform built for your market.</p>

      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mb-5">
        {bullets.map(b => (
          <div key={b} className="flex items-center gap-1.5 text-xs text-slate-600">
            <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            <span>{b}</span>
          </div>
        ))}
      </div>

      {!joined ? (
        <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md">
          <Input
            placeholder="Enter your work email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 h-10 border-slate-300 text-slate-800 text-sm"
          />
          <Button
            onClick={() => { if (email) setJoined(true); }}
            className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm whitespace-nowrap"
          >
            Join Waitlist <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-sm"
        >
          <Check className="w-4 h-4" /> You're on the waitlist! We'll be in touch soon.
        </motion.div>
      )}
      <p className="text-[11px] text-slate-400 mt-3">No credit card required · Early access pricing locked in</p>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

const STEPS = [
  { title: 'Define Target Market', short: 'Discover' },
  { title: 'Qualify & Prioritize', short: 'Qualify' },
  { title: 'Activate Outreach', short: 'Activate' },
  { title: 'Join the Waitlist', short: 'Join' },
];

export default function RVNUWorkflowModal({ onClose }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const canGoBack = step > 0;
  const canGoNext = step < STEPS.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6,11,26,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl w-full flex flex-col"
        style={{ maxWidth: '860px', height: 'min(82vh, 560px)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="flex items-center gap-2 px-5 pt-3.5 pb-0 flex-shrink-0">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            </div>
          ))}
          <button
            onClick={onClose}
            className="ml-3 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Step labels */}
        <div className="flex items-center gap-2 px-5 pt-1 pb-2 border-b border-slate-100 flex-shrink-0">
          {STEPS.map((s, i) => (
            <div key={i} className="flex-1 text-center">
              <p className={`text-[10px] font-semibold transition-colors truncate ${i === step ? 'text-emerald-600' : i < step ? 'text-slate-400' : 'text-slate-300'}`}>
                {s.short}
              </p>
            </div>
          ))}
          <div className="w-9 flex-shrink-0" />
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {step === 0 && <Step1 />}
              {step === 1 && <Step2 />}
              {step === 2 && <Step3 />}
              {step === 3 && <Step4 onClose={onClose} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={() => canGoBack && setStep(s => s - 1)}
            disabled={!canGoBack}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${canGoBack ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 cursor-default'}`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <p className="text-[11px] text-slate-400">{step + 1} / {STEPS.length}</p>
          {canGoNext ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-4 text-xs"
            >
              Next <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <div className="w-20" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}