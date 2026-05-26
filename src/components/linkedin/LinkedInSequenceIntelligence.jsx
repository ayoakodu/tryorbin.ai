import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ChevronDown, ChevronRight, Clock, CheckCircle2,
  CornerDownRight, Mail, ArrowRight, Info, PlusCircle, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const RULE_TEMPLATES = [
  {
    id: 'wait_after_connect',
    label: 'Wait after connection request',
    description: 'Pause the sequence for 2 days after sending a connection request before the next step.',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    trigger: 'connection_request_sent',
    action: 'wait_days',
    default_value: 2,
  },
  {
    id: 'followup_no_response',
    label: 'Follow up if no response',
    description: 'Automatically create a follow-up LinkedIn step if no reply is received within the wait period.',
    icon: CornerDownRight,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    trigger: 'no_response',
    action: 'create_followup',
    default_value: 3,
  },
  {
    id: 'move_to_email',
    label: 'Move to email after LinkedIn',
    description: 'Transition the prospect to an email sequence after a LinkedIn step is completed.',
    icon: Mail,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    trigger: 'linkedin_step_completed',
    action: 'advance_to_email',
    default_value: null,
  },
  {
    id: 'pause_until_task',
    label: 'Pause sequence until step done',
    description: 'Hold the entire sequence from advancing until this LinkedIn step is marked complete.',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    trigger: 'step_incomplete',
    action: 'block_sequence',
    default_value: null,
  },
];

function RuleCard({ rule, active, value, onToggle, onValueChange, onRemove }) {
  const Icon = rule.icon;
  return (
    <div className={cn(
      'rounded-xl border transition-all',
      active ? `${rule.bg} ${rule.border}` : 'bg-white border-slate-200'
    )}>
      <div className="flex items-center gap-4 p-4">
        <div className={cn('w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0',
          active ? `${rule.bg} ${rule.border}` : 'bg-slate-50 border-slate-200')}>
          <Icon className={cn('w-4 h-4', active ? rule.color : 'text-slate-400')} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-[12px] font-semibold', active ? 'text-slate-800' : 'text-slate-600')}>{rule.label}</p>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{rule.description}</p>

          {/* Inline value editor */}
          {active && rule.default_value !== null && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-slate-500">After</span>
              <input
                type="number"
                min={1}
                max={30}
                value={value}
                onChange={e => onValueChange(parseInt(e.target.value) || 1)}
                className={cn(
                  'w-14 text-[12px] font-semibold text-center border rounded-lg px-2 py-1 outline-none transition-colors',
                  rule.border, rule.bg, rule.color
                )}
              />
              <span className="text-[11px] text-slate-500">days</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {active && (
            <button onClick={onRemove} className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onToggle}
            className={cn(
              'relative w-9 h-5 rounded-full transition-all flex-shrink-0',
              active ? 'bg-emerald-500' : 'bg-slate-200'
            )}
          >
            <div className={cn(
              'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all',
              active ? 'left-4' : 'left-0.5'
            )} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LinkedInSequenceIntelligence({ rules = [], onChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const [localRules, setLocalRules] = useState(() => {
    const map = {};
    (rules || []).forEach(r => { map[r.id] = r; });
    return map;
  });

  const toggleRule = (ruleId) => {
    const tpl = RULE_TEMPLATES.find(r => r.id === ruleId);
    if (!tpl) return;
    setLocalRules(prev => {
      const next = { ...prev };
      if (next[ruleId]) {
        delete next[ruleId];
      } else {
        next[ruleId] = { id: ruleId, value: tpl.default_value };
      }
      onChange?.(Object.values(next));
      return next;
    });
  };

  const updateValue = (ruleId, value) => {
    setLocalRules(prev => {
      const next = { ...prev, [ruleId]: { ...prev[ruleId], value } };
      onChange?.(Object.values(next));
      return next;
    });
  };

  const activeCount = Object.keys(localRules).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setCollapsed(v => !v)}
        className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-violet-600" />
          </div>
          <span className="text-[12px] font-bold text-slate-800">Sequence Intelligence</span>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold bg-violet-100 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full">
              {activeCount} active
            </span>
          )}
        </div>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', !collapsed && 'rotate-180')} />
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-2.5 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Info className="w-3 h-3 text-slate-400" />
                <p className="text-[11px] text-slate-400">Smart rules that automatically adjust your LinkedIn sequence flow.</p>
              </div>
              {RULE_TEMPLATES.map(rule => (
                <RuleCard
                  key={rule.id}
                  rule={rule}
                  active={!!localRules[rule.id]}
                  value={localRules[rule.id]?.value ?? rule.default_value}
                  onToggle={() => toggleRule(rule.id)}
                  onValueChange={v => updateValue(rule.id, v)}
                  onRemove={() => toggleRule(rule.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}