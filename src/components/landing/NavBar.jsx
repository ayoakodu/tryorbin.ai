import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, ArrowRight, ChevronDown, Menu, X,
  Target, Shield, Layers, Search, Users, TrendingUp, Brain,
  Database, List, Map, Mail, BookOpen, Building, Briefcase,
  GraduationCap, BarChart2, Filter,
  MessageCircle, GitBranch, BarChart, Share2, Eye,
  Bot, Workflow, PieChart, Handshake, Cpu, Wallet, Truck,
  Megaphone, Rocket, Store, UserCheck, Network,
  CalendarCheck, Inbox, Globe, LineChart,
  Activity, LayoutDashboard, UserCog, Gauge, Send,
  FileText, Bell, Stars,
  Newspaper, LifeBuoy, Video, Monitor, MessageSquare,
  UserPlus, Puzzle, ContactRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrbinAILogo from '@/components/ui/OrbinAILogo.jsx';

const navData = {
  Product: {
    sections: [
      {
        label: 'PLATFORM',
        items: [
          { icon: Mail, title: 'AI Engagement', desc: 'Run AI-powered multichannel outbound campaigns across email, WhatsApp, LinkedIn, and SMS.' },
          { icon: Brain, title: 'AI Copilot', desc: 'Embedded AI assistants helping teams generate campaigns, personalize messaging, and automate workflows.' },
          { icon: Target, title: 'Pipeline', desc: 'Lightweight CRM and pipeline visibility for modern revenue execution teams.' },
          { icon: Workflow, title: 'Automation', desc: 'Automate follow-ups, tasks, reminders, and GTM workflows using AI.' },
          { icon: Users, title: 'Collaboration', desc: 'Shared GTM workspaces for SDRs, AEs, marketing, and revenue teams.' },
          { icon: PieChart, title: 'Analytics', desc: 'Track engagement, meetings, conversion rates, and campaign performance.' },
        ],
      },
      {
        label: 'FEATURES',
        cols: 2,
        items: [
          { icon: GitBranch, title: 'AI Sequences', desc: 'Generate and launch AI-powered multichannel outbound campaigns.' },
          { icon: MessageCircle, title: 'WhatsApp Workflows', desc: 'Run WhatsApp-native engagement campaigns with AI-powered messaging and shared inboxes.' },
          { icon: UserCog, title: 'AI Personalization', desc: 'Generate personalized outreach, follow-ups, and messaging at scale.' },
          { icon: Bot, title: 'AI Agents', desc: 'AI assistants for campaign optimization, pipeline execution, and GTM productivity.' },
          { icon: Zap, title: 'Workflow Automation', desc: 'Create trigger-based automations for outreach, follow-ups, and pipeline actions.' },
          { icon: Globe, title: 'GTM Intelligence', desc: 'Unified engagement insights, account summaries, and activity visibility.' },
          { icon: Network, title: 'Team Workspaces', desc: 'Collaborative campaign execution and shared GTM coordination.' },
          { icon: LineChart, title: 'Revenue Visibility', desc: 'Monitor meetings, conversions, engagement, and pipeline activity in real time.' },
        ],
      },
    ],
  },
  Solutions: {
    sections: [
      {
        label: 'USE CASES',
        items: [
          { icon: Search, title: 'Outbound Prospecting', desc: 'Find and engage your ideal buyers at scale.' },
          { icon: CalendarCheck, title: 'Meeting Generation', desc: 'Book more qualified meetings with less effort.' },
          { icon: TrendingUp, title: 'Pipeline Acceleration', desc: 'Move deals faster with AI-driven engagement.' },
          { icon: Inbox, title: 'Lead Follow-Up', desc: 'Never let a warm lead go cold again.' },
          { icon: ArrowRight, title: 'See all use cases', desc: 'Explore every workflow Orbin supports.', highlight: true, seeAll: true },
        ],
      },
      {
        label: 'INDUSTRIES',
        items: [
          { icon: Cpu, title: 'SaaS & Enterprise Software', desc: 'Target software buyers with precision and intent.' },
          { icon: Wallet, title: 'FinTech & Payments', desc: 'Reach financial decision-makers at the right time.' },
          { icon: Truck, title: 'Logistics & Supply Chain', desc: 'Engage logistics operators and procurement teams.' },
          { icon: Briefcase, title: 'Agencies & Consulting', desc: 'Win new retainers and scale client pipelines.' },
          { icon: ArrowRight, title: 'See all 12 industries', desc: 'Explore every vertical Orbin supports.', highlight: true, seeAll: true },
        ],
      },
      {
        label: 'COMPANY TYPE',
        items: [
          { icon: Stars, title: 'Startups', desc: 'Launch your GTM motion from day one.' },
          { icon: Store, title: 'SMB & Mid-Market', desc: 'Scale revenue without scaling headcount.' },
          { icon: Activity, title: 'High-Growth Companies', desc: 'Accelerate pipeline for teams moving fast.' },
          { icon: ArrowRight, title: 'See all company types', desc: 'Find the right fit for your organization.', highlight: true, seeAll: true },
        ],
      },
      {
        label: 'TEAMS',
        items: [
          { icon: Handshake, title: 'Sales Teams', desc: 'Close more deals and book more meetings with AI.' },
          { icon: Megaphone, title: 'Marketing Teams', desc: 'Run campaigns that convert across every channel.' },
          { icon: LayoutDashboard, title: 'Revenue Operations', desc: 'Orchestrate data, tools, and GTM execution.' },
          { icon: UserCheck, title: 'Founders & GTM Leaders', desc: 'Own your revenue motion from the top down.' },
        ],
      },
    ],
  },
  Workflows: {
    sections: [
      {
        label: 'WORKFLOWS',
        cols: 2,
        items: [
          { icon: GitBranch, title: 'Sequence Builder' },
          { icon: Bot, title: 'AI Follow-Ups' },
          { icon: MessageCircle, title: 'WhatsApp Outreach' },
          { icon: Share2, title: 'Lead Routing' },
          { icon: BarChart2, title: 'Pipeline Tracking' },
          { icon: Send, title: 'Meeting Handoffs' },
          { icon: Workflow, title: 'Task Automation' },
          { icon: Gauge, title: 'Engagement Tracking' },
          { icon: Users, title: 'Team Collaboration' },
          { icon: Search, title: 'AI Prospect Research' },
        ],
      },
    ],
  },
  Resources: {
    outerCols: 2,
    sections: [
      {
        label: 'CONTENT',
        cols: 2,
        items: [
          { icon: BookOpen, title: 'Blog', desc: 'Insights, trends, and GTM strategies from the Orbin team.' },
          { icon: Newspaper, title: 'Product Updates', desc: 'See the latest features and improvements to Orbin.' },
          { icon: Eye, title: 'Customer Stories', desc: 'How revenue teams use Orbin to grow faster.' },
        ],
      },
      {
        label: 'LEARN',
        cols: 2,
        items: [
          { icon: LifeBuoy, title: 'Help Center' },
          { icon: Rocket, title: 'Getting Started' },
          { icon: Database, title: 'API Documentation' },
          { icon: Network, title: 'Integrations' },
          { icon: Map, title: 'GTM Playbooks' },
          { icon: FileText, title: 'Revenue Templates' },
          { icon: Video, title: 'Workflow Tutorials' },
          { icon: GraduationCap, title: 'Orbin Academy' },
        ],
      },
      {
        label: 'CONNECT',
        cols: 2,
        items: [
          { icon: Monitor, title: 'Webinars', desc: 'Live and on-demand sessions with GTM experts.' },
          { icon: Bell, title: 'Events', desc: 'Conferences, meetups, and Orbin-hosted events.' },
          { icon: MessageSquare, title: 'Join the Community', desc: 'Connect with revenue operators using Orbin.' },
        ],
      },
      {
        label: 'COMPANY',
        cols: 2,
        items: [
          { icon: Building, title: 'About Us', desc: "It's time we stop working for our software." },
          { icon: UserPlus, title: 'Careers', desc: 'Join the Orbin team.' },
          { icon: Puzzle, title: 'Partners', desc: 'Introducing the Orbin Agency Network.' },
          { icon: ContactRound, title: 'Contact', desc: 'Get in touch with our team.' },
        ],
      },
    ],
  },
};

