import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  User, Bell, Palette, Zap, CreditCard, LogOut, ChevronDown,
  ChevronRight, Sun, Moon, Monitor, LayoutDashboard
} from 'lucide-react';

function useTheme() {
  const [theme, setThemeState] = useState(() => localStorage.getItem('rvnu-theme') || 'system');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (t) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else if (t === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  };

  const setTheme = (t) => {
    localStorage.setItem('rvnu-theme', t);
    setThemeState(t);
  };

  return { theme, setTheme };
}

export default function UserProfileMenu() {
  const [open, setOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const ref = useRef(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    base44.auth.logout();
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

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
            className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl z-50 py-1.5 overflow-hidden"
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

            {/* My Profile */}
            <Link to="/settings" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
              <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              My Profile
            </Link>

            {/* Activity & Notifications */}
            <Link to="/settings" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
              <Bell className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              Activity & Notifications
            </Link>

            {/* Appearance / Theme submenu */}
            <div className="relative"
              onMouseEnter={() => setThemeOpen(true)}
              onMouseLeave={() => setThemeOpen(false)}
            >
              <div className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors cursor-pointer
                ${themeOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}>
                <Palette className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="flex-1">Appearance</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </div>

              <AnimatePresence>
                {themeOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -6, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -6, scale: 0.97 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="absolute right-full top-0 mr-1.5 w-36 rounded-xl border border-slate-200 bg-white shadow-xl z-50 py-1.5 overflow-hidden"
                  >
                    {themeOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => { setTheme(value); setThemeOpen(false); setOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors
                          ${theme === value ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${theme === value ? 'text-emerald-600' : 'text-slate-400'}`} />
                        {label}
                        {theme === value && <span className="ml-auto text-emerald-600">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-px bg-slate-100 my-1 mx-2" />

            {/* AI Usage & Credits */}
            <Link to="/settings" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
              <Zap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              AI Usage & Credits
            </Link>

            {/* Billing & Plan */}
            <Link to="/settings" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
              <CreditCard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              Billing & Plan
            </Link>

            {/* Workspace Overview */}
            <Link to="/settings" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              Workspace Overview
            </Link>

            <div className="h-px bg-slate-100 my-1 mx-2" />

            {/* Logout */}
            <div onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
              <LogOut className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              Logout
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}