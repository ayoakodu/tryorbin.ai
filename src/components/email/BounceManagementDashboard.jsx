import { useState } from 'react';
import { AlertTriangle, XCircle, RefreshCw, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BOUNCE_TYPES = {
  hard: { label: 'Hard Bounce', color: 'bg-red-100 text-red-700', desc: 'Permanent delivery failure' },
  soft: { label: 'Soft Bounce', color: 'bg-amber-100 text-amber-700', desc: 'Temporary delivery issue' },
  failed: { label: 'Failed', color: 'bg-slate-100 text-slate-600', desc: 'Could not deliver' },
};

const BOUNCES = [
  { email: 'amara@badomain.io',     type: 'hard',   reason: 'User does not exist',              date: '2h ago',    campaign: 'Fintech Q2' },
  { email: 'kemi@yoco.com',         type: 'soft',   reason: 'Mailbox full',                     date: '5h ago',    campaign: 'West Africa' },
  { email: 'tunde@expired.co',      type: 'hard',   reason: 'Domain does not exist',            date: 'Yesterday', campaign: 'Enterprise Re-Engage' },
  { email: 'nadia@cellulant.io',    type: 'failed', reason: 'Connection timeout',               date: 'Yesterday', campaign: 'Warm Lead' },
  { email: 'chioma@opay.ng',        type: 'soft',   reason: 'Server temporarily unavailable',   date: '2d ago',    campaign: 'Fintech Q2' },
  { email: 'ade@nomail.xyz',        type: 'hard',   reason: 'Invalid email address',            date: '3d ago',    campaign: 'Cold ICP' },
  { email: 'femi@slowserver.io',    type: 'soft',   reason: 'Deferred — retry in 24h',          date: '3d ago',    campaign: 'Cold ICP' },
];

const STATS = [
  { label: 'Hard Bounces', value: 3, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
  { label: 'Soft Bounces', value: 3, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: RefreshCw },
  { label: 'Failed Deliveries', value: 1, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', icon: AlertTriangle },
];

export default function BounceManagementDashboard() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const visible = BOUNCES.filter(b =>
    (filter === 'all' || b.type === filter) &&
    (b.email.includes(search) || b.campaign.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className={cn('rounded-xl border p-4 flex items-center gap-3', s.bg, s.border)}>
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <s.icon className={cn('w-4 h-4', s.color)} />
            </div>
            <div>
              <p className={cn('text-lg font-bold', s.color)}>{s.value}</p>
              <p className="text-[11px] text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input placeholder="Search email or campaign…" className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1">
          {['all', 'hard', 'soft', 'failed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-colors', filter === f ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300')}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide text-[10px] border-b border-slate-100">
              <th className="px-4 py-2.5 text-left font-semibold">Email</th>
              <th className="px-4 py-2.5 text-left font-semibold">Type</th>
              <th className="px-4 py-2.5 text-left font-semibold">Reason</th>
              <th className="px-4 py-2.5 text-left font-semibold">Campaign</th>
              <th className="px-4 py-2.5 text-left font-semibold">Date</th>
              <th className="px-4 py-2.5 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((b) => {
              const type = BOUNCE_TYPES[b.type];
              return (
                <tr key={b.email} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-slate-800 text-[11px]">{b.email}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', type.color)}>{type.label}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">{b.reason}</td>
                  <td className="px-4 py-3 text-slate-600">{b.campaign}</td>
                  <td className="px-4 py-3 text-slate-400">{b.date}</td>
                  <td className="px-4 py-3">
                    {b.type === 'soft' ? (
                      <button className="text-[11px] text-emerald-600 font-semibold hover:underline">Retry</button>
                    ) : (
                      <button className="text-[11px] text-red-500 font-semibold hover:underline">Suppress</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No bounce records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}