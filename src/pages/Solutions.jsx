import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CalendarCheck, TrendingUp, Inbox,
  Cpu, Wallet, Truck, Briefcase, Store, Activity, Stars,
  Handshake, Megaphone, LayoutDashboard, UserCheck,
  ArrowRight, Check, Sparkles, ChevronRight, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NavBar from '@/components/landing/NavBar';
import Footer from '@/components/landing/Footer';
import { base44 } from '@/api/base44Client';

/* ── data ─────────────────────────────────────────────── */

const USE_CASES = [
  {
    id: 'outbound-prospecting',
    icon: Search,
    title: 'Outbound Prospecting',
    tagline: 'Find and engage your ideal buyers at scale.',
    description: 'Orbin is being designed to surface high-fit prospects across African and emerging markets — enriched with firmographic data, intent signals, and contact info — so your team starts every conversation with context, not cold searches.',
    bullets: ['AI-powered ICP matching', 'Intent and engagement signals', 'Contact enrichment across channels', 'Prospect scoring and prioritization'],
    color: 'emerald',
  },
  {
    id: 'meeting-generation',
    icon: CalendarCheck,
    title: 'Meeting Generation',
    tagline: 'Book more qualified meetings with less effort.',
    description: 'Automate the follow-up cycles that kill meeting rates. Orbin orchestrates multichannel outreach sequences across email, WhatsApp, and LinkedIn so more conversations turn into booked calls.',
    bullets: ['Multichannel sequence automation', 'AI-drafted personalised messaging', 'Follow-up reminders and task creation', 'Meeting conversion tracking'],
    color: 'blue',
  },
  {
    id: 'pipeline-acceleration',
    icon: TrendingUp,
    title: 'Pipeline Acceleration',
    tagline: 'Move deals faster with AI-driven engagement.',
    description: 'Stalled deals cost revenue. Orbin helps teams identify at-risk pipeline, trigger the right follow-ups at the right time, and keep deals moving through every stage.',
    bullets: ['Deal velocity tracking', 'AI-suggested next actions', 'At-risk deal alerts', 'Pipeline stage automation'],
    color: 'violet',
  },
  {
    id: 'lead-follow-up',
    icon: Inbox,
    title: 'Lead Follow-Up',
    tagline: 'Never let a warm lead go cold again.',
    description: "Most revenue is lost in the follow-up. Orbin's automated sequences and task reminders ensure every lead gets the right touchpoint at the right time — without reps having to remember.",
    bullets: ['Automated follow-up sequences', 'Task reminders and nudges', 'WhatsApp and email re-engagement', 'Lead warm/cold scoring'],
    color: 'amber',
  },
];

const INDUSTRIES = [
  {
    id: 'saas',
    icon: Cpu,
    title: 'SaaS & Enterprise Software',
    tagline: 'Target software buyers with precision and intent.',
    description: 'Software buying cycles are long and multi-stakeholder. Orbin helps SaaS teams run structured outbound, track champion engagement, and coordinate across AEs and SDRs in one workspace.',
    bullets: ['Multi-stakeholder outreach coordination', 'Trial and freemium conversion campaigns', 'Champion and economic buyer tracking', 'SaaS pipeline visibility'],
  },
  {
    id: 'fintech',
    icon: Wallet,
    title: 'FinTech & Payments',
    tagline: 'Reach financial decision-makers at the right time.',
    description: "Africa's fintech ecosystem moves fast. Orbin helps payments and financial services teams run compliant, personalised outreach at scale — across email, WhatsApp, and LinkedIn.",
    bullets: ['Regulated market outreach workflows', 'Payment partnership prospecting', 'WhatsApp-native engagement for African markets', 'Regional segmentation and targeting'],
  },
  {
    id: 'logistics',
    icon: Truck,
    title: 'Logistics & Supply Chain',
    tagline: 'Engage logistics operators and procurement teams.',
    description: 'Logistics buying decisions involve multiple teams and long lead times. Orbin helps revenue teams stay top of mind, coordinate follow-ups, and manage complex stakeholder relationships.',
    bullets: ['Procurement team outreach', 'Multi-contact account management', 'Long-cycle follow-up automation', 'Deal timeline and milestone tracking'],
  },
  {
    id: 'agencies',
    icon: Briefcase,
    title: 'Agencies & Consulting',
    tagline: 'Win new retainers and scale client pipelines.',
    description: 'Agency growth depends on consistent outbound and strong client relationships. Orbin centralizes prospecting, proposal tracking, and client communication in one GTM workspace.',
    bullets: ['Retainer prospect sequences', 'Proposal and pitch pipeline tracking', 'Client upsell and renewal campaigns', 'Team collaboration on accounts'],
  },
];

