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
  { icon: Users, label: 'Prospects', path: '/contacts' },
  { icon: Building2, label: 'Accounts', path: '/companies' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Workflow, label: 'Automations', path: '/automations' },
  { icon: UsersRound, label: 'Team Workspace', path: '/collaboration' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] flex flex-col z-40 border-r border-slate-200"
      style={{ background: '#f0f4f8' }}>
      
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-200">
        <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
          <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
        </div>
        <span className="text-base font-bold tracking-tight" style={{ color: '#10b981' }}>RVNU</span>
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
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group',
                active
                  ? 'bg-emerald-100 text-emerald-700'
                  : item.highlight
                  ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              )}
            >
              <item.icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-emerald-700' : item.highlight ? 'text-emerald-600' : 'text-slate-500')} />
              <span>{item.label}</span>
              {item.highlight && !active && <span className="ml-auto text-[9px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">AI</span>}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-primary/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-slate-200 pt-3">
        <Link to="/integrations" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all">
          <Globe className="w-4 h-4 text-slate-500" />
          <span>Integrations</span>
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all">
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </Link>
        <div className="mt-3 mx-1 p-3 rounded-lg bg-white border border-emerald-200">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">AI Credits</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '73%' }} />
          </div>
          <p className="text-[10px] text-slate-500">730 / 1000 used</p>
        </div>
      </div>
    </aside>
  );
}