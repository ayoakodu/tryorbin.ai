import { useState } from 'react';
import { Ban, Search, Plus, Trash2, ShieldCheck, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SUPPRESSED = [
  { email: 'do-not-contact@corp.io',  reason: 'Manual suppression',   date: '2d ago',    source: 'Manual' },
  { email: 'unsubscribed@mail.co',    reason: 'Unsubscribe link click',date: '5d ago',    source: 'Sequence' },
  { email: 'spam@domain.ng',          reason: 'Hard bounce',           date: '1w ago',    source: 'Bounce' },
  { email: 'opt-out@company.com',     reason: 'GDPR request',          date: '2w ago',    source: 'Compliance' },
  { email: 'noreply@blocked.io',      reason: 'Spam report',           date: '3w ago',    source: 'Complaint' },
];

const SOURCE_COLORS = {
  Manual: 'bg-slate-100 text-slate-600',
  Sequence: 'bg-blue-100 text-blue-700',
  Bounce: 'bg-red-100 text-red-600',
  Compliance: 'bg-violet-100 text-violet-700',
  Complaint: 'bg-amber-100 text-amber-700',
};

export default function UnsubscribeManager() {
  const [search, setSearch] = useState('');
  const [list, setList] = useState(SUPPRESSED);
  const [newEmail, setNewEmail] = useState('');

  const visible = list.filter(s => s.email.includes(search) || s.reason.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!newEmail.trim()) return;
    setList(prev => [{ email: newEmail.trim(), reason: 'Manual suppression', date: 'Just now', source: 'Manual' }, ...prev]);
    setNewEmail('');
  };

  const handleRemove = (email) => setList(prev => prev.filter(s => s.email !== email));

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Suppressed', value: list.length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Unsubscribed',     value: 2, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Compliance Blocks',value: 1, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map(s => (
          <div key={s.label} className={cn('rounded-xl border border-slate-200 p-4 flex items-center gap-3', s.bg)}>
            <Ban className={cn('w-5 h-5', s.color)} />
            <div>
              <p className={cn('text-lg font-bold', s.color)}>{s.value}</p>
              <p className="text-[11px] text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add + search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input placeholder="Search suppression list…" className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Input placeholder="Add email to suppress…" className="h-8 text-xs w-56" value={newEmail} onChange={e => setNewEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <Button size="sm" onClick={handleAdd} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Compliance notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-semibold text-blue-800 mb-0.5">Suppression List Compliance</p>
          <p className="text-[11px] text-blue-700 leading-relaxed">All emails on this list are excluded from outreach across all sequences and campaigns. Hard bounces and GDPR requests are added automatically.</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wide text-[10px]">
              <th className="px-4 py-2.5 text-left font-semibold">Email</th>
              <th className="px-4 py-2.5 text-left font-semibold">Reason</th>
              <th className="px-4 py-2.5 text-left font-semibold">Source</th>
              <th className="px-4 py-2.5 text-left font-semibold">Date</th>
              <th className="px-4 py-2.5 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((s) => (
              <tr key={s.email} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-slate-800">{s.email}</td>
                <td className="px-4 py-3 text-slate-500">{s.reason}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', SOURCE_COLORS[s.source] || 'bg-slate-100 text-slate-600')}>{s.source}</span>
                </td>
                <td className="px-4 py-3 text-slate-400">{s.date}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleRemove(s.email)} className="text-[11px] text-red-500 hover:text-red-700 font-semibold flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No suppressed emails found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}