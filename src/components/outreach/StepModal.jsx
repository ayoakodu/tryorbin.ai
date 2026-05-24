import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MessageCircle, Phone, Clock, CheckCircle2, X,
  User, Maximize2, Minimize2, Bold, Italic, Underline, Link2,
  Paperclip, Image, Video, PenLine,
  Search, Send, Wand2, ChevronRight, ChevronLeft, Calendar,
  ChevronDown, Sparkles, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Type, Eraser, Code2, Palette
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

// ─── TYPE DROPDOWN (New Thread / Reply) ───────────────────────────────────────
function TypeDropdown({ value, onChange, allSteps, currentIndex }) {
  const [open, setOpen] = useState(false);
  const [showReplyMenu, setShowReplyMenu] = useState(false);
  const ref = useRef(null);
  const replyTimeout = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowReplyMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => () => clearTimeout(replyTimeout.current), []);

  const prevEmailSteps = (allSteps || []).slice(0, currentIndex).filter(s =>
    (STEP_TYPE_MAP[s.subtype] || s.type) === 'email'
  );

  const displayLabel = value?.type === 'reply'
    ? value.replyTo === 'previous'
      ? 'Reply to previous'
      : `Reply: Step #${value.replyTo}`
    : 'New Thread';

  const handleReplyEnter = () => {
    clearTimeout(replyTimeout.current);
    setShowReplyMenu(true);
  };

  const handleReplyLeave = () => {
    replyTimeout.current = setTimeout(() => setShowReplyMenu(false), 120);
  };

  const handleSubmenuEnter = () => {
    clearTimeout(replyTimeout.current);
  };

  const handleSubmenuLeave = () => {
    replyTimeout.current = setTimeout(() => setShowReplyMenu(false), 120);
  };

  const selectReply = (replyTo, replySubject) => {
    onChange({ type: 'reply', replyTo, replySubject });
    setOpen(false);
    setShowReplyMenu(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(o => !o); setShowReplyMenu(false); }}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all',
          open
            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
        )}
      >
        <span>{displayLabel}</span>
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 mt-1.5 z-[9999] bg-white rounded-xl border border-slate-200 shadow-xl"
            style={{ minWidth: 230 }}
          >
            {/* New Thread */}
            <button
              onClick={() => { onChange({ type: 'new_thread' }); setOpen(false); setShowReplyMenu(false); }}
              className={cn(
                'flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-colors hover:bg-slate-50 rounded-t-xl',
                value?.type !== 'reply' && 'bg-emerald-50/60'
              )}
            >
              <div className="w-5 h-5 rounded bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-2.5 h-2.5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-slate-800">New Thread</p>
                <p className="text-[10px] text-slate-400">Start a fresh email conversation</p>
              </div>
              {value?.type !== 'reply' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
            </button>

            <div className="h-px bg-slate-100 mx-3" />

            {/* Reply row — hover triggers submenu */}
            <div className="relative rounded-b-xl overflow-visible">
              <div
                onMouseEnter={handleReplyEnter}
                onMouseLeave={handleReplyLeave}
                className={cn(
                  'flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-colors cursor-pointer rounded-b-xl',
                  showReplyMenu ? 'bg-slate-50' : 'hover:bg-slate-50',
                  value?.type === 'reply' && 'bg-emerald-50/60'
                )}
              >
                <div className="w-5 h-5 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <ChevronRight className="w-2.5 h-2.5 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-semibold text-slate-800">Reply</p>
                  <p className="text-[10px] text-slate-400">Thread onto an existing email</p>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                {value?.type === 'reply' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
              </div>

              {/* Submenu — rendered inline to the right */}
              <AnimatePresence>
                {showReplyMenu && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.12 }}
                    onMouseEnter={handleSubmenuEnter}
                    onMouseLeave={handleSubmenuLeave}
                    className="absolute top-0 left-full ml-1.5 bg-white rounded-xl border border-slate-200 shadow-xl z-[9999]"
                    style={{ minWidth: 230 }}
                  >
                    <div className="px-4 pt-3 pb-1.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Reply to…</p>
                    </div>

                    <button
                      onClick={() => selectReply('previous', null)}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left hover:bg-emerald-50 transition-colors"
                    >
                      <div className="w-5 h-5 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                        <ChevronRight className="w-2.5 h-2.5 text-emerald-500" />
                      </div>
                      <span className="text-[12px] font-medium text-slate-700">Reply to previous step</span>
                    </button>

                    {prevEmailSteps.length > 0 && (
                      <>
                        <div className="h-px bg-slate-100 mx-3 my-0.5" />
                        <div className="px-4 py-1">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Specific step</p>
                        </div>
                        {prevEmailSteps.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => selectReply(i + 1, s.subject)}
                            className="flex items-center gap-2.5 w-full px-4 py-2 text-left hover:bg-emerald-50 transition-colors"
                          >
                            <div className="w-5 h-5 rounded bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-slate-500">
                              {i + 1}
                            </div>
                            <span className="text-[12px] font-medium text-slate-700 truncate">
                              {s.subject || 'No subject'}
                            </span>
                          </button>
                        ))}
                      </>
                    )}

                    {prevEmailSteps.length === 0 && (
                      <p className="text-[11px] text-slate-400 italic px-4 pb-3">No previous email steps yet</p>
                    )}
                    <div className="h-2" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
      <div className="px-3 pt-2.5 pb-1">
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:border-emerald-300 transition-colors">
          <Search className="w-3 h-3 text-slate-300 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search variables…"
            className="flex-1 text-[11px] text-slate-700 bg-transparent outline-none placeholder:text-slate-300" />
        </div>
      </div>
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

