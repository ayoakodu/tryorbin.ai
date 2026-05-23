import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft, Plus, Mail, MessageCircle, Phone,
  Sparkles, Users, Clock, Trash2, Edit3, CheckCircle2,
  BarChart3, AlertCircle, Loader2, Save,
  ArrowDown, GitBranch, BookOpen
} from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { initialSequences } from './Outreach';
import AIPersonalizePanel from '@/components/ai/AIPersonalizePanel';
import AddStepMenu, { STEP_TYPE_MAP, STEP_SUBTYPE_LABELS } from '@/components/outreach/AddStepMenu';
import StepEditor from '@/components/outreach/StepEditor';
import StepPreview from '@/components/outreach/StepPreview';

const channelColors = {
  email: 'text-blue-500', linkedin: 'text-blue-600',
  whatsapp: 'text-emerald-500', sms: 'text-violet-500',
  call: 'text-amber-500', task: 'text-violet-500', delay: 'text-slate-400',
};
const channelBg = {
  email: 'bg-blue-50 border-blue-100', linkedin: 'bg-blue-50 border-blue-100',
  whatsapp: 'bg-emerald-50 border-emerald-100', sms: 'bg-violet-50 border-violet-100',
  call: 'bg-amber-50 border-amber-100', task: 'bg-violet-50 border-violet-100',
  delay: 'bg-slate-50 border-slate-200',
};
const channelIcons = {
  email: Mail, linkedin: Linkedin, whatsapp: MessageCircle,
  sms: MessageCircle, call: Phone, task: CheckCircle2, delay: Clock,
};

const statusBadge = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
};

// Single step card in the workflow canvas
function WorkflowStep({ step, index, total, isSelected, onSelect, onRemove }) {
  const baseType = STEP_TYPE_MAP[step.subtype] || step.type;
  const Icon = channelIcons[baseType] || Mail;
  const isLast = index === total - 1;
  const subtypeLabel = STEP_SUBTYPE_LABELS[step.subtype] || step.subtype || baseType;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: index * 0.04 }}
        onClick={() => onSelect(index)}
        className={cn(
          'w-full max-w-xs rounded-xl border-2 p-3 cursor-pointer transition-colors',
          isSelected
            ? 'border-emerald-400 bg-white shadow-sm shadow-emerald-100'
            : 'border-slate-200 bg-white hover:border-slate-300'
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className={cn('w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0', channelBg[baseType] || 'bg-slate-50 border-slate-200')}>
            <Icon className={cn('w-3.5 h-3.5', channelColors[baseType] || 'text-slate-400')} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-slate-800 truncate">{subtypeLabel}</p>
              <span className="text-[9px] text-slate-400 flex items-center gap-0.5 flex-shrink-0">
                <Clock className="w-2.5 h-2.5" /> D{step.day || 0}
              </span>
            </div>
            {(step.subject || step.body) && (
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {(step.subject || step.body || '').replace(/\{\{.*?\}\}/g, '…')}
              </p>
            )}
          </div>
          <button onClick={e => { e.stopPropagation(); onRemove(index); }}
            className="p-1 rounded text-slate-300 hover:text-red-400 hover:bg-red-50 flex-shrink-0 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </motion.div>

      {!isLast && (
        <div className="flex flex-col items-center my-1">
          <div className="w-px h-4 bg-slate-200" />
          <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
            <ArrowDown className="w-2.5 h-2.5 text-slate-400" />
          </div>
          <div className="w-px h-4 bg-slate-200" />
        </div>
      )}
    </div>
  );
}

