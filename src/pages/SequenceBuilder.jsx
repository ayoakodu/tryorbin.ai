import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft, Mail, MessageCircle, Phone,
  Sparkles, Users, Clock, CheckCircle2, Save,
  BookOpen, Zap, Search, Plus, X, ChevronDown,
  Tag, TrendingUp, MousePointer, MessageSquare, Calendar,
  PhoneCall, PhoneOff, PhoneMissed, Voicemail,
  Filter, Check, AlertCircle, BarChart2, Settings
} from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { initialSequences } from './Outreach';
import { getSequence, upsertSequence } from '@/lib/sequences';
import AIPersonalizePanel from '@/components/ai/AIPersonalizePanel';
import AddStepMenu, { STEP_TYPE_MAP } from '@/components/outreach/AddStepMenu';
import StepModal from '@/components/outreach/StepModal';
import WorkflowCanvas from '@/components/outreach/WorkflowCanvas';

const statusBadge = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
};

const TABS = [
  { id: 'steps',    label: 'Steps'     },
  { id: 'prospects',label: 'Prospects' },
  { id: 'emails',   label: 'Emails'    },
  { id: 'calls',    label: 'Calls'     },
  { id: 'stats',    label: 'Stats'     },
  { id: 'settings', label: 'Settings'  },
];

// ─── Sample data (module-level constants) ────────────────────────────────────

const SAMPLE_PROSPECTS = [
  { id: 1, name: 'Amara Osei', company: 'Konga Group', email: 'amara.osei@kongagroup.com', status: 'active', step: 3, lastActivity: '2 hours ago' },
  { id: 2, name: 'Chidi Nwosu', company: 'Flutterwave', email: 'c.nwosu@flutterwave.com', status: 'replied', step: 2, lastActivity: '1 day ago' },
  { id: 3, name: 'Fatima Al-Hassan', company: 'Interswitch', email: 'fatima@interswitch.ng', status: 'active', step: 1, lastActivity: '3 hours ago' },
  { id: 4, name: 'Kofi Mensah', company: 'Jumia', email: 'k.mensah@jumia.com', status: 'bounced', step: 1, lastActivity: '5 days ago' },
  { id: 5, name: 'Ngozi Adeyemi', company: 'Paystack', email: 'ngozi.a@paystack.com', status: 'active', step: 4, lastActivity: '30 min ago' },
  { id: 6, name: 'Seun Bello', company: 'Carbon', email: 'seun@getcarbon.co', status: 'unsubscribed', step: 2, lastActivity: '1 week ago' },
];

const SAMPLE_EMAILS = [
  { id: 1, to: 'Amara Osei', subject: 'Quick question about your logistics ops', status: 'opened', step: 1, sentAt: '2h ago' },
  { id: 2, to: 'Chidi Nwosu', subject: 'How Flutterwave teams use our platform', status: 'replied', step: 2, sentAt: '1d ago' },
  { id: 3, to: 'Fatima Al-Hassan', subject: 'Quick question about your logistics ops', status: 'sent', step: 1, sentAt: '3h ago' },
  { id: 4, to: 'Kofi Mensah', subject: 'Quick question about your logistics ops', status: 'bounced', step: 1, sentAt: '5d ago' },
  { id: 5, to: 'Ngozi Adeyemi', subject: 'Following up — worth a 15-min chat?', status: 'clicked', step: 4, sentAt: '30m ago' },
  { id: 6, to: 'Seun Bello', subject: 'How Carbon can save 10hrs/week', status: 'sent', step: 2, sentAt: '1w ago' },
  { id: 7, to: 'Emeka Eze', subject: 'Quick question about your logistics ops', status: 'opened', step: 1, sentAt: '4h ago' },
  { id: 8, to: 'Bola Tinubu Jr.', subject: 'Following up — worth a 15-min chat?', status: 'clicked', step: 3, sentAt: '6h ago' },
];

