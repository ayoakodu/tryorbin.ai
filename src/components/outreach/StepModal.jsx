import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MessageCircle, Phone, Clock, CheckCircle2, Sparkles, X,
  User, Maximize2, Minimize2, Bold, Italic, Underline, Link2,
  Paperclip, Image, Video, BarChart2, PenLine, ChevronDown,
  Search, Send, Wand2, ChevronRight, ChevronLeft
} from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { STEP_TYPE_MAP, STEP_SUBTYPE_LABELS } from './AddStepMenu';

const channelColors = {
  email: 'text-blue-500', linkedin: 'text-blue-600',
  whatsapp: 'text-emerald-500', call: 'text-amber-500',
  task: 'text-violet-500', delay: 'text-slate-500',
};
const channelBg = {
  email: 'bg-blue-50 border-blue-100', linkedin: 'bg-blue-50 border-blue-100',
  whatsapp: 'bg-emerald-50 border-emerald-100', call: 'bg-amber-50 border-amber-100',
  task: 'bg-violet-50 border-violet-100', delay: 'bg-slate-50 border-slate-200',
};
const channelIcons = {
  email: Mail, linkedin: Linkedin, whatsapp: MessageCircle,
  call: Phone, task: CheckCircle2, delay: Clock,
};

const PRIORITIES = [
  { value: 'high',   label: 'High',   dot: 'bg-red-400',   text: 'text-red-500' },
  { value: 'normal', label: 'Normal', dot: 'bg-slate-300',  text: 'text-slate-500' },
  { value: 'low',    label: 'Low',    dot: 'bg-slate-200',  text: 'text-slate-400' },
];

const TONES = ['Professional', 'Friendly', 'Direct', 'Casual'];
const DELAY_UNITS = ['hours', 'days', 'weeks'];

const VAR_TABS = {
  Prospect: ['{{first_name}}', '{{last_name}}', '{{title}}', '{{phone}}', '{{email}}'],
  Account:  ['{{company}}', '{{industry}}', '{{website}}', '{{company_size}}', '{{revenue}}'],
  Opportunity: ['{{deal_name}}', '{{deal_value}}', '{{close_date}}', '{{stage}}'],
  Others:   ['{{sender_name}}', '{{sender_title}}', '{{sender_company}}', '{{today}}'],
};

function preview(text) {
  if (!text) return '';
  return text
    .replace(/\{\{first_name\}\}/g, 'Chisom')
    .replace(/\{\{last_name\}\}/g, 'Okafor')
    .replace(/\{\{company\}\}/g, 'Flutterwave')
    .replace(/\{\{title\}\}/g, 'Head of Growth')
    .replace(/\{\{industry\}\}/g, 'Fintech')
    .replace(/\{\{sender_name\}\}/g, 'You');
}

function Label({ children }) {
  return <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">{children}</label>;
}

// ─── VARIABLE DROPDOWN ────────────────────────────────────────────────────────
function VariableDropdown({ onInsert, onClose }) {
  const [activeTab, setActiveTab] = useState('Prospect');
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const vars = VAR_TABS[activeTab] || [];
  const filtered = search ? vars.filter(v => v.toLowerCase().includes(search.toLowerCase())) : vars;

  return (
    <div ref={ref} className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl border border-slate-200 shadow-xl w-64">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-1 pt-1">
        {Object.keys(VAR_TABS).map(t => (
          <button key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              'px-2.5 py-1.5 text-[10px] font-semibold rounded-t-md transition-colors',
              activeTab === t ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 hover:text-slate-700'
            )}>{t}</button>
        ))}
      </div>
      {/* Search */}
      <div className="px-2.5 pt-2 pb-1">
        <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2 py-1">
          <Search className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search variables…"
            className="flex-1 text-[11px] text-slate-700 bg-transparent outline-none placeholder:text-slate-300" />
        </div>
      </div>
      {/* Variables */}
      <div className="px-2 pb-2 max-h-40 overflow-y-auto space-y-0.5">
        {filtered.map(v => (
          <button key={v} onClick={() => { onInsert(v); onClose(); }}
            className="flex items-center w-full px-2 py-1.5 rounded-lg text-left hover:bg-slate-50 transition-colors gap-2">
            <span className="text-[11px] font-mono text-emerald-600 font-medium">{v}</span>
          </button>
        ))}
        {filtered.length === 0 && <p className="text-[11px] text-slate-400 px-2 py-2 italic">No variables found</p>}
      </div>
    </div>
  );
}

