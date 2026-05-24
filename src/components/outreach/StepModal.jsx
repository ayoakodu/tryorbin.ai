import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MessageCircle, Phone, Clock, CheckCircle2, Sparkles, X,
  User, Maximize2, Minimize2, Bold, Italic, Underline, Link2,
  Paperclip, Image, Video, BarChart2, PenLine,
  Search, Send, Wand2, ChevronRight, ChevronLeft, Calendar
} from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { STEP_TYPE_MAP, STEP_SUBTYPE_LABELS } from './AddStepMenu';

const channelColors = {
  email: 'text-blue-500', linkedin: 'text-blue-600',
  whatsapp: 'text-emerald-500', call: 'text-amber-500',
  task: 'text-violet-500', delay: 'text-slate-400',
};
const channelBg = {
  email: 'bg-blue-50 border-blue-100',
  linkedin: 'bg-blue-50 border-blue-100',
  whatsapp: 'bg-emerald-50 border-emerald-100',
  call: 'bg-amber-50 border-amber-100',
  task: 'bg-violet-50 border-violet-100',
  delay: 'bg-slate-50 border-slate-200',
};
const channelIcons = {
  email: Mail, linkedin: Linkedin, whatsapp: MessageCircle,
  call: Phone, task: CheckCircle2, delay: Clock,
};

const PRIORITIES = [
  { value: 'high',   label: 'High'   },
  { value: 'normal', label: 'Normal' },
  { value: 'low',    label: 'Low'    },
];

const TONES = ['Professional', 'Friendly', 'Direct', 'Casual'];
const DELAY_UNITS = ['hours', 'days', 'weeks'];

const VAR_TABS = {
  Prospect:    ['{{first_name}}', '{{last_name}}', '{{title}}', '{{phone}}', '{{email}}'],
  Account:     ['{{company}}', '{{industry}}', '{{website}}', '{{company_size}}', '{{revenue}}'],
  Opportunity: ['{{deal_name}}', '{{deal_value}}', '{{close_date}}', '{{stage}}'],
  Sender:      ['{{sender_name}}', '{{sender_title}}', '{{sender_company}}', '{{today}}'],
};