const SAMPLE_CALLS = [
  { id: 1, contact: 'Amara Osei', company: 'Konga Group', phone: '+234 801 ***-**34', status: 'scheduled', notes: '', dueDate: 'Today, 3:00 PM', completed: false },
  { id: 2, contact: 'Chidi Nwosu', company: 'Flutterwave', phone: '+234 706 ***-**12', status: 'completed', notes: 'Interested, wants a demo next week.', dueDate: 'Yesterday', completed: true },
  { id: 3, contact: 'Ngozi Adeyemi', company: 'Paystack', phone: '+234 803 ***-**90', status: 'no_answer', notes: '', dueDate: 'Jun 10', completed: false },
  { id: 4, contact: 'Kofi Mensah', company: 'Jumia', phone: '+233 55 ***-**67', status: 'left_voicemail', notes: 'Left VM about pricing page.', dueDate: 'Jun 8', completed: false },
  { id: 5, contact: 'Emeka Eze', company: 'Andela', phone: '+234 905 ***-**55', status: 'scheduled', notes: '', dueDate: 'Tomorrow, 11:00 AM', completed: false },
];

const TIMEZONES = [
  'Africa/Lagos', 'Africa/Nairobi', 'Africa/Accra', 'Africa/Cairo',
  'Africa/Johannesburg', 'Europe/London', 'America/New_York', 'Asia/Dubai',
];

// ─── Status badge helpers ────────────────────────────────────────────────────

const prospectStatusStyle = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  replied: 'bg-blue-50 text-blue-700 border border-blue-200',
  bounced: 'bg-red-50 text-red-600 border border-red-200',
  unsubscribed: 'bg-slate-100 text-slate-500 border border-slate-200',
};

const emailStatusStyle = {
  sent: 'bg-slate-100 text-slate-600 border border-slate-200',
  opened: 'bg-sky-50 text-sky-700 border border-sky-200',
  clicked: 'bg-violet-50 text-violet-700 border border-violet-200',
  replied: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  bounced: 'bg-red-50 text-red-600 border border-red-200',
};

const callStatusStyle = {
  scheduled: 'bg-amber-50 text-amber-700 border border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  no_answer: 'bg-slate-100 text-slate-500 border border-slate-200',
  left_voicemail: 'bg-sky-50 text-sky-700 border border-sky-200',
};

const callStatusIcon = {
  scheduled: Calendar,
  completed: PhoneCall,
  no_answer: PhoneMissed,
  left_voicemail: Voicemail,
};

// ─── Prospects Tab ──────────────────────────────────────────────────────────

