import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, ArrowRight, ChevronRight, Check, Sparkles,
  Globe, TrendingUp, Users, Mail, BarChart3,
  Target, Star, Menu, X, Brain, Search, 
  MessageSquare, PieChart, Layers, Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const africanCountries = [
  'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Egypt', 'Rwanda', 'Senegal',
  'Ethiopia', 'Tanzania', 'Uganda', 'Côte d\'Ivoire', 'Cameroon', 'Morocco',
  'Tunisia', 'Algeria', 'Angola', 'Mozambique', 'Zambia', 'Zimbabwe',
  'Botswana', 'Namibia', 'Mali', 'Burkina Faso', 'Guinea', 'Benin',
  'Togo', 'Niger', 'Chad', 'Somalia', 'Sudan', 'DR Congo', 'Congo',
  'Gabon', 'Malawi', 'Sierra Leone', 'Liberia', 'Mauritius', 'Cape Verde',
];

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'AI Discovers & Enriches Your Ideal Prospects',
    description: 'RVNU is being designed to automatically surface high-fit leads from across African and emerging markets — enriching each contact with firmographic data, intent signals, and buying stage indicators, so your team starts every conversation informed.',
    tags: ['Smart ICP Matching', 'Intent Signals', 'Contact Enrichment'],
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Orchestrate Personalised Multichannel Outreach',
    description: 'Our vision is a platform where AI drafts hyper-personalised sequences across email, WhatsApp, LinkedIn, and SMS — tailored to each prospect\'s context, role, and industry. Every touchpoint, unified in one workspace.',
    tags: ['Email', 'WhatsApp', 'LinkedIn', 'SMS'],
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'A Living Pipeline That Thinks With You',
    description: 'RVNU\'s planned CRM will go beyond tracking — it\'s designed to score deals, flag risk, forecast revenue, and recommend next best actions, so your team focuses energy where it matters most.',
    tags: ['Deal Scoring', 'Risk Alerts', 'Revenue Forecasting'],
  },
  {
    number: '04',
    icon: Target,
    title: 'Account-Based Campaigns, Built for Committees',
    description: 'We\'re building a dedicated ABM module designed to map buying committees, track multi-stakeholder engagement, and orchestrate coordinated campaigns across every decision-maker in a target account.',
    tags: ['Buying Committees', 'Multi-touch ABM', 'Account Intelligence'],
  },
  {
    number: '05',
    icon: Brain,
    title: 'Your AI Revenue Copilot, Always On',
    description: 'Imagine asking your GTM platform: "Which deals are at risk this quarter?" or "Write me a cold email for fintech CTOs in Lagos." RVNU\'s AI Copilot is designed to answer — generating strategies, content, and insights on demand.',
    tags: ['Strategy Generation', 'Content Creation', 'Pipeline Analysis'],
  },
  {
    number: '06',
    icon: PieChart,
    title: 'Unified Analytics Across Your Entire GTM',
    description: 'Every outreach, campaign, and deal will feed into a single analytics layer — giving your team clear attribution, funnel visibility, and performance intelligence without stitching together data from multiple tools.',
    tags: ['Attribution', 'Funnel Analysis', 'Team Performance'],
  },
];

const faqs = [
  { q: 'Who is RVNU built for?', a: 'RVNU is being designed specifically for revenue and GTM teams operating in Africa and emerging markets — including sales, marketing, and growth functions at startups, scale-ups, and enterprise organisations.' },
  { q: 'How is RVNU different from HubSpot or Apollo?', a: 'RVNU is designed as an AI-native platform purpose-built for emerging markets. Rather than adapting tools built for Western markets, we\'re building from scratch with local context — regional channels like WhatsApp, local currencies, and market-aware AI.' },
  { q: 'What does "AI-native" mean for RVNU?', a: 'AI is not a bolt-on feature — it\'s intended to be embedded throughout every workflow: from prospect discovery and outreach personalisation to deal scoring and campaign optimisation.' },
  { q: 'What channels will RVNU support?', a: 'Our roadmap includes email, LinkedIn, WhatsApp, SMS, and phone tasks — all unified in one multichannel workspace, reflecting how GTM teams in Africa actually communicate.' },
  { q: 'When will RVNU launch, and how do I get early access?', a: 'We\'re currently in development and building towards our early access launch. Join the waitlist to be among the first to experience RVNU and help shape the platform.' },
];

