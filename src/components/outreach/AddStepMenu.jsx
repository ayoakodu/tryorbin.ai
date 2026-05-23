import { useState, useEffect, useRef } from 'react';
import { Plus, Mail, MessageCircle, Phone, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEP_GROUPS = [
  {
    label: 'Email',
    icon: Mail,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    items: [
      { type: 'email_manual', label: 'Manual Email', desc: 'Write and send manually' },
      { type: 'email_auto', label: 'Automated Email', desc: 'Send automatically on schedule' },
    ],
  },
  {
    label: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    items: [
      { type: 'linkedin_connect', label: 'Connection Request', desc: 'Send with a personal note' },
      { type: 'linkedin_message', label: 'LinkedIn Message', desc: 'Follow-up via DM' },
      { type: 'linkedin_view', label: 'View Profile', desc: 'Trigger visibility signal' },
      { type: 'linkedin_interact', label: 'Interact With Post', desc: 'Like or comment on post' },
    ],
  },
  {
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    items: [
      { type: 'whatsapp', label: 'WhatsApp Message', desc: 'Send via WhatsApp' },
      { type: 'whatsapp_followup', label: 'WhatsApp Follow-up', desc: 'Automated follow-up message' },
    ],
  },
  {
    label: 'Calls & Tasks',
    icon: Phone,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    items: [
      { type: 'call', label: 'Phone Call', desc: 'Log a call task' },
      { type: 'task', label: 'Manual Task', desc: 'Custom action reminder' },
      { type: 'delay', label: 'Delay / Wait Step', desc: 'Pause before next step' },
    ],
  },
];

// Map sub-types to their base channel type
export const STEP_TYPE_MAP = {
  email_manual: 'email', email_auto: 'email',
  linkedin_connect: 'linkedin', linkedin_message: 'linkedin',
  linkedin_view: 'linkedin', linkedin_interact: 'linkedin',
  whatsapp: 'whatsapp', whatsapp_followup: 'whatsapp',
  call: 'call', task: 'task', delay: 'delay',
};

export const STEP_SUBTYPE_LABELS = {
  email_manual: 'Manual Email', email_auto: 'Automated Email',
  linkedin_connect: 'Connection Request', linkedin_message: 'LinkedIn Message',
  linkedin_view: 'View Profile', linkedin_interact: 'Interact With Post',
  whatsapp: 'WhatsApp Message', whatsapp_followup: 'WhatsApp Follow-up',
  call: 'Phone Call', task: 'Manual Task', delay: 'Delay / Wait',
};

export default function AddStepMenu({ onAdd, trigger = 'inline' }) {
  const [open, setOpen] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAdd = (subtype) => {
    onAdd(subtype);
    setOpen(false);
    setHoveredGroup(null);
  };

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      {trigger === 'inline' && <div className="w-px h-4 bg-slate-200" />}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed text-xs font-medium transition-colors',
          open
            ? 'border-emerald-400 text-emerald-600 bg-emerald-50'
            : 'border-slate-300 text-slate-500 bg-white hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'
        )}
      >
        <Plus className="w-3.5 h-3.5" /> Add Step
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-20 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
          style={{ minWidth: 220 }}>
          {STEP_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            const isHovered = hoveredGroup === group.label;
            return (
              <div key={group.label}
                onMouseEnter={() => setHoveredGroup(group.label)}
                onMouseLeave={() => setHoveredGroup(null)}
                className="relative group">
                <div className={cn(
                  'flex items-center gap-2.5 px-3 py-2 cursor-default transition-colors',
                  isHovered ? 'bg-slate-50' : ''
                )}>
                  <div className={cn('w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0', group.bg)}>
                    <GroupIcon className={cn('w-3.5 h-3.5', group.color)} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 flex-1">{group.label}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>

                {/* Submenu */}
                {isHovered && (
                  <div className="absolute left-full top-0 ml-1 bg-white rounded-xl border border-slate-200 shadow-xl z-30 py-1"
                    style={{ minWidth: 200 }}>
                    {group.items.map(item => (
                      <button key={item.type}
                        onClick={() => handleAdd(item.type)}
                        className="flex flex-col w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors">
                        <span className="text-xs font-medium text-slate-800">{item.label}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}