function DropdownPanel({ data }) {
  const sections = data.sections;
  const colCount = data.outerCols ?? (sections.length >= 4 ? 4 : sections.length >= 3 ? 3 : sections.length >= 2 ? 2 : 1);

  return (
    <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}>
      {sections.map((section) => (
        <div key={section.label}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">{section.label}</p>
          {section.cols === 2 ? (
            <div className="grid grid-cols-2 gap-2">
              {section.items.map((item) => (
                <button key={item.title} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-100 transition-colors text-left group">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-700 group-hover:text-primary transition-colors leading-tight">{item.title}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.title}
                  className={`flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-left w-full group ${item.highlight ? 'border border-primary/20 bg-primary/5' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${item.highlight ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold group-hover:text-primary transition-colors leading-tight ${item.highlight ? 'text-primary' : 'text-slate-700'}`}>{item.title}</p>
                    {item.desc && <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function NavBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (menu) => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 120);
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 backdrop-blur-xl" style={{ background: 'rgba(6, 11, 26, 0.92)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <OrbinAILogo size={44} className="rounded-lg" />
          <img src="https://media.base44.com/images/public/6a075dcc5cdaf3650af66cec/16b1fa4ca_2.png" alt="Orbin" className="h-20 object-contain -ml-2" />
        </div>

        {/* Centre nav items */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {Object.keys(navData).map((menu) => (
            <div
              key={menu}
              className="relative"
              onMouseEnter={() => handleMouseEnter(menu)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-colors ${activeMenu === menu ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
              >
                {menu}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === menu ? 'rotate-180' : ''}`} />
              </button>

              {activeMenu === menu && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-2xl border border-slate-200 shadow-2xl p-6 z-50 bg-white"
                  style={{ width: menu === 'Workflows' ? '520px' : menu === 'Product' ? '780px' : menu === 'Solutions' ? '960px' : menu === 'Resources' ? '780px' : '580px' }}
                >
                  <DropdownPanel data={navData[menu]} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <a href="#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap">
            How It Works
          </a>
          <a href="#waitlist">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green-sm text-xs">
              Join Waitlist <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/30 px-6 py-4 space-y-1">
          {Object.keys(navData).map((menu) => (
            <div key={menu}>
              <button
                onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground py-2.5"
              >
                {menu}
                <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === menu ? 'rotate-180' : ''}`} />
              </button>
              {activeMenu === menu && (
                <div className="pl-4 pb-2 space-y-1.5">
                  {navData[menu].sections.flatMap(s => s.items).map(item => (
                    <p key={item.title} className="text-xs text-muted-foreground py-1">{item.title}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-2 border-t border-border/30">
            <a href="#how-it-works" className="block text-sm text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileOpen(false)}>How It Works</a>
            <a href="#waitlist" onClick={() => setMobileOpen(false)}>
              <Button className="w-full mt-2 bg-primary text-primary-foreground">Join Waitlist</Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}