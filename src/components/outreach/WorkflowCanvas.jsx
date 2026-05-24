import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MessageCircle, Phone, Clock, CheckCircle2, Plus,
  MoreHorizontal, Trash2, Copy, Edit3, ArrowDown, ArrowUp, Shuffle
} from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STEP_TYPE_MAP, STEP_SUBTYPE_LABELS } from './AddStepMenu';
import AddStepMenu from './AddStepMenu';
import ChangeStepTypeModal from './ChangeStepTypeModal';

const channelColors = {
  email: 'text-blue-500', linkedin: 'text-blue-600',
  whatsapp: 'text-emerald-500', call: 'text-amber-500',
  task: 'text-violet-500', delay: 'text-slate-400',
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

const PRIORITY_STYLES = {
  high:   { dot: 'bg-red-400',    text: 'text-red-500',    label: 'High' },
  normal: { dot: 'bg-slate-300',  text: 'text-slate-400',  label: 'Normal' },
  low:    { dot: 'bg-slate-200',  text: 'text-slate-300',  label: 'Low' },
};

const MOCK_ANALYTICS = {
  delivered: { pct: 83, count: 120 },
  opens:     { pct: 42, count: 54  },
  clicks:    { pct: 11, count: 12  },
  replies:   { pct: 6,  count: 8   },
};

function StepAnalytics({ isHovered }) {
  const pcts = [
    { label: 'Delivered', val: `${MOCK_ANALYTICS.delivered.pct}%`, color: 'text-slate-500' },
    { label: 'Opens',     val: `${MOCK_ANALYTICS.opens.pct}%`,     color: 'text-blue-500'  },
    { label: 'Clicks',    val: `${MOCK_ANALYTICS.clicks.pct}%`,    color: 'text-emerald-500' },
    { label: 'Replies',   val: `${MOCK_ANALYTICS.replies.pct}%`,   color: 'text-violet-500' },
  ];
  const counts = [
    { label: 'Delivered', val: MOCK_ANALYTICS.delivered.count, color: 'text-slate-500' },
    { label: 'Opens',     val: MOCK_ANALYTICS.opens.count,     color: 'text-blue-500'  },
    { label: 'Clicks',    val: MOCK_ANALYTICS.clicks.count,    color: 'text-emerald-500' },
    { label: 'Replies',   val: MOCK_ANALYTICS.replies.count,   color: 'text-violet-500' },
  ];
  const data = isHovered ? counts : pcts;

  return (
    <div className="flex flex-col gap-0.5 text-right flex-shrink-0 ml-2">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={isHovered ? 'c' : 'p'}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="flex flex-col gap-0.5">
          {data.map(({ label, val, color }) => (
            <div key={label} className="flex items-center gap-1 justify-end">
              <span className="text-[9px] text-slate-400 leading-none">{label}</span>
              <span className={cn('text-[10px] font-bold tabular-nums leading-none', color)}>{val}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StepActionMenu({ onEdit, onDuplicate, onDelete, onChangeType, canMoveUp, canMoveDown, onMoveUp, onMoveDown }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const actions = [
    { icon: Edit3,    label: 'Edit Step',         onClick: onEdit,       color: 'text-slate-700' },
    { icon: Shuffle,  label: 'Change Step Type',  onClick: onChangeType, color: 'text-slate-700' },
    { icon: Copy,     label: 'Duplicate',         onClick: onDuplicate,  color: 'text-slate-700' },
    ...(canMoveUp   ? [{ icon: ArrowUp,   label: 'Move Up',   onClick: onMoveUp,   color: 'text-slate-700' }] : []),
    ...(canMoveDown ? [{ icon: ArrowDown, label: 'Move Down', onClick: onMoveDown, color: 'text-slate-700' }] : []),
    { icon: Trash2,   label: 'Delete',            onClick: onDelete,     color: 'text-red-500', divider: true },
  ];

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className="p-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-[9999] bg-white rounded-xl border border-slate-200 shadow-xl py-1 min-w-[148px]">
          {actions.map(({ icon: Icon, label, onClick, color, divider }, i) => (
            <div key={label}>
              {divider && <div className="my-1 border-t border-slate-100" />}
              <button
                onClick={e => { e.stopPropagation(); onClick(); setOpen(false); }}
                className={cn('flex items-center gap-2 w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 transition-colors', color)}>
                <Icon className="w-3 h-3 flex-shrink-0" />
                {label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InsertionPoint({ onAdd }) {
  return (
    <div className="flex flex-col items-center my-0.5 group/ins">
      <div className="w-px h-3 bg-slate-200 group-hover/ins:bg-emerald-300 transition-colors" />
      <button onClick={onAdd}
        className="w-5 h-5 rounded-full border border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-300 hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all">
        <Plus className="w-3 h-3" />
      </button>
      <div className="w-px h-3 bg-slate-200 group-hover/ins:bg-emerald-300 transition-colors" />
    </div>
  );
}

function WorkflowStep({ step, index, total, onEdit, onRemove, onDuplicate, onInsertAfter, onMoveUp, onMoveDown, onChangeType }) {
  const [isHovered, setIsHovered] = useState(false);
  const baseType = STEP_TYPE_MAP[step.subtype] || step.type;
  const Icon = channelIcons[baseType] || Mail;
  const subtypeLabel = STEP_SUBTYPE_LABELS[step.subtype] || step.subtype || baseType;
  const isDelay = baseType === 'delay';
  const priority = step.priority || 'normal';
  const pStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.normal;
  const canMoveUp = total > 1 && index > 0;
  const canMoveDown = total > 1 && index < total - 1;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, delay: index * 0.03 }}
        className="w-full"
      >
        {isDelay ? (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 cursor-pointer hover:border-slate-400 transition-colors"
          >
            <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="text-[11px] text-slate-500 flex-1">
              Wait {step.delay_amount || 3} {step.delay_unit || 'days'}
            </span>
            <StepActionMenu
              onEdit={onEdit} onDuplicate={onDuplicate} onDelete={() => onRemove(index)}
              onChangeType={() => onChangeType(index)}
              canMoveUp={canMoveUp} canMoveDown={canMoveDown}
              onMoveUp={() => onMoveUp(index)} onMoveDown={() => onMoveDown(index)}
            />
          </div>
        ) : (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onEdit}
            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm cursor-pointer transition-all"
          >
            {/* Step number */}
            <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-bold text-slate-500">{index + 1}</span>
            </div>

            {/* Icon */}
            <div className={cn('w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0', channelBg[baseType] || 'bg-slate-50 border-slate-200')}>
              <Icon className={cn('w-3.5 h-3.5', channelColors[baseType])} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-slate-800 truncate">{subtypeLabel}</p>
                {priority !== 'normal' && (
                  <span className="flex items-center gap-0.5 flex-shrink-0">
                    <span className={cn('w-1.5 h-1.5 rounded-full', pStyle.dot)} />
                    <span className={cn('text-[9px] font-medium', pStyle.text)}>{pStyle.label}</span>
                  </span>
                )}
                <span className="text-[9px] text-slate-400 flex-shrink-0 flex items-center gap-0.5">
                  <Clock className="w-2 h-2" /> D{step.day ?? 1}
                </span>
              </div>
              {(step.subject || step.body) && (
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {(step.subject || step.body || '').replace(/\{\{.*?\}\}/g, '…')}
                </p>
              )}
            </div>

            {/* Analytics */}
            <StepAnalytics isHovered={isHovered} />

            {/* Action menu */}
            <StepActionMenu
              onEdit={onEdit} onDuplicate={onDuplicate} onDelete={() => onRemove(index)}
              onChangeType={() => onChangeType(index)}
              canMoveUp={canMoveUp} canMoveDown={canMoveDown}
              onMoveUp={() => onMoveUp(index)} onMoveDown={() => onMoveDown(index)}
            />
          </div>
        )}
      </motion.div>

      {index < total - 1 && (
        <InsertionPoint onAdd={() => onInsertAfter(index)} />
      )}
    </div>
  );
}

export default function WorkflowCanvas({ steps, onAddStep, onEditStep, onRemoveStep, onDuplicateStep, onInsertAfterStep, onMoveStep, onChangeStepType }) {
  const [changingTypeIdx, setChangingTypeIdx] = useState(null);

  const handleMoveUp = (i) => onMoveStep && onMoveStep(i, i - 1);
  const handleMoveDown = (i) => onMoveStep && onMoveStep(i, i + 1);

  return (
    <div className="flex flex-col items-stretch max-w-lg mx-auto w-full">
      {/* Start node */}
      <div className="flex justify-center mb-1">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-semibold text-emerald-700">Sequence Start</span>
        </div>
      </div>
      <div className="w-px h-3 bg-slate-200 mx-auto" />

      <AnimatePresence>
        {steps.map((step, i) => (
          <WorkflowStep
            key={`${i}-${step.subtype}-${step.type}`}
            step={step}
            index={i}
            total={steps.length}
            onEdit={() => onEditStep(i)}
            onRemove={onRemoveStep}
            onDuplicate={() => onDuplicateStep(i)}
            onInsertAfter={onInsertAfterStep}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onChangeType={(idx) => setChangingTypeIdx(idx)}
          />
        ))}
      </AnimatePresence>

      {/* Add step at bottom */}
      <div className="flex justify-center mt-1">
        <AddStepMenu onAdd={onAddStep} trigger="inline" />
      </div>

      <div className="w-px h-3 bg-slate-200 mx-auto mt-1" />
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
          <CheckCircle2 className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] font-medium text-slate-500">Sequence End</span>
        </div>
      </div>

      {changingTypeIdx !== null && (
        <ChangeStepTypeModal
          currentSubtype={steps[changingTypeIdx]?.subtype}
          onSelect={(subtype) => {
            onChangeStepType && onChangeStepType(changingTypeIdx, subtype);
            setChangingTypeIdx(null);
          }}
          onClose={() => setChangingTypeIdx(null)}
        />
      )}
    </div>
  );
}