// ─── EMAIL EDITOR TOOLBAR ────────────────────────────────────────────────────
function EmailToolbar({ onVarInsert }) {
  const [showVars, setShowVars] = useState(false);
  const varBtnRef = useRef(null);

  const formatBtns = [
    { icon: Bold,       title: 'Bold'       },
    { icon: Italic,     title: 'Italic'     },
    { icon: Underline,  title: 'Underline'  },
    { icon: Link2,      title: 'Link'       },
    { icon: Paperclip,  title: 'Attachment' },
    { icon: Image,      title: 'Image'      },
    { icon: Video,      title: 'Video'      },
    { icon: BarChart2,  title: 'Tracking'   },
    { icon: PenLine,    title: 'Signature'  },
  ];

  return (
    <div className="flex items-center gap-0.5 px-1 py-1.5 border-t border-slate-100 bg-slate-50/70 rounded-b-lg flex-wrap">
      {formatBtns.map(({ icon: Icon, title }) => (
        <button key={title} title={title}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors">
          <Icon className="w-3 h-3" />
        </button>
      ))}
      <div className="w-px h-4 bg-slate-200 mx-1" />
      {/* Variables trigger */}
      <div className="relative" ref={varBtnRef}>
        <button onClick={() => setShowVars(v => !v)}
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors',
            showVars ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
          )}>
          {'{ }'} Variables
        </button>
        {showVars && (
          <VariableDropdown
            onInsert={onVarInsert}
            onClose={() => setShowVars(false)}
          />
        )}
      </div>
    </div>
  );
}

