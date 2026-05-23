import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft, Play, Pause, Plus, Mail, MessageCircle, Phone,
  Sparkles, Users, Zap, Clock, Trash2, Edit3, CheckCircle2,
  BarChart3, TrendingUp, Reply, AlertCircle, Loader2, Save,
  ArrowDown, Copy, GitBranch
} from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { initialSequences } from './Outreach';
import BranchingStepEditor from '@/components/outreach/BranchingStepEditor';
import AIPersonalizePanel from '@/components/ai/AIPersonalizePanel';

const channelIcons = { email: Mail, linkedin: Linkedin, whatsapp: MessageCircle, sms: MessageCircle, call: Phone };
const channelColors = { email: 'text-blue-500', linkedin: 'text-blue-600', whatsapp: 'text-emerald-500', sms: 'text-violet-500', call: 'text-amber-500' };
const channelBg = { email: 'bg-blue-50 border-blue-100', linkedin: 'bg-blue-50 border-blue-100', whatsapp: 'bg-emerald-50 border-emerald-100', sms: 'bg-violet-50 border-violet-100', call: 'bg-amber-50 border-amber-100' };
const channelLabel = { email: 'Email', linkedin: 'LinkedIn', whatsapp: 'WhatsApp', sms: 'SMS', call: 'Call Task' };

const statusBadge = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
};

function WorkflowStep({ step, index, total, isSelected, onSelect, onUpdate, onRemove, onOpenPersonalize }) {
  const Icon = channelIcons[step.type] || Mail;
  const isLast = index === total - 1;

  return (
    <div className="flex flex-col items-center">
      {/* Step card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => onSelect(index)}
        className={cn(
          'w-full max-w-sm rounded-xl border-2 p-4 cursor-pointer transition-all',
          isSelected
            ? 'border-emerald-400 bg-white shadow-md shadow-emerald-100'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0', channelBg[step.type] || 'bg-slate-50 border-slate-100')}>
            <Icon className={cn('w-4 h-4', channelColors[step.type] || 'text-slate-400')} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded', channelBg[step.type])}>
                <span className={channelColors[step.type]}>{channelLabel[step.type] || step.type}</span>
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" /> Day {step.day}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 truncate">{step.subject || 'Untitled step'}</p>
            {step.body && (
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{step.body.replace(/{{.*?}}/g, '…')}</p>
            )}
          </div>
          <button onClick={e => { e.stopPropagation(); onRemove(index); }}
            className="p-1 rounded text-slate-300 hover:text-red-400 hover:bg-red-50 flex-shrink-0">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Connector */}
      {!isLast && (
        <div className="flex flex-col items-center my-1">
          <div className="w-px h-5 bg-slate-200" />
          <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
            <ArrowDown className="w-3 h-3 text-slate-400" />
          </div>
          <div className="w-px h-5 bg-slate-200" />
        </div>
      )}
    </div>
  );
}

