import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, LayoutDashboard, Zap, Target, Check, ChevronRight,
  TrendingUp, Users, Shield, Star, MessageCircle, Mail,
  BarChart3, Calendar, DollarSign, Activity, Eye, Sparkles,
  ArrowRight, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ── GTM ROLES ─────────────────────────────────────────────────────────────────
const GTM_ROLES = [
  { id: 'sdr',       label: 'SDR',              sub: 'Outbound prospecting & first contact',   icon: Zap,         color: 'text-cyan-500',    bg: 'bg-cyan-50'    },
  { id: 'sdr_mgr',   label: 'SDR Manager',       sub: 'Team coaching & sequence performance',   icon: Users,       color: 'text-blue-500',    bg: 'bg-blue-50'    },
  { id: 'ae',        label: 'Account Executive', sub: 'Deal progression & closing',             icon: DollarSign,  color: 'text-violet-500',  bg: 'bg-violet-50'  },
  { id: 'sales_ldr', label: 'Sales Leader',       sub: 'Pipeline visibility & team performance', icon: TrendingUp,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'founder',   label: 'Founder / CEO',      sub: 'Revenue overview & growth',             icon: Star,        color: 'text-amber-500',   bg: 'bg-amber-50'   },
  { id: 'revops',    label: 'RevOps',             sub: 'Process health & funnel optimization',  icon: Activity,    color: 'text-orange-500',  bg: 'bg-orange-50'  },
  { id: 'mktg',      label: 'Marketing Leader',   sub: 'Campaign performance & demand gen',     icon: BarChart3,   color: 'text-pink-500',    bg: 'bg-pink-50'    },
  { id: 'cs',        label: 'Customer Success',   sub: 'Retention, expansion & health',         icon: Shield,      color: 'text-teal-500',    bg: 'bg-teal-50'    },
];

// ── DASHBOARD WIDGETS ─────────────────────────────────────────────────────────
const WIDGETS = [
  { id: 'ai_command',      label: 'AI Intelligence',      sub: 'Revenue risks & opportunities',   icon: Brain,       defaultOn: true },
  { id: 'next_actions',    label: 'Next Best Actions',     sub: 'AI execution queue',              icon: Zap,         defaultOn: true },
  { id: 'live_ops',        label: 'Live Operations',       sub: 'Sequences, signals & workflows',  icon: Activity,    defaultOn: true },
  { id: 'revenue_forecast',label: 'Revenue Forecast',      sub: 'Projected pipeline & close rate', icon: TrendingUp,  defaultOn: true },
  { id: 'team_perf',       label: 'Team Performance',      sub: 'Rep activity & quota tracking',   icon: Users,       defaultOn: false },
  { id: 'deliverability',  label: 'Deliverability Health', sub: 'Inbox placement & DMARC status',  icon: Shield,      defaultOn: true },
  { id: 'hot_accounts',    label: 'Hot Accounts',          sub: 'High-intent account list',        icon: Star,        defaultOn: true },
  { id: 'pipeline_risk',   label: 'Pipeline Risk',         sub: 'At-risk deals & stall alerts',    icon: AlertIcon,   defaultOn: true },
  { id: 'sequence_perf',   label: 'Sequence Performance',  sub: 'Reply rates & step conversion',   icon: BarChart3,   defaultOn: false },
  { id: 'meeting_analytics',label:'Meeting Analytics',     sub: 'Bookings, show rate & source',    icon: Calendar,    defaultOn: false },
  { id: 'activity_feed',   label: 'GTM Activity Feed',     sub: 'Live execution stream',           icon: MessageCircle, defaultOn: true },
  { id: 'buying_intent',   label: 'Buying Intent Signals', sub: 'Engagement & page visit signals', icon: Eye,         defaultOn: false },
];

function AlertIcon(props) {
  return <Target {...props} />;
}

