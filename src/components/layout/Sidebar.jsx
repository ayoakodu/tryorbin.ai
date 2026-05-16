import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, TrendingUp, 
  Megaphone, Mail, BarChart3, Zap, MessageCircle,
  Settings, ChevronRight, Sparkles, Globe, Workflow, UsersRound
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Sparkles, label: 'AI Copilot', path: '/ai-copilot', highlight: true },
  { icon: Mail, label: 'Sequences', path: '/outreach' },
  { icon: Megaphone, label: 'Campaigns', path: '/campaigns' },
  { icon: MessageCircle, label: 'WhatsApp', path: '/whatsapp' },
  { icon: TrendingUp, label: 'Pipeline', path: '/pipeline' },
  { icon: Users, label: 'Contacts', path: '/contacts' },
  { icon: Building2, label: 'Companies', path: '/companies' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Workflow, label: 'Automations', path: '/automations' },
  { icon: UsersRound, label: 'Team Workspace', path: '/collaboration' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] flex flex-col z-40 border-r border-border/50"
      style={{ background: 'hsl(224 71% 5%)' }}>
      
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border/30">
        <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
          <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold tracking-tight gradient-text">RVNU</span>
        <span className="ml-auto text-[10px] font-mono text-primary/60 bg-primary/10 px-1.5 py-0.5 rounded">BETA</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-primary/10 text-primary glow-green-sm'
                  : item.highlight
                  ? 'text-primary/80 hover:text-primary hover:bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <item.icon className={cn('w-4 h-4 flex-shrink-0', active || item.highlight ? 'text-primary' : '')} />
              <span>{item.label}</span>
              {item.highlight && !active && <span className="ml-auto text-[9px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">AI</span>}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-primary/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-border/30 pt-3">
        <Link to="/integrations" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
          <Globe className="w-4 h-4" />
          <span>Integrations</span>
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
        <div className="mt-3 mx-1 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">AI Credits</span>
          </div>
          <div className="w-full bg-border rounded-full h-1.5 mb-1">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '73%' }} />
          </div>
          <p className="text-[10px] text-muted-foreground">730 / 1000 used</p>
        </div>
      </div>
    </aside>
  );
}