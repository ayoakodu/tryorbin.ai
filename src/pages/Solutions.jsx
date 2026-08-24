import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, CalendarCheck, TrendingUp, Inbox,
  Cpu, Wallet, Truck, Briefcase, Store, Activity, Stars,
  Handshake, Megaphone, LayoutDashboard, UserCheck,
  ArrowRight, Check, Sparkles, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NavBar from '@/components/landing/NavBar';
import Footer from '@/components/landing/Footer';
import { useState } from 'react';
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

/* ── components ───────────────────────────────────────── */

const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    icon: 'text-blue-600',    badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  violet:  { bg: 'bg-violet-50',  border: 'border-violet-200',  icon: 'text-violet-600',  badge: 'bg-violet-50 text-violet-700 border-violet-200' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   icon: 'text-amber-600',   badge: 'bg-amber-50 text-amber-700 border-amber-200' },
};

function SolutionCard({ item, index, colorKey }) {
  const c = COLOR_MAP[colorKey || 'emerald'];
  const Icon = item.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      id={item.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      viewport={{ once: true }}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-start py-14 border-b border-slate-100 last:border-0`}
    >
      {/* Text */}
      <div className="flex-1">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-5 ${c.badge}`}>
          <Icon className="w-3.5 h-3.5" />
          {item.title}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">{item.tagline}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-lg">{item.description}</p>
        <ul className="space-y-2 mb-6">
          {item.bullets.map(b => (
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
      <div className={`flex-1 rounded-2xl border p-6 ${c.bg} ${c.border}`}>
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <p className="text-sm font-bold text-slate-800 mb-1">{item.title}</p>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">{item.tagline}</p>
        <div className="space-y-2">
          {item.bullets.map((b, i) => (
            <motion.div key={b}
              initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }} viewport={{ once: true }}
              className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-white/80 shadow-sm text-xs text-slate-700">
              <ChevronRight className={`w-3 h-3 flex-shrink-0 ${c.icon}`} />
              {b}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

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
        <div>
          {USE_CASES.map((item, i) => (
            <SolutionCard key={item.id} item={item} index={i} colorKey={item.color} />
          ))}
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Industries"
            title="Built for Africa's fastest-growing sectors"
            subtitle="Orbin is designed with the realities of emerging market GTM teams in mind — local channels, regional context, global ambition."
          />
          <div className="grid md:grid-cols-2 gap-5">
            {INDUSTRIES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.id} id={item.id}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{item.description}</p>
                  <ul className="space-y-1.5">
                    {item.bullets.map(b => (
                      <li key={b} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{b}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPANY TYPES */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <SectionHeader
          label="Company Types"
          title="Right-sized for where you are"
          subtitle="Orbin adapts to your growth stage — from zero to one outbound motion to scaling a full GTM organisation."
        />
        <div className="grid md:grid-cols-3 gap-5">
          {COMPANY_TYPES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.id} id={item.id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 mb-4 italic">{item.tagline}</p>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{item.description}</p>
                <ul className="space-y-1.5">
                  {item.bullets.map(b => (
                    <li key={b} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* TEAMS */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            label="Teams"
            title="One platform, every revenue function"
            subtitle="Sales, marketing, RevOps, and leadership — Orbin keeps every GTM function aligned and executing together."
          />
          <div className="grid md:grid-cols-2 gap-5">
            {TEAMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.id} id={item.id}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{item.description}</p>
                      <ul className="space-y-1.5">
                        {item.bullets.map(b => (
                          <li key={b} className="flex items-center gap-2 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <WaitlistCTA />
      <Footer />
    </div>
  );
}
