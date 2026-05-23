import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  X, Sparkles, BookOpen, Edit3, ArrowLeft, Loader2,
  Mail, Clock, Calendar, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const CREATION_METHODS = [
  {
    id: 'ai',
    icon: Sparkles,
    label: 'AI-Assisted',
    description: 'Generate a multichannel sequence using AI.',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    border: 'hover:border-emerald-300',
    selectedBorder: 'border-emerald-400 bg-emerald-50/40',
  },
  {
    id: 'template',
    icon: BookOpen,
    label: 'Templates',
    description: 'Start from proven workflow templates.',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    border: 'hover:border-blue-300',
    selectedBorder: 'border-blue-400 bg-blue-50/40',
  },
  {
    id: 'scratch',
    icon: Edit3,
    label: 'From Scratch',
    description: 'Build your workflow manually.',
    iconColor: 'text-slate-500',
    iconBg: 'bg-slate-100',
    border: 'hover:border-slate-400',
    selectedBorder: 'border-slate-400 bg-slate-50',
  },
];

const SCHEDULES = [
  { id: 'business', label: 'Business Hours', desc: 'Mon–Fri, 8AM–5PM' },
  { id: 'weekdays', label: 'Weekdays Only', desc: 'Mon–Fri, all hours' },
  { id: 'custom', label: 'Custom Schedule', desc: 'Set your own window' },
];

// Step 1 — Method Selection
function MethodStep({ selected, onSelect, onNext, onClose }) {
  return (
    <motion.div key="method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Create a Sequence</h2>
          <p className="text-xs text-slate-400 mt-0.5">Choose how you want to build your outreach workflow.</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-3">
        {CREATION_METHODS.map(method => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
              selected === method.id
                ? method.selectedBorder
                : `border-slate-200 ${method.border}`
            )}
          >
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', method.iconBg)}>
              <method.icon className={cn('w-4 h-4', method.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{method.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{method.description}</p>
            </div>
            {selected === method.id && (
              <div className="w-4 h-4 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-end px-6 pb-6">
        <Button
          onClick={onNext}
          disabled={!selected}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-5"
        >
          Continue <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

// Step 2 — Configuration
function ConfigStep({ method, onBack, onSave, onClose }) {
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState('business');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const methodInfo = CREATION_METHODS.find(m => m.id === method);

  const generateName = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a concise, professional B2B outreach sequence name for: "${aiPrompt}". Return JSON with name (string only, no quotes, no explanation).`,
      response_json_schema: {
        type: 'object',
        properties: { name: { type: 'string' } }
      }
    });
    if (result?.name) setName(result.name);
    setAiLoading(false);
  };

  const selectedSchedule = SCHEDULES.find(s => s.id === schedule);

  return (
    <motion.div key="config" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Set up your sequence</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {methodInfo?.label} — configure the basics before building.
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-5">

        {/* Sequence Name */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
            Sequence Name <span className="text-red-400">*</span>
          </label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='e.g. Fintech CFO Outreach — Nigeria'
            className="text-sm"
            autoFocus
          />
        </div>

        {/* AI name generator (only for AI method) */}
        {method === 'ai' && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">Generate name with AI</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. Fintech CFOs in Lagos focused on cost reduction"
                className="text-xs flex-1 h-8"
                onKeyDown={e => e.key === 'Enter' && generateName()}
              />
              <Button
                onClick={generateName}
                disabled={aiLoading || !aiPrompt.trim()}
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs px-3 h-8"
              >
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        )}

        {/* Sending Schedule */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
            Sending Schedule
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SCHEDULES.map(s => (
              <button
                key={s.id}
                onClick={() => setSchedule(s.id)}
                className={cn(
                  'p-2.5 rounded-lg border text-left transition-all',
                  schedule === s.id
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <p className={cn('text-xs font-semibold', schedule === s.id ? 'text-emerald-700' : 'text-slate-700')}>{s.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sending Window Preview */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <div>
            <p className="text-[11px] font-semibold text-slate-600">Sending Window</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{selectedSchedule?.desc}</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {['M','T','W','T','F'].map((d, i) => (
              <span key={i} className={cn(
                'w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center',
                schedule === 'custom' ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-700'
              )}>{d}</span>
            ))}
          </div>
        </div>

      </div>

      <div className="flex items-center justify-between px-6 pb-6">
        <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
          ← Back
        </button>
        <Button
          onClick={() => onSave({ name, schedule, method })}
          disabled={!name.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-5"
        >
          Create Sequence
        </Button>
      </div>
    </motion.div>
  );
}

// Main Flow Component
export default function CreateSequenceFlow({ onClose, onSave, defaultMethod = null }) {
  const [step, setStep] = useState(defaultMethod ? 'config' : 'method');
  const [selectedMethod, setSelectedMethod] = useState(defaultMethod);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 'method' && (
            <MethodStep
              key="method"
              selected={selectedMethod}
              onSelect={setSelectedMethod}
              onNext={() => setStep('config')}
              onClose={onClose}
            />
          )}
          {step === 'config' && (
            <ConfigStep
              key="config"
              method={selectedMethod}
              onBack={() => setStep('method')}
              onSave={onSave}
              onClose={onClose}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}