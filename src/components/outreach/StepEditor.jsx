import { Mail, MessageCircle, Phone, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { STEP_SUBTYPE_LABELS, STEP_TYPE_MAP } from './AddStepMenu';

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

const VARIABLES = ['{{first_name}}', '{{last_name}}', '{{company}}', '{{title}}', '{{industry}}'];
const TONES = ['Professional', 'Friendly', 'Direct', 'Casual', 'Formal'];
const DELAY_UNITS = ['hours', 'days', 'weeks'];

function Label({ children }) {
  return <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">{children}</label>;
}

function FieldGroup({ children, className }) {
  return <div className={cn('space-y-3', className)}>{children}</div>;
}

function VarChips({ onInsert }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {VARIABLES.map(v => (
        <button key={v} onClick={() => onInsert(v)}
          className="text-[9px] font-mono bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 transition-colors">
          {v}
        </button>
      ))}
    </div>
  );
}

// Email fields
function EmailFields({ step, onUpdate, onPersonalize }) {
  const insertVar = (field, v) => {
    const cur = step[field] || '';
    onUpdate({ ...step, [field]: cur + v });
  };
  return (
    <FieldGroup>
      <div>
        <Label>Subject Line</Label>
        <Input value={step.subject || ''} onChange={e => onUpdate({ ...step, subject: e.target.value })}
          placeholder="e.g. Quick question about {{company}}" className="text-xs h-8" />
        <VarChips onInsert={v => insertVar('subject', v)} />
      </div>
      <div>
        <Label>Email Body</Label>
        <Textarea value={step.body || ''} onChange={e => onUpdate({ ...step, body: e.target.value })}
          placeholder={"Hi {{first_name}},\n\nI noticed {{company}} recently...\n\nWould love to connect."}
          className="text-xs resize-none" rows={5} />
        <VarChips onInsert={v => insertVar('body', v)} />
      </div>
      <div>
        <Label>Tone</Label>
        <div className="flex gap-1.5 flex-wrap">
          {TONES.map(t => (
            <button key={t} onClick={() => onUpdate({ ...step, tone: t })}
              className={cn('text-[10px] px-2 py-1 rounded-md border transition-colors',
                step.tone === t ? 'border-emerald-400 bg-emerald-50 text-emerald-700 font-semibold' : 'border-slate-200 text-slate-500 hover:border-slate-300'
              )}>{t}</button>
          ))}
        </div>
      </div>
      <button onClick={onPersonalize}
        className="flex items-center gap-1.5 text-[11px] text-emerald-600 hover:text-emerald-700 transition-colors font-medium">
        <Sparkles className="w-3 h-3" /> AI Personalize this step
      </button>
    </FieldGroup>
  );
}

// LinkedIn fields
function LinkedInFields({ step, onUpdate }) {
  const insertVar = (field, v) => onUpdate({ ...step, [field]: (step[field] || '') + v });
  const subtype = step.subtype;

  return (
    <FieldGroup>
      {(subtype === 'linkedin_connect' || subtype === 'linkedin_message') && (
        <div>
          <Label>{subtype === 'linkedin_connect' ? 'Connection Note' : 'Message'}</Label>
          <Textarea value={step.body || ''} onChange={e => onUpdate({ ...step, body: e.target.value })}
            placeholder={subtype === 'linkedin_connect'
              ? "Hi {{first_name}}, I'd love to connect — I work with {{industry}} teams..."
              : "Hi {{first_name}}, following up on my connection request..."}
            className="text-xs resize-none" rows={4} />
          <VarChips onInsert={v => insertVar('body', v)} />
        </div>
      )}
      {subtype === 'linkedin_view' && (
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
          This step triggers a profile view to create a visibility signal before your outreach.
          No content needed — it runs automatically.
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
    </FieldGroup>
  );
}

// WhatsApp fields
function WhatsAppFields({ step, onUpdate }) {
  const insertVar = (field, v) => onUpdate({ ...step, [field]: (step[field] || '') + v });
  return (
    <FieldGroup>
      <div>
        <Label>Message</Label>
        <Textarea value={step.body || ''} onChange={e => onUpdate({ ...step, body: e.target.value })}
          placeholder={"Hi {{first_name}} 👋 I'm reaching out from RVNU...\n\nWould love to show you how we help {{industry}} teams."}
          className="text-xs resize-none" rows={5} />
        <VarChips onInsert={v => insertVar('body', v)} />
      </div>
      <div>
        <Label>CTA</Label>
        <Input value={step.cta || ''} onChange={e => onUpdate({ ...step, cta: e.target.value })}
          placeholder="e.g. Reply YES to learn more" className="text-xs h-8" />
      </div>
    </FieldGroup>
  );
}

// Call / Task / Delay fields
function TaskFields({ step, onUpdate }) {
  const isDelay = STEP_TYPE_MAP[step.subtype] === 'delay' || step.type === 'delay';
  if (isDelay) {
    return (
      <FieldGroup>
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
      </FieldGroup>
    );
  }
  return (
    <FieldGroup>
      <div>
        <Label>{step.type === 'call' || step.subtype === 'call' ? 'Call Instructions' : 'Task Description'}</Label>
        <Textarea value={step.body || ''} onChange={e => onUpdate({ ...step, body: e.target.value })}
          placeholder={step.type === 'call' ? "Call objective: qualify budget and timeline..." : "Research prospect's recent funding round..."}
          className="text-xs resize-none" rows={4} />
      </div>
      <div>
        <Label>Notes</Label>
        <Input value={step.notes || ''} onChange={e => onUpdate({ ...step, notes: e.target.value })}
          placeholder="Any prep notes or context" className="text-xs h-8" />
      </div>
    </FieldGroup>
  );
}

export default function StepEditor({ step, index, onUpdate, onPersonalize }) {
  if (!step) return null;

  const baseType = STEP_TYPE_MAP[step.subtype] || step.type;
  const Icon = channelIcons[baseType] || Mail;
  const subtypeLabel = STEP_SUBTYPE_LABELS[step.subtype] || step.subtype || baseType;

  const renderFields = () => {
    if (baseType === 'email') return <EmailFields step={step} onUpdate={onUpdate} onPersonalize={onPersonalize} />;
    if (baseType === 'linkedin') return <LinkedInFields step={step} onUpdate={onUpdate} />;
    if (baseType === 'whatsapp') return <WhatsAppFields step={step} onUpdate={onUpdate} />;
    return <TaskFields step={step} onUpdate={onUpdate} />;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Step header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2.5">
        <div className={cn('w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0', channelBg[baseType] || 'bg-slate-50 border-slate-200')}>
          <Icon className={cn('w-3.5 h-3.5', channelColors[baseType])} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">{subtypeLabel}</p>
          <p className="text-[10px] text-slate-400">Step {index + 1}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <label className="text-[10px] text-slate-400">Day</label>
          <input type="number" min={0} value={step.day || 0}
            onChange={e => onUpdate({ ...step, day: parseInt(e.target.value) || 0 })}
            className="w-12 text-xs bg-slate-50 border border-slate-200 rounded-md px-1.5 py-1 text-slate-700 outline-none focus:border-emerald-400 text-center" />
        </div>
      </div>

      <div className="p-4">
        {renderFields()}
      </div>
    </div>
  );
}