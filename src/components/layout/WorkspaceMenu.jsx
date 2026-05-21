import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Shield, LayoutDashboard, ShieldCheck, Mail, Globe,
  CreditCard, Key, Lock, FileText, HelpCircle, MessageSquare,
  ChevronUp, Building2
} from 'lucide-react';

const sections = [
  {
    label: 'Workspace',
    items: [
      { icon: Users, label: 'Team Members', path: '/collaboration' },
      { icon: Shield, label: 'Roles & Permissions', path: '/settings' },
      { icon: LayoutDashboard, label: 'Workspace Overview', path: '/dashboard' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { icon: ShieldCheck, label: 'Deliverability', path: '/deliverability' },
      { icon: Mail, label: 'Connected Mailboxes', path: '/deliverability' },
      { icon: Globe, label: 'Integrations', path: '/integrations' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { icon: CreditCard, label: 'Billing & Usage', path: '/settings' },
      { icon: Key, label: 'API Keys', path: '/settings', badge: 'Soon' },
      { icon: Lock, label: 'Security', path: '/settings' },
      { icon: FileText, label: 'Audit Logs', path: '/settings', badge: 'Soon' },
    ],
  },
  {
    label: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', action: 'help' },
      { icon: MessageSquare, label: 'Contact Support', action: 'support' },
    ],
  },
];

export default function WorkspaceMenu({ collapsed }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        title={collapsed ? 'Workspace' : undefined}
        className={`w-full flex items-center rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all py-2 gap-3
          ${collapsed ? 'justify-center px-0' : 'px-3'}`}
      >
        <Building2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
        {!collapsed && (
          <>
            <span>Workspace</span>
            <ChevronUp className={`w-3 h-3 ml-auto text-slate-400 transition-transform duration-200 ${open ? '' : 'rotate-180'}`} />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 bottom-full mb-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl z-50 py-1.5 overflow-hidden"
            style={{ maxHeight: '70vh', overflowY: 'auto' }}
          >
            {sections.map((section, si) => (
              <div key={si}>
                {si > 0 && <div className="h-px bg-slate-100 my-1 mx-2" />}
                <p className="px-3 pt-2 pb-1 text-[9px] font-semibold tracking-widest text-slate-400 uppercase">
                  {section.label}
                </p>
                {section.items.map((item, ii) => {
                  const Icon = item.icon;
                  const inner = (
                    <div className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                      <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );

                  if (item.path) {
                    return <Link key={ii} to={item.path} onClick={() => setOpen(false)}>{inner}</Link>;
                  }
                  return <div key={ii} onClick={() => setOpen(false)}>{inner}</div>;
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}