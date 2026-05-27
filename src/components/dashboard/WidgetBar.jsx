import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Users, Shield, Zap, BarChart3, Target,
  Activity, Calendar, Brain, Star, Plus, Check, X, Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ALL_WIDGETS = [
  { id: 'revenue_forecast', label: 'Revenue Forecast', icon: TrendingUp, color: 'text-emerald-500', available: true  },
  { id: 'team_performance', label: 'Team Performance', icon: Users, color: 'text-cyan-500',    available: true  },
  { id: 'sequence_perf',    label: 'Sequence Performance', icon: Zap, color: 'text-violet-500', available: true  },
  { id: 'deliverability',   label: 'Deliverability Health', icon: Shield, color: 'text-amber-500', available: true },
  { id: 'hot_accounts',     label: 'Hot Accounts',      icon: Target, color: 'text-red-500',    available: true  },
  { id: 'buying_intent',    label: 'Buying Intent',     icon: Star,   color: 'text-orange-500', available: false },
  { id: 'pipeline_velocity',label: 'Pipeline Velocity', icon: Activity, color: 'text-slate-500', available: false },
  { id: 'meeting_analytics',label: 'Meeting Analytics', icon: Calendar, color: 'text-blue-500', available: false },
];

// Mini widget previews
function RevenueWidget() {
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-10">
        {[40, 55, 48, 70, 62, 85, 78, 95].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-emerald-200 transition-all"
            style={{ height: `${h}%`, opacity: 0.6 + (i * 0.05) }} />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>$1.8M forecast</span><span className="text-emerald-500 font-semibold">▲ 22%</span>
      </div>
    </div>
  );
}

function TeamWidget() {
  return (
    <div className="space-y-1.5">
      {[
        { name: 'Chioma', pct: 92 }, { name: 'Emeka', pct: 78 }, { name: 'Fatima', pct: 65 }
      ].map(r => (
        <div key={r.name} className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 w-12 flex-shrink-0">{r.name}</span>
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-cyan-400" style={{ width: `${r.pct}%` }} />
          </div>
          <span className="text-[10px] font-semibold text-slate-500 w-6 text-right">{r.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function DeliverabilityWidget() {
  return (
    <div className="space-y-1.5">
      {[
        { label: 'Inbox Rate', val: '94%', ok: true },
        { label: 'Spam Rate',  val: '0.8%', ok: true },
        { label: 'DMARC',      val: 'None', ok: false },
      ].map(r => (
        <div key={r.label} className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500">{r.label}</span>
          <span className={cn('text-[10px] font-bold', r.ok ? 'text-emerald-500' : 'text-amber-500')}>{r.val}</span>
        </div>
      ))}
    </div>
  );
}

function HotAccountsWidget() {
  return (
    <div className="space-y-1.5">
      {['Flutterwave', 'Paystack', 'MTN Fintech'].map((acc, i) => (
        <div key={acc} className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-200 to-red-100 flex items-center justify-center text-[9px] font-bold text-red-500 flex-shrink-0">
            {acc[0]}
          </div>
          <span className="text-[11px] text-slate-700 font-medium flex-1 truncate">{acc}</span>
          <span className="text-[9px] text-red-400 font-bold">🔥 Hot</span>
        </div>
      ))}
    </div>
  );
}

function SequenceWidget() {
  return (
    <div className="space-y-1.5">
      {[
        { name: 'Fintech CTO', rate: '18%', trend: '▼', bad: true },
        { name: 'SaaS Founders', rate: '31%', trend: '▲', bad: false },
        { name: 'Neobank DM', rate: '24%', trend: '▲', bad: false },
      ].map(s => (
        <div key={s.name} className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 truncate flex-1">{s.name}</span>
          <span className={cn('text-[10px] font-bold', s.bad ? 'text-red-400' : 'text-emerald-500')}>
            {s.trend} {s.rate}
          </span>
        </div>
      ))}
    </div>
  );
}

const WIDGET_CONTENT = {
  revenue_forecast: { Component: RevenueWidget, title: 'Revenue Forecast' },
  team_performance: { Component: TeamWidget, title: 'Team Performance' },
  deliverability:   { Component: DeliverabilityWidget, title: 'Deliverability' },
  hot_accounts:     { Component: HotAccountsWidget, title: 'Hot Accounts' },
  sequence_perf:    { Component: SequenceWidget, title: 'Sequences' },
};

export default function WidgetBar({ isCustomizing, onToggleCustomize }) {
  const [active, setActive] = useState(['revenue_forecast', 'team_performance', 'deliverability', 'hot_accounts']);
  const [showPicker, setShowPicker] = useState(false);

  const visibleWidgets = ALL_WIDGETS.filter(w => active.includes(w.id));

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dashboard Widgets</p>
        <button
          onClick={() => { setShowPicker(v => !v); }}
          className={cn(
            'flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all',
            showPicker
              ? 'bg-slate-800 text-white border-slate-800'
              : 'text-slate-500 border-slate-200 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          )}
        >
          <Settings2 className="w-3 h-3" />
          {showPicker ? 'Done' : 'Customize'}
        </button>
      </div>

      {/* Widget picker */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-semibold text-slate-500 mb-3">Choose widgets to display:</p>
              <div className="flex flex-wrap gap-2">
                {ALL_WIDGETS.map(w => {
                  const Icon = w.icon;
                  const isActive = active.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      disabled={!w.available}
                      onClick={() => setActive(prev =>
                        isActive ? prev.filter(id => id !== w.id) : [...prev, w.id]
                      )}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-medium transition-all',
                        !w.available && 'opacity-40 cursor-not-allowed',
                        isActive && w.available
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      )}
                    >
                      <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-emerald-500' : w.color)} />
                      {w.label}
                      {isActive && <Check className="w-3 h-3 text-emerald-500" />}
                      {!w.available && <span className="text-[9px] text-slate-300 ml-1">Soon</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <AnimatePresence>
          {visibleWidgets.map((w, i) => {
            const widgetDef = WIDGET_CONTENT[w.id];
            const Icon = w.icon;
            if (!widgetDef) return null;
            const { Component } = widgetDef;
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn('w-6 h-6 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center')}>
                    <Icon className={cn('w-3.5 h-3.5', w.color)} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{widgetDef.title}</span>
                </div>
                <Component />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add widget placeholder */}
        {!showPicker && (
          <button
            onClick={() => setShowPicker(true)}
            className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 flex flex-col items-center justify-center gap-2 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group min-h-[100px]"
          >
            <Plus className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            <span className="text-[11px] font-medium text-slate-400 group-hover:text-emerald-600 transition-colors">Add Widget</span>
          </button>
        )}
      </div>
    </div>
  );
}