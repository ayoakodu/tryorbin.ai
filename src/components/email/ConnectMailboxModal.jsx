import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle2, Loader2, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PROVIDERS = [
  {
    id: 'gmail',
    name: 'Gmail',
    subtitle: 'Google Workspace or personal Gmail',
    color: 'border-red-200 hover:border-red-300 hover:bg-red-50/40',
    activeColor: 'border-red-400 bg-red-50',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3a11.934 11.934 0 0 0-7.91-3C6.55 0 2.18 3.337.005 7.91l5.261 1.855z"/>
        <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-5.25 1.932C2.16 20.54 6.556 24 12 24c3.059 0 5.845-1.025 7.971-2.972l-3.93-3.015z"/>
        <path fill="#FBBC05" d="M19.971 21.028A11.963 11.963 0 0 0 24 12c0-.698-.063-1.381-.182-2.044H12v4.051h6.845c-.298 1.498-1.132 2.77-2.38 3.635l3.506 3.386z"/>
        <path fill="#EA4335" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L.01 7.91A11.943 11.943 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/>
      </svg>
    ),
    steps: ['Sign in with your Google account', 'Grant RVNU read & send access', 'Choose mailbox to connect'],
  },
  {
    id: 'outlook',
    name: 'Outlook / Microsoft 365',
    subtitle: 'Office 365 or Outlook.com',
    color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50/40',
    activeColor: 'border-blue-400 bg-blue-50',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path fill="#0078D4" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2v-4h2v-2h-2v-2h2v-2h-2V8h2V6h-2V4a2 2 0 00-2-2z"/>
        <path fill="white" d="M10 7.5c-1.93 0-3.5 1.57-3.5 3.5S8.07 14.5 10 14.5s3.5-1.57 3.5-3.5S11.93 7.5 10 7.5zm0 5c-.828 0-1.5-.672-1.5-1.5S9.172 9.5 10 9.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5z"/>
      </svg>
    ),
    steps: ['Sign in with your Microsoft account', 'Grant RVNU mailbox permissions', 'Select folders to sync'],
  },
  {
    id: 'smtp',
    name: 'Custom SMTP',
    subtitle: 'Any email provider via SMTP',
    color: 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40',
    activeColor: 'border-slate-400 bg-slate-50',
    logo: <Mail className="w-6 h-6 text-slate-500" />,
    steps: ['Enter SMTP host and credentials', 'Verify connection', 'Configure send settings'],
  },
];

const SECURITY_NOTES = [
  'RVNU uses OAuth 2.0 — we never store your password',
  'You can revoke access at any time from your account settings',
  'Emails are encrypted in transit and at rest',
];

export default function ConnectMailboxModal({ onClose, onConnect }) {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState('select'); // select | auth | success
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!selected) return;
    setStep('auth');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 2200);
  };

  const handleDone = () => {
    onConnect?.(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Connect a Mailbox</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Choose your email provider to get started</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">

            {/* Step: Select provider */}
            {step === 'select' && (
              <motion.div key="select" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="space-y-3 mb-6">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelected(p.id)}
                      className={cn('w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left', selected === p.id ? p.activeColor : p.color)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                        {p.logo}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <p className="text-[11px] text-slate-500">{p.subtitle}</p>
                      </div>
                      {selected === p.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    </button>
                  ))}
                </div>

                {/* Security notes */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
                  <div className="flex items-center gap-2 mb-2.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Security</p>
                  </div>
                  <div className="space-y-1.5">
                    {SECURITY_NOTES.map((note, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                        <p className="text-[11px] text-slate-600">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleContinue} disabled={!selected} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            )}

            {/* Step: Auth loading */}
            {step === 'auth' && (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1">Connecting your mailbox…</p>
                <p className="text-[12px] text-slate-500">Establishing secure OAuth connection</p>
                <div className="flex items-center justify-center gap-1.5 mt-5">
                  {['Authenticating', 'Verifying access', 'Syncing folders'].map((s, i) => (
                    <span key={s} className="flex items-center gap-1 text-[11px] text-slate-400">
                      {i > 0 && <span className="text-slate-300">·</span>}
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step: Success */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-slate-800 mb-1">Mailbox Connected!</p>
                <p className="text-[12px] text-slate-500 mb-6">Your inbox is now syncing with RVNU</p>
                {PROVIDERS.find(p => p.id === selected)?.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-4 py-2 text-left">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <p className="text-[12px] text-slate-700">{s}</p>
                  </div>
                ))}
                <Button onClick={handleDone} className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                  Done
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}