// ── AI FOCUS AREAS ─────────────────────────────────────────────────────────────
const AI_FOCUS_AREAS = [
  { id: 'pipeline_risk',    label: 'Pipeline Risk Detection',     icon: Target,      color: 'text-red-500' },
  { id: 'deliverability',   label: 'Deliverability Monitoring',   icon: Shield,      color: 'text-amber-500' },
  { id: 'meeting_gen',      label: 'Meeting Generation',          icon: Calendar,    color: 'text-cyan-500' },
  { id: 'seq_optimization', label: 'Sequence Optimization',       icon: Zap,         color: 'text-violet-500' },
  { id: 'linkedin',         label: 'LinkedIn Engagement',         icon: Users,       color: 'text-blue-500' },
  { id: 'whatsapp',         label: 'WhatsApp Performance',        icon: MessageCircle, color: 'text-emerald-500' },
  { id: 're_engagement',    label: 'Re-engagement Opportunities', icon: RefreshCw,   color: 'text-orange-500' },
  { id: 'hot_accounts',     label: 'Hot Account Detection',       icon: Star,        color: 'text-amber-500' },
  { id: 'buying_intent',    label: 'Buying Intent Signals',       icon: Eye,         color: 'text-violet-500' },
  { id: 'forecasting',      label: 'Revenue Forecasting',         icon: TrendingUp,  color: 'text-emerald-500' },
  { id: 'team_coaching',    label: 'Team Performance Coaching',   icon: Users,       color: 'text-cyan-500' },
  { id: 'expansion',        label: 'Expansion Opportunities',     icon: ArrowRight,  color: 'text-blue-500' },
];

// ── OPERATIONAL PRIORITIES ────────────────────────────────────────────────────
const OP_PRIORITIES = [
  { id: 'revenue_growth',   label: 'Revenue Growth'       },
  { id: 'pipeline_exp',     label: 'Pipeline Expansion'   },
  { id: 'meeting_volume',   label: 'Meeting Volume'        },
  { id: 'reply_rates',      label: 'Reply Rates'           },
  { id: 'deliverability',   label: 'Deliverability Health' },
  { id: 'enterprise',       label: 'Enterprise Deals'      },
  { id: 'expansion_rev',    label: 'Expansion Revenue'     },
  { id: 'seq_perf',         label: 'Sequence Performance'  },
  { id: 'multichannel',     label: 'Multi-channel Engagement' },
];

// ── DASHBOARD VIEW PRESETS ────────────────────────────────────────────────────
const DASHBOARD_VIEWS = [
  { id: 'ai_first',    label: 'AI-First View',          sub: 'AI command center dominates. Ideal for AI-driven workflows.' },
  { id: 'executive',   label: 'Executive Summary',       sub: 'High-level pipeline & revenue metrics. Minimal noise.' },
  { id: 'sdr_exec',    label: 'SDR Execution View',      sub: 'Sequence health, task queue & activity focused.' },
  { id: 'pipeline',    label: 'Pipeline View',           sub: 'Deal stages, velocity & risk signals front and center.' },
  { id: 'performance', label: 'Performance View',        sub: 'Charts, team metrics and trend analysis.' },
];

// ── SHARED SUBCOMPONENTS ──────────────────────────────────────────────────────
const Card = ({ children, className }) => (
  <div className={cn('rounded-xl bg-white border border-slate-200 p-5', className)}>{children}</div>
);

