import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Clock, Mail, Pause, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const RULES = [
  {
    id: 'wait_after_connect',
    icon: Clock,
    color: 'text-blue-500',
    bg: 'bg-blue-50 border-blue-100',
    label: 'Wait after connection request',
    description: 'Pause before next step after sending a connection request.',
    defaultValue: 2,
    unit: 'days',
  },
  {
    id: 'followup_no_response',
    icon: RefreshCw,
    color: 'text-amber-500',
    bg: 'bg-amber-50 border-amber-100',
    label: 'Follow up if no response',
    description: 'Auto-create a follow-up reminder task if no reply.',
    defaultValue: 3,
    unit: 'days',
  },
  {
    id: 'move_to_email',
    icon: Mail,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 border-emerald-100',
    label: 'Move to email after LinkedIn',
    description: 'Transition to email touchpoint after this LinkedIn step.',
    defaultValue: null,
    unit: null,
  },
  {
    id: 'pause_until_done',
    icon: Pause,
    color: 'text-violet-500',
    bg: 'bg-violet-50 border-violet-100',
    label: 'Pause sequence until step done',
    description: 'Hold the sequence until you manually mark this task complete.',
    defaultValue: null,
    unit: null,
  },
];

export default function LinkedInIntelligencePanel({ rules = {}, onChange }) {
  const [open, setOpen] = useState(false);

  const toggle = (id) => {
    const updated = { ...rules, [id]: rules[id] ? null : { enabled: true, value: RULES.find(r => r.id === id)?.defaultValue } };
    onChange?.(updated);
  };

  const updateValue = (id, value) => {
    onChange?.({ ...rules, [id]: { ...(rules[id] || {}), enabled: true, value } });
  };

  const activeCount = Object.values(rules).filter(Boolean).length;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[12px] font-bold text-slate-700">Sequence Intelligence</span>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              {activeCount} active
            </span>
          )}
        </div>
        <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-slate-100">
              {RULES.map(rule => {
                const active = !!rules[rule.id];
                const RuleIcon = rule.icon;
                return (
                  <div key={rule.id} className="flex items-center gap-3 px-4 py-3 bg-white">
                    <div className={cn('w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0', rule.bg)}>
                      <RuleIcon className={cn('w-3.5 h-3.5', rule.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-slate-800">{rule.label}</p>
                      <p className="text-[10px] text-slate-400 leading-tight">{rule.description}</p>
                      {active && rule.unit && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <input
                            type="number"
                            min={1}
                            value={rules[rule.id]?.value ?? rule.defaultValue}
                            onChange={e => updateValue(rule.id, parseInt(e.target.value) || 1)}
                            className="w-12 text-[11px] border border-slate-200 rounded-md px-2 py-0.5 text-slate-700 outline-none focus:border-emerald-400"
                          />
                          <span className="text-[10px] text-slate-500">{rule.unit}</span>
                        </div>
                      )}
                    </div>
                    {/* Toggle */}
                    <button
                      onClick={() => toggle(rule.id)}
                      className={cn(
                        'w-9 h-5 rounded-full transition-colors flex-shrink-0 flex items-center px-0.5',
                        active ? 'bg-emerald-500' : 'bg-slate-200'
                      )}
                    >
                      <div className={cn('w-4 h-4 rounded-full bg-white shadow transition-transform', active ? 'translate-x-4' : 'translate-x-0')} />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}