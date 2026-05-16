import { useState } from 'react';
import { Phone, Linkedin, Clock, CheckCircle2, Circle, ChevronRight, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sampleTasks = [
  {
    id: 1, type: 'call', contact: 'Amara Diallo', company: 'Flutterwave',
    sequence: 'Fintech CTO Outbound — Nigeria', step: 'Step 4 · Day 8',
    context: 'Objective: qualify budget & timeline. Previous: email opened, LinkedIn connected.',
    dueDate: 'Today', completed: false,
  },
  {
    id: 2, type: 'linkedin', contact: 'Tunde Okafor', company: 'Paystack',
    sequence: 'Fintech CTO Outbound — Nigeria', step: 'Step 2 · Day 2',
    context: 'Send LinkedIn connection request with note: "Hi Tunde, I work with fintech teams in Nigeria..."',
    dueDate: 'Today', completed: false,
  },
  {
    id: 3, type: 'call', contact: 'Kefilwe Mthembu', company: 'Yoco',
    sequence: 'SMB Decision Maker — WhatsApp', step: 'Step 5 · Day 12',
    context: 'Follow-up discovery call. No response to last 2 emails. Try mobile.',
    dueDate: 'Tomorrow', completed: false,
  },
  {
    id: 4, type: 'linkedin', contact: 'Kweku Mensah', company: 'Wave',
    sequence: 'Fintech CTO Outbound — Nigeria', step: 'Step 2 · Day 2',
    context: 'Connect on LinkedIn and send note mentioning Wave\'s expansion into francophone Africa.',
    dueDate: 'Tomorrow', completed: true,
  },
];

const typeConfig = {
  call: { icon: Phone, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Call Task' },
  linkedin: { icon: Linkedin, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'LinkedIn Task' },
};

export default function TaskQueuePanel({ onClose }) {
  const [tasks, setTasks] = useState(sampleTasks);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('pending');

  const toggle = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const filtered = tasks.filter(t => filter === 'all' ? true : filter === 'pending' ? !t.completed : t.completed);
  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">Task Queue</h3>
            <p className="text-[10px] text-muted-foreground">LinkedIn & Call tasks from sequences</p>
          </div>
        </div>
        {pendingCount > 0 && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {pendingCount} pending
          </span>
        )}
      </div>

      <div className="flex gap-1 p-3 border-b border-border/20">
        {[['pending', 'Pending'], ['completed', 'Completed'], ['all', 'All']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${filter === val ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-border/20 max-h-80 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-xs">No tasks in this view</div>
        )}
        {filtered.map(task => {
          const cfg = typeConfig[task.type];
          const Icon = cfg.icon;
          return (
            <div key={task.id} className={`px-4 py-3 transition-colors ${task.completed ? 'opacity-50' : 'hover:bg-secondary/30'}`}>
              <div className="flex items-start gap-3">
                <button onClick={() => toggle(task.id)} className="mt-0.5 flex-shrink-0">
                  {task.completed
                    ? <CheckCircle2 className="w-4 h-4 text-primary" />
                    : <Circle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${cfg.bg}`}>
                      <Icon className={`w-3 h-3 ${cfg.color}`} />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{task.contact}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground">{task.company}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-1">{task.sequence} · {task.step}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium ${task.dueDate === 'Today' ? 'text-amber-400' : 'text-muted-foreground'}`}>
                      Due {task.dueDate}
                    </span>
                    <button onClick={() => setExpanded(expanded === task.id ? null : task.id)}
                      className="text-[10px] text-primary/70 hover:text-primary flex items-center gap-0.5">
                      Context <ChevronRight className={`w-3 h-3 transition-transform ${expanded === task.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                  {expanded === task.id && (
                    <div className="mt-2 p-2.5 rounded-lg bg-secondary/50 border border-border/30">
                      <p className="text-[10px] text-foreground leading-relaxed">{task.context}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}