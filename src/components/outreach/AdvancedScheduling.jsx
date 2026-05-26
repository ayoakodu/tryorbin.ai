import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Settings2, Clock, CalendarDays, Timer, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const SCHEDULE_MODES = [
  { value: 'immediate', label: 'Send immediately' },
  { value: 'delay',     label: 'Add delay' },
  { value: 'time',      label: 'Send at specific time' },
  { value: 'datetime',  label: 'Send at specific date & time' },
];

const DELAY_UNITS = [
  { value: 'minutes', label: 'minutes' },
  { value: 'hours',   label: 'hours' },
  { value: 'days',    label: 'days' },
];

const SEND_UNTIL_OPTIONS = [
  { value: 'none',        label: 'No limit' },
  { value: '2h',          label: 'For next 2 hours' },
  { value: '4h',          label: 'For next 4 hours' },
  { value: '8h',          label: 'For next 8 hours' },
  { value: 'end_of_day',  label: 'Until end of day' },
  { value: 'all',         label: 'Until all are dispatched' },
];

// ─── DYNAMIC SUMMARY ──────────────────────────────────────────────────────────
function buildSummary(adv, day) {
  const mode = adv?.scheduleMode || 'immediate';

  if (mode === 'immediate') {
    return day === 1
      ? 'This step will execute immediately after a prospect is enrolled.'
      : `This step will execute on Day ${day} of the sequence.`;
  }

  if (mode === 'delay') {
    const amt  = adv.delayAmount || 1;
    const unit = adv.delayUnit   || 'hours';
    return `This step will be sent after a delay of ${amt} ${unit}.`;
  }

  if (mode === 'time') {
    const t = adv.sendTime || '';
    if (!t) return 'This step will be sent at the specified time each day.';
    const [h, m] = t.split(':');
    const d = new Date(); d.setHours(+h, +m);
    const formatted = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `This step will be sent at ${formatted} on Day ${day}.`;
  }

  if (mode === 'datetime') {
    const date = adv.sendDate || '';
    const time = adv.sendTime || '';
    if (!date && !time) return 'This step will be sent at the specified date and time.';
    const parts = [];
    if (date) parts.push(new Date(date + 'T00:00').toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
    if (time) {
      const [h, m] = time.split(':');
      const d = new Date(); d.setHours(+h, +m);
      parts.push('at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    return `This step will be sent on ${parts.join(' ')}.`;
  }

  return '';
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function AdvancedScheduling({ day, draft, onDraftChange }) {
  const [open, setOpen] = useState(false);

  const adv = draft.advanced || {};
  const mode = adv.scheduleMode || 'immediate';

  const setAdv = (patch) =>
    onDraftChange(d => ({ ...d, advanced: { ...(d.advanced || {}), ...patch } }));

  const summary = buildSummary(adv, day);

  return (
    <div className="border-t border-slate-100 bg-white">

      {/* Day row + helper text */}
      <div className="flex items-start gap-2 ml-auto px-3 py-2 border-l border-slate-100 w-fit">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Day</span>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                onMouseDown={e => { e.preventDefault(); onDraftChange(d => ({ ...d, day: Math.max(1, (d.day ?? 1) - 1) })); }}
                className="px-2 py-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors text-sm font-bold leading-none">−</button>
              <input
                type="number" min={1}
                value={day ?? 1}
                onChange={e => onDraftChange(d => ({ ...d, day: Math.max(1, parseInt(e.target.value) || 1) }))}
                className="w-10 text-[12px] text-center font-semibold text-slate-700 bg-transparent outline-none border-x border-slate-200 py-1 tabular-nums"
                style={{ MozAppearance: 'textfield' }} />
              <button
                onMouseDown={e => { e.preventDefault(); onDraftChange(d => ({ ...d, day: (d.day ?? 1) + 1 })); }}
                className="px-2 py-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors text-sm font-bold leading-none">+</button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight pl-0.5 flex items-center gap-1">
            <Info className="w-2.5 h-2.5 flex-shrink-0" />
            Day 1 = sequence start. Steps fire when a prospect is enrolled on that day.
          </p>
        </div>
      </div>

      {/* Advanced Settings toggle */}
      <div className="px-3 pb-1.5">
        <button
          onClick={() => setOpen(v => !v)}
          className={cn(
            'flex items-center gap-1.5 text-[10px] font-semibold transition-colors rounded-md px-2 py-1',
            open
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          )}
        >
          <Settings2 className="w-3 h-3" />
          Advanced Settings
          <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', open && 'rotate-180')} />
        </button>
      </div>

      {/* Expanded panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="adv"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t border-slate-100 pt-3 bg-slate-50/40">

              {/* Schedule mode */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Timing</span>
                </div>
                <select
                  value={mode}
                  onChange={e => setAdv({ scheduleMode: e.target.value })}
                  className="flex-1 text-[11px] font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                >
                  {SCHEDULE_MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>

              {/* Delay inputs */}
              <AnimatePresence initial={false}>
                {mode === 'delay' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 pl-5">
                      <input
                        type="number" min={1}
                        value={adv.delayAmount || 1}
                        onChange={e => setAdv({ delayAmount: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-16 text-[12px] text-center font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 outline-none focus:border-emerald-400 transition-colors"
                        style={{ MozAppearance: 'textfield' }}
                      />
                      <select
                        value={adv.delayUnit || 'hours'}
                        onChange={e => setAdv({ delayUnit: e.target.value })}
                        className="text-[11px] font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                      >
                        {DELAY_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                      <span className="text-[10px] text-slate-400">after enrollment</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Time picker */}
              <AnimatePresence initial={false}>
                {(mode === 'time' || mode === 'datetime') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-3 pl-5 flex-wrap">
                      {mode === 'datetime' && (
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <input
                            type="date"
                            value={adv.sendDate || ''}
                            onChange={e => setAdv({ sendDate: e.target.value })}
                            className="text-[11px] font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Timer className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <input
                          type="time"
                          value={adv.sendTime || ''}
                          onChange={e => setAdv({ sendTime: e.target.value })}
                          className="text-[11px] font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Send Until */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Send Until</span>
                </div>
                <select
                  value={adv.sendUntil || 'none'}
                  onChange={e => setAdv({ sendUntil: e.target.value })}
                  className="flex-1 text-[11px] font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                >
                  {SEND_UNTIL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Dynamic summary */}
              <div className="flex items-start gap-2 bg-emerald-50/60 border border-emerald-100 rounded-lg px-3 py-2">
                <Info className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-800 leading-snug">{summary}</p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}