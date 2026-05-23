import { Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SequenceEmptyState({ onCreateAI, onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Illustration */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-100 flex items-center justify-center mb-5 shadow-sm">
        <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
          <rect x="4" y="10" width="10" height="10" rx="3" fill="#d1fae5" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="19" y="10" width="10" height="10" rx="3" fill="#cffafe" stroke="#22d3ee" strokeWidth="1.5"/>
          <rect x="34" y="10" width="10" height="10" rx="3" fill="#ede9fe" stroke="#a78bfa" strokeWidth="1.5"/>
          <line x1="14" y1="15" x2="19" y2="15" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2"/>
          <line x1="29" y1="15" x2="34" y2="15" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2"/>
          <rect x="4" y="28" width="10" height="10" rx="3" fill="#d1fae5" stroke="#34d399" strokeWidth="1.5"/>
          <rect x="19" y="28" width="10" height="10" rx="3" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1.5"/>
          <line x1="14" y1="33" x2="19" y2="33" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2"/>
          <circle cx="39" cy="33" r="6" fill="#ecfdf5" stroke="#34d399" strokeWidth="1.5"/>
          <line x1="39" y1="30" x2="39" y2="36" stroke="#34d399" strokeWidth="1.5"/>
          <line x1="36" y1="33" x2="42" y2="33" stroke="#34d399" strokeWidth="1.5"/>
        </svg>
      </div>

      <h2 className="text-sm font-bold text-slate-800 mb-1.5">Create your first sequence</h2>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-6">
        Build custom multi-step campaigns to automate emails, book more meetings, and convert more customers.
      </p>

      <div className="flex items-center gap-2.5">
        <Button
          onClick={onCreateAI}
          className="gap-1.5 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white px-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Create a sequence with AI
        </Button>
        <Button
          onClick={onCreate}
          variant="outline"
          className="gap-1.5 text-xs h-8 px-4"
        >
          <Plus className="w-3.5 h-3.5" />
          Create sequence
        </Button>
      </div>

      {/* Resource links */}
      <div className="mt-8 flex items-center gap-1 text-[11px] text-slate-400">
        <span>More sequence resources</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16"><path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
}