function previewText(text) {
  if (!text) return '';
  return text
    .replace(/\{\{first_name\}\}/g, 'Chisom')
    .replace(/\{\{last_name\}\}/g, 'Okafor')
    .replace(/\{\{company\}\}/g, 'Flutterwave')
    .replace(/\{\{title\}\}/g, 'Head of Growth')
    .replace(/\{\{industry\}\}/g, 'Fintech')
    .replace(/\{\{sender_name\}\}/g, 'You')
    .replace(/\{\{sender_title\}\}/g, 'Account Executive')
    .replace(/\{\{sender_company\}\}/g, 'RVNU');
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
  const filtered = search
    ? Object.values(VAR_TABS).flat().filter(v => v.toLowerCase().includes(search.toLowerCase()))
    : vars;

  return (
    <div ref={ref}
      className="absolute bottom-full left-0 mb-2 z-[999] bg-white rounded-xl border border-slate-200 shadow-2xl"
      style={{ width: 280 }}>
      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-2 pt-2 gap-0.5">
        {Object.keys(VAR_TABS).map(t => (
          <button key={t} onClick={() => { setActiveTab(t); setSearch(''); }}
            className={cn(
              'px-2.5 py-1.5 text-[10px] font-semibold rounded-t transition-colors whitespace-nowrap',
              activeTab === t && !search
                ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-600'
            )}>{t}</button>
        ))}
      </div>
      {/* Search */}
      <div className="px-3 pt-2.5 pb-1">
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-emerald-300 transition-colors">
          <Search className="w-3 h-3 text-slate-300 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search variables…"
            className="flex-1 text-[11px] text-slate-700 bg-transparent outline-none placeholder:text-slate-300" />
        </div>
      </div>
      {/* List */}
      <div className="px-2 pb-2.5 max-h-44 overflow-y-auto">
        {filtered.map(v => (
          <button key={v} onClick={() => { onInsert(v); onClose(); }}
            className="flex items-center w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-slate-50 transition-colors">
            <span className="text-[11px] font-mono text-emerald-600 font-semibold">{v}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-[11px] text-slate-400 px-2.5 py-2 italic">No variables found</p>
        )}
      </div>
    </div>
  );
}

// ─── EMAIL FORMATTING TOOLBAR ─────────────────────────────────────────────────
function EmailToolbar({ onVarInsert, editorRef, onHtmlChange }) {
  const [showVars, setShowVars] = useState(false);
  const fileInputRef  = useRef(null);
  const imageInputRef = useRef(null);

  const exec = (cmd, value = null) => {
    editorRef?.current?.focus();
    document.execCommand(cmd, false, value);
    // Sync HTML back to state after execCommand
    requestAnimationFrame(() => {
      if (editorRef?.current) onHtmlChange(editorRef.current.innerHTML);
    });
  };

  const handleLink = () => {
    const url = window.prompt('Enter URL:', 'https://');
    if (url) exec('createLink', url);
  };

  const insertHtmlAtCursor = (html) => {
    editorRef?.current?.focus();
    document.execCommand('insertHTML', false, html);
    requestAnimationFrame(() => {
      if (editorRef?.current) onHtmlChange(editorRef.current.innerHTML);
    });
  };

  const handleFile = (e, isImage) => {
    const file = e.target.files?.[0];
    if (!file) return;
    insertHtmlAtCursor(isImage
      ? `<span style="color:#16a34a">[Image: ${file.name}]</span>`
      : `<span style="color:#16a34a">[Attachment: ${file.name}]</span>`);
    e.target.value = '';
  };

  const handleVideo = () => {
    const url = window.prompt('Enter video URL:', 'https://');
    if (url) insertHtmlAtCursor(`<a href="${url}" style="color:#2563eb">[Video]</a>`);
  };

  const handleCalendar = () => insertHtmlAtCursor('<span style="color:#16a34a">{{calendar_link}}</span>');
  const handleTracking = () => insertHtmlAtCursor('<span style="color:#16a34a">{{tracking_pixel}}</span>');
  const handleSignature = () => insertHtmlAtCursor('<br><br>--<br>{{sender_name}}<br>{{sender_title}} at {{sender_company}}');

  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-t border-slate-100 bg-white flex-wrap">
      {/* Format group */}
      <div className="flex items-center gap-0.5">
        <button title="Bold" onMouseDown={e => { e.preventDefault(); exec('bold'); }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Bold className="w-[13px] h-[13px]" />
        </button>
        <button title="Italic" onMouseDown={e => { e.preventDefault(); exec('italic'); }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Italic className="w-[13px] h-[13px]" />
        </button>
        <button title="Underline" onMouseDown={e => { e.preventDefault(); exec('underline'); }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Underline className="w-[13px] h-[13px]" />
        </button>
        <button title="Insert Link" onMouseDown={e => { e.preventDefault(); handleLink(); }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Link2 className="w-[13px] h-[13px]" />
        </button>
      </div>

      <div className="w-px h-4 bg-slate-200 mx-1 flex-shrink-0" />

      {/* Insert group */}
      <div className="flex items-center gap-0.5">
        <button title="Attach File" onMouseDown={e => { e.preventDefault(); fileInputRef.current?.click(); }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Paperclip className="w-[13px] h-[13px]" />
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={e => handleFile(e, false)} />

        <button title="Insert Image" onMouseDown={e => { e.preventDefault(); imageInputRef.current?.click(); }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Image className="w-[13px] h-[13px]" />
        </button>
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, true)} />

        <button title="Insert Video" onMouseDown={e => { e.preventDefault(); handleVideo(); }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Video className="w-[13px] h-[13px]" />
        </button>
        <button title="Insert Calendar Link" onMouseDown={e => { e.preventDefault(); handleCalendar(); }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Calendar className="w-[13px] h-[13px]" />
        </button>
        <button title="Enable Tracking" onMouseDown={e => { e.preventDefault(); handleTracking(); }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <BarChart2 className="w-[13px] h-[13px]" />
        </button>
        <button title="Insert Signature" onMouseDown={e => { e.preventDefault(); handleSignature(); }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <PenLine className="w-[13px] h-[13px]" />
        </button>
      </div>

      <div className="w-px h-4 bg-slate-200 mx-1 flex-shrink-0" />

      {/* Variables */}
      <div className="relative">
        <button onMouseDown={e => { e.preventDefault(); setShowVars(v => !v); }}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors',
            showVars
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-transparent'
          )}>
          <span className="font-mono text-[12px] leading-none">{'{ }'}</span>
          Variables
        </button>
        {showVars && (
          <VariableDropdown onInsert={v => { insertHtmlAtCursor(`<span style="color:#16a34a">${v}</span>`); onVarInsert(v); }} onClose={() => setShowVars(false)} />
        )}
      </div>

      {/* AI Write — right side */}
      <div className="flex items-center ml-auto">
        <button title="AI Write"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-200">
          <Wand2 className="w-[13px] h-[13px]" />
          <span className="hidden xl:inline">AI Write</span>
        </button>
      </div>
    </div>
  );
}

// ─── EMAIL EDITOR ─────────────────────────────────────────────────────────────
function EmailEditor({ step, onUpdate }) {
  const editorRef = useRef(null);
  // Track whether we've initialized the editor DOM with existing content
  const initializedRef = useRef(false);

  // Only set innerHTML on first mount or when step id changes (not on every keystroke)
  useEffect(() => {
    if (editorRef.current && !initializedRef.current) {
      editorRef.current.innerHTML = step.body || '';
      initializedRef.current = true;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onUpdate({ ...step, body: editorRef.current.innerHTML });
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Subject row */}
      <div className="flex items-center gap-4 px-6 py-3.5 border-b border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-14 flex-shrink-0">Subject</span>
        <input
          value={step.subject || ''}
          onChange={e => onUpdate({ ...step, subject: e.target.value })}
          placeholder="e.g. Quick question about {{company}}…"
          className="flex-1 text-[13px] font-medium text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
        />
      </div>

      {/* Tone row */}
      <div className="flex items-center gap-4 px-6 py-2.5 border-b border-slate-100 bg-slate-50/30">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-14 flex-shrink-0">Tone</span>
        <div className="flex items-center gap-1.5">
          {TONES.map(t => (
            <button key={t} onClick={() => onUpdate({ ...step, tone: step.tone === t ? undefined : t })}
              className={cn(
                'text-[11px] px-2.5 py-1 rounded-full border transition-all font-medium',
                step.tone === t
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 bg-white'
              )}>{t}</button>
          ))}
        </div>
      </div>

      {/* Body — contentEditable rich text area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder="Hi {{first_name}},&#10;&#10;I came across {{company}} and noticed…&#10;&#10;Would love to share a quick idea.&#10;&#10;Best,&#10;{{sender_name}}"
          className="flex-1 text-[13px] leading-relaxed px-6 py-5 text-slate-700 outline-none overflow-y-auto min-h-0 email-editor-body"
          style={{ minHeight: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        />
        <EmailToolbar
          editorRef={editorRef}
          onVarInsert={() => {}}
          onHtmlChange={html => onUpdate({ ...step, body: html })}
        />
      </div>
    </div>
  );
}

// ─── NON-EMAIL EDITORS ────────────────────────────────────────────────────────
function LinkedInEditor({ step, onUpdate }) {
  const subtype = step.subtype;
  return (
    <div className="p-6 space-y-5">
      {(subtype === 'linkedin_connect' || subtype === 'linkedin_message') && (
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
            {subtype === 'linkedin_connect' ? 'Connection Note' : 'Message'}
          </label>
          <Textarea value={step.body || ''} onChange={e => onUpdate({ ...step, body: e.target.value })}
            placeholder={subtype === 'linkedin_connect' ? "Hi {{first_name}}, I'd love to connect…" : "Hi {{first_name}}, following up…"}
            className="text-[13px] resize-none" rows={8} />
        </div>
      )}
      {subtype === 'linkedin_view' && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-[12px] text-blue-700 leading-relaxed">
          This step automatically triggers a profile view signal. No content needed.
        </div>
      )}
      {subtype === 'linkedin_interact' && (
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Post URL (optional)</label>
          <Input value={step.post_url || ''} onChange={e => onUpdate({ ...step, post_url: e.target.value })}
            placeholder="https://linkedin.com/posts/…" className="text-[12px]" />
          <p className="text-[11px] text-slate-400 mt-1.5">Leave blank to interact with their latest post.</p>
        </div>
      )}
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">CTA / Purpose</label>
        <Input value={step.cta || ''} onChange={e => onUpdate({ ...step, cta: e.target.value })}
          placeholder="e.g. Book a 15-min call" className="text-[12px]" />
      </div>
    </div>
  );
}

function WhatsAppEditor({ step, onUpdate }) {
  return (
    <div className="p-6 space-y-5">
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Message</label>
        <Textarea value={step.body || ''} onChange={e => onUpdate({ ...step, body: e.target.value })}
          placeholder={"Hi {{first_name}} 👋 I'm reaching out from RVNU…"} className="text-[13px] resize-none" rows={9} />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">CTA</label>
        <Input value={step.cta || ''} onChange={e => onUpdate({ ...step, cta: e.target.value })}
          placeholder="e.g. Reply YES to learn more" className="text-[12px]" />
      </div>
    </div>
  );
}

function TaskEditor({ step, onUpdate }) {
  const isDelay = STEP_TYPE_MAP[step.subtype] === 'delay' || step.type === 'delay';
  const isCall  = step.type === 'call' || step.subtype === 'call';

  if (isDelay) {
    return (
      <div className="p-6 space-y-5">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Wait Duration</label>
          <div className="flex gap-3">
            <input type="number" min={1} value={step.delay_amount || 3}
              onChange={e => onUpdate({ ...step, delay_amount: parseInt(e.target.value) || 1 })}
              className="w-24 text-[13px] bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-emerald-400 transition-colors" />
            <select value={step.delay_unit || 'days'}
              onChange={e => onUpdate({ ...step, delay_unit: e.target.value })}
              className="flex-1 text-[13px] bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-emerald-400 transition-colors">
              {DELAY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Note (optional)</label>
          <Input value={step.notes || ''} onChange={e => onUpdate({ ...step, notes: e.target.value })}
            placeholder="e.g. Wait for prospect to see LinkedIn view" className="text-[12px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
          {isCall ? 'Call Instructions' : 'Task Description'}
        </label>
        <Textarea value={step.body || ''} onChange={e => onUpdate({ ...step, body: e.target.value })}
          placeholder={isCall ? 'Call objective: qualify budget and timeline…' : "Research prospect's recent funding round…"}
          className="text-[13px] resize-none" rows={8} />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Notes</label>
        <Input value={step.notes || ''} onChange={e => onUpdate({ ...step, notes: e.target.value })}
          placeholder="Prep notes or context" className="text-[12px]" />
      </div>
    </div>
  );
}

// ─── PREVIEWS ─────────────────────────────────────────────────────────────────
function EmailPreview({ step }) {
  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
        </div>
        <span className="text-[10px] text-slate-400 ml-1 font-medium">Email Preview</span>
      </div>

      {/* Email header fields */}
      <div className="px-5 py-3 border-b border-slate-100 space-y-2 flex-shrink-0 bg-white">
        {[
          { label: 'From', value: 'You <you@company.com>' },
          { label: 'To',   value: 'Chisom Okafor <chisom@flutterwave.com>' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-semibold w-7 flex-shrink-0">{label}</span>
            <span className="text-[11px] text-slate-600">{value}</span>
          </div>
        ))}
        <div className="flex items-start gap-3">
          <span className="text-[10px] text-slate-400 font-semibold w-7 flex-shrink-0 mt-0.5">Sub</span>
          {step.subject
            ? <span className="text-[12px] font-semibold text-slate-800 leading-tight">{previewText(step.subject)}</span>
            : <span className="text-[11px] text-slate-300 italic">No subject yet…</span>}
        </div>
      </div>

      {/* Email body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {step.body
          ? <div className="text-[12px] text-slate-700 leading-[1.75] email-preview-body"
              dangerouslySetInnerHTML={{ __html: previewText(step.body) }} />
          : <p className="text-[12px] text-slate-300 italic">Start typing to see your email preview…</p>}
      </div>

      {/* Tone badge */}
      {step.tone && (
        <div className="px-5 py-2 border-t border-slate-100 flex items-center gap-2 flex-shrink-0">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Tone</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">{step.tone}</span>
        </div>
      )}
    </div>
  );
}

function WhatsAppPreview({ step }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#128C7E] flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-white">Chisom Okafor</p>
          <p className="text-[10px] text-emerald-300">online</p>
        </div>
      </div>
      <div className="p-5 min-h-[140px] bg-[#e5ddd5]">
        {step.body ? (
          <div className="bg-white rounded-xl rounded-tl-none px-4 py-3 shadow-sm max-w-[85%]">
            <p className="text-[12px] text-slate-800 whitespace-pre-wrap leading-relaxed">{previewText(step.body)}</p>
            {step.cta && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] text-emerald-600 font-semibold">{previewText(step.cta)}</p>
              </div>
            )}
            <p className="text-[10px] text-slate-400 text-right mt-1.5">09:41 ✓✓</p>
          </div>
        ) : (
          <p className="text-[12px] text-slate-500 italic">Start typing to preview…</p>
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
      <div className="p-5">
        {(subtype === 'linkedin_connect' || subtype === 'linkedin_message') && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800">Chisom Okafor</p>
                <p className="text-[11px] text-slate-400">Head of Growth · Flutterwave</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 min-h-[80px]">
              {step.body
                ? <p className="text-[12px] text-slate-700 whitespace-pre-wrap leading-relaxed">{previewText(step.body)}</p>
                : <p className="text-[12px] text-slate-400 italic">Write your message to preview…</p>}
            </div>
          </>
        )}
        {subtype === 'linkedin_view' && (
          <div className="flex items-center gap-3 py-2">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-[12px] text-slate-600"><span className="font-semibold">You</span> viewed Chisom Okafor's profile</p>
          </div>
        )}
        {subtype === 'linkedin_interact' && (
          <div className="space-y-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Interacting with post</p>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[12px] text-slate-500">
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
  const isCall  = step.type === 'call' || step.subtype === 'call';

  if (isDelay) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
          <Clock className="w-6 h-6 text-slate-400" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-slate-700">Wait {step.delay_amount || 3} {step.delay_unit || 'days'}</p>
          <p className="text-[12px] text-slate-400 mt-0.5">{step.notes || 'Pause before next step'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0',
          isCall ? 'bg-amber-50 border-amber-100' : 'bg-violet-50 border-violet-100')}>
          {isCall ? <Phone className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-violet-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-800">{isCall ? 'Phone Call' : 'Manual Task'}</p>
          <p className="text-[12px] text-slate-500 mt-2 whitespace-pre-wrap leading-relaxed min-h-[60px]">
            {step.body || <span className="italic text-slate-300">{isCall ? 'No call instructions yet.' : 'No task description yet.'}</span>}
          </p>
          {step.notes && <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100">{step.notes}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN MODAL ───────────────────────────────────────────────────────────────
export default function StepModal({ step, index, isNew, onSave, onClose }) {
  const [draft, setDraft] = useState(() => ({ priority: 'normal', ...step, day: isNew ? 1 : (step?.day ?? 1) }));
  const [maximized, setMaximized] = useState(false);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);

  useEffect(() => {
    setDraft({ priority: 'normal', ...step, day: isNew ? 1 : (step?.day ?? 1) });
  }, [step]);

  if (!draft) return null;

  const baseType    = STEP_TYPE_MAP[draft.subtype] || draft.type;
  const StepIcon    = channelIcons[baseType] || Mail;
  const subtypeLabel = STEP_SUBTYPE_LABELS[draft.subtype] || draft.subtype || baseType;
  const isEmail     = baseType === 'email';
  const hasSplit    = isEmail || baseType === 'linkedin' || baseType === 'whatsapp';

  const renderEditor  = () => {
    if (isEmail)            return <EmailEditor step={draft} onUpdate={setDraft} />;
    if (baseType === 'linkedin') return <LinkedInEditor step={draft} onUpdate={setDraft} />;
    if (baseType === 'whatsapp') return <WhatsAppEditor step={draft} onUpdate={setDraft} />;
    return <TaskEditor step={draft} onUpdate={setDraft} />;
  };

  const renderPreview = () => {
    if (isEmail)            return <EmailPreview step={draft} />;
    if (baseType === 'whatsapp') return <WhatsAppPreview step={draft} />;
    if (baseType === 'linkedin') return <LinkedInPreview step={draft} />;
    return <TaskPreview step={draft} />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[3px] p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden w-full"
        style={{
          width:     maximized ? '96vw'  : '90vw',
          maxWidth:  maximized ? '100vw' : '1500px',
          height:    maximized ? '96vh'  : '88vh',
          maxHeight: '95vh',
          transition: 'width 0.2s ease, height 0.2s ease',
        }}
      >

        {/* ── MODAL HEADER ── */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 flex-shrink-0">
          {/* Left: Step identity */}
          <div className="flex items-center gap-3">
            <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0', channelBg[baseType] || 'bg-slate-50 border-slate-200')}>
              <StepIcon className={cn('w-4 h-4', channelColors[baseType])} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800 leading-tight">{subtypeLabel}</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Step {index + 1}</p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">

            {/* Priority */}
            <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-1.5 bg-white hover:border-slate-300 transition-colors">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Priority</span>
              <select
                value={draft.priority || 'normal'}
                onChange={e => setDraft(d => ({ ...d, priority: e.target.value }))}
                className="text-[11px] font-bold bg-transparent outline-none text-slate-700 cursor-pointer">
                {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            {/* Maximize */}
            <button onClick={() => setMaximized(m => !m)}
              title={maximized ? 'Restore' : 'Maximize'}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              {maximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── SUB-HEADER: Day + Send Test ── */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Send on Day</span>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => setDraft(d => ({ ...d, day: Math.max(1, (d.day ?? 1) - 1) }))}
                className="px-2.5 py-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors text-sm font-bold leading-none">−</button>
              <input
                type="number" min={1}
                value={draft.day ?? 1}
                onChange={e => setDraft(d => ({ ...d, day: Math.max(1, parseInt(e.target.value) || 1) }))}
                className="w-10 text-[12px] text-center font-semibold text-slate-700 bg-transparent outline-none border-x border-slate-200 py-1.5 tabular-nums" />
              <button
                onClick={() => setDraft(d => ({ ...d, day: (d.day ?? 1) + 1 }))}
                className="px-2.5 py-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors text-sm font-bold leading-none">+</button>
            </div>
          </div>

          {isEmail && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all shadow-sm">
              <Send className="w-3 h-3" />
              Send Test Email
            </button>
          )}
        </div>

        {/* ── MODAL BODY ── */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* LEFT — Editor */}
          <div
            className={cn(
              'flex flex-col min-h-0 transition-all duration-200',
              hasSplit
                ? previewCollapsed ? 'flex-1' : 'w-[62%]'
                : 'flex-1'
            )}
          >
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              {renderEditor()}
            </div>
          </div>

          {/* DIVIDER + TOGGLE (split views only) */}
          {hasSplit && (
            <div className="relative flex items-center flex-shrink-0"
              style={{ width: 1, background: '#e2e8f0' }}>
              <button
                onClick={() => setPreviewCollapsed(c => !c)}
                title={previewCollapsed ? 'Show preview' : 'Hide preview'}
                className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 hover:border-emerald-400 transition-all shadow-sm group"
              >
                {previewCollapsed
                  ? <ChevronRight className="w-3 h-3 text-emerald-500 group-hover:text-emerald-700" />
                  : <ChevronLeft  className="w-3 h-3 text-emerald-500 group-hover:text-emerald-700" />}
              </button>
            </div>
          )}

          {/* RIGHT — Preview */}
          {hasSplit && (
            <AnimatePresence initial={false}>
              {!previewCollapsed && (
                <motion.div
                  key="preview-panel"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '38%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="flex flex-col overflow-hidden flex-shrink-0 bg-slate-50/60"
                  style={{ minWidth: 0 }}
                >
                  <div className="px-5 pt-4 pb-2 flex-shrink-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Preview</p>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 pb-5 min-h-0">
                    {renderPreview()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-white flex-shrink-0">
          <button onClick={onClose}
            className="text-[12px] font-medium text-slate-400 hover:text-slate-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100">
            Cancel
          </button>
          <Button
            onClick={() => onSave(draft)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-6 text-[12px] font-semibold gap-2 rounded-lg shadow-sm">
            {isNew ? 'Add Step' : 'Save Changes'}
          </Button>
        </div>

      </motion.div>
    </div>
  );
}