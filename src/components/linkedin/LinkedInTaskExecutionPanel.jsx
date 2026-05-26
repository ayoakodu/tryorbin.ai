import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, MessageCircle, Eye, ThumbsUp, CornerDownRight,
  Bell, Building2, ExternalLink, Copy, CheckCircle2, Clock,
  SkipForward, Wand2, RefreshCw, Minimize2, ChevronDown,
  Sparkles, User, Briefcase, AlertCircle, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';
import {
  openLinkedInProfile, openLinkedInCompanyPage, openLinkedInPost,
  TASK_TYPE_LABELS, TASK_TYPE_DESCRIPTIONS, RESULT_LABELS
} from '@/utils/linkedinUtils';

const TASK_ICONS = {
  send_connection_request: UserPlus,
  send_linkedin_message:   MessageCircle,
  view_profile:            Eye,
  engage_with_post:        ThumbsUp,
  follow_up_message:       CornerDownRight,
  reply_reminder:          Bell,
  visit_company_page:      Building2,
};

const PRIORITY_STYLES = {
  high:   'bg-red-50 text-red-600 border-red-200',
  normal: 'bg-slate-50 text-slate-600 border-slate-200',
  low:    'bg-emerald-50 text-emerald-600 border-emerald-200',
};

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly',     label: 'Friendly'     },
  { value: 'direct',       label: 'Direct'       },
  { value: 'casual',       label: 'Casual'       },
];

const REFINE_ACTIONS = [
  { label: 'Make it shorter',      instruction: 'Make it significantly shorter and more concise.' },
  { label: 'Make it more personal',instruction: 'Make it feel more personal and human.' },
  { label: 'Add more value',       instruction: 'Add a specific value proposition relevant to their role.' },
  { label: 'Soften the tone',      instruction: 'Make the tone softer and less salesy.' },
];

