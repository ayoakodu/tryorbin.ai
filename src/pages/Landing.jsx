import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, ArrowRight, ChevronRight, Check, Sparkles, 
  Globe, TrendingUp, Users, Mail, BarChart3, 
  Target, Shield, Star, Play, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const features = [
  { icon: Users, title: 'Smart Prospecting', desc: 'AI-powered contact discovery and enrichment for African and emerging markets.' },
  { icon: Mail, title: 'Multichannel Outreach', desc: 'Email, WhatsApp, LinkedIn, SMS — all unified in one intelligent workspace.' },
  { icon: TrendingUp, title: 'Pipeline Intelligence', desc: 'Real-time CRM with AI deal scoring and revenue forecasting built in.' },
  { icon: Sparkles, title: 'AI Revenue Copilot', desc: 'Your always-on GTM assistant that generates copy, insights, and strategies.' },
  { icon: BarChart3, title: 'Unified Analytics', desc: 'Attribution, funnel analysis, and team performance — all in one view.' },
  { icon: Target, title: 'Account-Based Marketing', desc: 'Target buying committees and orchestrate multi-touch ABM campaigns.' },
];

const testimonials = [
  { name: 'Amara Diallo', role: 'VP Sales, Flutterwave', quote: 'RVNU replaced 4 tools we were using. Our SDR team is 3x more productive.', avatar: 'AD' },
  { name: 'Tunde Okafor', role: 'Head of Growth, Paystack', quote: 'The AI copilot writes better outbound than most of our reps. Game changer.', avatar: 'TO' },
  { name: 'Kefilwe Mthembu', role: 'CMO, Yoco', quote: 'Finally a GTM platform built for how we actually work in Africa.', avatar: 'KM' },
];