function AddStepButton({ onAdd }) {
  const [open, setOpen] = useState(false);
  const channels = [
    { type: 'email', icon: Mail, label: 'Email', color: 'text-blue-500' },
    { type: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-600' },
    { type: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'text-emerald-500' },
    { type: 'call', icon: Phone, label: 'Call Task', color: 'text-amber-500' },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="w-px h-4 bg-slate-200" />
      <div className="relative">
        <button onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 bg-white text-xs text-slate-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
          <Plus className="w-3.5 h-3.5" /> Add Step
        </button>
        {open && (
          <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-10 min-w-[140px]">
            {channels.map(ch => (
              <button key={ch.type} onClick={() => { onAdd(ch.type); setOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                <ch.icon className={cn('w-3.5 h-3.5', ch.color)} />
                {ch.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SequenceBuilder() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const seqId = parseInt(urlParams.get('id'));

  const [seq, setSeq] = useState(() => {
    const found = initialSequences.find(s => s.id === seqId);
    return found || initialSequences[0];
  });

  const [selectedStepIdx, setSelectedStepIdx] = useState(0);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [saved, setSaved] = useState(false);

  const selectedStep = seq.steps[selectedStepIdx];
  const replyRate = seq.enrolled > 0 ? ((seq.replied / seq.enrolled) * 100).toFixed(1) : 0;
  const meetingRate = seq.enrolled > 0 ? ((seq.meetings / seq.enrolled) * 100).toFixed(1) : 0;

  const addStep = (type) => {
    const lastDay = seq.steps[seq.steps.length - 1]?.day || 0;
    const newStep = { type, day: lastDay + 3, subject: '', body: '' };
    setSeq(s => ({ ...s, steps: [...s.steps, newStep] }));
    setSelectedStepIdx(seq.steps.length);
  };

  const updateStep = (i, updated) => {
    setSeq(s => ({ ...s, steps: s.steps.map((st, idx) => idx === i ? updated : st) }));
  };

  const removeStep = (i) => {
    setSeq(s => ({ ...s, steps: s.steps.filter((_, idx) => idx !== i) }));
    setSelectedStepIdx(prev => Math.max(0, prev - 1));
  };

  const toggleStatus = () => {
    setSeq(s => ({ ...s, status: s.status === 'active' ? 'paused' : 'active' }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getAISuggestions = async () => {
    setAiSuggesting(true);
    setAiSuggestions([]);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this outreach sequence and provide 3 specific optimization recommendations:
Sequence: "${seq.name}"
Steps: ${seq.steps.length} steps, channels: ${seq.steps.map(s => s.type).join(', ')}
Reply rate: ${replyRate}%, Meeting rate: ${meetingRate}%
Enrolled: ${seq.enrolled}

Return JSON with suggestions array of objects: { type: "warning"|"tip"|"insight", title: string, body: string }`,
      response_json_schema: {
        type: 'object',
        properties: {
          suggestions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                title: { type: 'string' },
                body: { type: 'string' }
              }
            }
          }
        }
      }
    });
    setAiSuggestions(result?.suggestions || []);
    setAiSuggesting(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: '#f8fafc' }}>

      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/outreach')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Sequences
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="text-sm font-bold text-slate-800 max-w-xs truncate">{seq.name}</h1>
          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', statusBadge[seq.status])}>
            {seq.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-4 mr-3">
            {[
              { label: 'Enrolled', value: seq.enrolled, color: 'text-slate-700' },
              { label: 'Reply', value: `${replyRate}%`, color: 'text-emerald-600' },
              { label: 'Meetings', value: seq.meetings, color: 'text-amber-600' },
            ].map(m => (
              <div key={m.label} className="text-center">
                <p className={cn('text-xs font-bold', m.color)}>{m.value}</p>
                <p className="text-[10px] text-slate-400">{m.label}</p>
              </div>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={toggleStatus}
            className={cn('gap-1.5 text-xs h-7',
              seq.status === 'active' ? 'border-amber-200 text-amber-600 hover:bg-amber-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
            )}>
            {seq.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {seq.status === 'active' ? 'Pause' : 'Launch'}
          </Button>
          <Button size="sm" onClick={handleSave}
            className={cn('gap-1.5 text-xs h-7', saved ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700', 'text-white')}>
            {saved ? <CheckCircle2 className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            {saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Center: Workflow Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-md mx-auto">

            {/* Sequence start node */}
            <div className="flex justify-center mb-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold text-emerald-700">Sequence Start</span>
                <span className="text-[10px] text-emerald-500">{seq.enrolled} contacts enrolled</span>
              </div>
            </div>
            <div className="w-px h-4 bg-slate-200 mx-auto mb-0" />

            {seq.steps.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                  <GitBranch className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-600 mb-1">No steps yet</p>
                <p className="text-xs text-slate-400 mb-4">Add your first step to start building the sequence workflow.</p>
              </div>
            ) : (
              seq.steps.map((step, i) => (
                <WorkflowStep
                  key={i}
                  step={step}
                  index={i}
                  total={seq.steps.length}
                  isSelected={selectedStepIdx === i}
                  onSelect={setSelectedStepIdx}
                  onUpdate={updateStep}
                  onRemove={removeStep}
                  onOpenPersonalize={() => setShowPersonalize(true)}
                />
              ))
            )}

            <AddStepButton onAdd={addStep} />

            {seq.steps.length > 0 && (
              <>
                <div className="w-px h-4 bg-slate-200 mx-auto" />
                <div className="flex justify-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                    <CheckCircle2 className="w-3 h-3 text-slate-400" />
                    <span className="text-[11px] font-medium text-slate-500">Sequence End</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Step Editor + AI Insights */}
        <div className="w-72 xl:w-80 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden">

          {/* Step Editor */}
          {selectedStep ? (
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Step {selectedStepIdx + 1} — Edit</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Channel</label>
                    <select
                      value={selectedStep.type}
                      onChange={e => updateStep(selectedStepIdx, { ...selectedStep, type: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-emerald-400"
                    >
                      <option value="email">Email</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="sms">SMS</option>
                      <option value="call">Call Task</option>
                    </select>
                  </div>
                  <div className="w-20">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Day</label>
                    <input
                      type="number" min={0}
                      value={selectedStep.day}
                      onChange={e => updateStep(selectedStepIdx, { ...selectedStep, day: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Subject / Task</label>
                  <Input
                    value={selectedStep.subject}
                    onChange={e => updateStep(selectedStepIdx, { ...selectedStep, subject: e.target.value })}
                    placeholder="Subject line or task description"
                    className="text-xs h-8"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Message Body</label>
                  <Textarea
                    value={selectedStep.body}
                    onChange={e => updateStep(selectedStepIdx, { ...selectedStep, body: e.target.value })}
                    placeholder="Message body... use {{first_name}}, {{company}}"
                    className="text-xs resize-none"
                    rows={4}
                  />
                </div>

                <button onClick={() => setShowPersonalize(true)}
                  className="flex items-center gap-1.5 text-[11px] text-emerald-600 hover:text-emerald-700 transition-colors">
                  <Sparkles className="w-3 h-3" /> AI Personalize this step
                </button>

                <BranchingStepEditor step={selectedStep} index={selectedStepIdx} onUpdate={updateStep} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <div>
                <Edit3 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Click a step to edit it</p>
              </div>
            </div>
          )}

          {/* AI Insights Panel */}
          <div className="border-t border-slate-100 flex-shrink-0">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <p className="text-[11px] font-semibold text-slate-700">AI Recommendations</p>
              </div>
              <button onClick={getAISuggestions} disabled={aiSuggesting}
                className="text-[10px] text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                {aiSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Analyze'}
              </button>
            </div>
            <div className="p-3 space-y-2 max-h-52 overflow-y-auto">
              {aiSuggestions.length === 0 ? (
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {seq.steps.length > 0
                    ? `${seq.steps.length}-step sequence. Click Analyze for AI optimization tips.`
                    : 'Add steps to get AI-powered recommendations.'}
                </p>
              ) : (
                aiSuggestions.map((s, i) => (
                  <div key={i} className={cn('rounded-lg p-2.5 border text-[11px]',
                    s.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                    s.type === 'insight' ? 'bg-blue-50 border-blue-100' :
                    'bg-emerald-50 border-emerald-100'
                  )}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {s.type === 'warning' ? <AlertCircle className="w-3 h-3 text-amber-500" /> :
                       s.type === 'insight' ? <BarChart3 className="w-3 h-3 text-blue-500" /> :
                       <Sparkles className="w-3 h-3 text-emerald-500" />}
                      <span className="font-semibold text-slate-700">{s.title}</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed">{s.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showPersonalize && <AIPersonalizePanel onClose={() => setShowPersonalize(false)} />}
    </div>
  );
}