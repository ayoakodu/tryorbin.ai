import { Users, Circle } from 'lucide-react';

const teamMembers = [
  { id: 1, name: 'Kofi A.', initials: 'KA', color: 'bg-primary/20 text-primary', active: true },
  { id: 2, name: 'Fatima B.', initials: 'FB', color: 'bg-violet-500/20 text-violet-400', active: true },
  { id: 3, name: 'David M.', initials: 'DM', color: 'bg-cyan-500/20 text-cyan-400', active: false },
];

export default function SharedInboxHeader({ assignedTo, onAssign }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-secondary/30 border-b border-border/20">
      <div className="flex items-center gap-1.5">
        <Users className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Team Online</span>
      </div>
      <div className="flex items-center gap-1.5">
        {teamMembers.map(m => (
          <button key={m.id} onClick={() => onAssign(m)}
            title={m.name}
            className={`w-6 h-6 rounded-full text-[9px] font-bold flex items-center justify-center transition-all
              ${assignedTo?.id === m.id ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}
              ${m.color}`}>
            {m.initials}
            {m.active && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full border border-background" />
            )}
          </button>
        ))}
      </div>
      {assignedTo && (
        <span className="text-[10px] text-muted-foreground ml-auto">
          Assigned to <span className="text-primary font-semibold">{assignedTo.name}</span>
        </span>
      )}
    </div>
  );
}