function ProspectsTab({ seq }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [prospects, setProspects] = useState(SAMPLE_PROSPECTS);
  const [newContact, setNewContact] = useState({ name: '', email: '', company: '' });

  const filtered = prospects.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter;
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: prospects.length,
    active: prospects.filter(p => p.status === 'active').length,
    replied: prospects.filter(p => p.status === 'replied').length,
    bounced: prospects.filter(p => p.status === 'bounced').length,
  };

  const handleAdd = () => {
    if (!newContact.name || !newContact.email) return;
    setProspects(prev => [...prev, {
      id: Date.now(), ...newContact, status: 'active', step: 1, lastActivity: 'Just now'
    }]);
    setNewContact({ name: '', email: '', company: '' });
    setShowAddModal(false);
  };

  return (
    <div className="p-5">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Enrolled', value: counts.all, color: 'text-slate-800' },
          { label: 'Active', value: counts.active, color: 'text-emerald-600' },
          { label: 'Replied', value: counts.replied, color: 'text-blue-600' },
          { label: 'Bounced', value: counts.bounced, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 px-4 py-3">
            <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts…"
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
        </div>
        {['all', 'active', 'replied', 'bounced'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 text-[11px] rounded-lg font-medium border transition-colors',
              filter === f ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            )}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {counts[f] !== undefined ? `(${counts[f]})` : ''}
          </button>
        ))}
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Contacts
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Name', 'Company', 'Email', 'Status', 'Current Step', 'Last Activity'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className={cn('border-b border-slate-50 hover:bg-slate-50/60 transition-colors', i === filtered.length - 1 && 'border-0')}>
                <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                <td className="px-4 py-3 text-slate-500">{p.company}</td>
                <td className="px-4 py-3 text-slate-500">{p.email}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', prospectStatusStyle[p.status])}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">Step {p.step}</td>
                <td className="px-4 py-3 text-slate-400">{p.lastActivity}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-slate-400">No contacts found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-80" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Add Contact</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            {[
              { label: 'Full Name', key: 'name', placeholder: 'e.g. Amara Osei' },
              { label: 'Email', key: 'email', placeholder: 'amara@company.com' },
              { label: 'Company', key: 'company', placeholder: 'e.g. Konga Group' },
            ].map(f => (
              <div key={f.key} className="mb-3">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">{f.label}</label>
                <input
                  value={newContact[f.key]}
                  onChange={e => setNewContact(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleAdd}
                className="flex-1 py-1.5 text-xs rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors">
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Emails Tab ─────────────────────────────────────────────────────────────

function EmailsTab() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filters = ['all', 'sent', 'opened', 'clicked', 'replied', 'bounced'];
  const filtered = SAMPLE_EMAILS.filter(e => {
    const matchFilter = filter === 'all' || e.status === filter;
    const matchSearch = !search ||
      e.to.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = filters.reduce((acc, f) => {
    acc[f] = f === 'all' ? SAMPLE_EMAILS.length : SAMPLE_EMAILS.filter(e => e.status === f).length;
    return acc;
  }, {});

  return (
    <div className="p-5">
      {/* Summary */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: 'Sent', value: counts.sent, color: 'text-slate-700' },
          { label: 'Opened', value: counts.opened, color: 'text-sky-600' },
          { label: 'Clicked', value: counts.clicked, color: 'text-violet-600' },
          { label: 'Replied', value: counts.replied, color: 'text-emerald-600' },
          { label: 'Bounced', value: counts.bounced, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 px-4 py-3">
            <p className={cn('text-xl font-bold', s.color)}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search emails…"
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
        </div>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 text-[11px] rounded-lg font-medium border transition-colors',
              filter === f ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            )}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['To', 'Subject', 'Status', 'Step', 'Sent At'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[11px] font-medium text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={e.id} className={cn('border-b border-slate-50 hover:bg-slate-50/60 transition-colors', i === filtered.length - 1 && 'border-0')}>
                <td className="px-4 py-3 font-medium text-slate-800">{e.to}</td>
                <td className="px-4 py-3 text-slate-500 max-w-[220px] truncate">{e.subject}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium', emailStatusStyle[e.status])}>
                    {e.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">Step {e.step}</td>
                <td className="px-4 py-3 text-slate-400">{e.sentAt}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-xs text-slate-400">No emails found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Calls Tab ──────────────────────────────────────────────────────────────

function CallsTab() {
  const [filter, setFilter] = useState('all');
  const [calls, setCalls] = useState(SAMPLE_CALLS);
  const [openOutcome, setOpenOutcome] = useState(null);
  const [outcome, setOutcome] = useState({ result: 'completed', notes: '' });

  const filters = ['all', 'scheduled', 'completed', 'no_answer', 'left_voicemail'];
  const filtered = calls.filter(c => filter === 'all' || c.status === filter);

  const toggleComplete = (id) => {
    setCalls(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed, status: !c.completed ? 'completed' : 'scheduled' } : c));
  };

  const logOutcome = (id) => {
    setCalls(prev => prev.map(c => c.id === id ? { ...c, status: outcome.result, notes: outcome.notes } : c));
    setOpenOutcome(null);
    setOutcome({ result: 'completed', notes: '' });
  };

  return (
    <div className="p-5">
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 text-[11px] rounded-lg font-medium border transition-colors',
              filter === f ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            )}>
            {f === 'no_answer' ? 'No Answer' : f === 'left_voicemail' ? 'Voicemail' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {filtered.map(c => {
          const StatusIcon = callStatusIcon[c.status] || PhoneCall;
          return (
            <div key={c.id} className="bg-white rounded-xl border border-slate-100 px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleComplete(c.id)}
                    className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                      c.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-emerald-400')}>
                    {c.completed && <Check className="w-3 h-3" />}
                  </button>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{c.contact}</p>
                    <p className="text-[11px] text-slate-400">{c.company} · {c.phone}</p>
                    {c.notes && <p className="text-[11px] text-slate-500 mt-1 italic">"{c.notes}"</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium', callStatusStyle[c.status])}>
                    <StatusIcon className="w-3 h-3" />
                    {c.status === 'no_answer' ? 'No Answer' : c.status === 'left_voicemail' ? 'Voicemail' : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                  <span className="text-[11px] text-slate-400">{c.dueDate}</span>
                  <button onClick={() => { setOpenOutcome(openOutcome === c.id ? null : c.id); setOutcome({ result: 'completed', notes: '' }); }}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                    Log Outcome
                  </button>
                </div>
              </div>

              {/* Inline outcome form */}
              {openOutcome === c.id && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Outcome</label>
                    <select value={outcome.result} onChange={e => setOutcome(prev => ({ ...prev, result: e.target.value }))}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400">
                      <option value="completed">Completed</option>
                      <option value="no_answer">No Answer</option>
                      <option value="left_voicemail">Left Voicemail</option>
                      <option value="scheduled">Rescheduled</option>
                    </select>
                  </div>
                  <div className="flex-[2]">
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Notes</label>
                    <input value={outcome.notes} onChange={e => setOutcome(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Brief outcome notes…"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                  <button onClick={() => logOutcome(c.id)}
                    className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                    Save
                  </button>
                  <button onClick={() => setOpenOutcome(null)}
                    className="px-2.5 py-1.5 text-[11px] rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-400">No call tasks found</div>
        )}
      </div>
    </div>
  );
}

// ─── Stats Tab ──────────────────────────────────────────────────────────────

function StatsTab({ seq }) {
  const enrolled = seq.enrolled || 124;
  const opens = seq.opens || 67;
  const replied = seq.replied || 18;
  const meetings = seq.meetings || 5;

  const openRate = enrolled > 0 ? Math.round((opens / enrolled) * 100) : 54;
  const replyRate = enrolled > 0 ? Math.round((replied / enrolled) * 100) : 15;
  const meetingRate = enrolled > 0 ? Math.round((meetings / enrolled) * 100) : 4;

  // Per-step chart data based on actual steps (or mock if none)
  const stepLabels = seq.steps.length > 0
    ? seq.steps.map((s, i) => ({ name: `Step ${i + 1}`, type: s.subtype || s.type || 'email' }))
    : [
        { name: 'Step 1', type: 'email_auto' },
        { name: 'Step 2', type: 'linkedin_connect' },
        { name: 'Step 3', type: 'email_auto' },
        { name: 'Step 4', type: 'call' },
      ];

  const mockOpenPcts = [72, 45, 38, 21];
  const mockReplyPcts = [8, 12, 18, 6];

  const chartData = stepLabels.map((s, i) => ({
    name: s.name,
    openRate: mockOpenPcts[i % mockOpenPcts.length] ?? 30,
    replyRate: mockReplyPcts[i % mockReplyPcts.length] ?? 10,
  }));

  // Channel breakdown
  const allSteps = seq.steps.length > 0 ? seq.steps : [
    { subtype: 'email_auto' }, { subtype: 'linkedin_connect' }, { subtype: 'email_auto' }, { subtype: 'call' }
  ];
  const channelCounts = allSteps.reduce((acc, s) => {
    const t = s.subtype || s.type || 'email';
    const channel = t.includes('email') ? 'Email' : t.includes('linkedin') ? 'LinkedIn' : t.includes('whatsapp') ? 'WhatsApp' : t.includes('call') ? 'Call' : 'Other';
    acc[channel] = (acc[channel] || 0) + 1;
    return acc;
  }, {});
  const totalSteps = allSteps.length;
  const channelColors = { Email: 'bg-blue-400', LinkedIn: 'bg-blue-600', WhatsApp: 'bg-emerald-500', Call: 'bg-amber-400', Other: 'bg-slate-400' };

  const bestStep = chartData.reduce((best, s) => s.replyRate > (best?.replyRate ?? -1) ? s : best, null);

  return (
    <div className="p-5 space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Enrolled', value: enrolled, icon: Users, color: 'text-slate-800', sub: 'contacts' },
          { label: 'Open Rate', value: `${openRate}%`, icon: Mail, color: 'text-sky-600', sub: `${opens} opens` },
          { label: 'Reply Rate', value: `${replyRate}%`, icon: MessageSquare, color: 'text-emerald-600', sub: `${replied} replies` },
          { label: 'Meeting Rate', value: `${meetingRate}%`, icon: Calendar, color: 'text-violet-600', sub: `${meetings} booked` },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-slate-100 px-4 py-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11px] text-slate-500 font-medium">{k.label}</p>
              <k.icon className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <p className={cn('text-2xl font-bold', k.color)}>{k.value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-slate-700">Per-Step Performance</h3>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block" /> Open Rate</span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Reply Rate</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barGap={4} barCategoryGap="30%">
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(v, n) => [`${v}%`, n === 'openRate' ? 'Open Rate' : 'Reply Rate']}
            />
            <Bar dataKey="openRate" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="replyRate" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Channel breakdown */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="text-xs font-semibold text-slate-700 mb-4">Channel Breakdown</h3>
          <div className="space-y-2.5">
            {Object.entries(channelCounts).map(([ch, count]) => {
              const pct = Math.round((count / totalSteps) * 100);
              return (
                <div key={ch}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-600 font-medium">{ch}</span>
                    <span className="text-[11px] text-slate-400">{count} step{count !== 1 ? 's' : ''} · {pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={cn('h-full rounded-full', channelColors[ch] || 'bg-slate-400')} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best performing step */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Best Performing Step</h3>
          {bestStep ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-slate-800">{bestStep.name}</p>
              <p className="text-xs text-slate-400 mt-1">Highest reply rate</p>
              <span className="mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                {bestStep.replyRate}% reply rate
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No step data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ───────────────────────────────────────────────────────────

function SettingsTab({ seq, setSeq }) {
  const [form, setForm] = useState({
    name: seq.name,
    status: seq.status || 'active',
    schedule: 'business',
    timezone: 'Africa/Lagos',
    dailyLimit: 50,
    stopOnReply: true,
    stopOnBounce: true,
    unsubFooter: true,
    tags: seq.tags || [],
  });
  const [tagInput, setTagInput] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      update('tags', [...form.tags, t]);
    }
    setTagInput('');
  };

  const removeTag = (t) => update('tags', form.tags.filter(x => x !== t));

  const handleSave = () => {
    const updated = { ...seq, name: form.name, status: form.status, tags: form.tags };
    setSeq(updated);
    upsertSequence(updated);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const Toggle = ({ value, onChange }) => (
    <button type="button" onClick={() => onChange(!value)}
      className={cn('relative inline-flex w-9 h-5 rounded-full transition-colors', value ? 'bg-emerald-500' : 'bg-slate-200')}>
      <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', value ? 'translate-x-4' : 'translate-x-0.5')} />
    </button>
  );

  const Field = ({ label, children, description }) => (
    <div className="flex items-start justify-between py-4 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-xs font-medium text-slate-700">{label}</p>
        {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className="ml-6 flex-shrink-0">{children}</div>
    </div>
  );

  return (
    <div className="p-5 max-w-2xl">
      <div className="bg-white rounded-xl border border-slate-100 px-5 divide-y divide-slate-50">

        {/* Name */}
        <Field label="Sequence Name">
          <input
            value={form.name}
            onChange={e => update('name', e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400 w-56"
          />
        </Field>

        {/* Status */}
        <Field label="Status" description="Controls whether this sequence sends emails">
          <div className="flex gap-1">
            {['active', 'paused', 'draft'].map(s => (
              <button key={s} onClick={() => update('status', s)}
                className={cn(
                  'px-3 py-1 text-[11px] rounded-lg font-medium border transition-colors capitalize',
                  form.status === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                )}>
                {s}
              </button>
            ))}
          </div>
        </Field>

        {/* Schedule */}
        <Field label="Send Window" description="When can this sequence send messages">
          <div className="flex gap-1">
            {[['business', 'Business Hours'], ['anytime', 'Any Time'], ['custom', 'Custom']].map(([v, l]) => (
              <button key={v} onClick={() => update('schedule', v)}
                className={cn(
                  'px-2.5 py-1 text-[11px] rounded-lg font-medium border transition-colors',
                  form.schedule === v ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                )}>
                {l}
              </button>
            ))}
          </div>
        </Field>

        {/* Timezone */}
        <Field label="Time Zone">
          <select value={form.timezone} onChange={e => update('timezone', e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400">
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </Field>

        {/* Daily limit */}
        <Field label="Daily Send Limit" description="Max emails sent per day from this sequence">
          <input
            type="number"
            value={form.dailyLimit}
            onChange={e => update('dailyLimit', parseInt(e.target.value) || 0)}
            min={1} max={500}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400 w-24 text-right"
          />
        </Field>

        {/* Stop on reply */}
        <Field label="Stop on Reply" description="Pause contact from sequence when they reply">
          <Toggle value={form.stopOnReply} onChange={v => update('stopOnReply', v)} />
        </Field>

        {/* Stop on bounce */}
        <Field label="Stop on Bounce" description="Remove contact if email bounces">
          <Toggle value={form.stopOnBounce} onChange={v => update('stopOnBounce', v)} />
        </Field>

        {/* Unsubscribe footer */}
        <Field label="Unsubscribe Footer" description="Append unsubscribe link to all emails">
          <Toggle value={form.unsubFooter} onChange={v => update('unsubFooter', v)} />
        </Field>

        {/* Tags */}
        <Field label="Tags" description="Organise this sequence with tags">
          <div className="w-56">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map(t => (
                <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] border border-slate-200">
                  {t}
                  <button onClick={() => removeTag(t)} className="text-slate-400 hover:text-slate-600"><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()}
                placeholder="Add tag…"
                className="flex-1 text-xs px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button onClick={addTag}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </Field>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={handleSave}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors',
            savedFlash ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700'
          )}>
          {savedFlash ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {savedFlash ? 'Saved!' : 'Save Settings'}
        </button>
        {savedFlash && <span className="text-xs text-emerald-600 font-medium">Settings saved successfully</span>}
      </div>
    </div>
  );
}

// ─── Multichannel illustration for empty state ───────────────────────────────

function MultichannelIllustration() {
  const orbitIcons = [
    { Icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100', angle: 0 },
    { Icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', angle: 72 },
    { Icon: MessageCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100', angle: 144 },
    { Icon: Phone, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100', angle: 216 },
    { Icon: CheckCircle2, color: 'text-violet-500', bg: 'bg-violet-50 border-violet-100', angle: 288 },
  ];
  const R = 52;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg className="absolute inset-0" width="140" height="140">
        <circle cx="70" cy="70" r={R} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 5" />
      </svg>
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center z-10">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
        </svg>
      </motion.div>
      {orbitIcons.map(({ Icon, color, bg, angle }, i) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const x = 70 + R * Math.cos(rad) - 12;
        const y = 70 + R * Math.sin(rad) - 12;
        return (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className={`absolute w-6 h-6 rounded-lg border flex items-center justify-center ${bg}`}
            style={{ left: x, top: y }}>
            <Icon className={`w-3 h-3 ${color}`} />
          </motion.div>
        );
      })}
    </div>
  );
}

function EmptyWorkflowState({ onAddStep, onShowTemplates, onGenerateWithAI }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
      className="flex flex-col items-center text-center px-6">
      <MultichannelIllustration />
      <h3 className="text-sm font-bold text-slate-800 mt-5 mb-1.5">Sequence is empty</h3>
      <p className="text-xs text-slate-400 mb-6 max-w-[260px] leading-relaxed">
        Add your first step to start building a multichannel outreach workflow.
      </p>
      <div className="mb-3">
        <AddStepMenu onAdd={onAddStep} trigger="empty" />
      </div>
      <div className="flex items-center gap-2 w-40 mb-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[11px] text-slate-400 font-medium">Or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onShowTemplates}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-600 hover:bg-slate-50 transition-colors font-medium">
          <BookOpen className="w-3 h-3" /> Use Template
        </button>
        <button onClick={onGenerateWithAI}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700 hover:bg-emerald-100 transition-colors font-medium">
          <Sparkles className="w-3 h-3 text-emerald-500" /> AI-Assisted Sequence
        </button>
      </div>
    </motion.div>
  );
}

// Top metrics bar
function SequenceMetrics({ seq }) {
  const automatedCount = seq.steps.filter(s => s.subtype === 'email_auto' || s.subtype === 'whatsapp_followup').length;
  const automatedPct = seq.steps.length > 0 ? Math.round((automatedCount / seq.steps.length) * 100) : 0;
  const totalDays = seq.steps.length > 0 ? (seq.steps[seq.steps.length - 1]?.day || 0) : 0;

  const metrics = [
    { label: 'Steps', value: seq.steps.length, Icon: Zap },
    { label: 'Days', value: totalDays, Icon: Clock },
    { label: 'Automated', value: `${automatedPct}%`, Icon: CheckCircle2 },
    { label: 'Enrolled', value: seq.enrolled || 0, Icon: Users },
  ];

  return (
    <div className="flex items-center gap-1 px-5 py-2 border-b border-slate-100 bg-white flex-shrink-0">
      {metrics.map(({ label, value, Icon }, i) => (
        <div key={label} className={cn('flex items-center gap-2 px-3 py-1.5', i < metrics.length - 1 && 'border-r border-slate-100')}>
          <Icon className="w-3 h-3 text-slate-400 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none">{value}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SequenceBuilder() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const seqId = parseInt(urlParams.get('id'));

  const [seq, setSeq] = useState(() => {
    const fromStorage = seqId ? getSequence(seqId) : null;
    const fromStatic = seqId ? initialSequences.find(s => s.id === seqId) : null;
    return fromStorage || fromStatic || {
      id: seqId || Date.now(), name: 'New Sequence', status: 'draft',
      steps: [], enrolled: 0, replied: 0, meetings: 0, opens: 0, tags: [],
    };
  });

  const [activeTab, setActiveTab] = useState('steps');
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pendingInsert, setPendingInsert] = useState(null);

  // Modal state
  const [modalState, setModalState] = useState(null);
  // { step, index, isNew, insertAfterIndex? }

  const openNewStep = useCallback((subtype, insertAfterIndex = null) => {
    const baseType = STEP_TYPE_MAP[subtype] || subtype;
    const lastDay = seq.steps[seq.steps.length - 1]?.day || 0;
    const newStep = { type: baseType, subtype, day: lastDay + 3, subject: '', body: '' };
    const insertIdx = insertAfterIndex !== null ? insertAfterIndex + 1 : seq.steps.length;
    setModalState({ step: newStep, index: insertIdx, isNew: true, insertAfterIndex });
  }, [seq.steps]);

  const openEditStep = useCallback((index) => {
    setModalState({ step: { ...seq.steps[index] }, index, isNew: false });
  }, [seq.steps]);

  const handleModalSave = useCallback((updatedStep) => {
    setSeq(s => {
      const newSteps = [...s.steps];
      if (modalState.isNew) {
        newSteps.splice(modalState.index, 0, updatedStep);
      } else {
        newSteps[modalState.index] = updatedStep;
      }
      return { ...s, steps: newSteps };
    });
    setModalState(null);
  }, [modalState]);

  const removeStep = useCallback((i) => {
    setSeq(s => ({ ...s, steps: s.steps.filter((_, idx) => idx !== i) }));
  }, []);

  const duplicateStep = useCallback((i) => {
    setSeq(s => {
      const newSteps = [...s.steps];
      const copy = { ...s.steps[i], day: (s.steps[i].day || 0) + 1 };
      newSteps.splice(i + 1, 0, copy);
      return { ...s, steps: newSteps };
    });
  }, []);

  const moveStep = useCallback((from, to) => {
    setSeq(s => {
      if (to < 0 || to >= s.steps.length) return s;
      const newSteps = [...s.steps];
      const [moved] = newSteps.splice(from, 1);
      newSteps.splice(to, 0, moved);
      return { ...s, steps: newSteps };
    });
  }, []);

  const changeStepType = useCallback((i, subtype) => {
    setSeq(s => {
      const newSteps = [...s.steps];
      const baseType = STEP_TYPE_MAP[subtype] || subtype;
      newSteps[i] = { ...newSteps[i], subtype, type: baseType };
      return { ...s, steps: newSteps };
    });
  }, []);

  const toggleStatus = useCallback(() => {
    setSeq(s => ({ ...s, status: s.status === 'active' ? 'paused' : 'active' }));
  }, []);

  const handleSave = useCallback(() => {
    upsertSequence(seq);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [seq]);

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: '#f8fafc' }}>

      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-2 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/outreach')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Sequences
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="text-sm font-bold text-slate-800 max-w-xs truncate">{seq.name}</h1>
          <button onClick={toggleStatus}
            className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors cursor-pointer', statusBadge[seq.status])}>
            {seq.status}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline"
            className="gap-1.5 text-[11px] h-7 border-slate-200 text-slate-600 hover:bg-slate-50">
            <Users className="w-3 h-3" /> Add Contacts
          </Button>
          <Button size="sm" onClick={handleSave}
            className={cn('gap-1.5 text-[11px] h-7 text-white', saved ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700')}>
            {saved ? <CheckCircle2 className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            {saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between px-5 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 text-xs font-medium border-b-2 transition-colors',
                activeTab === tab.id ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              )}>
              {tab.label}
            </button>
          ))}
        </div>
        {/* Add Step button top-right */}
        {activeTab === 'steps' && seq.steps.length > 0 && (
          <AddStepMenu onAdd={openNewStep} trigger="empty" />
        )}
      </div>

      {/* Sequence Metrics (steps tab only) */}
      {activeTab === 'steps' && seq.steps.length > 0 && (
        <SequenceMetrics seq={seq} />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'prospects' && <ProspectsTab seq={seq} />}
        {activeTab === 'emails' && <EmailsTab />}
        {activeTab === 'calls' && <CallsTab />}
        {activeTab === 'stats' && <StatsTab seq={seq} />}
        {activeTab === 'settings' && <SettingsTab seq={seq} setSeq={setSeq} />}

        {activeTab === 'steps' && (
          <>
            {seq.steps.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <EmptyWorkflowState
                  onAddStep={openNewStep}
                  onShowTemplates={() => {}}
                  onGenerateWithAI={() => setShowPersonalize(true)}
                />
              </div>
            ) : (
              <div className="py-6 px-4">
                <WorkflowCanvas
                  steps={seq.steps}
                  onAddStep={openNewStep}
                  onEditStep={openEditStep}
                  onRemoveStep={removeStep}
                  onDuplicateStep={duplicateStep}
                  onInsertAfterStep={(idx) => setPendingInsert(idx)}
                  onMoveStep={moveStep}
                  onChangeStepType={changeStepType}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Step Modal */}
      {modalState && (
        <StepModal
          step={modalState.step}
          index={modalState.index}
          isNew={modalState.isNew}
          onSave={handleModalSave}
          onClose={() => setModalState(null)}
          allSteps={seq.steps}
          sequenceName={seq.name}
        />
      )}

      {/* Insertion add-step picker */}
      {pendingInsert !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20"
          onClick={() => setPendingInsert(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-xl border border-slate-200 shadow-xl p-2">
            <AddStepMenu onAdd={(subtype) => { openNewStep(subtype, pendingInsert); setPendingInsert(null); }} trigger="empty" />
          </div>
        </div>
      )}

      {showPersonalize && <AIPersonalizePanel onClose={() => setShowPersonalize(false)} />}
    </div>
  );
}
