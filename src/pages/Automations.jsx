import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Zap, Plus, Play, Pause, Trash2, Sparkles, Loader2,
  Mail, MessageCircle, Bell, GitBranch, Clock, CheckCircle2,
  MoreHorizontal, X, ChevronRight, RefreshCw, AlertCircle
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const triggerTypes = [
  { id: 'reply_received', label: 'Reply Received', icon: Mail, color: 'text-blue-400' },
  { id: 'deal_stage_change', label: 'Deal Stage Changed', icon: GitBranch, color: 'text-violet-400' },
  { id: 'no_reply_after', label: 'No Reply After X Days', icon: Clock, color: 'text-amber-400' },
  { id: 'contact_created', label: 'New Contact Added', icon: CheckCircle2, color: 'text-primary' },
  { id: 'meeting_booked', label: 'Meeting Booked', icon: CheckCircle2, color: 'text-cyan-400' },
  { id: 'whatsapp_reply', label: 'WhatsApp Reply', icon: MessageCircle, color: 'text-primary' },
];

const actionTypes = [
  { id: 'send_email', label: 'Send Email', icon: Mail },
  { id: 'send_whatsapp', label: 'Send WhatsApp', icon: MessageCircle },
  { id: 'slack_notify', label: 'Slack Notification', icon: Bell },
  { id: 'add_to_sequence', label: 'Add to Sequence', icon: Zap },
  { id: 'update_deal_stage', label: 'Update Deal Stage', icon: GitBranch },
  { id: 'create_task', label: 'Create Task', icon: CheckCircle2 },
];

const initialAutomations = [
  { id: 1, name: 'Auto Follow-up — No Reply in 3 Days', trigger: 'no_reply_after', action: 'send_email', status: 'active', runs: 142, lastRun: '2h ago', description: 'Automatically sends a follow-up email if a prospect hasn\'t replied within 3 days of initial outreach.' },
  { id: 2, name: 'WhatsApp Reply → Slack Alert', trigger: 'whatsapp_reply', action: 'slack_notify', status: 'active', runs: 89, lastRun: '15m ago', description: 'Notifies the sales team on Slack immediately when a prospect replies on WhatsApp.' },
  { id: 3, name: 'New Contact → Welcome Sequence', trigger: 'contact_created', action: 'add_to_sequence', status: 'active', runs: 234, lastRun: '1h ago', description: 'Automatically enrolls new contacts into the onboarding email sequence.' },
  { id: 4, name: 'Deal Won → Handoff Task', trigger: 'deal_stage_change', action: 'create_task', status: 'paused', runs: 31, lastRun: '2d ago', description: 'Creates a customer success handoff task when a deal moves to Closed Won stage.' },
  { id: 5, name: 'Meeting Booked → CRM Update', trigger: 'meeting_booked', action: 'update_deal_stage', status: 'active', runs: 67, lastRun: '30m ago', description: 'Automatically moves the associated deal to Proposal stage when a discovery call is booked.' },
];