// Multichannel illustration for empty state
function MultichannelIllustration() {
  const orbitIcons = [
    { Icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100', angle: 0 },
    { Icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', angle: 72 },
    { Icon: MessageCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100', angle: 144 },
    { Icon: Phone, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100', angle: 216 },
    { Icon: CheckCircle2, color: 'text-violet-500', bg: 'bg-violet-50 border-violet-100', angle: 288 },
  ];
  const R = 52;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      {/* Orbit ring */}
      <svg className="absolute inset-0" width="140" height="140">
        <circle cx="70" cy="70" r={R} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 5" />
      </svg>
      {/* Center paper plane */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center z-10"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
        </svg>
      </motion.div>
      {/* Orbit icons */}
      {orbitIcons.map(({ Icon, color, bg, angle }, i) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const x = 70 + R * Math.cos(rad) - 12;
        const y = 70 + R * Math.sin(rad) - 12;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className={`absolute w-6 h-6 rounded-lg border flex items-center justify-center ${bg}`}
            style={{ left: x, top: y }}
          >
            <Icon className={`w-3 h-3 ${color}`} />
          </motion.div>
        );
      })}
    </div>
  );
}

// Empty state for a fresh sequence — full width, centered, no side panels
function EmptyWorkflowState({ onAddStep, onShowTemplates, onGenerateWithAI }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col items-center justify-center text-center px-6"
    >
      <MultichannelIllustration />

      <h3 className="text-sm font-bold text-slate-800 mt-5 mb-1.5">Sequence is empty</h3>
      <p className="text-xs text-slate-400 mb-6 max-w-[260px] leading-relaxed">
        Add your first step to start building a multichannel outreach workflow.
      </p>

      {/* Primary CTA — inline Add Step menu */}
      <div className="mb-2">
        <AddStepMenu onAdd={onAddStep} trigger="empty" />
      </div>

      {/* Secondary CTAs */}
      <div className="flex items-center gap-2 mt-1">
        <button onClick={onShowTemplates}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-600 hover:bg-slate-50 transition-colors font-medium">
          <BookOpen className="w-3 h-3" /> Use Template
        </button>
        <button onClick={onGenerateWithAI}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700 hover:bg-emerald-100 transition-colors font-medium">
          <Sparkles className="w-3 h-3 text-emerald-500" /> Generate with AI
        </button>
      </div>
    </motion.div>
  );
}

export default function SequenceBuilder() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const seqId = parseInt(urlParams.get('id'));

  const [seq, setSeq] = useState(() => {
    const found = initialSequences.find(s => s.id === seqId);
    return found || {
      id: seqId || Date.now(), name: 'New Sequence', status: 'draft',
      steps: [], enrolled: 0, replied: 0, meetings: 0, opens: 0, tags: [],
    };
  });

  const [activeTab, setActiveTab] = useState('builder');
  const [selectedStepIdx, setSelectedStepIdx] = useState(null);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [saved, setSaved] = useState(false);

  const selectedStep = selectedStepIdx !== null ? seq.steps[selectedStepIdx] : null;
  const replyRate = seq.enrolled > 0 ? ((seq.replied / seq.enrolled) * 100).toFixed(1) : 0;
  const meetingRate = seq.enrolled > 0 ? ((seq.meetings / seq.enrolled) * 100).toFixed(1) : 0;

  const addStep = useCallback((subtype) => {
    const baseType = STEP_TYPE_MAP[subtype] || subtype;
    const lastDay = seq.steps[seq.steps.length - 1]?.day || 0;
    const newStep = { type: baseType, subtype, day: lastDay + 3, subject: '', body: '' };
    const newIdx = seq.steps.length;
    setSeq(s => ({ ...s, steps: [...s.steps, newStep] }));
    setSelectedStepIdx(newIdx);
  }, [seq.steps]);

  const updateStep = useCallback((i, updated) => {
    setSeq(s => ({ ...s, steps: s.steps.map((st, idx) => idx === i ? updated : st) }));
  }, []);

  const removeStep = useCallback((i) => {
    setSeq(s => ({ ...s, steps: s.steps.filter((_, idx) => idx !== i) }));
    setSelectedStepIdx(prev => {
      if (prev === null || prev < i) return prev;
      if (prev === i) return seq.steps.length > 1 ? Math.max(0, i - 1) : null;
      return prev - 1;
    });
  }, [seq.steps.length]);

  const toggleStatus = useCallback(() => {
    setSeq(s => ({ ...s, status: s.status === 'active' ? 'paused' : 'active' }));
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const getAISuggestions = async () => {
    setAiSuggesting(true);
    setAiSuggestions([]);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this outreach sequence and provide 3 specific optimization recommendations:
Sequence: "${seq.name}"
Steps: ${seq.steps.length} steps, channels: ${seq.steps.map(s => s.type).join(', ')}
Reply rate: ${replyRate}%, Meeting rate: ${meetingRate}%
Return JSON with suggestions array: { type: "warning"|"tip"|"insight", title: string, body: string }`,
      response_json_schema: {
        type: 'object',
        properties: {
          suggestions: {
            type: 'array',
            items: { type: 'object', properties: { type: { type: 'string' }, title: { type: 'string' }, body: { type: 'string' } } }
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
      <div className="flex items-center justify-between px-5 py-2 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/outreach')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Sequences
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="text-sm font-bold text-slate-800 max-w-xs truncate">{seq.name}</h1>
          <button onClick={toggleStatus}
            className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors cursor-pointer', statusBadge[seq.status])}>
            {seq.status}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline"
            className="gap-1.5 text-[11px] h-7 border-slate-200 text-slate-600 hover:bg-slate-50">
            <Users className="w-3 h-3" /> Add Contacts
          </Button>
          <Button size="sm" onClick={handleSave}
            className={cn('gap-1.5 text-[11px] h-7 text-white', saved ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700')}>
            {saved ? <CheckCircle2 className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            {saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-5 bg-white border-b border-slate-200 flex-shrink-0">
        {[
          { id: 'builder', label: 'Builder' },
          { id: 'contacts', label: 'Contacts' },
          { id: 'activity', label: 'Activity' },
          { id: 'settings', label: 'Settings' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2.5 text-xs font-medium border-b-2 transition-colors',
              activeTab === tab.id ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            )}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Non-builder placeholder */}
        {activeTab !== 'builder' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-medium text-slate-600 capitalize">{activeTab}</p>
              <p className="text-[11px] text-slate-400 mt-1">Coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'builder' && (
          <>
            {seq.steps.length === 0 ? (
              /* EMPTY STATE: full width, centered, no side panels */
              <EmptyWorkflowState
                onAddStep={addStep}
                onShowTemplates={() => {}}
                onGenerateWithAI={() => setShowPersonalize(true)}
              />
            ) : (
              /* POPULATED STATE: 3-column split */
              <>
                {/* Left: Workflow Canvas */}
                <div className="flex-1 overflow-y-auto p-6 border-r border-slate-200">
                  <div className="max-w-xs mx-auto">
                    <div className="flex justify-center mb-1">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-semibold text-emerald-700">Sequence Start</span>
                      </div>
                    </div>
                    <div className="w-px h-4 bg-slate-200 mx-auto" />

                    {seq.steps.map((step, i) => (
                      <WorkflowStep
                        key={i}
                        step={step}
                        index={i}
                        total={seq.steps.length}
                        isSelected={selectedStepIdx === i}
                        onSelect={setSelectedStepIdx}
                        onRemove={removeStep}
                      />
                    ))}

                    <AddStepMenu onAdd={addStep} trigger="inline" />

                    <div className="w-px h-4 bg-slate-200 mx-auto" />
                    <div className="flex justify-center">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                        <CheckCircle2 className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-medium text-slate-500">Sequence End</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: Step Editor */}
                <div className="w-64 xl:w-72 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
                  {selectedStep ? (
                    <StepEditor
                      step={selectedStep}
                      index={selectedStepIdx}
                      onUpdate={(updated) => updateStep(selectedStepIdx, updated)}
                      onPersonalize={() => setShowPersonalize(true)}
                    />
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-6 text-center">
                      <div>
                        <Edit3 className="w-7 h-7 text-slate-200 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">Select a step to edit</p>
                      </div>
                    </div>
                  )}

                  {/* AI Tips */}
                  <div className="border-t border-slate-100 flex-shrink-0">
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <p className="text-[11px] font-semibold text-slate-700">AI Tips</p>
                      </div>
                      <button onClick={getAISuggestions} disabled={aiSuggesting}
                        className="text-[10px] text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                        {aiSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Analyze'}
                      </button>
                    </div>
                    <div className="p-3 space-y-2 max-h-40 overflow-y-auto">
                      {aiSuggestions.length === 0 ? (
                        <p className="text-[11px] text-slate-400 leading-relaxed">Click Analyze for AI tips.</p>
                      ) : (
                        aiSuggestions.map((s, i) => (
                          <div key={i} className={cn('rounded-lg p-2.5 border text-[11px]',
                            s.type === 'warning' ? 'bg-amber-50 border-amber-100' :
                            s.type === 'insight' ? 'bg-blue-50 border-blue-100' :
                            'bg-emerald-50 border-emerald-100'
                          )}>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {s.type === 'warning' ? <AlertCircle className="w-3 h-3 text-amber-500" /> :
                               s.type === 'insight' ? <BarChart3 className="w-3 h-3 text-blue-500" /> :
                               <Sparkles className="w-3 h-3 text-emerald-500" />}
                              <span className="font-semibold text-slate-700 text-[10px]">{s.title}</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed">{s.body}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Live Preview */}
                <div className="w-64 xl:w-72 flex-shrink-0 bg-white flex flex-col overflow-hidden">
                  <StepPreview step={selectedStep} />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {showPersonalize && <AIPersonalizePanel onClose={() => setShowPersonalize(false)} />}
    </div>
  );
}