export default function LinkedInTaskExecutionPanel({ task, onClose, onTaskUpdate }) {
  const [message, setMessage]           = useState(task?.ai_generated_message || '');
  const [tone, setTone]                 = useState('professional');
  const [generating, setGenerating]     = useState(false);
  const [copied, setCopied]             = useState(false);
  const [saving, setSaving]             = useState(false);
  const [showSnooze, setShowSnooze]     = useState(false);
  const [showRefine, setShowRefine]     = useState(false);
  const [aiRec, setAiRec]               = useState(task?.ai_recommendations || '');

  if (!task) return null;

  const TaskIcon = TASK_ICONS[task.task_type] || MessageCircle;
  const label    = TASK_TYPE_LABELS[task.task_type] || 'LinkedIn Action';
  const desc     = TASK_TYPE_DESCRIPTIONS[task.task_type] || '';
  const needsMsg = ['send_connection_request','send_linkedin_message','follow_up_message','reply_reminder','engage_with_post'].includes(task.task_type);

  // ── AI Generation ─────────────────────────────────────────────────────────
  const generateMessage = async (refineInstruction = '') => {
    setGenerating(true);
    try {
      const res = await base44.functions.invoke('generateLinkedInContent', {
        task_type:        task.task_type,
        contact_name:     task.contact_name,
        contact_title:    task.contact_title,
        contact_company:  task.contact_company,
        tone,
        existing_message: refineInstruction ? message : '',
        refine_instruction: refineInstruction,
      });
      if (res.data?.message) setMessage(res.data.message);
      if (res.data?.recommendation) setAiRec(res.data.recommendation);
    } finally {
      setGenerating(false);
    }
  };

  // ── Copy to clipboard ─────────────────────────────────────────────────────
  const copyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Mark completed ────────────────────────────────────────────────────────
  const markCompleted = async (result) => {
    setSaving(true);
    try {
      const updated = await base44.entities.LinkedInTask.update(task.id, {
        status:          'completed',
        task_result:     result,
        completion_date: new Date().toISOString(),
        ai_generated_message: message,
        ai_recommendations:   aiRec,
      });
      onTaskUpdate?.(updated);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  // ── Snooze ────────────────────────────────────────────────────────────────
  const snoozeTask = async (hours) => {
    setSaving(true);
    try {
      const until = new Date();
      until.setHours(until.getHours() + hours);
      const updated = await base44.entities.LinkedInTask.update(task.id, {
        status:        'snoozed',
        snoozed_until: until.toISOString(),
      });
      onTaskUpdate?.(updated);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  // ── Skip ──────────────────────────────────────────────────────────────────
  const skipTask = async () => {
    setSaving(true);
    try {
      const updated = await base44.entities.LinkedInTask.update(task.id, {
        status:      'skipped',
        task_result: 'no_response',
      });
      onTaskUpdate?.(updated);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  // ── Open LinkedIn ─────────────────────────────────────────────────────────
  const openLinkedIn = () => {
    if (task.task_type === 'visit_company_page') {
      openLinkedInCompanyPage(task.linkedin_company_page_url);
    } else if (task.task_type === 'engage_with_post') {
      openLinkedInPost(task.linkedin_post_url);
    } else {
      openLinkedInProfile(task.linkedin_profile_url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[3px] p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <TaskIcon className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800">{label}</p>
              <p className="text-[10px] text-slate-400">{desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide', PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.normal)}>
              {task.priority}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Prospect info */}
          {(task.contact_name || task.contact_company) && (
            <div className="px-6 py-4 bg-slate-50/60 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  {task.contact_name && <p className="text-[13px] font-semibold text-slate-800">{task.contact_name}</p>}
                  {task.contact_title && <p className="text-[11px] text-slate-500">{task.contact_title}</p>}
                  {task.contact_company && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <p className="text-[11px] text-slate-500">{task.contact_company}</p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={openLinkedIn}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 text-[11px] gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open on LinkedIn
                </Button>
              </div>
              {task.notes && (
                <p className="mt-3 text-[11px] text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2">
                  <span className="font-semibold text-slate-600">Note: </span>{task.notes}
                </p>
              )}
            </div>
          )}

          {/* AI Message section */}
          {needsMsg && (
            <div className="px-6 py-5 space-y-4">

              {/* AI strip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-[12px] font-bold text-slate-700">AI-Suggested Message</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Tone selector */}
                  <select
                    value={tone}
                    onChange={e => setTone(e.target.value)}
                    className="text-[11px] bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                  >
                    {TONE_OPTIONS.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => generateMessage()}
                    disabled={generating}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border',
                      generating
                        ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm'
                    )}
                  >
                    {generating
                      ? <RefreshCw className="w-3 h-3 animate-spin" />
                      : <Wand2 className="w-3 h-3" />}
                    {message ? 'Regenerate' : 'Generate'}
                  </button>
                </div>
              </div>

              {/* Message textarea */}
              <div className="relative">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={task.task_type === 'send_connection_request' ? 4 : 7}
                  placeholder={generating ? 'Generating your message…' : 'Click "Generate" to create an AI-assisted message, or write your own…'}
                  className={cn(
                    'w-full text-[13px] text-slate-700 bg-white border rounded-xl px-4 py-3 resize-none outline-none transition-all leading-relaxed',
                    generating ? 'border-emerald-300 bg-emerald-50/30 animate-pulse' : 'border-slate-200 focus:border-emerald-400'
                  )}
                />
                {task.task_type === 'send_connection_request' && message && (
                  <div className={cn(
                    'absolute bottom-3 right-3 text-[10px] font-mono',
                    message.length > 280 ? 'text-red-500' : message.length > 250 ? 'text-amber-500' : 'text-slate-400'
                  )}>
                    {message.length}/300
                  </div>
                )}
              </div>

              {/* Refine actions */}
              {message && (
                <div>
                  <button
                    onClick={() => setShowRefine(v => !v)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <ChevronDown className={cn('w-3 h-3 transition-transform', showRefine && 'rotate-180')} />
                    Refine message
                  </button>
                  <AnimatePresence>
                    {showRefine && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden mt-2"
                      >
                        <div className="flex flex-wrap gap-2">
                          {REFINE_ACTIONS.map(r => (
                            <button
                              key={r.label}
                              onClick={() => generateMessage(r.instruction)}
                              disabled={generating}
                              className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all disabled:opacity-50"
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* AI recommendation */}
              {aiRec && (
                <div className="flex gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-700 leading-relaxed">{aiRec}</p>
                </div>
              )}
            </div>
          )}

          {/* Due date info */}
          {task.due_date && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Due: <span className="font-semibold text-slate-700">{new Date(task.due_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></span>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between gap-3">

            {/* Left actions */}
            <div className="flex items-center gap-2">
              {/* Copy message */}
              {needsMsg && message && (
                <button
                  onClick={copyMessage}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[11px] font-semibold transition-all',
                    copied
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy Message'}
                </button>
              )}

              {/* Snooze */}
              <div className="relative">
                <button
                  onClick={() => setShowSnooze(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-500 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <Clock className="w-3 h-3" />
                  Snooze
                  <ChevronDown className={cn('w-3 h-3 transition-transform', showSnooze && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {showSnooze && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute bottom-full left-0 mb-1.5 bg-white rounded-xl border border-slate-200 shadow-xl z-10"
                      style={{ minWidth: 160 }}
                    >
                      {[
                        { label: '2 hours',  hours: 2  },
                        { label: 'Tomorrow', hours: 24 },
                        { label: '3 days',   hours: 72 },
                        { label: '1 week',   hours: 168},
                      ].map(opt => (
                        <button
                          key={opt.label}
                          onClick={() => { snoozeTask(opt.hours); setShowSnooze(false); }}
                          className="flex items-center w-full px-4 py-2.5 text-left text-[12px] text-slate-700 hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Skip */}
              <button
                onClick={skipTask}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-500 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                <SkipForward className="w-3 h-3" />
                Skip
              </button>
            </div>

            {/* Right — Mark done */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => markCompleted('completed')}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold h-9 px-5 gap-2 rounded-lg shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {saving ? 'Saving…' : 'Mark Done'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}