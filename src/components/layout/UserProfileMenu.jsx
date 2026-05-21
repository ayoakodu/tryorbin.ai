import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  User, Bell, Settings, Palette, Zap, CreditCard, LogOut,
  Keyboard, UserPlus, ChevronDown
} from 'lucide-react';

const menuItems = [
  { icon: User, label: 'My Profile', path: '/settings' },
  { icon: Bell, label: 'Notifications', path: '/settings' },
  { divider: true },
  { icon: Settings, label: 'Workspace Settings', path: '/settings' },
  { icon: Palette, label: 'Appearance', path: '/settings' },
  { divider: true },
  { icon: Zap, label: 'AI Usage & Credits', path: '/settings' },
  { icon: CreditCard, label: 'Billing & Plan', path: '/settings' },
  { divider: true },
  { icon: UserPlus, label: 'Invite Teammates', path: '/collaboration' },
  { icon: Keyboard, label: 'Keyboard Shortcuts', action: 'shortcuts' },
  { divider: true },
  { icon: LogOut, label: 'Logout', action: 'logout', danger: true },
];

export default function UserProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAction = async (item) => {
    setOpen(false);
    if (item.action === 'logout') {
      base44.auth.logout();
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 pl-1 pr-1 py-0.5 rounded-lg hover:bg-white/60 transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <span className="text-[10px] font-bold text-emerald-700">JD</span>
        </div>
        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-xl z-50 py-1.5 overflow-hidden"
          >
            {/* User info header */}
            <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-emerald-700">JD</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">John Doe</p>
                  <p className="text-[10px] text-slate-500 truncate">john@company.com</p>
                </div>
              </div>
            </div>

            {menuItems.map((item, i) => {
              if (item.divider) return <div key={i} className="h-px bg-slate-100 my-1 mx-2" />;

              const Icon = item.icon;
              const inner = (
                <div className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors cursor-pointer
                  ${item.danger
                    ? 'text-red-500 hover:bg-red-50'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${item.danger ? 'text-red-400' : 'text-slate-400'}`} />
                  {item.label}
                </div>
              );

              if (item.path && !item.action) {
                return <Link key={i} to={item.path} onClick={() => setOpen(false)}>{inner}</Link>;
              }
              return <div key={i} onClick={() => handleAction(item)}>{inner}</div>;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}