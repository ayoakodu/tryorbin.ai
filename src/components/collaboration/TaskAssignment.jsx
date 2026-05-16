import { useState } from 'react';
import { CheckSquare, Plus, X, Clock, User, CheckCircle2 } from 'lucide-react';

const teamMembers = [
  { id: 1, name: 'Kofi A.', initials: 'KA', color: 'bg-primary/20 text-primary' },
  { id: 2, name: 'Fatima B.', initials: 'FB', color: 'bg-violet-500/20 text-violet-400' },
  { id: 3, name: 'David M.', initials: 'DM', color: 'bg-cyan-500/20 text-cyan-400' },
  { id: 4, name: 'Amina S.', initials: 'AS', color: 'bg-amber-500/20 text-amber-400' },
];

const initialTasks = [
  { id: 1, text: 'Send proposal to Flutterwave', assignee: teamMembers[0], due: 'Tomorrow', done: false },
  { id: 2, text: 'Follow up with Andela contact', assignee: teamMembers[1], due: 'Today', done: true },
];

export default function TaskAssignment({ entityId }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [assignee, setAssignee] = useState(teamMembers[0]);
  const [showForm, setShowForm] = useState(false);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask, assignee, due: 'No date', done: false }]);
    setNewTask('');
    setShowForm(false);
  };

  const toggleDone = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Tasks ({tasks.filter(t => !t.done).length} open)
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add Task
        </button>
      </div>

      <div className="space-y-2 mb-3">
        {tasks.map(task => (
          <div key={task.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-colors ${task.done ? 'opacity-50' : 'bg-secondary/30'}`}>
            <button onClick={() => toggleDone(task.id)} className="flex-shrink-0">
              {task.done
                ? <CheckCircle2 className="w-4 h-4 text-primary" />
                : <div className="w-4 h-4 rounded border border-border/60" />
              }
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-xs ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.text}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${task.assignee.color}`}>
                  {task.assignee.initials}
                </div>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" /> {task.due}
                </span>
              </div>
            </div>
            <button onClick={() => removeTask(task.id)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 space-y-2">
          <input value={newTask} onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addTask(); }}
            placeholder="Task description..."
            className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none" />
          <div className="flex items-center gap-2">
            <select value={assignee.id} onChange={e => setAssignee(teamMembers.find(m => m.id === Number(e.target.value)))}
              className="flex-1 bg-secondary border border-border/50 rounded-lg px-2 py-1.5 text-xs text-foreground outline-none">
              {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <button onClick={addTask} disabled={!newTask.trim()}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs disabled:opacity-40">
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}