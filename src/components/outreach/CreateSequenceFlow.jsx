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
  { id: 'business', label: 'Business Hours', desc: 'Timezone-aware, Mon–Fri' },
  { id: 'custom', label: 'Custom Schedule', desc: 'Set your own windows' },
];

const TIMEZONES = [
  { label: 'GMT+0 (London)', value: 'GMT+0' },
  { label: 'GMT+1 (Lagos, Paris)', value: 'GMT+1' },
  { label: 'GMT+2 (Johannesburg, Cairo)', value: 'GMT+2' },
  { label: 'GMT+3 (Nairobi, Riyadh)', value: 'GMT+3' },
  { label: 'GMT+4 (Dubai)', value: 'GMT+4' },
  { label: 'GMT+5:30 (Mumbai)', value: 'GMT+5:30' },
  { label: 'GMT+8 (Singapore, Beijing)', value: 'GMT+8' },
  { label: 'GMT+9 (Tokyo)', value: 'GMT+9' },
  { label: 'GMT-5 (New York)', value: 'GMT-5' },
  { label: 'GMT-6 (Chicago)', value: 'GMT-6' },
  { label: 'GMT-7 (Denver)', value: 'GMT-7' },
  { label: 'GMT-8 (Los Angeles)', value: 'GMT-8' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM'];

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

  // Business Hours state
  const [timezone, setTimezone] = useState('GMT+1');
  const [activeDays, setActiveDays] = useState(['Mon','Tue','Wed','Thu','Fri']);
  const [startTime, setStartTime] = useState('8:00 AM');
  const [endTime, setEndTime] = useState('5:00 PM');

  // Custom schedule state: array of { day, start, end }
  const [customWindows, setCustomWindows] = useState([
    { day: 'Mon', start: '9:00 AM', end: '5:00 PM' }
  ]);

  const methodInfo = CREATION_METHODS.find(m => m.id === method);
  const tzLabel = TIMEZONES.find(t => t.value === timezone)?.label || timezone;

  const toggleDay = (day) => {
    setActiveDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addCustomWindow = () => {
    const unusedDay = DAYS.find(d => !customWindows.find(w => w.day === d));
    if (unusedDay) setCustomWindows(prev => [...prev, { day: unusedDay, start: '9:00 AM', end: '5:00 PM' }]);
  };

  const updateCustomWindow = (idx, field, value) => {
    setCustomWindows(prev => prev.map((w, i) => i === idx ? { ...w, [field]: value } : w));
  };

  const removeCustomWindow = (idx) => {
    setCustomWindows(prev => prev.filter((_, i) => i !== idx));
  };

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

  // Build schedule preview text
  const schedulePreview = schedule === 'business'
    ? `${activeDays.join(', ')} · ${startTime} – ${endTime} · ${tzLabel}`
    : customWindows.map(w => `${w.day}: ${w.start}–${w.end}`).join('  ·  ');

  return (
    <motion.div key="config" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Set up your sequence</h2>
            <p className="text-xs text-slate-400 mt-0.5">{methodInfo?.label} — configure the basics before building.</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">

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

        {/* AI name generator */}
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
              <Button onClick={generateName} disabled={aiLoading || !aiPrompt.trim()}
                size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs px-3 h-8">
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        )}

        {/* Schedule Type Toggle */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
            Sending Schedule
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SCHEDULES.map(s => (
              <button key={s.id} onClick={() => setSchedule(s.id)}
                className={cn(
                  'p-3 rounded-xl border-2 text-left transition-all',
                  schedule === s.id ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                )}>
                <p className={cn('text-xs font-semibold', schedule === s.id ? 'text-emerald-700' : 'text-slate-700')}>{s.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Business Hours Config */}
        {schedule === 'business' && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">

            {/* Timezone */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Timezone</label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 outline-none focus:border-emerald-400">
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            {/* Days */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Sending Days</label>
              <div className="flex gap-1.5">
                {DAYS.map(day => (
                  <button key={day} onClick={() => toggleDay(day)}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-[10px] font-semibold border transition-all',
                      activeDays.includes(day)
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    )}>
                    {day.slice(0, 2)}
                  </button>
                ))}
              </div>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Start Time</label>
                <select value={startTime} onChange={e => setStartTime(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 outline-none focus:border-emerald-400">
                  {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">End Time</label>
                <select value={endTime} onChange={e => setEndTime(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 outline-none focus:border-emerald-400">
                  {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Custom Schedule Config */}
        {schedule === 'custom' && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">

            {/* Timezone */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Timezone</label>
              <select value={timezone} onChange={e => setTimezone(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 outline-none focus:border-emerald-400">
                {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
              </select>
            </div>

            {/* Custom Windows */}
            <div className="space-y-2">
              {customWindows.map((win, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
                  <select value={win.day} onChange={e => updateCustomWindow(idx, 'day', e.target.value)}
                    className="text-xs bg-transparent border-none outline-none text-slate-700 font-semibold w-16 cursor-pointer">
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span className="text-[10px] text-slate-300">→</span>
                  <select value={win.start} onChange={e => updateCustomWindow(idx, 'start', e.target.value)}
                    className="text-xs bg-transparent border-none outline-none text-slate-600 flex-1 cursor-pointer">
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="text-[10px] text-slate-400">–</span>
                  <select value={win.end} onChange={e => updateCustomWindow(idx, 'end', e.target.value)}
                    className="text-xs bg-transparent border-none outline-none text-slate-600 flex-1 cursor-pointer">
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {customWindows.length > 1 && (
                    <button onClick={() => removeCustomWindow(idx)}
                      className="text-slate-300 hover:text-red-400 transition-colors ml-1 flex-shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {customWindows.length < 7 && (
              <button onClick={addCustomWindow}
                className="flex items-center gap-1.5 text-[11px] text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                <Clock className="w-3 h-3" /> Add another window
              </button>
            )}
          </motion.div>
        )}

        {/* Live Preview */}
        <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-600 mb-0.5">Schedule Preview</p>
            <p className="text-[10px] text-slate-400 leading-relaxed break-words">{schedulePreview || '—'}</p>
          </div>
        </div>

      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
        <button onClick={onBack} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
          ← Back
        </button>
        <Button
          onClick={() => onSave({ name, schedule, method, timezone, activeDays, startTime, endTime, customWindows })}
          disabled={!name.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-5">
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
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
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