const COMPANY_TYPES = [
  {
    id: 'startups',
    icon: Stars,
    title: 'Startups',
    tagline: 'Launch your GTM motion from day one.',
    description: "Early-stage teams can't afford wasted outreach cycles. Orbin gives startups a structured GTM execution workspace — ICP targeting, sequence building, and pipeline tracking without the enterprise overhead.",
    bullets: ['Fast ICP definition and targeting', 'Lightweight CRM for early teams', 'AI-drafted outreach from day one', 'No RevOps team required'],
  },
  {
    id: 'smb',
    icon: Store,
    title: 'SMB & Mid-Market',
    tagline: 'Scale revenue without scaling headcount.',
    description: 'SMB revenue teams need tools that work without armies of ops people to configure them. Orbin is built to be picked up and used — structured outbound, pipeline visibility, and team coordination out of the box.',
    bullets: ['Ready-to-run outreach sequences', 'Team pipeline visibility', 'Automated task and follow-up workflows', 'Affordable per-seat pricing'],
  },
  {
    id: 'high-growth',
    icon: Activity,
    title: 'High-Growth Companies',
    tagline: 'Accelerate pipeline for teams moving fast.',
    description: 'High-growth teams are adding headcount faster than processes can keep up. Orbin gives fast-moving revenue teams the execution infrastructure to keep GTM coordinated as they scale.',
    bullets: ['Cross-team GTM coordination', 'Real-time pipeline and engagement visibility', 'Scalable outbound infrastructure', 'RevOps-ready reporting'],
  },
];

const TEAMS = [
  {
    id: 'sales',
    icon: Handshake,
    title: 'Sales Teams',
    tagline: 'Close more deals and book more meetings with AI.',
    description: "Sales reps spend too much time on admin. Orbin automates the outreach, follow-ups, and task management so reps can focus on conversations — not the CRM.",
    bullets: ['AI-drafted outreach and follow-ups', 'Task reminders and next-step nudges', 'Deal pipeline tracking', 'Call and email activity logging'],
  },
  {
    id: 'marketing',
    icon: Megaphone,
    title: 'Marketing Teams',
    tagline: 'Run campaigns that convert across every channel.',
    description: 'Marketing teams using Orbin can orchestrate multichannel campaigns — email sequences, WhatsApp broadcasts, and LinkedIn outreach — and track engagement back to pipeline.',
    bullets: ['Multichannel campaign orchestration', 'Audience segmentation and targeting', 'Engagement and reply rate tracking', 'Campaign-to-pipeline attribution'],
  },
  {
    id: 'revops',
    icon: LayoutDashboard,
    title: 'Revenue Operations',
    tagline: 'Orchestrate data, tools, and GTM execution.',
    description: 'RevOps teams need visibility across the full GTM motion. Orbin provides unified pipeline data, campaign analytics, team activity tracking, and workflow automation in one workspace.',
    bullets: ['Unified GTM analytics dashboard', 'Workflow and sequence governance', 'Team performance reporting', 'CRM and tool integrations'],
  },
  {
    id: 'founders',
    icon: UserCheck,
    title: 'Founders & GTM Leaders',
    tagline: 'Own your revenue motion from the top down.',
    description: "Founders and GTM leaders need to see the full picture — pipeline, outreach activity, team performance, and engagement — without digging through five tools. Orbin puts it all in one place.",
    bullets: ['Executive pipeline visibility', 'Team GTM coordination', 'Campaign performance at a glance', 'AI-assisted strategy and execution'],
  },
];

