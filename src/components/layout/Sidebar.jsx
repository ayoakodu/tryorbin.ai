import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Building2, TrendingUp, 
  Megaphone, BarChart3, MessageCircle,
  ChevronRight, Sparkles, Workflow, UsersRound,
  Phone, CheckSquare, List, MailOpen, Send, ShieldCheck, Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RVNULogo from '@/components/ui/RVNULogo.jsx';
import SettingsMenu from './SettingsMenu';
import OnboardingHub from './OnboardingHub';

const navGroups = [
  {
    label: null,
    items: [
      { icon: Home, label: 'Home', path: '/dashboard' },
      { icon: Sparkles, label: 'AI Copilot', path: '/ai-copilot', highlight: true },
    ],
  },
  {
    label: 'PROSPECT',
    items: [
      { icon: Users, label: 'People', path: '/contacts' },
      { icon: Building2, label: 'Accounts', path: '/companies' },
      { icon: List, label: 'Lists', path: '/lists' },
    ],
  },
  {
    label: 'ENGAGEMENT',
    items: [
      { icon: Send, label: 'Sequences', path: '/outreach' },
      { icon: MailOpen, label: 'Emails', path: '/emails' },
      { icon: Settings2, label: 'Email Ops', path: '/email-ops' },
      { icon: Phone, label: 'Calls', path: '/calls' },
      { icon: MessageCircle, label: 'WhatsApp', path: '/whatsapp' },
      { icon: Megaphone, label: 'Campaigns', path: '/campaigns' },
      { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    ],
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      { icon: Workflow, label: 'Automations', path: '/automations' },
    ],
  },
  {
    label: 'PIPELINE & WORKSPACE',
    items: [
      { icon: TrendingUp, label: 'Pipeline', path: '/pipeline' },
      { icon: UsersRound, label: 'Collaboration', path: '/collaboration' },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-40 border-r border-slate-200 transition-all duration-300"
      style={{ background: '#f0f4f8', width: collapsed ? '60px' : '190px' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 border-b border-slate-200 flex-shrink-0 overflow-hidden"
        style={{ height: '40px', minHeight: '40px', maxHeight: '40px' }}>
        <RVNULogo size={26} className="rounded-md flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="text-sm font-bold tracking-tight whitespace-nowrap" style={{ color: '#10b981' }}>Orbin</span>
            <span className="ml-auto text-[10px] font-mono text-primary/60 bg-primary/10 px-1.5 py-0.5 rounded whitespace-nowrap">BETA</span>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden space-y-3">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {!collapsed && group.label && (
              <p className="px-3 mb-0.5 text-[9px] font-semibold tracking-widest text-slate-400 uppercase">
                {group.label}
              </p>
            )}
            {collapsed && group.label && <div className="border-t border-slate-200 my-1" />}
            <div className="space-y-0">
              {group.items.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg text-[11px] font-medium transition-all duration-150',
                      collapsed ? 'justify-center px-0 py-2' : 'px-3 py-1.5',
                      active
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.highlight
                        ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    )}
                  >
                    <item.icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-emerald-700' : item.highlight ? 'text-emerald-600' : 'text-slate-500')} />
                    {!collapsed && (
                      <>
                        <span>{item.label}</span>
                        {item.highlight && !active && <span className="ml-auto text-[9px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">AI</span>}
                        {active && <ChevronRight className="w-3 h-3 ml-auto text-primary/60" />}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 border-t border-slate-200 pt-2 flex-shrink-0">
        <Link to="/deliverability" title={collapsed ? 'Deliverability' : undefined}
          className={cn('flex items-center gap-3 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all py-2',
            collapsed ? 'justify-center px-0' : 'px-3')}>
          <ShieldCheck className="w-4 h-4 text-slate-500 flex-shrink-0" />
          {!collapsed && <span>Deliverability</span>}
        </Link>
        <SettingsMenu collapsed={collapsed} />

        {!collapsed && <OnboardingHub />}

        {/* Toggle */}
        <div className={cn('mt-2 flex', collapsed ? 'justify-center' : 'justify-end px-1')}>
          <button
            onClick={onToggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-700 transition-all"
          >
            <span className="text-[11px] font-bold tracking-tighter leading-none">
              {collapsed ? '>>' : '<<'}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
