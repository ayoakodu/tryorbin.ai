import { useState } from 'react';
import {
  UserPlus, MessageCircle, Eye, ThumbsUp, CornerDownRight,
  Bell, Building2, Wand2, RefreshCw, Check, Copy, ExternalLink,
  Sparkles, ChevronDown, AlertCircle
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';
import { TASK_TYPE_LABELS, TASK_TYPE_DESCRIPTIONS, openLinkedInProfile } from '@/utils/linkedinUtils';
import AdvancedScheduling from '@/components/outreach/AdvancedScheduling';

const TASK_ICONS = {
  send_connection_request: UserPlus,
  send_linkedin_message:   MessageCircle,
  view_profile:            Eye,
  engage_with_post:        ThumbsUp,
  follow_up_message:       CornerDownRight,
  reply_reminder:          Bell,
  visit_company_page:      Building2,
};

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly',     label: 'Friendly'     },
  { value: 'direct',       label: 'Direct'       },
  { value: 'casual',       label: 'Casual'       },
];

const REFINE_ACTIONS = [
  { label: 'Shorter',      instruction: 'Make it significantly shorter and more concise.' },
  { label: 'More personal',instruction: 'Make it feel more personal and human.' },
  { label: 'Add value',    instruction: 'Add a specific value proposition relevant to their role.' },
  { label: 'Softer tone',  instruction: 'Make the tone softer and less salesy.' },
];

const CHAR_LIMIT = {
  send_connection_request: 300,
};

