import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Plus, Search, Mail, MessageSquare, Linkedin, Send, Users, BarChart3, Copy, Pencil, Trash2, ChevronRight } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const STATUS_STYLES = {
  draft: 'bg-slate-50 text-slate-500 border-slate-200',
  scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  sent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paused: 'bg-red-50 text-red-600 border-red-200',
};

const CHANNEL_ICONS = { email: Mail, whatsapp: MessageSquare, linkedin: Linkedin };
const CHANNEL_STYLES = {
  email: 'bg-cyan-50 text-cyan-700',
  whatsapp: 'bg-emerald-50 text-emerald-700',
  linkedin: 'bg-blue-50 text-blue-700',
};

const BROADCASTS = [
  { id: 1, name: 'Q3 Partnership Outreach', channel: 'email', status: 'sent', audience: 342, opened: 61, clicked: 18, replied: 7, sentAt: 'Jun 10, 2025', subject: 'Q3 Partnership Opportunity' },
  { id: 2, name: 'Fintech CEO WhatsApp Blast', channel: 'whatsapp', status: 'sent', audience: 84, opened: 76, clicked: 0, replied: 24, sentAt: 'Jun 8, 2025', subject: 'Quick intro message' },
  { id: 3, name: 'Mid-Market SaaS Re-Engagement', channel: 'email', status: 'scheduled', audience: 210, opened: 0, clicked: 0, replied: 0, sentAt: 'Jun 20, 2025', subject: 'We have something new for you' },
  { id: 4, name: 'East Africa LinkedIn Connect', channel: 'linkedin', status: 'draft', audience: 0, opened: 0, clicked: 0, replied: 0, sentAt: '—', subject: 'Connection request template' },
  { id: 5, name: 'Product Update Announcement', channel: 'email', status: 'sent', audience: 1240, opened: 54, clicked: 22, replied: 3, sentAt: 'May 28, 2025', subject: 'Exciting update from Orbin AI' },
];

export default function Broadcasts() {
  const [broadcasts, setBroadcasts] = useState(BROADCASTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterChannel, setFilterChannel] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', channel: 'email', subject: '' });

  const filtered = broadcasts.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || b.status === filterStatus;
    const matchChannel = filterChannel === 'All' || b.channel === filterChannel;
    return matchSearch && matchStatus && matchChannel;
  });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    setBroadcasts(prev => [{
      id: Date.now(), ...form, status: 'draft', audience: 0,
      opened: 0, clicked: 0, replied: 0, sentAt: '—',
    }, ...prev]);
    setForm({ name: '', channel: 'email', subject: '' });
    setShowCreate(false);
  };

  const handleDuplicate = (b) => {
    setBroadcasts(prev => [{ ...b, id: Date.now(), name: `${b.name} (copy)`, status: 'draft' }, ...prev]);
  };

  const handleDelete = (id) => setBroadcasts(prev => prev.filter(b => b.id !== id));

  const totalSent = broadcasts.filter(b => b.status === 'sent').reduce((a, b) => a + b.audience, 0);
  const avgOpen = Math.round(broadcasts.filter(b => b.status === 'sent').reduce((a, b) => a + b.opened, 0) / Math.max(broadcasts.filter(b => b.status === 'sent').length, 1));

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', color: '#0f172a' }}>
      <TopBar title="Broadcasts" subtitle="Campaign-style outreach to targeted groups" />
      <div className="p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Broadcasts', value: broadcasts.length, icon: Radio, color: 'text-emerald-500' },
            { label: 'Total Sent', value: totalSent.toLocaleString(), icon: Send, color: 'text-cyan-500' },
            { label: 'Avg Open Rate', value: `${avgOpen}%`, icon: BarChart3, color: 'text-violet-500' },
            { label: 'Scheduled', value: broadcasts.filter(b => b.status === 'scheduled').length, icon: Users, color: 'text-amber-500' },
          ].map((s, i) => (
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
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input placeholder="Search broadcasts..." className="pl-9 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {['All', 'draft', 'scheduled', 'sent', 'paused'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${filterStatus === s ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {['All', 'email', 'whatsapp', 'linkedin'].map(c => (
              <button key={c} onClick={() => setFilterChannel(c)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${filterChannel === c ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}>
                {c}
              </button>
            ))}
          </div>
          <Button size="sm" className="ml-auto bg-primary text-white text-xs" onClick={() => setShowCreate(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> New Broadcast
          </Button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <p className="text-sm font-semibold text-slate-800 mb-3">Create Broadcast</p>
            <div className="flex gap-3">
              <Input placeholder="Broadcast name..." className="h-9 text-sm flex-1" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              <Input placeholder="Subject / message headline..." className="h-9 text-sm flex-1" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
              <select className="h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700"
                value={form.channel} onChange={e => setForm(p => ({ ...p, channel: e.target.value }))}>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="linkedin">LinkedIn</option>
              </select>
              <Button size="sm" className="bg-primary text-white text-xs" onClick={handleCreate}>Create</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Broadcast Cards */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-xl flex flex-col items-center justify-center py-16 text-slate-400" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <Radio className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm">No broadcasts found. Create your first above.</p>
            </div>
          )}
          {filtered.map((b, i) => {
            const ChannelIcon = CHANNEL_ICONS[b.channel] || Mail;
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-xl p-5 group hover:shadow-sm transition-all" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${CHANNEL_STYLES[b.channel]}`}>
                    <ChannelIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-semibold text-slate-800 truncate">{b.name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{b.subject}</p>
                    {b.status === 'sent' && (
                      <div className="flex gap-6">
                        {[
                          ['Audience', b.audience.toLocaleString()],
                          ['Opened', `${b.opened}%`],
                          ['Clicked', `${b.clicked}%`],
                          ['Replied', `${b.replied}%`],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
                            <p className="text-sm font-bold text-slate-800">{value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {b.status !== 'sent' && (
                      <p className="text-xs text-slate-400">{b.status === 'scheduled' ? `Scheduled for ${b.sentAt}` : 'Draft — not yet sent'}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-100 rounded-lg" onClick={() => handleDuplicate(b)}>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <Pencil className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(b.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}