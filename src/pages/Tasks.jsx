import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Plus, Search, Sparkles, Calendar, User, AlertCircle, Clock, ChevronDown, Trash2, Flag } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PRIORITY_STYLES = {
  high: 'bg-red-50 text-red-600 border-red-200',
  medium: 'bg-amber-50 text-amber-600 border-amber-200',
  low: 'bg-slate-50 text-slate-500 border-slate-200',
};

const TYPE_STYLES = {
  'Follow-up': 'bg-cyan-50 text-cyan-700',
  'Email': 'bg-violet-50 text-violet-600',
  'Call': 'bg-emerald-50 text-emerald-700',
  'Review': 'bg-amber-50 text-amber-600',
  'Sequence': 'bg-blue-50 text-blue-600',
};

const TASKS = [
  { id: 1, title: 'Follow up with Amara Diallo — Flutterwave', type: 'Follow-up', priority: 'high', due: 'Today', assignee: 'JD', done: false, ai: false },
  { id: 2, title: 'Send sequence Day 3 email to Fintech CEO list', type: 'Sequence', priority: 'high', due: 'Today', assignee: 'JD', done: false, ai: true },
  { id: 3, title: 'Call Tunde Okafor — Paystack (no answer yesterday)', type: 'Call', priority: 'medium', due: 'Today', assignee: 'SB', done: false, ai: false },
  { id: 4, title: 'Review high-priority accounts in pipeline', type: 'Review', priority: 'medium', due: 'Tomorrow', assignee: 'JD', done: false, ai: false },
  { id: 5, title: 'Update target account list for Q3', type: 'Review', priority: 'low', due: 'Tomorrow', assignee: 'AM', done: false, ai: false },
  { id: 6, title: 'Check campaign replies — Q3 Partnership Outreach', type: 'Email', priority: 'medium', due: 'Tomorrow', assignee: 'JD', done: false, ai: true },
  { id: 7, title: 'Prepare demo materials for Yoco meeting', type: 'Review', priority: 'high', due: 'Jun 21', assignee: 'JD', done: false, ai: false },
  { id: 8, title: 'Send LinkedIn connection requests to new list', type: 'Follow-up', priority: 'low', due: 'Jun 22', assignee: 'SB', done: false, ai: false },
  { id: 9, title: 'Write re-engagement email for cold contacts', type: 'Email', priority: 'medium', due: 'Jun 23', assignee: 'JD', done: false, ai: true },
  { id: 10, title: 'Called Kemi — confirmed demo for tomorrow', type: 'Call', priority: 'low', due: 'Yesterday', assignee: 'JD', done: true, ai: false },
];

const SECTIONS = [
  { label: 'Overdue', filter: t => !t.done && t.due === 'Yesterday', color: 'text-red-500' },
  { label: 'Due Today', filter: t => !t.done && t.due === 'Today', color: 'text-emerald-600' },
  { label: 'Due Tomorrow', filter: t => !t.done && t.due === 'Tomorrow', color: 'text-amber-600' },
  { label: 'Upcoming', filter: t => !t.done && t.due !== 'Yesterday' && t.due !== 'Today' && t.due !== 'Tomorrow', color: 'text-slate-600' },
  { label: 'Completed', filter: t => t.done, color: 'text-slate-400' },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(TASKS);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'Follow-up', priority: 'medium', due: 'Today', assignee: 'JD' });

  const toggle = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const remove = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const newTask = { id: Date.now(), ...form, done: false, ai: false };
    setTasks(prev => [newTask, ...prev]);
    setForm({ title: '', type: 'Follow-up', priority: 'medium', due: 'Today', assignee: 'JD' });
    setShowCreate(false);
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchAssignee = filterAssignee === 'All' || t.assignee === filterAssignee;
    return matchSearch && matchPriority && matchAssignee;
  });

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const overdue = tasks.filter(t => !t.done && t.due === 'Yesterday').length;
  const today = tasks.filter(t => !t.done && t.due === 'Today').length;

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', color: '#0f172a' }}>
      <TopBar title="Tasks" subtitle="Manage your GTM actions, follow-ups, and reminders" />
      <div className="p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Tasks', value: total, icon: CheckSquare, color: 'text-emerald-500' },
            { label: 'Due Today', value: today, icon: Clock, color: 'text-cyan-500' },
            { label: 'Overdue', value: overdue, icon: AlertCircle, color: 'text-red-500' },
            { label: 'Completed', value: done, icon: CheckSquare, color: 'text-slate-400' },
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
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input placeholder="Search tasks..." className="pl-9 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {['All', 'high', 'medium', 'low'].map(p => (
              <button key={p} onClick={() => setFilterPriority(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${filterPriority === p ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {['All', 'JD', 'SB', 'AM'].map(a => (
              <button key={a} onClick={() => setFilterAssignee(a)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterAssignee === a ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}>
                {a}
              </button>
            ))}
          </div>
          <Button size="sm" className="ml-auto bg-primary text-white text-xs" onClick={() => setShowCreate(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
          </Button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <p className="text-sm font-semibold text-slate-800 mb-3">New Task</p>
            <div className="flex gap-3 mb-3">
              <Input placeholder="Task title..." className="h-9 text-sm flex-1" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="flex gap-3">
              <select className="h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                {Object.keys(TYPE_STYLES).map(t => <option key={t}>{t}</option>)}
              </select>
              <select className="h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <select className="h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700" value={form.due} onChange={e => setForm(p => ({ ...p, due: e.target.value }))}>
                {['Today', 'Tomorrow', 'Jun 21', 'Jun 22', 'Jun 23'].map(d => <option key={d}>{d}</option>)}
              </select>
              <select className="h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700" value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))}>
                {['JD', 'SB', 'AM'].map(a => <option key={a}>{a}</option>)}
              </select>
              <Button size="sm" className="bg-primary text-white text-xs" onClick={handleCreate}>Save</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Task Sections */}
        <div className="space-y-5">
          {SECTIONS.map(section => {
            const sectionTasks = filtered.filter(section.filter);
            if (sectionTasks.length === 0) return null;
            return (
              <div key={section.label}>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${section.color}`}>{section.label}</h3>
                  <span className="text-xs text-slate-400">({sectionTasks.length})</span>
                </div>
                <div className="space-y-2">
                  {sectionTasks.map((task, i) => (
                    <motion.div key={task.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className={`flex items-center gap-3 p-4 rounded-xl group transition-all ${task.done ? 'opacity-50' : 'hover:shadow-sm'}`}
                      style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                      <button onClick={() => toggle(task.id)} className="flex-shrink-0">
                        {task.done
                          ? <CheckSquare className="w-4 h-4 text-emerald-500" />
                          : <Square className="w-4 h-4 text-slate-300 hover:text-emerald-500 transition-colors" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-xs font-medium text-slate-800 truncate ${task.done ? 'line-through text-slate-400' : ''}`}>{task.title}</p>
                          {task.ai && <Sparkles className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${TYPE_STYLES[task.type] || 'bg-slate-100 text-slate-500'}`}>{task.type}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />{task.due}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-slate-600">{task.assignee}</span>
                        </div>
                        <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all" onClick={() => remove(task.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
