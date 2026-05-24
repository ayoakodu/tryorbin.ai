import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft, Mail, MessageCircle, Phone,
  Sparkles, Users, Clock, CheckCircle2, Save,
  BookOpen, Zap
} from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { initialSequences } from './Outreach';
import AIPersonalizePanel from '@/components/ai/AIPersonalizePanel';
import AddStepMenu, { STEP_TYPE_MAP, STEP_SUBTYPE_LABELS } from '@/components/outreach/AddStepMenu';
import StepModal from '@/components/outreach/StepModal';
import WorkflowCanvas from '@/components/outreach/WorkflowCanvas';

const statusBadge = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
};

const TABS = [
  { id: 'steps', label: 'Steps' },
  { id: 'prospects', label: 'Prospects' },
  { id: 'emails', label: 'Emails' },
  { id: 'calls', label: 'Calls' },
  { id: 'stats', label: 'Stats' },
  { id: 'settings', label: 'Settings' },
];

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
      <svg className="absolute inset-0" width="140" height="140">
        <circle cx="70" cy="70" r={R} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 5" />
      </svg>
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center z-10">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
        </svg>
      </motion.div>
      {orbitIcons.map(({ Icon, color, bg, angle }, i) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const x = 70 + R * Math.cos(rad) - 12;
        const y = 70 + R * Math.sin(rad) - 12;
        return (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className={`absolute w-6 h-6 rounded-lg border flex items-center justify-center ${bg}`}
            style={{ left: x, top: y }}>
            <Icon className={`w-3 h-3 ${color}`} />
          </motion.div>
        );
      })}
    </div>
  );
}

function EmptyWorkflowState({ onAddStep, onShowTemplates, onGenerateWithAI }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
      className="flex flex-col items-center text-center px-6">
      <MultichannelIllustration />
      <h3 className="text-sm font-bold text-slate-800 mt-5 mb-1.5">Sequence is empty</h3>
      <p className="text-xs text-slate-400 mb-6 max-w-[260px] leading-relaxed">
        Add your first step to start building a multichannel outreach workflow.
      </p>
      <div className="mb-3">
        <AddStepMenu onAdd={onAddStep} trigger="empty" />
      </div>
      <div className="flex items-center gap-2 w-40 mb-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[11px] text-slate-400 font-medium">Or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onShowTemplates}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-600 hover:bg-slate-50 transition-colors font-medium">
          <BookOpen className="w-3 h-3" /> Use Template
        </button>
        <button onClick={onGenerateWithAI}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700 hover:bg-emerald-100 transition-colors font-medium">
          <Sparkles className="w-3 h-3 text-emerald-500" /> AI-Assisted Sequence
        </button>
      </div>
    </motion.div>
  );
}