// ─── ADVANCED FORMAT POPOVER ──────────────────────────────────────────────────
const FONT_FAMILIES = ['Default', 'Arial', 'Georgia', 'Verdana', 'Trebuchet MS', 'Courier New'];
const FONT_SIZES    = ['10px', '12px', '13px', '14px', '16px', '18px', '20px', '24px'];
const TEXT_COLORS   = [
  '#1e293b', '#475569', '#94a3b8', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899',
];

function FormatPopover({ editorRef, onHtmlChange, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const exec = (cmd, value = null) => {
    editorRef?.current?.focus();
    document.execCommand(cmd, false, value);
    requestAnimationFrame(() => {
      if (editorRef?.current) onHtmlChange(editorRef.current.innerHTML);
    });
  };

  const fmtBtn = (title, cmd, val, Icon, extraClass = '') => (
    <button
      key={title}
      title={title}
      onMouseDown={e => { e.preventDefault(); exec(cmd, val); }}
      className={cn(
        'w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors',
        extraClass
      )}
    >
      <Icon className="w-[13px] h-[13px]" />
    </button>
  );

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 mb-1.5 z-[999] bg-white rounded-xl border border-slate-200 shadow-xl"
      style={{ minWidth: 340 }}
    >
      <div className="px-3 py-2.5 flex flex-col gap-2.5">

        {/* Row 1: Font family + size */}
        <div className="flex items-center gap-2">
          <select
            onMouseDown={e => e.stopPropagation()}
            onChange={e => { if (e.target.value !== 'Default') exec('fontName', e.target.value); }}
            className="flex-1 text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 outline-none focus:border-emerald-400 transition-colors cursor-pointer"
          >
            {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select
            onMouseDown={e => e.stopPropagation()}
            onChange={e => exec('fontSize', { '10px': '1', '12px': '2', '13px': '3', '14px': '3', '16px': '4', '18px': '5', '20px': '6', '24px': '7' }[e.target.value] || '3')}
            className="w-20 text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 outline-none focus:border-emerald-400 transition-colors cursor-pointer"
          >
            {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Row 2: B / I / U + alignment + list + code + clear */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {fmtBtn('Bold',           'bold',           null, Bold)}
          {fmtBtn('Italic',         'italic',         null, Italic)}
          {fmtBtn('Underline',      'underline',      null, Underline)}
          <div className="w-px h-4 bg-slate-200 mx-1" />
          {fmtBtn('Align Left',     'justifyLeft',    null, AlignLeft)}
          {fmtBtn('Align Center',   'justifyCenter',  null, AlignCenter)}
          {fmtBtn('Align Right',    'justifyRight',   null, AlignRight)}
          <div className="w-px h-4 bg-slate-200 mx-1" />
          {fmtBtn('Bullet List',    'insertUnorderedList', null, List)}
          {fmtBtn('Numbered List',  'insertOrderedList',   null, ListOrdered)}
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <button
            title="Inline Code"
            onMouseDown={e => {
              e.preventDefault();
              editorRef?.current?.focus();
              const sel = window.getSelection();
              const txt = sel?.toString();
              if (txt) document.execCommand('insertHTML', false, `<code style="background:#f1f5f9;padding:1px 5px;border-radius:4px;font-family:monospace;font-size:12px">${txt}</code>`);
              requestAnimationFrame(() => { if (editorRef?.current) onHtmlChange(editorRef.current.innerHTML); });
            }}
            className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Code2 className="w-[13px] h-[13px]" />
          </button>
          {fmtBtn('Clear Formatting', 'removeFormat', null, Eraser)}
        </div>

        <div className="h-px bg-slate-100" />

        {/* Row 3: Color palette */}
        <div className="flex items-center gap-2">
          <Palette className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <div className="flex items-center gap-1.5 flex-wrap">
            {TEXT_COLORS.map(color => (
              <button
                key={color}
                title={color}
                onMouseDown={e => { e.preventDefault(); exec('foreColor', color); }}
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform ring-1 ring-slate-200 hover:ring-slate-400"
                style={{ background: color }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── EMAIL FORMATTING TOOLBAR ─────────────────────────────────────────────────
function EmailToolbar({ editorRef, onHtmlChange, draft, onDraftChange }) {
  const [showVars, setShowVars] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  const fileInputRef  = useRef(null);
  const imageInputRef = useRef(null);

  const exec = (cmd, value = null) => {
    editorRef?.current?.focus();
    document.execCommand(cmd, false, value);
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
  const handleSignature = () => insertHtmlAtCursor('<br><br>--<br>{{sender_name}}<br>{{sender_title}} at {{sender_company}}');

  const toolBtn = (title, onMD, Icon) => (
    <button title={title} onMouseDown={e => { e.preventDefault(); onMD(); }}
      className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
      <Icon className="w-[13px] h-[13px]" />
    </button>
  );

  return (
    <div className="flex-shrink-0 border-t border-slate-100 bg-white">
      <div className="flex items-center gap-0.5 px-3 py-1.5 flex-wrap">

        {/* Format Text trigger */}
        <div className="relative mr-0.5">
          <button
            title="Format Text"
            onMouseDown={e => { e.preventDefault(); setShowFormat(v => !v); setShowVars(false); }}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-colors border',
              showFormat
                ? 'bg-slate-800 text-white border-slate-800'
                : 'text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
            )}
          >
            <Type className="w-[13px] h-[13px]" />
            <span>A</span>
          </button>
          {showFormat && (
            <FormatPopover
              editorRef={editorRef}
              onHtmlChange={onHtmlChange}
              onClose={() => setShowFormat(false)}
            />
          )}
        </div>

        <div className="w-px h-4 bg-slate-200 mx-0.5 flex-shrink-0" />

        {/* Quick-access bold / italic / underline / link */}
        {toolBtn('Bold',      () => exec('bold'),      Bold)}
        {toolBtn('Italic',    () => exec('italic'),    Italic)}
        {toolBtn('Underline', () => exec('underline'), Underline)}
        {toolBtn('Link', handleLink, Link2)}

        <div className="w-px h-4 bg-slate-200 mx-0.5 flex-shrink-0" />

        {toolBtn('Attach File',      () => fileInputRef.current?.click(), Paperclip)}
        <input ref={fileInputRef} type="file" className="hidden" onChange={e => handleFile(e, false)} />
        {toolBtn('Insert Image',     () => imageInputRef.current?.click(), Image)}
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, true)} />
        {toolBtn('Insert Video',     handleVideo, Video)}
        {toolBtn('Calendar Link',    handleCalendar, Calendar)}
        {toolBtn('Insert Signature', handleSignature, PenLine)}

        <div className="w-px h-4 bg-slate-200 mx-0.5 flex-shrink-0" />

        {/* Variables */}
        <div className="relative">
          <button onMouseDown={e => { e.preventDefault(); setShowVars(v => !v); setShowFormat(false); }}
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
            <VariableDropdown
              onInsert={v => insertHtmlAtCursor(`<span style="color:#16a34a">${v}</span>`)}
              onClose={() => setShowVars(false)}
            />
          )}
        </div>

        {/* Send on Day */}
        <div className="flex items-center gap-2 ml-auto pl-3 border-l border-slate-100">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Day</span>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button
              onMouseDown={e => { e.preventDefault(); onDraftChange(d => ({ ...d, day: Math.max(1, (d.day ?? 1) - 1) })); }}
              className="px-2 py-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors text-sm font-bold leading-none">−</button>
            <input
              type="number" min={1}
              value={draft.day ?? 1}
              onChange={e => onDraftChange(d => ({ ...d, day: Math.max(1, parseInt(e.target.value) || 1) }))}
              className="w-9 text-[12px] text-center font-semibold text-slate-700 bg-transparent outline-none border-x border-slate-200 py-1 tabular-nums" />
            <button
              onMouseDown={e => { e.preventDefault(); onDraftChange(d => ({ ...d, day: (d.day ?? 1) + 1 })); }}
              className="px-2 py-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors text-sm font-bold leading-none">+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EMAIL EDITOR ─────────────────────────────────────────────────────────────
function EmailEditor({ step, onUpdate, draft, onDraftChange, allSteps, stepIndex }) {
  const editorRef = useRef(null);
  const initializedRef = useRef(false);
  const [showCcBcc, setShowCcBcc] = useState(!!(step.cc || step.bcc));

  // Determine inherited subject for Reply mode
  const threadType = draft.threadType || { type: 'new_thread' };
  const isReply = threadType.type === 'reply';
  let inheritedSubject = '';
  if (isReply) {
    if (threadType.replyTo === 'previous') {
      const prevEmails = (allSteps || []).slice(0, stepIndex).filter(s =>
        (STEP_TYPE_MAP[s.subtype] || s.type) === 'email'
      );
      const prev = prevEmails[prevEmails.length - 1];
      inheritedSubject = prev?.subject ? `RE: ${prev.subject}` : '';
    } else if (threadType.replySubject) {
      inheritedSubject = `RE: ${threadType.replySubject}`;
    }
  }
  const displaySubject = isReply ? inheritedSubject : (step.subject || '');

  useEffect(() => {
    if (editorRef.current && !initializedRef.current) {
      editorRef.current.innerHTML = step.body || '';
      initializedRef.current = true;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) onUpdate({ ...step, body: editorRef.current.innerHTML });
  };

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Type + Subject row */}
      <div className="flex items-center gap-0 border-b border-slate-100 flex-shrink-0">
        {/* Type dropdown */}
        <div className="flex items-center gap-2 px-4 py-3 border-r border-slate-100 flex-shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</span>
          <TypeDropdown
            value={threadType}
            onChange={val => onDraftChange(d => ({ ...d, threadType: val }))}
            allSteps={allSteps}
            currentIndex={stepIndex}
          />
        </div>

        {/* Subject */}
        <div className="flex items-center gap-3 flex-1 px-4 py-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex-shrink-0">Subject</span>
          {isReply ? (
            <span className="flex-1 text-[13px] font-medium text-slate-500 italic truncate">
              {inheritedSubject || <span className="text-slate-300">Inherited from previous step…</span>}
            </span>
          ) : (
            <input
              value={step.subject || ''}
              onChange={e => onUpdate({ ...step, subject: e.target.value })}
              placeholder="e.g. Quick question about {{company}}…"
              className="flex-1 text-[13px] font-medium text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
            />
          )}
        </div>

        {/* CC/BCC toggle */}
        <button
          onClick={() => setShowCcBcc(v => !v)}
          className="flex-shrink-0 px-4 py-3 text-[11px] font-semibold text-slate-500 hover:text-emerald-700 transition-colors border-l border-slate-100 whitespace-nowrap"
        >
          {showCcBcc ? 'Hide Cc/Bcc' : 'Cc / Bcc'}
        </button>
      </div>

      {/* CC/BCC fields */}
      <AnimatePresence initial={false}>
        {showCcBcc && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden flex-shrink-0 border-b border-slate-100"
          >
            <div className="flex flex-col bg-slate-50/40">
              {[
                { key: 'cc',  label: 'Cc',  placeholder: 'Enter CC emails, comma separated…' },
                { key: 'bcc', label: 'Bcc', placeholder: 'Enter BCC emails, comma separated…' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="flex items-center gap-3 px-4 py-2 border-b border-slate-100 last:border-b-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest w-6 flex-shrink-0">{label}</span>
                  <input
                    value={step[key] || ''}
                    onChange={e => onUpdate({ ...step, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="flex-1 text-[12px] text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Write strip — sits directly above body */}
      <div className="flex items-center gap-4 px-5 py-2.5 bg-gradient-to-r from-emerald-50/50 to-white border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-emerald-600" />
          </div>
          <span className="text-[11px] font-bold text-emerald-700">AI Write</span>
        </div>
        <span className="flex-1 text-[11px] text-slate-500">Generate a ready-to-send personalized email.</span>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors shadow-sm flex-shrink-0">
          <Wand2 className="w-3 h-3" />
          Generate
        </button>
      </div>

      {/* Body — contentEditable rich text */}
      <div className="flex-1 flex flex-col min-h-0 border-b border-slate-100">
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
          onHtmlChange={html => onUpdate({ ...step, body: html })}
          draft={draft}
          onDraftChange={onDraftChange}
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
function EmailPreview({ step, draft }) {
  const threadType = draft?.threadType || { type: 'new_thread' };
  const isReply = threadType.type === 'reply';

  let subjectDisplay = step.subject;
  if (isReply) {
    subjectDisplay = threadType.replySubject
      ? `RE: ${threadType.replySubject}`
      : 'RE: (previous step subject)';
  }

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
        {isReply && (
          <span className="ml-auto text-[9px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">Reply</span>
        )}
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
        {step.cc && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-semibold w-7 flex-shrink-0">Cc</span>
            <span className="text-[11px] text-slate-500">{step.cc}</span>
          </div>
        )}
        {step.bcc && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-semibold w-7 flex-shrink-0">Bcc</span>
            <span className="text-[11px] text-slate-500">{step.bcc}</span>
          </div>
        )}
        <div className="flex items-start gap-3">
          <span className="text-[10px] text-slate-400 font-semibold w-7 flex-shrink-0 mt-0.5">Sub</span>
          {subjectDisplay
            ? <span className="text-[12px] font-semibold text-slate-800 leading-tight">{previewText(subjectDisplay)}</span>
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
export default function StepModal({ step, index, isNew, onSave, onClose, allSteps }) {
  const [draft, setDraft] = useState(() => ({
    priority: 'normal',
    threadType: { type: 'new_thread' },
    ...step,
    day: isNew ? 1 : (step?.day ?? 1),
  }));
  const [maximized, setMaximized] = useState(false);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);

  useEffect(() => {
    setDraft({
      priority: 'normal',
      threadType: { type: 'new_thread' },
      ...step,
      day: isNew ? 1 : (step?.day ?? 1),
    });
  }, [step]);

  if (!draft) return null;

  const baseType     = STEP_TYPE_MAP[draft.subtype] || draft.type;
  const StepIcon     = channelIcons[baseType] || Mail;
  const subtypeLabel = STEP_SUBTYPE_LABELS[draft.subtype] || draft.subtype || baseType;
  const isEmail      = baseType === 'email';
  const hasSplit     = isEmail || baseType === 'linkedin' || baseType === 'whatsapp';

  const renderEditor = () => {
    if (isEmail) return (
      <EmailEditor
        step={draft}
        onUpdate={setDraft}
        draft={draft}
        onDraftChange={setDraft}
        allSteps={allSteps || []}
        stepIndex={index}
      />
    );
    if (baseType === 'linkedin') return <LinkedInEditor step={draft} onUpdate={setDraft} />;
    if (baseType === 'whatsapp') return <WhatsAppEditor step={draft} onUpdate={setDraft} />;
    return <TaskEditor step={draft} onUpdate={setDraft} />;
  };

  const renderPreview = () => {
    if (isEmail)            return <EmailPreview step={draft} draft={draft} />;
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
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        style={{
          width:     maximized ? '96vw'  : '92vw',
          maxWidth:  maximized ? '100vw' : '1600px',
          height:    maximized ? '96vh'  : '90vh',
          maxHeight: '95vh',
          transition: 'width 0.2s ease, height 0.2s ease',
        }}
      >

        {/* ── MODAL HEADER ── */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0', channelBg[baseType] || 'bg-slate-50 border-slate-200')}>
              <StepIcon className={cn('w-4 h-4', channelColors[baseType])} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800 leading-tight">{subtypeLabel}</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Step {index + 1}</p>
            </div>
          </div>

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

            {isEmail && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all shadow-sm">
                <Send className="w-3 h-3" />
                Send Test Email
              </button>
            )}

            <button onClick={() => setMaximized(m => !m)}
              title={maximized ? 'Restore' : 'Maximize'}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              {maximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── MODAL BODY ── */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* LEFT — Editor */}
          <div className={cn(
            'flex flex-col min-h-0 transition-all duration-200',
            hasSplit ? previewCollapsed ? 'flex-1' : 'w-[62%]' : 'flex-1'
          )}>
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              {renderEditor()}
            </div>
          </div>

          {/* DIVIDER + TOGGLE */}
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
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Preview</p>
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
        <div className="flex items-center justify-between px-6 py-2.5 border-t border-slate-100 bg-white flex-shrink-0">
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