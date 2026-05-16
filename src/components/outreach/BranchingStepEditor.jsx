import { useState } from 'react';
import { GitBranch, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const conditionOptions = [
  { value: 'opened', label: 'Email Opened' },
  { value: 'clicked', label: 'Link Clicked' },
  { value: 'replied', label: 'Replied' },
  { value: 'not_opened', label: 'Not Opened (after X days)' },
  { value: 'not_replied', label: 'No Reply (after X days)' },
  { value: 'meeting_booked', label: 'Meeting Booked' },
];

const actionOptions = [
  { value: 'send_email', label: 'Send Email' },
  { value: 'send_whatsapp', label: 'Send WhatsApp' },
  { value: 'linkedin_connect', label: 'LinkedIn Connect' },
  { value: 'add_to_sequence', label: 'Add to Sequence' },
  { value: 'remove_from_sequence', label: 'Remove from Sequence' },
  { value: 'notify_rep', label: 'Notify Sales Rep' },
  { value: 'create_task', label: 'Create Task' },
];

function Branch({ branch, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="ml-4 border-l-2 border-primary/30 pl-3 mt-2">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground">
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">IF</span>
        <Select value={branch.condition} onValueChange={v => onUpdate({ ...branch, condition: v })}>
          <SelectTrigger className="h-7 text-xs bg-secondary/50 border-border/50 flex-1">
            <SelectValue placeholder="Select condition..." />
          </SelectTrigger>
          <SelectContent>
            {conditionOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {expanded && (
        <div className="space-y-2 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider w-8">THEN</span>
            <Select value={branch.action} onValueChange={v => onUpdate({ ...branch, action: v })}>
              <SelectTrigger className="h-7 text-xs bg-secondary/50 border-border/50 flex-1">
                <SelectValue placeholder="Select action..." />
              </SelectTrigger>
              <SelectContent>
                {actionOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {(branch.action === 'send_email' || branch.action === 'send_whatsapp') && (
            <Input
              value={branch.message || ''}
              onChange={e => onUpdate({ ...branch, message: e.target.value })}
              placeholder="Message content..."
              className="text-xs h-7 bg-secondary/50 border-border/50"
            />
          )}
          {(branch.condition === 'not_opened' || branch.condition === 'not_replied') && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Wait</span>
              <Input
                type="number"
                value={branch.wait_days || 3}
                onChange={e => onUpdate({ ...branch, wait_days: parseInt(e.target.value) || 3 })}
                className="w-16 text-xs h-7 bg-secondary/50 border-border/50"
                min={1}
              />
              <span className="text-[10px] text-muted-foreground">days before triggering</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BranchingStepEditor({ step, index, onUpdate }) {
  const [showBranches, setShowBranches] = useState(false);
  const branches = step.branches || [];

  const addBranch = () => {
    onUpdate(index, {
      ...step,
      branches: [...branches, { id: Date.now(), condition: '', action: '', message: '', wait_days: 3 }]
    });
  };

  const updateBranch = (bIdx, updated) => {
    const newBranches = branches.map((b, i) => i === bIdx ? updated : b);
    onUpdate(index, { ...step, branches: newBranches });
  };

  const removeBranch = (bIdx) => {
    onUpdate(index, { ...step, branches: branches.filter((_, i) => i !== bIdx) });
  };

  return (
    <div className="mt-2">
      <button
        onClick={() => setShowBranches(!showBranches)}
        className="flex items-center gap-1.5 text-[10px] font-medium text-violet-400 hover:text-violet-300 transition-colors"
      >
        <GitBranch className="w-3 h-3" />
        {branches.length > 0 ? `${branches.length} branch condition${branches.length > 1 ? 's' : ''}` : 'Add conditional branch'}
        {showBranches ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>

      {showBranches && (
        <div className="mt-2 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
          <p className="text-[10px] text-muted-foreground mb-2">Define what happens based on prospect behavior after this step:</p>
          {branches.map((branch, bIdx) => (
            <Branch
              key={branch.id || bIdx}
              branch={branch}
              onUpdate={(updated) => updateBranch(bIdx, updated)}
              onRemove={() => removeBranch(bIdx)}
            />
          ))}
          <button
            onClick={addBranch}
            className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 mt-2 ml-2"
          >
            <Plus className="w-3 h-3" /> Add condition
          </button>
        </div>
      )}
    </div>
  );
}