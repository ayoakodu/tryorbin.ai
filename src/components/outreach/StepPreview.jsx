import { Mail, MessageCircle, Phone, Clock, CheckCircle2, User } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STEP_TYPE_MAP, STEP_SUBTYPE_LABELS } from './AddStepMenu';

// Replace template variables with demo values for preview
function preview(text) {
  if (!text) return '';
  return text
    .replace(/\{\{first_name\}\}/g, 'Chisom')
    .replace(/\{\{last_name\}\}/g, 'Okafor')
    .replace(/\{\{company\}\}/g, 'Flutterwave')
    .replace(/\{\{title\}\}/g, 'Head of Growth')
    .replace(/\{\{industry\}\}/g, 'Fintech');
}

function EmailPreview({ step }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
      {/* Email chrome */}
      <div className="px-4 py-3 border-b border-slate-100 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-8">From</span>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3 text-emerald-600" />
            </div>
            <span className="text-[11px] text-slate-700 font-medium">You &lt;you@company.com&gt;</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-8">To</span>
          <span className="text-[11px] text-slate-700">Chisom Okafor &lt;chisom@flutterwave.com&gt;</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[10px] text-slate-400 w-8 mt-0.5">Sub</span>
          <span className="text-[11px] font-semibold text-slate-800">{preview(step.subject) || <span className="text-slate-300 font-normal">No subject</span>}</span>
        </div>
      </div>
      <div className="p-4 min-h-[80px]">
        {step.body ? (
          <p className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">{preview(step.body)}</p>
        ) : (
          <p className="text-[11px] text-slate-300">Start typing your email body...</p>
        )}
      </div>
      {step.tone && (
        <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-1.5">
          <span className="text-[9px] uppercase font-semibold text-slate-400">Tone</span>
          <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{step.tone}</span>
        </div>
      )}
    </div>
  );
}

function WhatsAppPreview({ step }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-[#e5ddd5]">
      {/* WA header bar */}
      <div className="bg-[#075e54] px-4 py-2.5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-[#128C7E] flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-white">Chisom Okafor</p>
          <p className="text-[9px] text-emerald-200">online</p>
        </div>
      </div>
      {/* Chat area */}
      <div className="p-4 min-h-[80px]">
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
          <p className="text-[11px] text-slate-500">Start typing your message...</p>
        )}
      </div>
    </div>
  );
}

function LinkedInPreview({ step }) {
  const subtype = step.subtype;
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="bg-[#0077b5] px-4 py-3 flex items-center gap-2">
        <Linkedin className="w-4 h-4 text-white" />
        <span className="text-[11px] font-semibold text-white">LinkedIn</span>
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
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <p className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                {preview(step.body) || <span className="text-slate-400">Write your {subtype === 'linkedin_connect' ? 'connection note' : 'message'}...</span>}
              </p>
            </div>
          </>
        )}
        {subtype === 'linkedin_view' && (
          <div className="flex items-center gap-2.5 text-xs text-slate-600">
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

function CallTaskPreview({ step }) {
  const isDelay = STEP_TYPE_MAP[step.subtype] === 'delay' || step.type === 'delay';
  if (isDelay) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
          <Clock className="w-4 h-4 text-slate-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-700">Wait {step.delay_amount || 3} {step.delay_unit || 'days'}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{step.notes || 'Pause before next step'}</p>
        </div>
      </div>
    );
  }
  const isCall = step.type === 'call' || step.subtype === 'call';
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-start gap-2.5">
        <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0',
          isCall ? 'bg-amber-50 border-amber-100' : 'bg-violet-50 border-violet-100')}>
          {isCall ? <Phone className="w-4 h-4 text-amber-500" /> : <CheckCircle2 className="w-4 h-4 text-violet-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-800">{isCall ? 'Phone Call' : 'Manual Task'}</p>
          <p className="text-[11px] text-slate-500 mt-1 whitespace-pre-wrap leading-relaxed">
            {step.body || (isCall ? 'No call instructions added yet.' : 'No task description yet.')}
          </p>
          {step.notes && (
            <p className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">{step.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StepPreview({ step }) {
  if (!step) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <Mail className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-xs font-medium text-slate-400">Select a step to see preview</p>
        </div>
      </div>
    );
  }

  const baseType = STEP_TYPE_MAP[step.subtype] || step.type;
  const subtypeLabel = STEP_SUBTYPE_LABELS[step.subtype] || step.subtype;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Live Preview</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{subtypeLabel || baseType} · Day {step.day || 0}</p>
      </div>
      <div className="p-4 flex-1">
        {baseType === 'email' && <EmailPreview step={step} />}
        {baseType === 'whatsapp' && <WhatsAppPreview step={step} />}
        {baseType === 'linkedin' && <LinkedInPreview step={step} />}
        {(baseType === 'call' || baseType === 'task' || baseType === 'delay' || step.type === 'delay') && <CallTaskPreview step={step} />}
      </div>
    </div>
  );
}