import { useState, useEffect, useRef } from 'react';
import { Plus, Mail, MessageCircle, Phone, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
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
      { type: 'linkedin_message', label: 'Send Message', desc: 'Follow-up via DM' },
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
  linkedin_connect: 'Connection Request', linkedin_message: 'Send Message',
  linkedin_view: 'View Profile', linkedin_interact: 'Interact With Post',
  whatsapp: 'WhatsApp Message', whatsapp_followup: 'WhatsApp Follow-up',
  call: 'Phone Call', task: 'Manual Task', delay: 'Delay / Wait',
};

export default function AddStepMenu({ onAdd, trigger = 'inline' }) {
  const [open, setOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const ref = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setExpandedGroup(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAdd = (subtype) => {
    onAdd(subtype);
    setOpen(false);
    setExpandedGroup(null);
  };

  const toggleGroup = (label) => {
    setExpandedGroup(prev => prev === label ? null : label);
  };

  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 });
    }
    setOpen(o => !o);
    setExpandedGroup(null);
  };

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      {trigger === 'inline' && <div className="w-px h-4 bg-slate-200" />}

      <button
        ref={btnRef}
        onClick={openMenu}
        className={cn(
          'flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors',
          trigger === 'empty'
            ? open
              ? 'border-emerald-400 text-emerald-700 bg-emerald-50'
              : 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            : open
              ? 'border-emerald-400 text-emerald-600 bg-emerald-50 border-dashed'
              : 'border-slate-300 text-slate-500 bg-white hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 border-dashed'
        )}
      >
        <Plus className="w-3.5 h-3.5" />
        {trigger === 'empty' ? 'Add Step' : 'Add Step'}
      </button>

      {open && (
        <div
          className="fixed z-[9999] bg-white rounded-xl border border-slate-200 shadow-xl"
          style={{ top: dropdownPos.top, left: dropdownPos.left, transform: 'translateX(-50%)', minWidth: 240 }}
        >
          {STEP_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            const isExpanded = expandedGroup === group.label;
            return (
              <div key={group.label} className="border-b border-slate-100 last:border-b-0">
                {/* Category row */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-3 py-2.5 text-left transition-colors',
                    isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50'
                  )}
                >
                  <div className={cn('w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0', group.bg)}>
                    <GroupIcon className={cn('w-3.5 h-3.5', group.color)} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 flex-1">{group.label}</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', isExpanded && 'rotate-180')} />
                </button>

                {/* Submenu items — inline, no scroll */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-100">
                    {group.items.map(item => (
                      <button
                        key={item.type}
                        onClick={() => handleAdd(item.type)}
                        className="flex items-start gap-2.5 w-full px-4 py-2 text-left hover:bg-white transition-colors"
                      >
                        <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', group.color.replace('text-', 'bg-'))} />
                        <div>
                          <span className="text-xs font-medium text-slate-800 block">{item.label}</span>
                          <span className="text-[10px] text-slate-400">{item.desc}</span>
                        </div>
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