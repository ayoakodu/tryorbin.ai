import { Mail, MessageCircle, Phone, CheckCircle2, Clock, X } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STEP_SUBTYPE_LABELS } from './AddStepMenu';

const STEP_TYPES = [
  { group: 'Email',      icon: Mail,         color: 'text-blue-500',    bg: 'bg-blue-50 border-blue-100',      subtypes: ['email_manual', 'email_auto'] },
  { group: 'LinkedIn',   icon: Linkedin,     color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-100',      subtypes: ['linkedin_connect', 'linkedin_message', 'linkedin_view', 'linkedin_interact'] },
  { group: 'WhatsApp',   icon: MessageCircle,color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100',subtypes: ['whatsapp', 'whatsapp_followup'] },
  { group: 'Calls',      icon: Phone,        color: 'text-amber-500',   bg: 'bg-amber-50 border-amber-100',    subtypes: ['call'] },
  { group: 'Tasks',      icon: CheckCircle2, color: 'text-violet-500',  bg: 'bg-violet-50 border-violet-100',  subtypes: ['task'] },
];

export default function ChangeStepTypeModal({ currentSubtype, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-800">Change Step Type</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 space-y-1 max-h-[70vh] overflow-y-auto">
          {STEP_TYPES.map(({ group, icon: GroupIcon, color, bg, subtypes }) => (
            <div key={group}>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 pt-2 pb-1">{group}</p>
              {subtypes.map(sub => {
                const isCurrent = sub === currentSubtype;
                return (
                  <button key={sub}
                    onClick={() => !isCurrent && onSelect(sub)}
                    className={cn(
                      'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-left transition-colors',
                      isCurrent ? 'bg-emerald-50 cursor-default' : 'hover:bg-slate-50 cursor-pointer'
                    )}>
                    <div className={cn('w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0', bg)}>
                      <GroupIcon className={cn('w-3 h-3', color)} />
                    </div>
                    <span className={cn('text-xs font-medium', isCurrent ? 'text-emerald-700' : 'text-slate-700')}>
                      {STEP_SUBTYPE_LABELS[sub] || sub}
                    </span>
                    {isCurrent && <span className="ml-auto text-[9px] text-emerald-500 font-semibold">Current</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}