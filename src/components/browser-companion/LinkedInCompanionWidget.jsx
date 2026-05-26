/**
 * RVNU Browser Companion Architecture — Frontend Shell
 *
 * This component prepares the RVNU frontend for future browser-extension integration.
 * It is a PRODUCTIVITY OVERLAY — not automation. Users manually act on every suggestion.
 * No hidden actions, no auto-sending, no scraping.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chrome, Zap, Copy, ExternalLink, CheckCircle2,
  User, Briefcase, MessageCircle, UserPlus, X,
  ChevronDown, Wifi, WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Context Awareness Panel ───────────────────────────────────────────────────
function LinkedInContextPanel({ context, onDismiss }) {
  const [copied, setCopied] = useState(null);

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-blue-200 shadow-lg overflow-hidden" style={{ width: 320 }}>
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="text-[11px] font-bold text-white">RVNU Companion</span>
        </div>
        <button onClick={onDismiss} className="text-white/60 hover:text-white transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Prospect info */}
        {context?.name && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-slate-800 truncate">{context.name}</p>
              {context.title && <p className="text-[10px] text-slate-400 truncate">{context.title}</p>}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick Actions</p>
          {[
            { icon: Copy,        label: 'Copy profile URL',    action: () => copy(context?.profileUrl || '', 'url'),     active: !!context?.profileUrl },
            { icon: MessageCircle, label: 'Copy saved message', action: () => copy(context?.savedMessage || '', 'msg'), active: !!context?.savedMessage },
            { icon: UserPlus,    label: 'Log connection sent',  action: () => context?.onLogConnection?.(),              active: true },
            { icon: CheckCircle2,label: 'Mark step complete',   action: () => context?.onMarkComplete?.(),               active: true },
          ].filter(a => a.active).map((action, i) => {
            const Icon = action.icon;
            const isCopied = (i === 0 && copied === 'url') || (i === 1 && copied === 'msg');
            return (
              <button
                key={i}
                onClick={action.action}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <Icon className={cn('w-3.5 h-3.5 transition-colors', isCopied ? 'text-emerald-500' : 'text-slate-400 group-hover:text-blue-500')} />
                <span className={cn('text-[12px] font-medium transition-colors', isCopied ? 'text-emerald-600' : 'text-slate-600 group-hover:text-slate-800')}>
                  {isCopied ? 'Copied!' : action.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sequence context */}
        {context?.sequenceName && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] text-slate-400">Active sequence</p>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{context.sequenceName}</p>
            {context?.stepLabel && (
              <p className="text-[10px] text-slate-400 mt-0.5">Current step: {context.stepLabel}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Companion Status Bar ──────────────────────────────────────────────────────
export function CompanionStatusBar({ connected = false, onConnect }) {
  return (
    <div className={cn(
      'flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-[11px] font-semibold transition-all',
      connected
        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
        : 'bg-slate-50 border-slate-200 text-slate-500'
    )}>
      <Chrome className="w-3.5 h-3.5" />
      {connected ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Browser companion connected</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Browser companion not connected</span>
          <button
            onClick={onConnect}
            className="ml-auto text-[10px] font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
          >
            Learn more
          </button>
        </>
      )}
    </div>
  );
}

// ── Floating Trigger Button ───────────────────────────────────────────────────
export function CompanionTrigger({ context, className }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-semibold transition-all shadow-sm',
          open
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
        )}
      >
        <Chrome className="w-3.5 h-3.5" />
        Companion
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 z-50"
          >
            <LinkedInContextPanel
              context={context || {}}
              onDismiss={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LinkedInContextPanel;