/* ── helpers ──────────────────────────────────────────── */

const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', tabActive: 'bg-emerald-600', tabText: 'text-emerald-600' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    icon: 'text-blue-600',    badge: 'bg-blue-50 text-blue-700 border-blue-200',    tabActive: 'bg-blue-600',    tabText: 'text-blue-600' },
  violet:  { bg: 'bg-violet-50',  border: 'border-violet-200',  icon: 'text-violet-600',  badge: 'bg-violet-50 text-violet-700 border-violet-200',  tabActive: 'bg-violet-600',  tabText: 'text-violet-600' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   icon: 'text-amber-600',   badge: 'bg-amber-50 text-amber-700 border-amber-200',   tabActive: 'bg-amber-600',   tabText: 'text-amber-600' },
};

/* ── components ───────────────────────────────────────── */

function SectionHeader({ label, title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-xs text-emerald-700 mb-4">
        <Sparkles className="w-3 h-3" /> {label}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{title}</h2>
      <p className="text-base text-slate-500 max-w-xl mx-auto">{subtitle}</p>
    </div>
  );
}

function UseCaseTabs() {
  const [activeIdx, setActiveIdx] = useState(0);
  const panelRef = useRef(null);
  const active = USE_CASES[activeIdx];
  const c = COLOR_MAP[active.color];
  const Icon = active.icon;

  return (
    <div className="flex flex-col md:flex-row gap-0 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Tab list */}
      <div className="md:w-56 flex-shrink-0 flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 overflow-x-auto">
        {USE_CASES.map((uc, i) => {
          const TabIcon = uc.icon;
          const isActive = i === activeIdx;
          const tc = COLOR_MAP[uc.color];
          return (
            <button
              key={uc.id}
              id={uc.id}
              onClick={() => setActiveIdx(i)}
              className={`relative flex items-center gap-3 px-5 py-4 text-left text-sm font-medium transition-colors flex-shrink-0 md:flex-shrink focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
                ${isActive
                  ? 'bg-white text-slate-900'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                }`}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-indicator"
                  className={`absolute left-0 top-0 bottom-0 w-0.5 md:w-0.5 hidden md:block ${tc.tabActive}`}
                />
              )}
              <TabIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? tc.tabText : 'text-slate-400'}`} />
              <span className="leading-tight">{uc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      <div className="flex-1 min-w-0 bg-white p-6 md:p-8" ref={panelRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-col lg:flex-row gap-8 items-start"
          >
            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-5 ${c.badge}`}>
                <Icon className="w-3.5 h-3.5" />
                {active.title}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 text-balance">{active.tagline}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-md">{active.description}</p>
              <ul className="space-y-2 mb-6">
                {active.bullets.map(b => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check className={`w-4 h-4 flex-shrink-0 ${c.icon}`} />
                    {b}
                  </li>
                ))}
              </ul>
              <a href="#waitlist">
                <button className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Join waitlist to get early access <ArrowRight className="w-4 h-4" />
                </button>
              </a>
            </div>

            {/* Visual card */}
            <div className={`w-full lg:w-64 flex-shrink-0 rounded-2xl border p-5 ${c.bg} ${c.border}`}>
              <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
                <Icon className={`w-4.5 h-4.5 ${c.icon}`} />
              </div>
              <p className="text-sm font-bold text-slate-800 mb-0.5">{active.title}</p>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">{active.tagline}</p>
              <div className="space-y-2">
                {active.bullets.map((b, i) => (
                  <motion.div
                    key={b}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-white/80 shadow-sm text-xs text-slate-700"
                  >
                    <ChevronRight className={`w-3 h-3 flex-shrink-0 ${c.icon}`} />
                    {b}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function AccordionCard({ item, isOpen, onToggle, animDelay = 0 }) {
  const Icon = item.icon;
  return (
    <motion.div
      id={item.id}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: animDelay, duration: 0.4 }}
      viewport={{ once: true }}
      className={`bg-white border rounded-2xl overflow-hidden transition-shadow ${isOpen ? 'border-emerald-300 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset"
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200'}`}>
          <Icon className={`w-4.5 h-4.5 transition-colors ${isOpen ? 'text-emerald-600' : 'text-slate-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold leading-snug transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-800'}`}>{item.title}</p>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{item.tagline}</p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-emerald-600' : 'text-slate-400'}`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-5 pt-1 border-t border-slate-100">
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{item.description}</p>
              <ul className="space-y-2">
                {item.bullets.map(b => (
                  <li key={b} className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AccordionGroup({ items, columns = 2 }) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));

  const gridClass = columns === 3
    ? 'grid md:grid-cols-3 gap-4'
    : 'grid md:grid-cols-2 gap-4';

  return (
    <div className={gridClass}>
      {items.map((item, i) => (
        <AccordionCard
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => toggle(item.id)}
          animDelay={i * 0.07}
        />
      ))}
    </div>
  );
}

function WaitlistCTA() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const isValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleJoin = async () => {
    const t = email.trim();
    if (!t) { setError('Please enter your email.'); return; }
    if (!isValid(t)) { setError('Please enter a valid email address.'); return; }
    setError(''); setJoining(true);
    try { await base44.entities.WaitlistSignup.create({ email: t, signed_up_at: new Date().toISOString() }); } catch {}
    setJoining(false); setJoined(true);
  };

  return (
    <section id="waitlist" className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="rounded-2xl p-10 border border-emerald-200 bg-emerald-50">
          <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Be first to use Orbin for your team</h2>
          <p className="text-sm text-slate-500 mb-6">Join the waitlist and get priority access when we launch — plus locked-in early adopter pricing.</p>
          {!joined ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
                <Input placeholder="Enter your work email" value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                  className="sm:w-72 h-11 border-emerald-300 bg-white" />
                <Button onClick={handleJoin} disabled={joining} className="h-11 px-6 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold">
                  {joining ? 'Joining…' : <><span>Join Waitlist</span><ArrowRight className="w-4 h-4 ml-2" /></>}
                </Button>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-emerald-300 text-emerald-700 font-semibold text-sm">
              <Check className="w-4 h-4" /> You're on the waitlist! We'll be in touch.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── page ─────────────────────────────────────────────── */

export default function Solutions() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0 }); return; }
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, [hash]);

  return (
    <div className="min-h-screen bg-white text-foreground font-inter overflow-x-hidden">
      <NavBar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center" style={{ background: '#060b1a' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Built for every GTM team
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Solutions for <span className="text-emerald-400">every revenue team</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Whether you're a founder running solo outbound, a sales team booking demos, or a RevOps leader scaling GTM — Orbin is being built for you.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['Use Cases', 'Industries', 'Company Types', 'Teams'].map((label, i) => {
              const anchors = ['#outbound-prospecting', '#saas', '#startups', '#sales'];
              return (
                <a key={label} href={anchors[i]}
                  className="px-4 py-2 rounded-full border border-white/20 text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors text-sm">
                  {label}
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* USE CASES */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <SectionHeader
          label="Use Cases"
          title="Every outbound workflow, covered"
          subtitle="From first prospecting touch to closed deal — Orbin supports every stage of your GTM execution."
        />
        <UseCaseTabs />
      </section>

      {/* INDUSTRIES */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Industries"
            title="Built for Africa's fastest-growing sectors"
            subtitle="Orbin is designed with the realities of emerging market GTM teams in mind — local channels, regional context, global ambition."
          />
          <AccordionGroup items={INDUSTRIES} columns={2} />
        </div>
      </section>

      {/* COMPANY TYPES */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <SectionHeader
          label="Company Types"
          title="Right-sized for where you are"
          subtitle="Orbin adapts to your growth stage — from zero to one outbound motion to scaling a full GTM organisation."
        />
        <AccordionGroup items={COMPANY_TYPES} columns={3} />
      </section>

      {/* TEAMS */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Teams"
            title="One platform, every revenue function"
            subtitle="Sales, marketing, RevOps, and leadership — Orbin keeps every GTM function aligned and executing together."
          />
          <AccordionGroup items={TEAMS} columns={2} />
        </div>
      </section>

      <WaitlistCTA />
      <Footer />
    </div>
  );
}