const CardTitle = ({ children, sub }) => (
  <div className="mb-4">
    <h3 className="text-[13px] font-bold text-slate-800">{children}</h3>
    {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    className={cn('w-10 h-5 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0', value ? 'bg-emerald-500' : 'bg-slate-200')}>
    <div className={cn('w-4 h-4 rounded-full bg-white shadow transition-transform', value ? 'translate-x-5' : 'translate-x-0')} />
  </button>
);

// ── ROLE PICKER ───────────────────────────────────────────────────────────────
function RolePicker({ value, onChange }) {
  return (
    <Card>
      <CardTitle sub="AI recommendations, widget defaults & dashboard priorities adapt to your role.">
        GTM Role & Persona
      </CardTitle>
      <div className="grid grid-cols-2 gap-2">
        {GTM_ROLES.map(role => {
          const Icon = role.icon;
          const active = value === role.id;
          return (
            <button key={role.id} onClick={() => onChange(role.id)}
              className={cn(
                'flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all',
                active
                  ? 'border-emerald-300 bg-emerald-50/60 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', role.bg)}>
                <Icon className={cn('w-3.5 h-3.5', role.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={cn('text-[12px] font-semibold', active ? 'text-emerald-800' : 'text-slate-800')}>{role.label}</p>
                  {active && <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{role.sub}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100">
        <p className="text-[11px] text-slate-400">
          Role affects AI prioritization, default widgets, and recommended actions.
          <span className="text-emerald-600 font-medium ml-1 cursor-pointer hover:underline">Configure custom role →</span>
        </p>
      </div>
    </Card>
  );
}

// ── WIDGET MANAGER ────────────────────────────────────────────────────────────
function WidgetManager({ enabled, onChange }) {
  return (
    <Card>
      <CardTitle sub="Choose which dashboard sections are visible. Drag to reorder (coming soon).">
        Dashboard Widgets
      </CardTitle>
      <div className="space-y-1">
        {WIDGETS.map(w => {
          const Icon = w.icon;
          const isOn = enabled.includes(w.id);
          return (
            <div key={w.id}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isOn ? 'bg-slate-50' : 'opacity-60 hover:opacity-80'
              )}
            >
              <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <Icon className="w-3 h-3 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-slate-700">{w.label}</p>
                <p className="text-[10px] text-slate-400">{w.sub}</p>
              </div>
              <Toggle value={isOn} onChange={() => {
                onChange(isOn ? enabled.filter(id => id !== w.id) : [...enabled, w.id]);
              }} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── AI FOCUS AREAS ────────────────────────────────────────────────────────────
function AIFocusConfig({ priorities, onChange }) {
  const toggle = (id) => {
    onChange(priorities.includes(id) ? priorities.filter(p => p !== id) : [...priorities, id]);
  };

  return (
    <Card>
      <CardTitle sub="Tell AI what to focus on. Selected areas receive higher priority in your dashboard intelligence.">
        AI Focus Areas
      </CardTitle>
      <div className="flex flex-wrap gap-2">
        {AI_FOCUS_AREAS.map(area => {
          const Icon = area.icon;
          const active = priorities.includes(area.id);
          return (
            <button key={area.id} onClick={() => toggle(area.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-semibold transition-all',
                active
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <Icon className={cn('w-3.5 h-3.5', active ? 'text-emerald-500' : area.color)} />
              {area.label}
              {active && <Check className="w-3 h-3 text-emerald-500" />}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-400 mt-4">
        {priorities.length} focus area{priorities.length !== 1 ? 's' : ''} selected · AI will emphasize these in your dashboard insights.
      </p>
    </Card>
  );
}

// ── OPERATIONAL PRIORITIES ────────────────────────────────────────────────────
function OperationalPriorities({ top3, onChange }) {
  const toggle = (id) => {
    if (top3.includes(id)) {
      onChange(top3.filter(p => p !== id));
    } else if (top3.length < 3) {
      onChange([...top3, id]);
    }
  };

  return (
    <Card>
      <CardTitle sub="Select up to 3 operational priorities. AI will weight its recommendations accordingly.">
        Operational Priorities
      </CardTitle>
      <div className="grid grid-cols-3 gap-2">
        {OP_PRIORITIES.map((p, i) => {
          const active = top3.includes(p.id);
          const rank = top3.indexOf(p.id);
          const locked = !active && top3.length >= 3;
          return (
            <button key={p.id} onClick={() => toggle(p.id)}
              disabled={locked}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-center transition-all text-[11px] font-semibold',
                active ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                  : locked ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              {active && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {rank + 1}
                </span>
              )}
              {p.label}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-400 mt-3">
        {3 - top3.length > 0 ? `Select ${3 - top3.length} more priorit${3 - top3.length === 1 ? 'y' : 'ies'}` : 'Priorities set — AI will adapt your dashboard accordingly.'}
      </p>
    </Card>
  );
}

// ── DEFAULT VIEW ──────────────────────────────────────────────────────────────
function DefaultViewPicker({ value, onChange }) {
  return (
    <Card>
      <CardTitle sub="Choose how your dashboard is structured by default when you open RVNU.">
        Default Dashboard View
      </CardTitle>
      <div className="space-y-2">
        {DASHBOARD_VIEWS.map(view => {
          const active = value === view.id;
          return (
            <button key={view.id} onClick={() => onChange(view.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all',
                active ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <div className={cn('w-2 h-2 rounded-full flex-shrink-0', active ? 'bg-emerald-500' : 'bg-slate-200')} />
              <div className="flex-1">
                <p className={cn('text-[12px] font-semibold', active ? 'text-emerald-800' : 'text-slate-700')}>{view.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{view.sub}</p>
              </div>
              {active && <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ── AI DENSITY ────────────────────────────────────────────────────────────────
function AIExperienceConfig({ prefs, onChange }) {
  return (
    <Card>
      <CardTitle sub="Fine-tune how the AI layer presents intelligence on your dashboard.">
        AI Experience Settings
      </CardTitle>
      <div className="space-y-0">
        {[
          { id: 'proactive_insights',  label: 'Proactive AI Insights',     hint: 'AI surfaces risks, opportunities & actions automatically' },
          { id: 'ai_heavy',            label: 'AI-Dominant Layout',         hint: 'AI sections occupy more visual space than charts' },
          { id: 'show_impact',         label: 'Show Estimated Impact',      hint: 'Display projected revenue / conversion impact on AI cards' },
          { id: 'dismissible_cards',   label: 'Dismissible Insight Cards',  hint: 'Allow AI cards to be dismissed from the dashboard' },
          { id: 'next_actions_queue',  label: 'Next Best Actions Queue',    hint: 'Show prioritized action queue at the top of the dashboard' },
          { id: 'activity_feed',       label: 'GTM Execution Stream',       hint: 'Live activity feed at the bottom of the dashboard' },
        ].map(item => (
          <div key={item.id} className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0">
            <div className="flex-1 mr-4">
              <p className="text-[12px] font-semibold text-slate-700">{item.label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.hint}</p>
            </div>
            <Toggle
              value={prefs[item.id] ?? true}
              onChange={v => onChange({ ...prefs, [item.id]: v })}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function DashboardAIPreferences({ onSave, saved }) {
  const [role, setRole] = useState('ae');
  const [enabledWidgets, setEnabledWidgets] = useState(
    WIDGETS.filter(w => w.defaultOn).map(w => w.id)
  );
  const [aiFocusPriorities, setAiFocusPriorities] = useState([
    'pipeline_risk', 'meeting_gen', 'seq_optimization', 'buying_intent'
  ]);
  const [opPriorities, setOpPriorities] = useState(['revenue_growth', 'meeting_volume', 'pipeline_exp']);
  const [defaultView, setDefaultView] = useState('ai_first');
  const [aiPrefs, setAiPrefs] = useState({
    proactive_insights: true,
    ai_heavy: true,
    show_impact: true,
    dismissible_cards: true,
    next_actions_queue: true,
    activity_feed: true,
  });

  const [activeTab, setActiveTab] = useState('role');

  const TABS = [
    { id: 'role',     label: 'Role & Persona',      icon: Users      },
    { id: 'widgets',  label: 'Dashboard Widgets',    icon: LayoutDashboard },
    { id: 'ai',       label: 'AI Focus Areas',       icon: Brain      },
    { id: 'ops',      label: 'Priorities',           icon: Target     },
    { id: 'view',     label: 'Layout & View',        icon: Eye        },
  ];

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4"
        style={{ background: 'linear-gradient(to right, #fff, rgba(240,253,244,0.4))' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-sm">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-[13px] font-bold text-slate-900">Dashboard & AI Preferences</h2>
            <p className="text-[11px] text-slate-400 leading-tight">Personalize your GTM command center · AI adapts to your role & priorities</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Role:</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full capitalize">
              {GTM_ROLES.find(r => r.id === role)?.label ?? 'Not set'}
            </span>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-slate-200 pb-0 -mb-3">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2.5 text-[11px] font-semibold border-b-2 -mb-px transition-colors',
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'role'    && <RolePicker value={role} onChange={setRole} />}
          {activeTab === 'widgets' && <WidgetManager enabled={enabledWidgets} onChange={setEnabledWidgets} />}
          {activeTab === 'ai'      && <AIFocusConfig priorities={aiFocusPriorities} onChange={setAiFocusPriorities} />}
          {activeTab === 'ops'     && <OperationalPriorities top3={opPriorities} onChange={setOpPriorities} />}
          {activeTab === 'view'    && (
            <div className="space-y-4">
              <DefaultViewPicker value={defaultView} onChange={setDefaultView} />
              <AIExperienceConfig prefs={aiPrefs} onChange={setAiPrefs} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Save bar */}
      <div className="flex items-center gap-3 pt-1">
        <Button size="sm" className="bg-primary text-white text-xs gap-1.5" onClick={onSave}>
          {saved ? <><Check className="w-3.5 h-3.5" /> Preferences Saved</> : 'Save Preferences'}
        </Button>
        <p className="text-[11px] text-slate-400">Changes update your AI dashboard experience immediately.</p>
      </div>
    </div>
  );
}