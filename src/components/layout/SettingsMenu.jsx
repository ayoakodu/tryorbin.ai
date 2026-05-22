import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Settings, Users, ShieldCheck, Globe, Lock, LogOut, ChevronRight, LayoutGrid, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ONBOARDING_TOTAL = 9;
const ONBOARDING_DONE = 1; // Connect Mailbox completed

const menuItems = [
  { icon: Users,        label: 'Users & Teams',      path: '/settings' },
  { icon: ShieldCheck,  label: 'Roles & Permissions', path: '/settings' },
  { icon: Globe,        label: 'Integrations',        path: '/integrations' },
  { icon: Lock,         label: 'Security',            path: '/settings' },
  { icon: CreditCard,   label: 'Plan Overview',       path: '/settings' },
  { icon: LayoutGrid,   label: 'All Settings',        path: '/settings' },
];

export default function SettingsMenu({ collapsed }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const pct = Math.round((ONBOARDING_DONE / ONBOARDING_TOTAL) * 100);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        title={collapsed ? 'Settings' : undefined}
        className={cn(
          'w-full flex items-center gap-3 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all py-2',
          collapsed ? 'justify-center px-0' : 'px-3',
          open && 'bg-white/60 text-slate-900'
        )}
      >
        <Settings className="w-4 h-4 text-slate-500 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">Settings</span>
            <ChevronRight className={cn('w-3 h-3 text-slate-400 transition-transform duration-200', open && 'rotate-90')} />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-full bottom-0 ml-2 w-52 rounded-xl border border-slate-200 bg-white shadow-xl z-50 py-1.5 overflow-hidden"
          >
            {/* Header: Workspace Overview */}
            <div className="px-3 pt-2 pb-2.5 border-b border-slate-100 mb-1">
              <p className="text-[10px] font-semibold text-slate-700 mb-1.5">Workspace Overview</p>
              <div className="w-full bg-slate-100 rounded-full h-1 mb-1">
                <div
                  className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">{pct}% setup complete</p>
            </div>

            {menuItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={label}
                to={path}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {label}
              </Link>
            ))}

            <div className="h-px bg-slate-100 my-1 mx-2" />

            <button
              onClick={() => { setOpen(false); base44.auth.logout(); }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}