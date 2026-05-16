import { useState } from 'react';
import { Users, Search, Plus, X, UserMinus, UserCheck, Loader2, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const mockProspects = [
  { id: 'p1', name: 'Amara Diallo', company: 'Flutterwave', step: 3, status: 'active', email: 'amara@flutterwave.com' },
  { id: 'p2', name: 'Tunde Okafor', company: 'Paystack', step: 1, status: 'active', email: 'tunde@paystack.com' },
  { id: 'p3', name: 'Chioma Eze', company: 'Andela', step: 2, status: 'paused', email: 'chioma@andela.com' },
  { id: 'p4', name: 'Kweku Mensah', company: 'Wave', step: 5, status: 'completed', email: 'kweku@wave.com' },
];

const statusBadge = {
  active: 'bg-primary/20 text-primary border-primary/30',
  paused: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  completed: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

export default function ProspectManager({ sequence, onClose }) {
  const [prospects, setProspects] = useState(mockProspects);
  const [search, setSearch] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const filtered = prospects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.company.toLowerCase().includes(search.toLowerCase())
  );

  const removeProspect = (id) => {
    setProspects(prev => prev.filter(p => p.id !== id));
  };

  const pauseProspect = (id) => {
    setProspects(prev => prev.map(p => p.id === id
      ? { ...p, status: p.status === 'active' ? 'paused' : 'active' }
      : p
    ));
  };

  const addProspect = async () => {
    if (!addEmail.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500)); // simulate API
    setProspects(prev => [...prev, {
      id: Date.now().toString(),
      name: addEmail.split('@')[0],
      company: addEmail.split('@')[1]?.split('.')[0] || 'Unknown',
      step: 1,
      status: 'active',
      email: addEmail
    }]);
    setAddEmail('');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg glass rounded-2xl border border-border/60 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-foreground text-sm">Manage Prospects</h2>
            <span className="text-xs text-muted-foreground">— {sequence?.name}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Add prospect */}
          <div className="flex gap-2">
            <Input
              value={addEmail}
              onChange={e => setAddEmail(e.target.value)}
              placeholder="Add prospect by email..."
              className="text-sm bg-secondary/50 border-border/50"
              onKeyDown={e => e.key === 'Enter' && addProspect()}
            />
            <Button onClick={addProspect} disabled={!addEmail.trim() || loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-3">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search prospects..." className="pl-9 text-sm bg-secondary/50 border-border/50" />
          </div>

          {/* List */}
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No prospects enrolled</p>
            ) : filtered.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.company} · Step {p.step}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusBadge[p.status]}`}>
                  {p.status}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => pauseProspect(p.id)}
                    className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-amber-400 transition-colors"
                    title={p.status === 'active' ? 'Pause' : 'Resume'}>
                    <UserCheck className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => removeProspect(p.id)}
                    className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove from sequence">
                    <UserMinus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
            <span>{prospects.filter(p => p.status === 'active').length} active · {prospects.filter(p => p.status === 'completed').length} completed</span>
            <Button size="sm" variant="outline" onClick={onClose} className="text-xs border-border/50 h-7">Done</Button>
          </div>
        </div>
      </div>
    </div>
  );
}