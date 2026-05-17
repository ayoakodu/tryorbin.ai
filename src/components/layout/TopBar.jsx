import { Bell, Search, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TopBar({ title, subtitle }) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-gray-200 sticky top-0 z-30" style={{ background: '#e8edf2' }}>
      <div>
        <h1 className="text-base font-semibold text-slate-800">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="pl-9 h-8 w-64 text-sm bg-white border-gray-300 focus:border-emerald-400 text-slate-700"
          />
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/10">
          <Sparkles className="w-3.5 h-3.5" />
          Ask AI
        </Button>
        <button className="relative p-2 rounded-lg hover:bg-white/60 transition-colors">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full"></span>
        </button>
        <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-white/60 transition-colors">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-xs font-bold text-emerald-700">JD</span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>
      </div>
    </header>
  );
}