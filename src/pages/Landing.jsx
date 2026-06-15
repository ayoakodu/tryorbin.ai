import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ArrowRight, ChevronRight, Check, Sparkles,
  Globe, TrendingUp, Users, Mail, BarChart3,
  Target, Brain, Search, MessageSquare, PieChart, Layers, Database, Play, GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NavBar from '@/components/landing/NavBar';
import Footer from '@/components/landing/Footer';
import OrbinAIWorkflowModal from '@/components/landing/OrbinAIWorkflowModal';
import OrbinAILogo from '@/components/ui/OrbinAILogo.jsx';

const ORBIN_WORDMARK = 'https://media.base44.com/images/public/6a075dcc5cdaf3650af66cec/ca2b52c96_OrbinAIWordmark.png';
import HeroDashboardPreview from '@/components/landing/HeroDashboardPreview';

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
    description: 'Orbin is being designed to automatically surface high-fit leads from across African and emerging markets — enriching each contact with firmographic data, intent signals, and buying stage indicators, so your team starts every conversation informed.',
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
    title: 'Unified Pipeline & GTM Workspace',
    description: 'Orbin centralizes pipeline management, team collaboration, deal visibility, and GTM execution into one connected workspace — helping revenue teams stay aligned and focused on the right opportunities.',
    tags: ['Pipeline Visibility', 'Team Collaboration', 'Deal Tracking', 'GTM Workspace'],
  },
  {
    number: '04',
    icon: Target,
    title: 'Account-Based Targeting & Outreach',
    description: 'Segment and organize high-fit accounts, coordinate outreach across your team, and execute targeted campaigns from one unified workspace.',
    tags: ['Account Segmentation', 'Collaborative Outreach', 'Multi-touch Campaigns', 'Account Intelligence'],
  },
  {
    number: '05',
    icon: Brain,
    title: 'Your AI GTM Assistant',
    description: 'Use AI to generate outreach ideas, draft messaging, summarize insights, and assist your team with day-to-day GTM execution workflows.',
    tags: ['AI Messaging', 'Outreach Assistance', 'Content Suggestions', 'Workflow Support'],
  },
  {
    number: '06',
    icon: PieChart,
    title: 'Unified GTM Analytics & Visibility',
    description: 'Track campaign activity, engagement performance, outreach metrics, and pipeline visibility from one centralized GTM workspace.',
    tags: ['Campaign Analytics', 'Engagement Tracking', 'Pipeline Visibility', 'Team Performance'],
  },
];

