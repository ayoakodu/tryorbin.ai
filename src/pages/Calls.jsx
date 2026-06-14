import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Search, Plus, Clock, User, Building2, FileText, ChevronDown } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const OUTCOME_STYLES = {
  'Connected': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'No Answer': 'bg-slate-50 text-slate-500 border-slate-200',
  'Left Voicemail': 'bg-amber-50 text-amber-700 border-amber-200',
  'Meeting Booked': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Not Interested': 'bg-red-50 text-red-600 border-red-200',
};

const CALLS = [
  { id: 1, contact: 'Amara Diallo', company: 'Flutterwave', rep: 'JD', direction: 'outbound', outcome: 'Meeting Booked', duration: '14m 22s', date: 'Today, 10:41 AM', notes: 'Great conversation — agreed to a full demo next Friday. High intent.', phone: '+234 810 000 0001' },
  { id: 2, contact: 'Kemi Adeyemi', company: 'Yoco', rep: 'JD', direction: 'inbound', outcome: 'Connected', duration: '8m 05s', date: 'Today, 9:15 AM', notes: 'Called to confirm tomorrow\'s demo time. Looking good.', phone: '+27 82 000 0002' },
  { id: 3, contact: 'Tunde Okafor', company: 'Paystack', rep: 'SB', direction: 'outbound', outcome: 'No Answer', duration: '0m 00s', date: 'Yesterday, 3:30 PM', notes: '', phone: '+234 803 000 0003' },
  { id: 4, contact: 'Nadia Hassan', company: 'Cellulant', rep: 'JD', direction: 'outbound', outcome: 'Left Voicemail', duration: '1m 12s', date: 'Yesterday, 11:00 AM', notes: 'Left voicemail asking for 15 mins this week.', phone: '+254 712 000 0004' },
  { id: 5, contact: 'Chioma Eze', company: 'OPay', rep: 'AM', direction: 'outbound', outcome: 'Connected', duration: '22m 47s', date: 'Mon, 2:00 PM', notes: 'Deep discovery call. Real pain around pipeline visibility. Very warm.', phone: '+234 906 000 0005' },
  { id: 6, contact: 'Kwame Mensah', company: 'Zeepay', rep: 'SB', direction: 'outbound', outcome: 'Not Interested', duration: '3m 14s', date: 'Mon, 10:00 AM', notes: 'Too early — revisit in 2 quarters.', phone: '+233 24 000 0006' },
];

const DirectionIcon = ({ dir }) => {
  if (dir === 'inbound') return <PhoneIncoming className="w-3.5 h-3.5 text-emerald-500" />;
  return <PhoneOutgoing className="w-3.5 h-3.5 text-cyan-500" />;
};

const CALLS_KEY = 'orbin_calls';
function loadCalls() { try { const s = localStorage.getItem(CALLS_KEY); return s ? JSON.parse(s) : null; } catch { return null; } }
function persistCalls(calls) { try { localStorage.setItem(CALLS_KEY, JSON.stringify(calls)); } catch {} }

export default function Calls() {
  const [calls, setCalls] = useState(() => loadCalls() ?? CALLS);
  const [search, setSearch] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [logForm, setLogForm] = useState({ contact: '', company: '', outcome: 'Connected', duration: '', notes: '' });

  const filtered = calls.filter(c => {
    const matchSearch = c.contact.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase());
    const matchOutcome = filterOutcome === 'All' || c.outcome === filterOutcome;
    return matchSearch && matchOutcome;
  });

  const stats = [
    { label: 'Total Calls', value: calls.length, icon: Phone, color: 'text-emerald-500' },
    { label: 'Connected', value: calls.filter(c => c.outcome === 'Connected' || c.outcome === 'Meeting Booked').length, icon: PhoneIncoming, color: 'text-cyan-500' },
    { label: 'Meetings Booked', value: calls.filter(c => c.outcome === 'Meeting Booked').length, icon: PhoneOutgoing, color: 'text-violet-500' },
    { label: 'No Answer', value: calls.filter(c => c.outcome === 'No Answer').length, icon: PhoneMissed, color: 'text-slate-400' },
  ];

  const handleLogCall = () => {
    if (!logForm.contact.trim()) return;
    const newCall = { id: Date.now(), ...logForm, rep: 'JD', direction: 'outbound', date: 'Just now', phone: '' };
    setCalls(prev => {
      const updated = [newCall, ...prev];
      persistCalls(updated);
      return updated;
    });
    setLogForm({ contact: '', company: '', outcome: 'Connected', duration: '', notes: '' });
    setShowLog(false);
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', color: '#0f172a' }}>
      <TopBar title="Calls" subtitle="Call activity log and outcomes" />
      <div className="p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input placeholder="Search by contact or company..." className="pl-9 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {['All', 'Connected', 'Meeting Booked', 'No Answer', 'Left Voicemail'].map(o => (
              <button key={o} onClick={() => setFilterOutcome(o)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterOutcome === o ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}>
                {o}
              </button>
            ))}
          </div>
          <Button size="sm" className="ml-auto bg-primary text-white text-xs" onClick={() => setShowLog(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Log Call
          </Button>
        </div>

        {/* Log Call Form */}
        {showLog && (
          <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <p className="text-sm font-semibold text-slate-800 mb-3">Log a Call</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Input placeholder="Contact name" className="h-9 text-sm" value={logForm.contact} onChange={e => setLogForm(p => ({ ...p, contact: e.target.value }))} />
              <Input placeholder="Company" className="h-9 text-sm" value={logForm.company} onChange={e => setLogForm(p => ({ ...p, company: e.target.value }))} />
              <select className="h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700"
                value={logForm.outcome} onChange={e => setLogForm(p => ({ ...p, outcome: e.target.value }))}>
                {Object.keys(OUTCOME_STYLES).map(o => <option key={o}>{o}</option>)}
              </select>
              <Input placeholder="Duration (e.g. 5m 30s)" className="h-9 text-sm" value={logForm.duration} onChange={e => setLogForm(p => ({ ...p, duration: e.target.value }))} />
            </div>
            <Input placeholder="Call notes..." className="h-9 text-sm mb-3" value={logForm.notes} onChange={e => setLogForm(p => ({ ...p, notes: e.target.value }))} />
            <div className="flex gap-2">
              <Button size="sm" className="bg-primary text-white text-xs" onClick={handleLogCall}>Save Call</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowLog(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Call Log */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Contact', 'Company', 'Direction', 'Outcome', 'Duration', 'Date', 'Rep', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-16 text-slate-400 text-sm">No calls logged yet.</td></tr>
              )}
              {filtered.map((call, i) => (
                <motion.tr key={call.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer group"
                  onClick={() => setSelected(selected?.id === call.id ? null : call)}>
                  <td className="px-5 py-3.5 text-xs font-medium text-slate-800">{call.contact}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{call.company}</td>
                  <td className="px-5 py-3.5"><DirectionIcon dir={call.direction} /></td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${OUTCOME_STYLES[call.outcome]}`}>{call.outcome}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{call.duration || '—'}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{call.date}</td>
                  <td className="px-5 py-3.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">{call.rep}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${selected?.id === call.id ? 'rotate-180' : ''}`} />
                  </td>
                </motion.tr>
              ))}
              {selected && (
                <tr>
                  <td colSpan={8} className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Call Notes</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{selected.notes || 'No notes recorded for this call.'}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}