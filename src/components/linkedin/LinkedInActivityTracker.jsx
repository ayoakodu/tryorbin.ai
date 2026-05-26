import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  UserPlus, MessageCircle, Eye, ThumbsUp, CornerDownRight,
  Bell, Building2, Clock, CheckCircle2, AlertTriangle,
  SkipForward, Pause, Filter, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';
import { TASK_TYPE_LABELS, STATUS_LABELS, RESULT_LABELS } from '@/utils/linkedinUtils';
import LinkedInTaskExecutionPanel from './LinkedInTaskExecutionPanel';

const TASK_ICONS = {
  send_connection_request: UserPlus,
  send_linkedin_message:   MessageCircle,
  view_profile:            Eye,
  engage_with_post:        ThumbsUp,
  follow_up_message:       CornerDownRight,
  reply_reminder:          Bell,
  visit_company_page:      Building2,
};

const STATUS_STYLES = {
  pending:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   icon: Clock         },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2  },
  overdue:   { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     icon: AlertTriangle },
  skipped:   { bg: 'bg-slate-50',   text: 'text-slate-500',   border: 'border-slate-200',   icon: SkipForward   },
  snoozed:   { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    icon: Pause         },
};

const PRIORITY_DOT = {
  high:   'bg-red-500',
  normal: 'bg-slate-400',
  low:    'bg-emerald-500',
};

const STATUS_TABS = [
  { key: 'all',       label: 'All'       },
  { key: 'pending',   label: 'Pending'   },
  { key: 'overdue',   label: 'Overdue'   },
  { key: 'completed', label: 'Completed' },
  { key: 'snoozed',   label: 'Snoozed'   },
  { key: 'skipped',   label: 'Skipped'   },
];

export default function LinkedInActivityTracker({ sequenceId }) {
  const [activeTab,     setActiveTab]     = useState('all');
  const [selectedTask,  setSelectedTask]  = useState(null);
  const [showFilters,   setShowFilters]   = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ['linkedin-tasks', sequenceId],
    queryFn: () => sequenceId
      ? base44.entities.LinkedInTask.filter({ sequence_id: sequenceId }, '-due_date')
      : base44.entities.LinkedInTask.list('-due_date', 100),
  });

  // Auto-mark overdue
  const now = new Date();
  const enriched = tasks.map(t => ({
    ...t,
    _isOverdue: t.status === 'pending' && t.due_date && new Date(t.due_date) < now,
  }));

  const filtered = enriched.filter(t => {
    const statusMatch = activeTab === 'all'
      || (activeTab === 'overdue' ? t._isOverdue : t.status === activeTab);
    const priorityMatch = priorityFilter === 'all' || t.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const counts = {
    pending:   enriched.filter(t => t.status === 'pending' && !t._isOverdue).length,
    overdue:   enriched.filter(t => t._isOverdue).length,
    completed: enriched.filter(t => t.status === 'completed').length,
    snoozed:   enriched.filter(t => t.status === 'snoozed').length,
    skipped:   enriched.filter(t => t.status === 'skipped').length,
  };

  const handleTaskUpdate = () => {
    setSelectedTask(null);
    refetch();
  };

  return (
    <>
      <div className="flex flex-col h-full">

        {/* Stat bar */}
        <div className="grid grid-cols-5 gap-3 mb-5">
          {[
            { key: 'pending',   label: 'Pending',   color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200'   },
            { key: 'overdue',   label: 'Overdue',   color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200'     },
            { key: 'completed', label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { key: 'snoozed',   label: 'Snoozed',   color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'    },
            { key: 'skipped',   label: 'Skipped',   color: 'text-slate-500',   bg: 'bg-slate-50',   border: 'border-slate-200'   },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setActiveTab(s.key)}
              className={cn(
                'rounded-xl border p-3 text-left transition-all hover:shadow-sm',
                activeTab === s.key ? `${s.bg} ${s.border}` : 'bg-white border-slate-200 hover:border-slate-300'
              )}
            >
              <p className={cn('text-[22px] font-bold leading-none', s.color)}>{counts[s.key]}</p>
              <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Filter row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all',
                  activeTab === tab.key
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {tab.label}
                {tab.key !== 'all' && counts[tab.key] > 0 && (
                  <span className="ml-1.5 text-[10px] text-slate-400">({counts[tab.key]})</span>
                )}
              </button>
            ))}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-500 hover:bg-slate-50 transition-all"
            >
              <Filter className="w-3 h-3" />
              Priority
              <ChevronDown className={cn('w-3 h-3 transition-transform', showFilters && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl z-10"
                  style={{ minWidth: 130 }}
                >
                  {['all','high','normal','low'].map(p => (
                    <button
                      key={p}
                      onClick={() => { setPriorityFilter(p); setShowFilters(false); }}
                      className={cn(
                        'flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-[12px] transition-colors first:rounded-t-xl last:rounded-b-xl',
                        priorityFilter === p ? 'bg-slate-50 font-semibold text-slate-800' : 'text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {p !== 'all' && <div className={cn('w-2 h-2 rounded-full', PRIORITY_DOT[p])} />}
                      {p === 'all' ? 'All priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-[13px] font-semibold text-slate-600">No LinkedIn steps here</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {activeTab === 'all' ? 'Add LinkedIn steps to your sequence to track them here.' : `No ${activeTab} steps at the moment.`}
              </p>
            </div>
          )}

          <AnimatePresence>
            {filtered.map((task, i) => {
              const Icon        = TASK_ICONS[task.task_type] || MessageCircle;
              const statusStyle = STATUS_STYLES[task._isOverdue ? 'overdue' : task.status] || STATUS_STYLES.pending;
              const StatusIcon  = statusStyle.icon;
              const displayStatus = task._isOverdue ? 'overdue' : task.status;

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: i * 0.03, duration: 0.15 }}
                  onClick={() => setSelectedTask(task)}
                  className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] font-semibold text-slate-800 truncate">
                        {TASK_TYPE_LABELS[task.task_type] || 'LinkedIn Step'}
                      </p>
                      <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', PRIORITY_DOT[task.priority])} title={`${task.priority} priority`} />
                    </div>
                    {task.contact_name && (
                      <p className="text-[11px] text-slate-400 truncate">{task.contact_name}{task.contact_company ? ` · ${task.contact_company}` : ''}</p>
                    )}
                    {task.due_date && (
                      <p className={cn('text-[10px] mt-0.5', task._isOverdue ? 'text-red-500 font-semibold' : 'text-slate-400')}>
                        {task._isOverdue ? 'Overdue · ' : 'Due: '}
                        {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {task.task_result && (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                        {RESULT_LABELS[task.task_result]}
                      </span>
                    )}
                    <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold', statusStyle.bg, statusStyle.text, statusStyle.border)}>
                      <StatusIcon className="w-3 h-3" />
                      {STATUS_LABELS[displayStatus]}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Execution panel */}
      <AnimatePresence>
        {selectedTask && (
          <LinkedInTaskExecutionPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onTaskUpdate={handleTaskUpdate}
          />
        )}
      </AnimatePresence>
    </>
  );
}