const faqs = [
  { q: 'Who is Orbin built for?', a: 'Orbin is being designed specifically for revenue and GTM teams operating in Africa and emerging markets — including sales, marketing, and growth functions at startups, scale-ups, and enterprise organisations.' },
  { q: 'How is Orbin different from HubSpot or Apollo?', a: 'Orbin is designed as an AI-native platform purpose-built for emerging markets. Rather than adapting tools built for Western markets, we\'re building from scratch with local context — regional channels like WhatsApp, local currencies, and market-aware AI.' },
  { q: 'What does "AI-native" mean for Orbin?', a: 'AI is not a bolt-on feature — it\'s intended to be embedded throughout every workflow: from prospect discovery and outreach personalisation to deal scoring and campaign optimisation.' },
  { q: 'What channels will Orbin support?', a: 'Our roadmap includes email, LinkedIn, WhatsApp, SMS, and phone tasks — all unified in one multichannel workspace, reflecting how GTM teams in Africa actually communicate.' },
  { q: 'When will Orbin launch, and how do I get early access?', a: 'We\'re currently in development and building towards our early access launch. Join the waitlist to be among the first to experience Orbin and help shape the platform.' },
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
  const [openFaq, setOpenFaq] = useState(null);
  const [showWorkflow, setShowWorkflow] = useState(false);

  const handleJoin = () => {
    if (email) setJoined(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-inter overflow-x-hidden">

      <NavBar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden" style={{ background: '#060b1a' }}>
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(74, 222, 128, 0.07) 0%, transparent 65%)' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5 animate-pulse-glow" />
              AI-Native GTM Execution for Emerging Market Revenue Teams
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-[1.15] tracking-tight mb-5">
              <span className="gradient-text">The AI-Native GTM Execution Platform.</span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Orbin automates the full GTM execution cycle — from multichannel outreach and pipeline management to AI-driven follow-ups and revenue forecasting — built for revenue teams across Africa and emerging markets.
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
                  className="sm:w-72 h-12 border-primary/40 text-center sm:text-left text-white placeholder:text-slate-300"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
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
            className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-300 mb-8">
            {earlyAccessBenefits.map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </motion.div>

          {/* Secondary CTA */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
            className="flex justify-center">
            <button
              onClick={() => setShowWorkflow(true)}
              className="group flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors duration-200"
            >
              <span className="w-7 h-7 rounded-full border border-slate-500 group-hover:border-primary/60 flex items-center justify-center transition-colors duration-200 group-hover:bg-primary/10">
                <Play className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors duration-200 ml-0.5" />
              </span>
              <span className="border-b border-dashed border-slate-600 group-hover:border-primary/50 transition-colors duration-200">
                See How Orbin Works
              </span>
            </button>
          </motion.div>
        </div>

        {/* Hero Dashboard Preview */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}>
          <HeroDashboardPreview />
        </motion.div>
      </section>

      {/* Building For */}
      <section className="py-10 px-6 border-y border-border/30">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-slate-500 uppercase tracking-widest text-center mb-6">Designed for GTM teams building in</p>
          <div className="overflow-hidden relative">
            <div className="flex animate-marquee whitespace-nowrap gap-10 opacity-80">
              {[...africanCountries, ...africanCountries].map((name, i) => (
                <span key={i} className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 flex-shrink-0">
                  <Globe className="w-3 h-3" /> {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-200 bg-green-50 text-xs text-green-700 mb-4">
              <Zap className="w-3 h-3 text-green-600" /> The Orbin Execution Engine
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">How Orbin Powers Your GTM Execution</h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              A step-by-step look at the AI-driven execution workflows we're building — from first touchpoint to closed deal and beyond.
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
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:border-green-300 transition-all duration-300 group">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                        <step.icon className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-mono text-green-500 font-bold">{step.number}</span>
                        <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mb-5">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-xs border border-green-200 bg-green-50 text-green-700">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step number visual */}
                <div className="hidden md:flex flex-shrink-0 w-20 flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full border-2 border-green-200 bg-green-50 flex items-center justify-center">
                    <span className="text-base font-bold gradient-text">{step.number}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-16 bg-gradient-to-b from-green-300 to-transparent" />
                  )}
                </div>

                {/* Placeholder visual */}
                <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 min-h-[160px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-3">
                      <step.icon className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-xs text-gray-400 font-mono">UI preview coming soon</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Copilot Highlight */}
      <section id="ai-copilot" className="py-20 px-6 relative overflow-hidden" style={{ background: '#060b1a' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.05) 0%, transparent 70%)' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-7 md:p-10 border border-primary/20 glow-green">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium mb-6">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse-glow" /> Embedded AI Workflow Assistance
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-4">AI assistance embedded across your GTM workflows</h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Orbin uses embedded AI assistance to help revenue teams draft outreach, generate ideas, summarize account insights, and support day-to-day GTM execution workflows directly inside the platform.
                </p>
                <div className="space-y-3">
                  {[
                    '"Generate a 5-step outbound sequence for fintech CTOs in Nigeria"',
                    '"Suggest high-fit B2B startups hiring SDRs in Kenya"',
                    '"Write a LinkedIn launch post for our new product"',
                    '"Summarize the top accounts engaged this week"',
                  ].map(prompt => (
                    <div key={prompt} className="flex items-start gap-2 text-xs">
                      <ChevronRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
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
                  <span className="text-xs font-semibold text-primary">Orbin AI Copilot</span>
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

      {/* Why Orbin AI */}
      <section className="py-16 px-6" style={{ background: '#060b1a' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3 gradient-text">Track smarter. Execute faster.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Most GTM tools focus on visibility. Orbin helps revenue teams execute outreach, manage follow-ups, coordinate workflows, and move pipeline faster — with AI assistance embedded throughout.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: MessageSquare, title: 'WhatsApp-Native Execution', desc: 'WhatsApp is a core GTM channel across emerging markets. Orbin treats it as a first-class execution channel for outreach, follow-ups, engagement tracking, and workflow coordination.' },
              { icon: GitBranch, title: 'Workflow Automation, Not Dashboards', desc: 'Orbin helps revenue teams coordinate outreach, manage follow-ups, and streamline GTM workflows from one unified execution workspace.' },
              { icon: TrendingUp, title: 'Revenue Outcomes Over Features', desc: 'Every workflow is designed around execution outcomes — helping teams move pipeline, engage accounts, and coordinate GTM activity from one centralized workspace.' },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }}
                className="border border-white/10 rounded-xl p-6 hover:border-primary/40 transition-all group" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8 text-gray-900">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-sm text-gray-900">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-2xl p-8 md:p-12 border border-primary/20 glow-green relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.08) 0%, transparent 70%)' }} />
            <div className="relative">
              <div className="flex items-center justify-center mx-auto mb-6">
                <OrbinAILogo size={96} className="rounded-2xl" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Be first to execute with Orbin</h2>
              <p className="text-muted-foreground mb-1 max-w-2xl mx-auto whitespace-nowrap">
                The AI-native GTM execution platform for Africa's revenue teams.
              </p>
              <p className="text-muted-foreground mb-3 max-w-md mx-auto leading-relaxed">
                Coordinate outreach, manage pipeline workflows, and streamline follow-ups from one unified workspace.
              </p>
              <p className="text-xs text-slate-400 mb-8">Orbin is currently in development. Early waitlist members will receive priority access and product updates.</p>

              {!joined ? (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Input
                    placeholder="Enter your work email to join the waitlist"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="sm:w-72 h-12 border-primary/40 text-center sm:text-left text-slate-800 placeholder:text-slate-500 bg-white"
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

      <Footer />

      <AnimatePresence>
        {showWorkflow && <OrbinAIWorkflowModal onClose={() => setShowWorkflow(false)} />}
      </AnimatePresence>
    </div>
  );
}