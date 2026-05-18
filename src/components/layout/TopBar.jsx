import { Bell, Search, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TopBar({ title, subtitle }) {
  return (
    <header className="flex items-center justify-between px-6 border-b border-slate-200 sticky top-0 z-30 min-h-0" style={{ background: '#f8fafc', height: '40px', minHeight: '40px', maxHeight: '40px' }}>
      <div>
        <h1 className="text-sm font-semibold text-slate-800">{title}</h1>
        {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            placeholder="Search anything..."
            className="pl-7 pr-3 h-6 w-52 text-[11px] rounded-md border border-slate-300 bg-white focus:border-emerald-400 focus:outline-none text-slate-700"
          />
        </div>
        <Button variant="outline" size="sm" className="h-6 px-2 gap-1 text-[11px] border-primary/30 text-primary hover:bg-primary/10">
          <Sparkles className="w-3 h-3" />
          Ask AI
        </Button>
        <button className="relative p-1 rounded-lg hover:bg-white/60 transition-colors">
          <Bell className="w-3.5 h-3.5 text-slate-500" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
        </button>
        <button className="flex items-center gap-1.5 pl-1 pr-1 py-0.5 rounded-lg hover:bg-white/60 transition-colors">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-[10px] font-bold text-emerald-700">JD</span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>
      </div>
    </header>
  );
}