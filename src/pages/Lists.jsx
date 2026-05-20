import { useState } from 'react';
import { motion } from 'framer-motion';
import { List, Plus, Search, Users, Building2, Star, MoreHorizontal, Trash2, Pencil, Tag, Calendar } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SAMPLE_LISTS = [
  { id: 1, name: 'Fintech CEOs', type: 'People', count: 84, owner: 'JD', tags: ['CEO', 'Fintech'], updated: '2h ago', starred: true },
  { id: 2, name: 'Manufacturing CEOs', type: 'People', count: 47, owner: 'JD', tags: ['CEO', 'Manufacturing'], updated: '1d ago', starred: false },
  { id: 3, name: 'High-Intent Accounts', type: 'Accounts', count: 23, owner: 'SB', tags: ['Hot', 'ABM'], updated: '3h ago', starred: true },
  { id: 4, name: 'Target Accounts Q3', type: 'Accounts', count: 61, owner: 'JD', tags: ['Pipeline', 'Q3'], updated: '2d ago', starred: false },
  { id: 5, name: 'Partnership Managers', type: 'People', count: 38, owner: 'AM', tags: ['Partnerships'], updated: '5d ago', starred: false },
  { id: 6, name: 'CFOs — East Africa', type: 'People', count: 29, owner: 'JD', tags: ['CFO', 'East Africa'], updated: '1w ago', starred: false },
];

export default function Lists() {
  const [lists, setLists] = useState(SAMPLE_LISTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('People');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const filtered = lists.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || l.type === filter;
    return matchSearch && matchFilter;
  });

  const handleCreate = () => {
    if (!newName.trim()) return;
    setLists(prev => [...prev, {
      id: Date.now(), name: newName.trim(), type: newType,
      count: 0, owner: 'JD', tags: [], updated: 'Just now', starred: false,
    }]);
    setNewName(''); setNewType('People'); setShowCreate(false);
  };

  const handleDelete = (id) => setLists(prev => prev.filter(l => l.id !== id));
  const handleStar = (id) => setLists(prev => prev.map(l => l.id === id ? { ...l, starred: !l.starred } : l));
  const handleRename = (id) => {
    setLists(prev => prev.map(l => l.id === id ? { ...l, name: editName } : l));
    setEditId(null); setEditName('');
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', color: '#0f172a' }}>
      <TopBar title="Lists" subtitle="Organize contacts and accounts into targeted lists" />
      <div className="p-6 space-y-5">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Lists', value: lists.length, icon: List, color: 'text-emerald-500' },
            { label: 'Total Contacts', value: lists.filter(l => l.type === 'People').reduce((a, l) => a + l.count, 0).toLocaleString(), icon: Users, color: 'text-cyan-500' },
            { label: 'Account Lists', value: lists.filter(l => l.type === 'Accounts').length, icon: Building2, color: 'text-violet-500' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
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
            <Input placeholder="Search lists..." className="pl-9 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {['All', 'People', 'Accounts'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-500 hover:text-slate-700 hover:bg-white border border-transparent'}`}>
                {f}
              </button>
            ))}
          </div>
          <Button size="sm" className="ml-auto bg-primary text-white text-xs" onClick={() => setShowCreate(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> New List
          </Button>
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <p className="text-sm font-semibold text-slate-800 mb-3">Create New List</p>
            <div className="flex gap-3">
              <Input placeholder="List name..." className="h-9 text-sm flex-1" value={newName} onChange={e => setNewName(e.target.value)} />
              <select value={newType} onChange={e => setNewType(e.target.value)}
                className="h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700">
                <option value="People">People</option>
                <option value="Accounts">Accounts</option>
              </select>
              <Button size="sm" className="bg-primary text-white text-xs" onClick={handleCreate}>Create</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Lists Table */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Name</th>
                <th className="text-left px-5 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Type</th>
                <th className="text-left px-5 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Members</th>
                <th className="text-left px-5 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Tags</th>
                <th className="text-left px-5 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Updated</th>
                <th className="text-left px-5 py-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Owner</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-16 text-slate-400 text-sm">No lists found. Create your first list above.</td></tr>
              )}
              {filtered.map((list, i) => (
                <motion.tr key={list.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleStar(list.id)}>
                        <Star className={`w-3.5 h-3.5 ${list.starred ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-400'}`} />
                      </button>
                      {editId === list.id ? (
                        <div className="flex gap-2">
                          <Input className="h-7 text-xs w-40" value={editName} onChange={e => setEditName(e.target.value)} />
                          <Button size="sm" className="h-7 text-xs bg-primary text-white" onClick={() => handleRename(list.id)}>Save</Button>
                        </div>
                      ) : (
                        <span className="font-medium text-slate-800 text-xs">{list.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${list.type === 'People' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                      {list.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-700 font-medium">{list.count}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {list.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{list.updated}</td>
                  <td className="px-5 py-3.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">{list.owner}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-slate-100 rounded" onClick={() => { setEditId(list.id); setEditName(list.name); }}>
                        <Pencil className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button className="p-1 hover:bg-red-50 rounded" onClick={() => handleDelete(list.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}