const pricingPlans = [
  { name: 'Starter', price: '$49', period: '/mo', desc: 'For early-stage teams', features: ['500 contacts', '3 sequences', 'Email outreach', 'Basic CRM', 'AI Copilot (50 credits)'] },
  { name: 'Growth', price: '$149', period: '/mo', desc: 'For scaling teams', features: ['5,000 contacts', 'Unlimited sequences', 'All channels', 'Full CRM + Pipeline', 'AI Copilot (500 credits)', 'Campaign automation', 'Analytics dashboard'], popular: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large revenue teams', features: ['Unlimited contacts', 'Unlimited sequences', 'All channels + API', 'Advanced ABM', 'Custom AI models', 'Dedicated CSM', 'SSO + Custom integrations'] },
];

const faqs = [
  { q: 'Is RVNU built for African businesses?', a: 'Yes. RVNU is purpose-built for African and emerging market GTM teams, with support for regional communication channels like WhatsApp and SMS, local currencies, and context-aware AI.' },
  { q: 'Can I replace HubSpot and Apollo with RVNU?', a: 'Absolutely. RVNU combines prospecting, CRM, outreach, marketing automation, and analytics into one unified platform — eliminating the need for multiple expensive tools.' },
  { q: 'Does RVNU have an AI assistant?', a: 'Yes. The AI Revenue Copilot is embedded throughout the platform and can generate emails, analyze pipeline, create ICPs, suggest campaigns, and more.' },
  { q: 'What channels does RVNU support?', a: 'Email, LinkedIn, WhatsApp, SMS, phone tasks, and website chat — all unified in one multichannel workspace.' },
  { q: 'Is there a free trial?', a: 'Yes. Join the waitlist to get early access and a 30-day free trial when we launch.' },
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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 backdrop-blur-xl" style={{ background: 'rgba(6, 11, 26, 0.9)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold gradient-text">RVNU</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Customers</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign in</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green-sm">
                Get Started <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-border/30 px-6 py-4 space-y-3">
            {['Features', 'Pricing', 'Customers', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>{item}</a>
            ))}
            <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
              <Button className="w-full mt-2 bg-primary text-primary-foreground">Enter App</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full" 
          style={{ background: 'radial-gradient(circle, rgba(74, 222, 128, 0.06) 0%, transparent 70%)' }} />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered GTM for Emerging Markets
              <ChevronRight className="w-3 h-3" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              The Operating System<br />
              <span className="gradient-text">for Modern GTM Teams</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              RVNU unifies prospecting, outreach, CRM, and marketing automation into one AI-native platform — 
              built for revenue teams across Africa and emerging markets.
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
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
            className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            {['No credit card required', '30-day free trial', 'Cancel anytime'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-primary" />
                <span>{t}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero Product Preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="relative max-w-5xl mx-auto mt-20">
          <div className="glass rounded-2xl overflow-hidden border border-border/60 glow-green shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="flex-1 h-6 bg-secondary/50 rounded-md mx-4 flex items-center px-3">
                <span className="text-xs text-muted-foreground">app.rvnu.ai/dashboard</span>
              </div>
            </div>
            <div className="h-64 md:h-80 bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 mesh-bg" />
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 p-6 w-full max-w-3xl">
                {[
                  { label: 'Pipeline', value: '$2.4M', color: 'text-primary' },
                  { label: 'Meetings', value: '47', color: 'text-cyan-400' },
                  { label: 'Sequences', value: '12 Active', color: 'text-violet-400' },
                  { label: 'AI Actions', value: '234', color: 'text-amber-400' },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-xl p-4 text-center">
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Logos / Social Proof */}
      <section className="py-12 px-6 border-y border-border/30">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-8">Trusted by GTM teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50">
            {['Flutterwave', 'Paystack', 'Andela', 'Moniepoint', 'Chipper', 'Yoco', 'Wave'].map(name => (
              <span key={name} className="text-sm font-semibold text-muted-foreground">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-xs text-muted-foreground mb-4">
              <Zap className="w-3 h-3 text-primary" /> Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Everything your GTM team needs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">One platform to replace your fragmented stack — prospecting, outreach, CRM, campaigns, and intelligence unified.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, delay: i * 0.08 }} viewport={{ once: true }}
                className="glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Highlight */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.05) 0%, transparent 70%)' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-8 md:p-12 border border-primary/20 glow-green">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium mb-6">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse-glow" /> AI Revenue Copilot
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4">Your always-on GTM intelligence engine</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">Ask RVNU anything. Generate outbound sequences, analyze your pipeline, identify at-risk deals, or create full campaign briefs — all in seconds.</p>
                <div className="space-y-3">
                  {['Generate a 5-step outbound sequence for SaaS fintech CTOs', 'Which deals are at risk this quarter?', 'Write a LinkedIn post about our product launch', 'Suggest 10 target accounts for our ICP'].map(prompt => (
                    <div key={prompt} className="flex items-center gap-2 text-sm">
                      <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">"{prompt}"</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-xl p-4 border border-border/40">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/30">
                  <div className="w-6 h-6 rounded-lg gradient-brand flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-xs font-semibold text-primary">RVNU AI</span>
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-accent rounded-lg p-3 text-muted-foreground text-xs">
                    Generate outbound email for fintech CTOs at Series B companies in Nigeria
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs leading-relaxed">
                    <p className="text-primary font-medium mb-1">Subject: Quick question about your payment stack</p>
                    <p className="text-muted-foreground">Hi [First Name], I noticed [Company] recently raised a Series B — congrats! At this stage, most fintech CTOs I speak to are dealing with...</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs border border-primary/20">Use this</div>
                    <div className="px-3 py-1.5 rounded-md bg-accent text-xs text-muted-foreground">Regenerate</div>
                    <div className="px-3 py-1.5 rounded-md bg-accent text-xs text-muted-foreground">Edit tone</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">GTM teams love RVNU</h2>
            <p className="text-muted-foreground">Hear from revenue operators across Africa's fastest-growing companies.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="glass rounded-xl p-6 hover:border-primary/20 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Built for African market budgets. No hidden fees, no surprise charges.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`glass rounded-xl p-6 relative flex flex-col ${plan.popular ? 'border-primary/50 glow-green-sm' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{plan.desc}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black gradient-text">{plan.price}</span>
                    <span className="text-muted-foreground text-sm pb-1">{plan.period}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <Button className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary hover:bg-accent text-foreground'}`}>
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </div>
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
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
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

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-2xl p-10 border border-primary/20 glow-green relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.07) 0%, transparent 70%)' }} />
            <div className="relative">
              <Zap className="w-10 h-10 text-primary mx-auto mb-4 animate-pulse-glow" />
              <h2 className="text-4xl font-black mb-3">Ready to transform your GTM?</h2>
              <p className="text-muted-foreground mb-8">Join 200+ revenue teams already on the RVNU waitlist.</p>
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 glow-green text-base font-semibold">
                  Enter the App <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
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
          <p className="text-xs text-muted-foreground">© 2026 RVNU. Built for Africa's revenue operators.</p>
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