// Top metrics bar
function SequenceMetrics({ seq }) {
  const automatedCount = seq.steps.filter(s => s.subtype === 'email_auto' || s.subtype === 'whatsapp_followup').length;
  const automatedPct = seq.steps.length > 0 ? Math.round((automatedCount / seq.steps.length) * 100) : 0;
  const totalDays = seq.steps.length > 0 ? (seq.steps[seq.steps.length - 1]?.day || 0) : 0;

  const metrics = [
    { label: 'Steps', value: seq.steps.length, Icon: Zap },
    { label: 'Days', value: totalDays, Icon: Clock },
    { label: 'Automated', value: `${automatedPct}%`, Icon: CheckCircle2 },
    { label: 'Enrolled', value: seq.enrolled || 0, Icon: Users },
  ];

  return (
    <div className="flex items-center gap-1 px-5 py-2 border-b border-slate-100 bg-white flex-shrink-0">
      {metrics.map(({ label, value, Icon }, i) => (
        <div key={label} className={cn('flex items-center gap-2 px-3 py-1.5', i < metrics.length - 1 && 'border-r border-slate-100')}>
          <Icon className="w-3 h-3 text-slate-400 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none">{value}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
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

  const [activeTab, setActiveTab] = useState('steps');
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pendingInsert, setPendingInsert] = useState(null);

  // Modal state
  const [modalState, setModalState] = useState(null);
  // { step, index, isNew, insertAfterIndex? }

  const openNewStep = useCallback((subtype, insertAfterIndex = null) => {
    const baseType = STEP_TYPE_MAP[subtype] || subtype;
    const lastDay = seq.steps[seq.steps.length - 1]?.day || 0;
    const newStep = { type: baseType, subtype, day: lastDay + 3, subject: '', body: '' };
    const insertIdx = insertAfterIndex !== null ? insertAfterIndex + 1 : seq.steps.length;
    setModalState({ step: newStep, index: insertIdx, isNew: true, insertAfterIndex });
  }, [seq.steps]);

  const openEditStep = useCallback((index) => {
    setModalState({ step: { ...seq.steps[index] }, index, isNew: false });
  }, [seq.steps]);

  const handleModalSave = useCallback((updatedStep) => {
    setSeq(s => {
      const newSteps = [...s.steps];
      if (modalState.isNew) {
        newSteps.splice(modalState.index, 0, updatedStep);
      } else {
        newSteps[modalState.index] = updatedStep;
      }
      return { ...s, steps: newSteps };
    });
    setModalState(null);
  }, [modalState]);

  const removeStep = useCallback((i) => {
    setSeq(s => ({ ...s, steps: s.steps.filter((_, idx) => idx !== i) }));
  }, []);

  const duplicateStep = useCallback((i) => {
    setSeq(s => {
      const newSteps = [...s.steps];
      const copy = { ...s.steps[i], day: (s.steps[i].day || 0) + 1 };
      newSteps.splice(i + 1, 0, copy);
      return { ...s, steps: newSteps };
    });
  }, []);

  const toggleStatus = useCallback(() => {
    setSeq(s => ({ ...s, status: s.status === 'active' ? 'paused' : 'active' }));
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

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
      <div className="flex items-center justify-between px-5 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 text-xs font-medium border-b-2 transition-colors',
                activeTab === tab.id ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              )}>
              {tab.label}
            </button>
          ))}
        </div>
        {/* Add Step button top-right */}
        {activeTab === 'steps' && seq.steps.length > 0 && (
          <AddStepMenu onAdd={openNewStep} trigger="empty" />
        )}
      </div>

      {/* Sequence Metrics (steps tab only) */}
      {activeTab === 'steps' && seq.steps.length > 0 && (
        <SequenceMetrics seq={seq} />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab !== 'steps' && (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center">
              <p className="text-xs font-medium text-slate-600 capitalize">{activeTab}</p>
              <p className="text-[11px] text-slate-400 mt-1">Coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <>
            {seq.steps.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <EmptyWorkflowState
                  onAddStep={openNewStep}
                  onShowTemplates={() => {}}
                  onGenerateWithAI={() => setShowPersonalize(true)}
                />
              </div>
            ) : (
              <div className="py-6 px-4">
                <WorkflowCanvas
                  steps={seq.steps}
                  onAddStep={openNewStep}
                  onEditStep={openEditStep}
                  onRemoveStep={removeStep}
                  onDuplicateStep={duplicateStep}
                  onInsertAfterStep={(idx) => setPendingInsert(idx)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Step Modal */}
      {modalState && (
        <StepModal
          step={modalState.step}
          index={modalState.index}
          isNew={modalState.isNew}
          onSave={handleModalSave}
          onClose={() => setModalState(null)}
        />
      )}

      {/* Insertion add-step picker */}
      {pendingInsert !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20"
          onClick={() => setPendingInsert(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-xl border border-slate-200 shadow-xl p-2">
            <AddStepMenu onAdd={(subtype) => { openNewStep(subtype, pendingInsert); setPendingInsert(null); }} trigger="empty" />
          </div>
        </div>
      )}

      {showPersonalize && <AIPersonalizePanel onClose={() => setShowPersonalize(false)} />}
    </div>
  );
}