// ─── AI ACTIONS ──────────────────────────────────────────────────────────────
function AIActions({ onAction }) {
  return (
    <div className="flex items-center gap-1">
      {[
        { icon: Wand2,     label: 'AI Write',      action: 'write'   },
        { icon: Sparkles,  label: 'Rewrite',       action: 'rewrite' },
        { icon: PenLine,   label: 'Improve Tone',  action: 'tone'    },
      ].map(({ icon: Icon, label, action }) => (
        <button key={action} onClick={() => onAction(action)}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all">
          <Icon className="w-3 h-3" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── EMAIL EDITOR (LEFT SIDE) ─────────────────────────────────────────────────
function EmailEditor({ step, onUpdate }) {
  const insertIntoField = (field, v) => onUpdate({ ...step, [field]: (step[field] || '') + v });

  return (
    <div className="flex flex-col h-full">
      {/* Subject */}
      <div className="px-4 pt-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-12 flex-shrink-0">Subject</span>
          <input
            value={step.subject || ''}
            onChange={e => onUpdate({ ...step, subject: e.target.value })}
            placeholder="e.g. Quick question about {{company}}"
            className="flex-1 text-xs text-slate-800 bg-transparent outline-none placeholder:text-slate-300 font-medium"
          />
        </div>
      </div>

      {/* Tone row */}
      <div className="px-4 py-1.5 border-b border-slate-100 flex items-center gap-2">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-12 flex-shrink-0">Tone</span>
        <div className="flex gap-1">
          {TONES.map(t => (
            <button key={t} onClick={() => onUpdate({ ...step, tone: t })}
              className={cn('text-[10px] px-2 py-0.5 rounded-md border transition-colors',
                step.tone === t
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700 font-semibold'
                  : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
              )}>{t}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col min-h-0">
        <Textarea
          value={step.body || ''}
          onChange={e => onUpdate({ ...step, body: e.target.value })}
          placeholder={"Hi {{first_name}},\n\nI noticed {{company}} recently...\n\nWould love to connect.\n\nBest,\n{{sender_name}}"}
          className="flex-1 text-xs resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[160px] px-4 py-3"
        />
        {/* Formatting toolbar */}
        <EmailToolbar onVarInsert={v => insertIntoField('body', v)} />
      </div>
    </div>
  );
}

// ─── NON-EMAIL EDITORS ────────────────────────────────────────────────────────
function LinkedInEditor({ step, onUpdate }) {
  const insertVar = v => onUpdate({ ...step, body: (step.body || '') + v });
  const subtype = step.subtype;
  return (
    <div className="p-4 space-y-4">
      {(subtype === 'linkedin_connect' || subtype === 'linkedin_message') && (
        <div>
          <Label>{subtype === 'linkedin_connect' ? 'Connection Note' : 'Message'}</Label>
          <Textarea value={step.body || ''} onChange={e => onUpdate({ ...step, body: e.target.value })}
            placeholder={subtype === 'linkedin_connect' ? "Hi {{first_name}}, I'd love to connect..." : "Hi {{first_name}}, following up..."}
            className="text-xs resize-none" rows={6} />
        </div>
      )}
      {subtype === 'linkedin_view' && (
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
          This step triggers a profile view automatically. No content needed.
        </div>
      )}
      {subtype === 'linkedin_interact' && (
        <div>
          <Label>Post URL (optional)</Label>
          <Input value={step.post_url || ''} onChange={e => onUpdate({ ...step, post_url: e.target.value })}
            placeholder="https://linkedin.com/posts/..." className="text-xs h-8" />
          <p className="text-[10px] text-slate-400 mt-1">Leave blank to interact with their latest post.</p>
        </div>
      )}
      <div>
        <Label>CTA / Purpose</Label>
        <Input value={step.cta || ''} onChange={e => onUpdate({ ...step, cta: e.target.value })}
          placeholder="e.g. Book a 15-min call" className="text-xs h-8" />
      </div>
    </div>
  );
}

function WhatsAppEditor({ step, onUpdate }) {
  const insertVar = v => onUpdate({ ...step, body: (step.body || '') + v });
  return (
    <div className="p-4 space-y-4">
      <div>
        <Label>Message</Label>
        <Textarea value={step.body || ''} onChange={e => onUpdate({ ...step, body: e.target.value })}
          placeholder={"Hi {{first_name}} 👋 I'm reaching out from RVNU..."} className="text-xs resize-none" rows={7} />
      </div>
      <div>
        <Label>CTA</Label>
        <Input value={step.cta || ''} onChange={e => onUpdate({ ...step, cta: e.target.value })}
          placeholder="e.g. Reply YES to learn more" className="text-xs h-8" />
      </div>
    </div>
  );
}

function TaskEditor({ step, onUpdate }) {
  const isDelay = STEP_TYPE_MAP[step.subtype] === 'delay' || step.type === 'delay';
  if (isDelay) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <Label>Wait Duration</Label>
          <div className="flex gap-2">
            <input type="number" min={1} value={step.delay_amount || 3}
              onChange={e => onUpdate({ ...step, delay_amount: parseInt(e.target.value) || 1 })}
              className="w-20 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-emerald-400" />
            <select value={step.delay_unit || 'days'}
              onChange={e => onUpdate({ ...step, delay_unit: e.target.value })}
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-emerald-400">
              {DELAY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div>
          <Label>Note (optional)</Label>
          <Input value={step.notes || ''} onChange={e => onUpdate({ ...step, notes: e.target.value })}
            placeholder="e.g. Wait for prospect to see LinkedIn view" className="text-xs h-8" />
        </div>
      </div>
    );
  }
  const isCall = step.type === 'call' || step.subtype === 'call';
  return (
    <div className="p-4 space-y-4">
      <div>
        <Label>{isCall ? 'Call Instructions' : 'Task Description'}</Label>
        <Textarea value={step.body || ''} onChange={e => onUpdate({ ...step, body: e.target.value })}
          placeholder={isCall ? 'Call objective: qualify budget and timeline...' : "Research prospect's recent funding round..."}
          className="text-xs resize-none" rows={6} />
      </div>
      <div>
        <Label>Notes</Label>
        <Input value={step.notes || ''} onChange={e => onUpdate({ ...step, notes: e.target.value })}
          placeholder="Any prep notes or context" className="text-xs h-8" />
      </div>
    </div>
  );
}

// ─── PREVIEWS ─────────────────────────────────────────────────────────────────
function EmailPreview({ step }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs shadow-sm h-full flex flex-col">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 flex-shrink-0">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
        </div>
        <span className="text-[10px] text-slate-400 ml-1 flex-1">Email Preview</span>
      </div>
      <div className="px-4 py-2.5 border-b border-slate-100 space-y-1.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-8 flex-shrink-0">From</span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <User className="w-2.5 h-2.5 text-emerald-600" />
            </div>
            <span className="text-[11px] text-slate-700 font-medium">You &lt;you@company.com&gt;</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-8 flex-shrink-0">To</span>
          <span className="text-[11px] text-slate-600">Chisom Okafor &lt;chisom@flutterwave.com&gt;</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[10px] text-slate-400 w-8 flex-shrink-0 mt-0.5">Sub</span>
          {step.subject
            ? <span className="text-[11px] font-semibold text-slate-800">{preview(step.subject)}</span>
            : <span className="text-[11px] text-slate-300">No subject yet</span>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {step.body
          ? <p className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">{preview(step.body)}</p>
          : <p className="text-[11px] text-slate-300 italic">Start typing to see your email preview…</p>}
      </div>
      {step.tone && (
        <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[9px] uppercase font-semibold text-slate-400">Tone</span>
          <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">{step.tone}</span>
        </div>
      )}
    </div>
  );
}

function WhatsAppPreview({ step }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="bg-[#075e54] px-4 py-2.5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-[#128C7E] flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-white">Chisom Okafor</p>
          <p className="text-[9px] text-emerald-200">online</p>
        </div>
      </div>
      <div className="p-4 min-h-[120px] bg-[#e5ddd5]">
        {step.body ? (
          <div className="bg-white rounded-xl rounded-tl-none px-3 py-2 shadow-sm max-w-[85%]">
            <p className="text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed">{preview(step.body)}</p>
            {step.cta && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-[10px] text-emerald-600 font-semibold">{preview(step.cta)}</p>
              </div>
            )}
            <p className="text-[9px] text-slate-400 text-right mt-1">09:41 ✓✓</p>
          </div>
        ) : (
          <p className="text-[11px] text-slate-500 italic">Start typing to preview...</p>
        )}
      </div>
    </div>
  );
}

function LinkedInPreview({ step }) {
  const subtype = step.subtype;
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-[#0077b5] px-4 py-2.5 flex items-center gap-2">
        <Linkedin className="w-3.5 h-3.5 text-white" />
        <span className="text-[11px] font-semibold text-white">LinkedIn Preview</span>
      </div>
      <div className="p-4">
        {(subtype === 'linkedin_connect' || subtype === 'linkedin_message') && (
          <>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Chisom Okafor</p>
                <p className="text-[10px] text-slate-400">Head of Growth · Flutterwave</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 min-h-[80px]">
              {step.body
                ? <p className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">{preview(step.body)}</p>
                : <p className="text-[11px] text-slate-400 italic">Write your message to preview...</p>}
            </div>
          </>
        )}
        {subtype === 'linkedin_view' && (
          <div className="flex items-center gap-2.5 text-xs text-slate-600 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-500" />
            </div>
            <p><span className="font-semibold">You</span> viewed Chisom Okafor's profile</p>
          </div>
        )}
        {subtype === 'linkedin_interact' && (
          <div className="text-xs text-slate-600 space-y-1.5">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Interacting with post</p>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-[11px] text-slate-500">
              {step.post_url || "Most recent post by Chisom Okafor"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskPreview({ step }) {
  const isDelay = STEP_TYPE_MAP[step.subtype] === 'delay' || step.type === 'delay';
  if (isDelay) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">Wait {step.delay_amount || 3} {step.delay_unit || 'days'}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{step.notes || 'Pause before next step'}</p>
        </div>
      </div>
    );
  }
  const isCall = step.type === 'call' || step.subtype === 'call';
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={cn('w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0',
          isCall ? 'bg-amber-50 border-amber-100' : 'bg-violet-50 border-violet-100')}>
          {isCall ? <Phone className="w-4 h-4 text-amber-500" /> : <CheckCircle2 className="w-4 h-4 text-violet-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-800">{isCall ? 'Phone Call' : 'Manual Task'}</p>
          <p className="text-[11px] text-slate-500 mt-1.5 whitespace-pre-wrap leading-relaxed min-h-[60px]">
            {step.body || <span className="italic text-slate-300">{isCall ? 'No call instructions yet.' : 'No task description yet.'}</span>}
          </p>
          {step.notes && <p className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">{step.notes}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN MODAL ───────────────────────────────────────────────────────────────
export default function StepModal({ step, index, isNew, onSave, onClose }) {
  const [draft, setDraft] = useState(() => ({
    day: 1,
    priority: 'normal',
    ...step,
  }));
  const [expanded, setExpanded] = useState(false);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);

  useEffect(() => {
    setDraft({ day: 1, priority: 'normal', ...step });
  }, [step]);

  if (!draft) return null;

  const baseType = STEP_TYPE_MAP[draft.subtype] || draft.type;
  const Icon = channelIcons[baseType] || Mail;
  const subtypeLabel = STEP_SUBTYPE_LABELS[draft.subtype] || draft.subtype || baseType;
  const isEmail = baseType === 'email';
  const isWide = isEmail || baseType === 'linkedin' || baseType === 'whatsapp';

  const renderEditor = () => {
    if (isEmail) return <EmailEditor step={draft} onUpdate={setDraft} />;
    if (baseType === 'linkedin') return <LinkedInEditor step={draft} onUpdate={setDraft} />;
    if (baseType === 'whatsapp') return <WhatsAppEditor step={draft} onUpdate={setDraft} />;
    return <TaskEditor step={draft} onUpdate={setDraft} />;
  };

  const renderPreview = () => {
    if (isEmail) return <EmailPreview step={draft} />;
    if (baseType === 'whatsapp') return <WhatsAppPreview step={draft} />;
    if (baseType === 'linkedin') return <LinkedInPreview step={draft} />;
    return <TaskPreview step={draft} />;
  };

  const modalWidth = expanded ? 'max-w-6xl' : isWide ? 'max-w-4xl' : 'max-w-xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className={cn('bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden w-full transition-all duration-200', modalWidth)}
        style={{ maxHeight: expanded ? '96vh' : '88vh' }}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={cn('w-7 h-7 rounded-lg border flex items-center justify-center', channelBg[baseType] || 'bg-slate-50 border-slate-200')}>
              <Icon className={cn('w-3.5 h-3.5', channelColors[baseType])} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{subtypeLabel}</p>
              <p className="text-[10px] text-slate-400">Step {index + 1}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Priority selector */}
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1 bg-white">
              <span className="text-[10px] text-slate-400 font-medium">Priority</span>
              <select
                value={draft.priority || 'normal'}
                onChange={e => setDraft(d => ({ ...d, priority: e.target.value }))}
                className="text-[10px] font-semibold bg-transparent outline-none text-slate-700 cursor-pointer">
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            {/* AI actions */}
            <AIActions onAction={() => {}} />

            {/* Expand / Collapse */}
            <button onClick={() => setExpanded(e => !e)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title={expanded ? 'Collapse' : 'Expand'}>
              {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close */}
            <button onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Schedule + Send Test row ── */}
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Send on Day</span>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
              <button onClick={() => setDraft(d => ({ ...d, day: Math.max(1, (d.day ?? 1) - 1) }))}
                className="px-2 py-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors text-xs font-bold">−</button>
              <input type="number" min={1}
                value={draft.day ?? 1}
                onChange={e => setDraft(d => ({ ...d, day: parseInt(e.target.value) || 1 }))}
                className="w-10 text-xs text-center text-slate-700 bg-transparent outline-none border-x border-slate-200 py-1 tabular-nums" />
              <button onClick={() => setDraft(d => ({ ...d, day: (d.day ?? 1) + 1 }))}
                className="px-2 py-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors text-xs font-bold">+</button>
            </div>
          </div>
          {isEmail && (
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[10px] font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-colors">
              <Send className="w-3 h-3" /> Send Test Email
            </button>
          )}
        </div>

        {/* ── Modal Body ── */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left: Editor */}
          <div className={cn(
            'flex flex-col transition-all duration-200',
            isWide
              ? previewCollapsed ? 'w-full' : 'w-1/2 border-r border-slate-100'
              : 'flex-1'
          )}>
            {isEmail ? (
              <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
                {renderEditor()}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {renderEditor()}
              </div>
            )}
          </div>

          {/* Collapse toggle + Right: Preview */}
          {isWide && (
            <>
              {/* Center divider toggle */}
              <button
                onClick={() => setPreviewCollapsed(c => !c)}
                className="flex items-center justify-center w-4 bg-slate-50 border-r border-slate-100 hover:bg-slate-100 transition-colors flex-shrink-0 group"
                title={previewCollapsed ? 'Show preview' : 'Hide preview'}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-emerald-300 transition-colors">
                  {previewCollapsed
                    ? <ChevronRight className="w-2 h-2 text-slate-400" />
                    : <ChevronLeft className="w-2 h-2 text-slate-400" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {!previewCollapsed && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '50%', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-y-auto bg-slate-50/50 flex-shrink-0"
                  >
                    <div className="p-4 h-full flex flex-col gap-2">
                      <div className="flex items-center justify-between flex-shrink-0">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Live Preview</p>
                      </div>
                      <div className="flex-1 min-h-0">
                        {renderPreview()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 flex-shrink-0 bg-slate-50/50">
          <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
          <Button size="sm" onClick={() => onSave(draft)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-4 text-xs font-semibold gap-1.5">
            {isNew ? 'Add Step' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}