const statusColors = {
  active: 'bg-primary/20 text-primary border-primary/30',
  paused: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

function AutomationRow({ automation, onToggle, onDelete }) {
  const trigger = triggerTypes.find(t => t.id === automation.trigger);
  const action = actionTypes.find(a => a.id === automation.action);
  const TriggerIcon = trigger?.icon || Zap;
  const ActionIcon = action?.icon || Zap;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 hover:border-border/60 transition-all group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Trigger → Action Visual */}
          <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
            <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center ${trigger?.color || 'text-muted-foreground'}`}>
              <TriggerIcon className="w-4 h-4" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ActionIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold text-sm text-foreground truncate">{automation.name}</h4>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${statusColors[automation.status]}`}>
                {automation.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{automation.description}</p>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span><strong className="text-foreground">{automation.runs}</strong> runs</span>
              <span>Last run: {automation.lastRun}</span>
              <span className="text-primary/70">{trigger?.label} → {action?.label}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={() => onToggle(automation.id)}
            className={`p-1.5 rounded-md transition-colors ${automation.status === 'active' ? 'hover:bg-amber-500/10 text-amber-400' : 'hover:bg-primary/10 text-primary'}`}>
            {automation.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => onDelete(automation.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Automations() {
  const [automations, setAutomations] = useState(initialAutomations);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', trigger: '', action: '', description: '' });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const { toast } = useToast();

  const activeCount = automations.filter(a => a.status === 'active').length;
  const totalRuns = automations.reduce((s, a) => s + a.runs, 0);

  const toggleAutomation = (id) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a));
  };

  const deleteAutomation = (id) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    toast({ title: 'Automation deleted' });
  };

  const createAutomation = () => {
    if (!form.name || !form.trigger || !form.action) return;
    const newAuto = { ...form, id: Date.now(), status: 'active', runs: 0, lastRun: 'Never' };
    setAutomations(prev => [...prev, newAuto]);
    toast({ title: 'Automation created!', description: `"${form.name}" is now active.` });
    setShowCreate(false);
    setForm({ name: '', trigger: '', action: '', description: '' });
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Create a sales automation workflow based on: "${aiPrompt}"
Return JSON with: name (string), trigger (one of: reply_received/deal_stage_change/no_reply_after/contact_created/meeting_booked/whatsapp_reply), action (one of: send_email/send_whatsapp/slack_notify/add_to_sequence/update_deal_stage/create_task), description (1-2 sentences explaining what it does).`,
      response_json_schema: {
        type: 'object', properties: {
          name: { type: 'string' }, trigger: { type: 'string' }, action: { type: 'string' }, description: { type: 'string' }
        }
      }
    });
    if (result?.name) {
      setForm({ name: result.name, trigger: result.trigger || '', action: result.action || '', description: result.description || '' });
    }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Automations" subtitle="Trigger-based workflows to automate your GTM execution" />

      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Automations', value: activeCount, color: 'text-primary', icon: Zap },
            { label: 'Total Runs', value: totalRuns.toLocaleString(), color: 'text-cyan-400', icon: RefreshCw },
            { label: 'Time Saved (hrs)', value: '148', color: 'text-violet-400', icon: Clock },
            { label: 'Tasks Automated', value: '563', color: 'text-amber-400', icon: CheckCircle2 },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* AI Create Banner */}
        <div className="glass rounded-xl p-5 border border-primary/20 flex flex-col md:flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-0.5">AI Automation Builder</h3>
            <p className="text-xs text-muted-foreground">Describe a workflow in plain language and AI will build the automation for you.</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Automation
          </Button>
        </div>

        {/* Automations List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">All Automations ({automations.length})</h3>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {automations.map(automation => (
                <AutomationRow key={automation.id} automation={automation} onToggle={toggleAutomation} onDelete={deleteAutomation} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Create Automation Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader><DialogTitle>Create Automation</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {/* AI Generator */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Generate with AI</span>
              </div>
              <div className="flex gap-2">
                <Input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                  placeholder="e.g. Send follow-up WhatsApp if no reply in 2 days"
                  className="text-sm flex-1" />
                <Button onClick={generateWithAI} disabled={aiLoading || !aiPrompt.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Automation Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Auto Follow-up After 3 Days" className="bg-secondary/50 border-border/60" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Trigger *</Label>
                <Select value={form.trigger} onValueChange={v => setForm({ ...form, trigger: v })}>
                  <SelectTrigger className="bg-secondary/50 border-border/60"><SelectValue placeholder="When this happens..." /></SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Action *</Label>
                <Select value={form.action} onValueChange={v => setForm({ ...form, action: v })}>
                  <SelectTrigger className="bg-secondary/50 border-border/60"><SelectValue placeholder="Do this..." /></SelectTrigger>
                  <SelectContent>
                    {actionTypes.map(a => <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Description</Label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Briefly describe what this automation does" className="bg-secondary/50 border-border/60" />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1 border-border/60">Cancel</Button>
              <Button onClick={createAutomation} disabled={!form.name || !form.trigger || !form.action}
                className="flex-1 bg-primary text-primary-foreground">
                Create Automation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}