import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, ArrowRight, ChevronDown, Menu, X,
  Target, Shield, Layers, Search, Users, TrendingUp, Brain,
  Database, List, Map, Mail, BookOpen, Building, Briefcase,
  GraduationCap, RefreshCw, BarChart2, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navData = {
  Product: {
    sections: [
      {
        label: 'PLATFORM',
        items: [
          { icon: Target, title: 'Targeting', desc: 'Define and map your full addressable market.' },
          { icon: Shield, title: 'Qualification', desc: 'Only work accounts that match your exact ICP criteria.' },
          { icon: Layers, title: 'Enrichment', desc: 'Verified phone numbers and emails for every contact.' },
        ],
      },
      {
        label: 'FEATURES',
        cols: 2,
        items: [
          { icon: Search, title: 'Agentic Search', desc: 'Build audiences using natural language.' },
          { icon: Database, title: 'B2B Database', desc: '300M+ contacts, 1,500+ enrichment fields.' },
          { icon: Users, title: 'Lookalikes', desc: 'Find companies like your best customers.' },
          { icon: TrendingUp, title: 'Signals', desc: 'Spot signs of buyer interest in real time.' },
          { icon: Shield, title: 'AI Qualification', desc: 'Verify and score accounts automatically.' },
          { icon: Brain, title: 'AI Agents', desc: 'Gather hard-to-find market insights.' },
        ],
      },
    ],
  },
  Solutions: {
    sections: [
      {
        label: 'USE CASES',
        items: [
          { icon: RefreshCw, title: 'RevOps', desc: 'Align data, ownership, and forecasts.' },
          { icon: BarChart2, title: 'Sales', desc: 'Prioritize deals and move opportunities forward.' },
          { icon: Target, title: 'Marketing', desc: 'Define your market and focus where demand forms.' },
          { icon: TrendingUp, title: 'Growth', desc: 'Scale pipeline from active demand.' },
        ],
      },
      {
        label: 'INDUSTRIES',
        items: [
          { icon: Building, title: 'B2B SaaS & Enterprise Software', desc: 'Target software companies with buying signals and fit.' },
          { icon: Layers, title: '3PL & Logistics', desc: 'Find fulfillment-focused providers no database can surface.' },
          { icon: Shield, title: 'Cybersecurity', desc: 'Reach security vendors evaluating new pipeline sources.' },
          { icon: ArrowRight, title: 'See all 25 industries', desc: 'Explore every vertical RVNU supports.', highlight: true },
        ],
      },
      {
        label: 'SEE US IN ACTION',
        items: [
          { icon: BookOpen, title: 'Step-by-Step Guides', desc: 'Learn how teams use RVNU.', highlight: true },
        ],
      },
    ],
  },
  Workflows: {
    sections: [
      {
        label: 'GTM EXECUTION',
        cols: 2,
        items: [
          { icon: List, title: 'List Building' },
          { icon: Map, title: 'TAM Mapping' },
          { icon: Filter, title: 'TAM Segmentation' },
          { icon: Search, title: 'Prospecting' },
          { icon: Target, title: 'Account-Based Marketing' },
          { icon: Mail, title: 'Outbound' },
          { icon: Search, title: 'Account Research' },
          { icon: Layers, title: 'Inbound Orchestration', comingSoon: true },
        ],
      },
    ],
  },
  Resources: {
    sections: [
      {
        label: 'BLOG',
        items: [
          { icon: Zap, title: 'RVNU named a Cool Vendor by Gartner®', desc: 'Recognition for AI-driven GTM intelligence.' },
          { icon: Brain, title: "RVNU's AI Lab launches GTM-2 Omni", desc: 'Our next-generation GTM intelligence model.' },
          { icon: TrendingUp, title: 'RVNU Raises $30M Series A', desc: 'Funding to help businesses find their next customer.' },
        ],
      },
      {
        label: 'COMPANY',
        items: [
          { icon: Building, title: 'About Us', desc: "It's time we stop working for our software." },
          { icon: Briefcase, title: 'Partners', desc: 'Introducing the RVNU Agency Network.' },
          { icon: GraduationCap, title: 'Careers', desc: 'Join the RVNU team.' },
        ],
      },
    ],
  },
};

function DropdownPanel({ data }) {
  const sections = data.sections;
  const colCount = sections.length >= 3 ? 3 : sections.length >= 2 ? 2 : 1;

  return (
    <div className={`grid gap-8`} style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}>
      {sections.map((section) => (
        <div key={section.label}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">{section.label}</p>
          {section.cols === 2 ? (
            <div className="grid grid-cols-2 gap-2">
              {section.items.map((item) => (
                <button key={item.title} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-accent/50 transition-colors text-left group">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-tight">{item.title}</p>
                    {item.comingSoon && (
                      <span className="text-[9px] font-bold uppercase text-muted-foreground/50 border border-border/50 rounded px-1">Coming Soon</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.title}
                  className={`flex items-start gap-3 p-2.5 rounded-xl hover:bg-accent/50 transition-colors text-left w-full group ${item.highlight ? 'border border-primary/20 bg-primary/5' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${item.highlight ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold group-hover:text-primary transition-colors leading-tight ${item.highlight ? 'text-primary' : 'text-foreground'}`}>{item.title}</p>
                    {item.desc && <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>}
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
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold gradient-text">RVNU</span>
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
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-colors ${activeMenu === menu ? 'text-foreground bg-accent/40' : 'text-muted-foreground hover:text-foreground hover:bg-accent/20'}`}
              >
                {menu}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === menu ? 'rotate-180' : ''}`} />
              </button>

              {activeMenu === menu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl p-6 z-50"
                  style={{ width: menu === 'Workflows' ? '520px' : menu === 'Product' ? '680px' : menu === 'Solutions' ? '760px' : '580px' }}
                >
                  <DropdownPanel data={navData[menu]} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
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