const earlyAccessBenefits = [
  'First access when we launch',
  'Shape the product with direct feedback',
  'Locked-in early adopter pricing',
  'Priority onboarding support',
];

export default function Landing() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleJoin = () => {
    if (email) setJoined(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-inter overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 backdrop-blur-xl" style={{ background: 'rgba(6, 11, 26, 0.92)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold gradient-text">RVNU</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#ai-copilot" className="hover:text-foreground transition-colors">AI Copilot</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs">Preview App</Button>
            </Link>
            <a href="#waitlist">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green-sm text-xs">
                Join Waitlist <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </a>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border/30 px-6 py-4 space-y-3">
            {['How It Works', 'AI Copilot', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>{item}</a>
            ))}
            <a href="#waitlist" onClick={() => setMobileOpen(false)}>
              <Button className="w-full mt-2 bg-primary text-primary-foreground">Join Waitlist</Button>
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(74, 222, 128, 0.07) 0%, transparent 65%)' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5 animate-pulse-glow" />
              Coming Soon — AI-Powered GTM for Emerging Markets
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              <span className="gradient-text">The AI-Native GTM Operating System.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              RVNU is an AI-native Go-To-Market operating system helping revenue teams across Africa and emerging markets unify prospecting, outreach, CRM, and intelligence in one platform.
            </p>
          </motion.div>

          {/* Waitlist CTA */}
          <motion.div id="waitlist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            {!joined ? (
              <>
                <Input
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="sm:w-72 h-12 bg-secondary/50 border-border/60 text-center sm:text-left"
                />
                <Button onClick={handleJoin} className="h-12 px-8 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 glow-green">
                  Join Waitlist <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary font-medium">
                <Check className="w-5 h-5" /> You're on the waitlist! We'll be in touch soon.
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
            {earlyAccessBenefits.map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero Dashboard Preview */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}
          className="relative max-w-5xl mx-auto mt-24">
          <div className="glass rounded-2xl overflow-hidden border border-border/60 glow-green shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-secondary/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-primary/50" />
              </div>
              <div className="flex-1 h-6 bg-secondary/50 rounded-md mx-4 flex items-center px-3">
                <span className="text-xs text-muted-foreground">app.uservnu.io — Early Access Preview</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                <span className="text-xs text-primary font-medium">In Development</span>
              </div>
            </div>
            <div className="h-64 md:h-80 bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 mesh-bg" />
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 p-6 w-full max-w-3xl">
                {[
                  { label: 'Pipeline Value', value: '$2.4M', color: 'text-primary', sub: 'Planned module' },
                  { label: 'AI Actions', value: '234', color: 'text-cyan-400', sub: 'Planned module' },
                  { label: 'Active Sequences', value: '12', color: 'text-violet-400', sub: 'Planned module' },
                  { label: 'Meetings Booked', value: '47', color: 'text-amber-400', sub: 'Planned module' },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-xl p-4 text-center">
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground/50 mt-3">Illustrative preview — RVNU is currently in active development.</p>
        </motion.div>
      </section>

      {/* Building For */}
      <section className="py-10 px-6 border-y border-border/30">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-muted-foreground uppercase tracking-widest text-center mb-6">Designed for GTM teams building in</p>
          <div className="overflow-hidden relative">
            <div className="flex animate-marquee whitespace-nowrap gap-10 opacity-40">
              {[...africanCountries, ...africanCountries].map((name, i) => (
                <span key={i} className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 flex-shrink-0">
                  <Globe className="w-3 h-3" /> {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-xs text-muted-foreground mb-4">
              <Zap className="w-3 h-3 text-primary" /> The RVNU Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-5">How RVNU Will Power<br />Your GTM Engine</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A step-by-step look at the AI-driven workflows we're designing — from first contact to closed deal and beyond.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content */}
                <div className="flex-1 glass rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 group">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <step.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-mono text-primary/60 font-bold">{step.number}</span>
                        <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-xs border border-primary/20 bg-primary/5 text-primary/80">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step number visual */}
                <div className="hidden md:flex flex-shrink-0 w-20 flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center">
                    <span className="text-xl font-black gradient-text">{step.number}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-16 bg-gradient-to-b from-primary/30 to-transparent" />
                  )}
                </div>

                {/* Placeholder visual */}
                <div className="flex-1 glass rounded-2xl p-6 border border-border/40 min-h-[160px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                      <step.icon className="w-6 h-6 text-primary/60" />
                    </div>
                    <p className="text-xs text-muted-foreground/50 font-mono">UI preview coming soon</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Copilot Highlight */}
      <section id="ai-copilot" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.05) 0%, transparent 70%)' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-8 md:p-14 border border-primary/20 glow-green">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium mb-6">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse-glow" /> AI Revenue Copilot — Planned Feature
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4">An intelligence engine embedded in every workflow</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  We're designing RVNU's AI Copilot to be your always-on GTM assistant — capable of generating outbound sequences, analysing pipeline risk, identifying target accounts, and creating campaign briefs. All from a single conversational interface.
                </p>
                <div className="space-y-3">
                  {[
                    '"Generate a 5-step outbound sequence for fintech CTOs in Nigeria"',
                    '"Which deals in my pipeline are most at risk this quarter?"',
                    '"Suggest 10 target accounts matching our ICP in East Africa"',
                    '"Write a LinkedIn post announcing our product launch"',
                  ].map(prompt => (
                    <div key={prompt} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground italic">{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Chat Mockup */}
              <div className="glass rounded-xl p-4 border border-border/40">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/30">
                  <div className="w-6 h-6 rounded-lg gradient-brand flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-xs font-semibold text-primary">RVNU AI Copilot</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                    <span className="text-[10px] text-muted-foreground">In development</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-accent rounded-lg p-3 text-muted-foreground text-xs">
                    Generate a cold email for Series B fintech CTOs in Lagos
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs leading-relaxed">
                    <p className="text-primary font-semibold mb-1.5">Subject: Quick question about your payment infrastructure</p>
                    <p className="text-muted-foreground">Hi [First Name], I noticed [Company] recently raised a Series B — congrats on the milestone. At this stage, most fintech CTOs I speak to are navigating the challenge of...</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">Use this</div>
                    <div className="px-3 py-1.5 rounded-md bg-accent text-xs text-muted-foreground cursor-pointer hover:bg-accent/80 transition-colors">Regenerate</div>
                    <div className="px-3 py-1.5 rounded-md bg-accent text-xs text-muted-foreground cursor-pointer hover:bg-accent/80 transition-colors">Edit tone</div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground/40 mt-3 text-center">Illustrative concept — functionality in development</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why RVNU */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-4">Built for how Africa does business</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Most GTM tools were built for Silicon Valley workflows. RVNU is being designed from the ground up for emerging market realities.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Globe, title: 'Market-Aware AI', desc: 'Our AI models are intended to understand the nuances of African business contexts, from local industries to regional buyer behaviour.' },
              { icon: MessageSquare, title: 'Channels That Reflect Reality', desc: 'WhatsApp isn\'t a secondary channel in Africa — it\'s often the primary one. RVNU is being built with this front of mind.' },
              { icon: Layers, title: 'One Platform, Not a Stack', desc: 'We\'re designing RVNU to replace the 4-6 tools most GTM teams are currently juggling — from prospecting to analytics.' },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}
                className="glass rounded-xl p-6 hover:border-primary/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-14">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-accent/20 transition-colors">
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-2xl p-10 md:p-14 border border-primary/20 glow-green relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.08) 0%, transparent 70%)' }} />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-6">
                <Zap className="w-7 h-7 text-black" strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Be first to experience RVNU</h2>
              <p className="text-muted-foreground mb-3 max-w-md mx-auto leading-relaxed">
                We're building something new for Africa's revenue operators. Join the waitlist to get early access, shape the product, and lock in founder pricing.
              </p>
              <p className="text-xs text-muted-foreground/50 mb-8">RVNU is currently in development. No credit card required to join the waitlist.</p>

              {!joined ? (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Input
                    placeholder="Enter your work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="sm:w-72 h-12 bg-secondary/50 border-border/60 text-center sm:text-left"
                  />
                  <Button onClick={handleJoin} size="lg" className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 glow-green font-semibold">
                    Join Waitlist <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary font-medium">
                  <Check className="w-5 h-5" /> You're on the waitlist! We'll be in touch.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-bold gradient-text">RVNU</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 RVNU. Built for Africa's revenue operators. Currently in development.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}