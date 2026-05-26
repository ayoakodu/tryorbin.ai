import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, RefreshCw, Unlink, AlertTriangle, CheckCircle2, Clock, Loader2, Wifi, WifiOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STATE_CONFIG = {
  connected:     { label: 'Connected',       color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
  connecting:    { label: 'Connecting...',   color: 'text-blue-600',    bg: 'bg-blue-50',     border: 'border-blue-200',    dot: 'bg-blue-400 animate-pulse', icon: Loader2 },
  disconnected:  { label: 'Disconnected',    color: 'text-slate-500',   bg: 'bg-slate-50',    border: 'border-slate-200',   dot: 'bg-slate-400', icon: WifiOff },
  expired:       { label: 'Session Expired', color: 'text-amber-600',   bg: 'bg-amber-50',    border: 'border-amber-200',   dot: 'bg-amber-500', icon: Clock },
  sync_error:    { label: 'Sync Error',      color: 'text-red-600',     bg: 'bg-red-50',      border: 'border-red-200',     dot: 'bg-red-500',   icon: AlertTriangle },
  reconnecting:  { label: 'Reconnecting...', color: 'text-violet-600',  bg: 'bg-violet-50',   border: 'border-violet-200',  dot: 'bg-violet-400 animate-pulse', icon: RotateCcw },
};

const PROVIDER_CONFIG = {
  gmail: {
    name: 'Gmail',
    logo: (
      <svg viewBox="0 0 48 48" className="w-5 h-5">
        <path fill="#EA4335" d="M24 5.457l-4.39 4.39L24 14.24l4.39-4.39z"/>
        <path fill="#4285F4" d="M5.457 24l4.39 4.39L14.24 24l-4.39-4.39z"/>
        <path fill="#34A853" d="M42.543 24l-4.39-4.39L33.76 24l4.39 4.39z"/>
        <path fill="#FBBC05" d="M24 42.543l4.39-4.39L24 33.76l-4.39 4.39z"/>
        <path fill="#EA4335" d="M5.457 24L24 5.457 42.543 24 24 42.543z" opacity=".1"/>
        <path fill="#4285F4" d="M5.457 24L24 5.457v37.086z" opacity=".2"/>
        <path fill="#34A853" d="M24 42.543L42.543 24H5.457z" opacity=".2"/>
        <path fill="#FBBC05" d="M42.543 24L24 5.457H5.457z" opacity=".1"/>
        <circle cx="24" cy="24" r="10" fill="white"/>
        <path fill="#EA4335" d="M7.955 14.545L24 24l16.045-9.455A19.928 19.928 0 0024 4 19.928 19.928 0 007.955 14.545z"/>
        <path fill="#34A853" d="M24 44c5.395 0 10.27-2.11 13.89-5.545L24 24z"/>
        <path fill="#4285F4" d="M10.11 38.455A19.928 19.928 0 0024 44V24z"/>
        <path fill="#FBBC05" d="M44 24c0-1.09-.09-2.165-.27-3.21L24 24z"/>
      </svg>
    ),
  },
  outlook: {
    name: 'Outlook',
    logo: (
      <svg viewBox="0 0 48 48" className="w-5 h-5">
        <path fill="#0072C6" d="M28 8h16v32H28z"/>
        <path fill="#0078D4" d="M4 12h24v24H4z"/>
        <path fill="white" d="M16 17c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 13c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"/>
        <path fill="white" d="M28 20h8v3h-8zM28 25h8v3h-8zM28 30h8v3h-8z"/>
      </svg>
    ),
  },
};

export default function MailboxConnectionCard({ mailbox, onReconnect, onDisconnect, onConnect }) {
  const [showActions, setShowActions] = useState(false);
  const state = STATE_CONFIG[mailbox.state] || STATE_CONFIG.disconnected;
  const provider = PROVIDER_CONFIG[mailbox.provider] || PROVIDER_CONFIG.gmail;
  const StateIcon = state.icon;

  return (
    <motion.div
      layout
      className={cn('rounded-xl border p-4 transition-all', state.border, state.bg)}
    >
      <div className="flex items-start gap-3">
        {/* Provider logo */}
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
          {provider.logo}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-slate-800 truncate">{mailbox.email}</p>
          </div>
          <p className="text-[11px] text-slate-500">{provider.name} · {mailbox.label || 'Primary Mailbox'}</p>
          {mailbox.lastSync && (
            <p className="text-[10px] text-slate-400 mt-0.5">Last sync {mailbox.lastSync}</p>
          )}
          {mailbox.state === 'sync_error' && mailbox.errorMessage && (
            <p className="text-[10px] text-red-600 mt-1 font-medium">{mailbox.errorMessage}</p>
          )}
        </div>

        {/* Status + actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-semibold', state.color, 'bg-white/80 border-current/20')}>
            <div className={cn('w-1.5 h-1.5 rounded-full', state.dot)} />
            {state.label}
          </div>

          {/* Action buttons */}
          {mailbox.state === 'connected' && (
            <div className="flex gap-1">
              <button onClick={onReconnect} className="p-1.5 rounded-lg hover:bg-white/80 text-slate-400 hover:text-slate-600 transition-colors" title="Re-sync">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button onClick={onDisconnect} className="p-1.5 rounded-lg hover:bg-white/80 text-slate-400 hover:text-red-500 transition-colors" title="Disconnect">
                <Unlink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {(mailbox.state === 'expired' || mailbox.state === 'sync_error') && (
            <Button size="sm" className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onReconnect}>
              Reconnect
            </Button>
          )}
          {(mailbox.state === 'disconnected') && (
            <Button size="sm" className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onConnect}>
              Connect
            </Button>
          )}
          {(mailbox.state === 'connecting' || mailbox.state === 'reconnecting') && (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          )}
        </div>
      </div>

      {/* Stats row for connected mailboxes */}
      {mailbox.state === 'connected' && mailbox.stats && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/60">
          {Object.entries(mailbox.stats).map(([k, v]) => (
            <div key={k} className="text-center">
              <p className="text-[13px] font-bold text-slate-800">{v}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wide">{k}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}