export default function LinkedInStepEditor({ step, onUpdate, draft, onDraftChange }) {
  const [generating, setGenerating] = useState(false);
  const [tone,       setTone]       = useState('professional');
  const [aiRec,      setAiRec]      = useState('');
  const [copied,     setCopied]     = useState(false);
  const [showRefine, setShowRefine] = useState(false);

  const subtype = step.subtype || step.task_type;
  const Icon    = TASK_ICONS[subtype] || MessageCircle;
  const label   = TASK_TYPE_LABELS[subtype] || 'LinkedIn Step';
  const desc    = TASK_TYPE_DESCRIPTIONS[subtype] || '';

  const needsMessage = ['send_connection_request','send_linkedin_message','follow_up_message','reply_reminder','engage_with_post'].includes(subtype);
  const needsProfile = ['send_connection_request','send_linkedin_message','view_profile','follow_up_message','reply_reminder'].includes(subtype);
  const needsPost    = subtype === 'engage_with_post';
  const needsCompany = subtype === 'visit_company_page';
  const charLimit    = CHAR_LIMIT[subtype];

  const generateAI = async (refineInstruction = '') => {
    setGenerating(true);
    try {
      const res = await base44.functions.invoke('generateLinkedInContent', {
        task_type:         subtype,
        contact_name:      step.contact_name,
        contact_title:     step.contact_title,
        contact_company:   step.contact_company,
        tone,
        existing_message:  refineInstruction ? (step.body || '') : '',
        refine_instruction: refineInstruction,
      });
      if (res.data?.message)        onUpdate({ ...step, body: res.data.message });
      if (res.data?.recommendation) setAiRec(res.data.recommendation);
    } finally {
      setGenerating(false);
    }
  };

  const copyBody = () => {
    navigator.clipboard.writeText(step.body || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto">
      {/* Step header strip */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-800">{label}</p>
          <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
        </div>
      </div>

      <div className="p-6 space-y-5 flex-1">

        {/* Prospect context fields */}
        {needsProfile && (
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Prospect</label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={step.contact_name || ''}
                onChange={e => onUpdate({ ...step, contact_name: e.target.value })}
                placeholder="Full name"
                className="text-[12px]"
              />
              <Input
                value={step.contact_title || ''}
                onChange={e => onUpdate({ ...step, contact_title: e.target.value })}
                placeholder="Job title"
                className="text-[12px]"
              />
              <Input
                value={step.contact_company || ''}
                onChange={e => onUpdate({ ...step, contact_company: e.target.value })}
                placeholder="Company name"
                className="text-[12px]"
              />
              <div className="flex gap-2">
                <Input
                  value={step.linkedin_profile_url || ''}
                  onChange={e => onUpdate({ ...step, linkedin_profile_url: e.target.value })}
                  placeholder="LinkedIn profile URL"
                  className="text-[12px] flex-1"
                />
                {step.linkedin_profile_url && (
                  <button
                    onClick={() => openLinkedInProfile(step.linkedin_profile_url)}
                    className="px-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex-shrink-0"
                    title="Open on LinkedIn"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {needsPost && (
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Post URL (optional)</label>
            <Input
              value={step.linkedin_post_url || ''}
              onChange={e => onUpdate({ ...step, linkedin_post_url: e.target.value })}
              placeholder="https://linkedin.com/posts/…"
              className="text-[12px]"
            />
            <p className="text-[11px] text-slate-400 mt-1">Leave blank to engage with their latest post.</p>
          </div>
        )}

        {needsCompany && (
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Company Page URL</label>
            <Input
              value={step.linkedin_company_page_url || ''}
              onChange={e => onUpdate({ ...step, linkedin_company_page_url: e.target.value })}
              placeholder="https://linkedin.com/company/…"
              className="text-[12px]"
            />
          </div>
        )}

        {/* View Profile — no message needed */}
        {subtype === 'view_profile' && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-[12px] text-blue-700 leading-relaxed">
            This step signals a profile view. Open the prospect's LinkedIn profile and view it — no message is needed.
          </div>
        )}

        {/* Message / content area */}
        {needsMessage && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {subtype === 'send_connection_request' ? 'Connection Note' : 'Message'}
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value)}
                  className="text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-600 outline-none focus:border-blue-400 transition-colors cursor-pointer"
                >
                  {TONE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <button
                  onClick={() => generateAI()}
                  disabled={generating}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border',
                    generating
                      ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm'
                  )}
                >
                  {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  {step.body ? 'Regenerate' : 'AI Generate'}
                </button>
              </div>
            </div>

            <div className="relative">
              <Textarea
                value={step.body || ''}
                onChange={e => onUpdate({ ...step, body: e.target.value })}
                placeholder={generating
                  ? 'Generating…'
                  : subtype === 'send_connection_request'
                    ? "Hi {{first_name}}, I came across your profile at {{company}} and would love to connect…"
                    : "Hi {{first_name}}, I wanted to follow up on…"}
                className={cn('text-[13px] resize-none leading-relaxed', generating && 'animate-pulse bg-emerald-50/30')}
                rows={subtype === 'send_connection_request' ? 4 : 7}
              />
              {charLimit && step.body && (
                <div className={cn(
                  'absolute bottom-3 right-3 text-[10px] font-mono',
                  (step.body?.length || 0) > charLimit - 20 ? 'text-red-500' : 'text-slate-400'
                )}>
                  {step.body?.length || 0}/{charLimit}
                </div>
              )}
            </div>

            {/* Refine strip */}
            {step.body && (
              <div>
                <button
                  onClick={() => setShowRefine(v => !v)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ChevronDown className={cn('w-3 h-3 transition-transform', showRefine && 'rotate-180')} />
                  Refine with AI
                </button>
                {showRefine && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {REFINE_ACTIONS.map(r => (
                      <button
                        key={r.label}
                        onClick={() => generateAI(r.instruction)}
                        disabled={generating}
                        className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all disabled:opacity-50"
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Copy shortcut */}
            {step.body && (
              <button
                onClick={copyBody}
                className={cn(
                  'flex items-center gap-1.5 text-[11px] font-semibold transition-all',
                  copied ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied to clipboard' : 'Copy message'}
              </button>
            )}

            {/* AI recommendation */}
            {aiRec && (
              <div className="flex gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <AlertCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-relaxed">{aiRec}</p>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Notes</label>
          <Input
            value={step.notes || ''}
            onChange={e => onUpdate({ ...step, notes: e.target.value })}
            placeholder="Private notes or context for this step…"
            className="text-[12px]"
          />
        </div>

        {/* Advanced scheduling */}
        <AdvancedScheduling
          day={draft?.day ?? 1}
          draft={draft || {}}
          onDraftChange={onDraftChange}
        />
      </div>
    </div>
  );
}