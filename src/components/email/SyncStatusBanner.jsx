import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, WifiOff, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SYNC_STATES = {
  syncing:     { icon: Loader2, spin: true,  color: 'bg-blue-50 border-blue-200 text-blue-700',      label: 'Syncing inbox…',          action: null },
  synced:      { icon: CheckCircle2,         color: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Inbox up to date',    action: null, autoDismiss: 4000 },
  reconnecting:{ icon: Loader2, spin: true,  color: 'bg-violet-50 border-violet-200 text-violet-700', label: 'Reconnecting…',           action: null },
  failed:      { icon: WifiOff,             color: 'bg-red-50 border-red-200 text-red-700',           label: 'Sync failed',             action: 'Retry' },
  pending:     { icon: AlertTriangle,       color: 'bg-amber-50 border-amber-200 text-amber-700',     label: 'Sync pending',            action: 'Sync now' },
  disconnected:{ icon: WifiOff,            color: 'bg-slate-50 border-slate-200 text-slate-600',      label: 'Mailbox disconnected',    action: 'Reconnect' },
};

export default function SyncStatusBanner({ state = 'synced', onAction, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  const cfg = SYNC_STATES[state] || SYNC_STATES.synced;
  const Icon = cfg.icon;

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className={cn('flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium', cfg.color)}
      >
        <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', cfg.spin && 'animate-spin')} />
        <span className="flex-1">{cfg.label}</span>
        {cfg.action && (
          <button
            onClick={onAction}
            className="flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            <RefreshCw className="w-3 h-3" /> {cfg.action}
          </button>
        )}
        {onDismiss && (
          <button onClick={() => { setDismissed(true); onDismiss?.(); }} className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}