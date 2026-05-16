import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Plus, Play, Pause, Mail, Linkedin, MessageCircle,
  Phone, MoreHorizontal, Sparkles, Users, TrendingUp,
  Reply, Zap, X, ChevronRight, Copy, Trash2,
  Clock, GitBranch, CheckCircle2, Loader2, Edit3,
  BarChart3, AlertCircle, ArrowRight, BookOpen, ListTodo
} from 'lucide-react';
import SequenceTemplates from '@/components/outreach/SequenceTemplates';
import TaskQueuePanel from '@/components/outreach/TaskQueuePanel';
import { ChannelStatusBadge, StepExecutionStatus } from '@/components/outreach/ChannelStatusBadge';
import AIPersonalizePanel from '@/components/ai/AIPersonalizePanel';
import BranchingStepEditor from '@/components/outreach/BranchingStepEditor';
import ProspectManager from '@/components/outreach/ProspectManager';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const channelIcons = { email: Mail, linkedin: Linkedin, whatsapp: MessageCircle, sms: MessageCircle, call: Phone };
const channelColors = { email: 'text-blue-400', linkedin: 'text-blue-500', whatsapp: 'text-primary', sms: 'text-violet-400', call: 'text-amber-400' };
const channelBg = { email: 'bg-blue-500/10', linkedin: 'bg-blue-500/10', whatsapp: 'bg-primary/10', sms: 'bg-violet-500/10', call: 'bg-amber-500/10' };

const statusBadge = {
  active: 'bg-primary/20 text-primary border-primary/30',
  paused: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  draft: 'bg-secondary text-muted-foreground border-border',
};

const initialSequences = [
  {
    id: 1, name: 'Fintech CTO Outbound — Nigeria', channel: 'multi-channel', status: 'active',
    enrolled: 142, replied: 31, meetings: 8, opens: 89,
    tags: ['fintech', 'cto', 'series-b'],
    steps: [
      { type: 'email', day: 0, subject: 'Quick question about your payment stack', body: 'Hi {{first_name}}, noticed {{company}} recently...' },
      { type: 'linkedin', day: 2, subject: 'LinkedIn connection + note', body: 'Hi {{first_name}}, I work with fintech teams in Nigeria...' },
      { type: 'email', day: 5, subject: 'Following up — case study inside', body: 'Hi {{first_name}}, wanted to share how we helped...' },
      { type: 'call', day: 8, subject: 'Discovery call attempt', body: 'Call objective: qualify budget & timeline' },
      { type: 'email', day: 12, subject: 'Last touchpoint from me', body: 'Hi {{first_name}}, I don\'t want to keep...' },
    ]
  },
  {
    id: 2, name: 'SMB Decision Maker — WhatsApp', channel: 'whatsapp', status: 'active',
    enrolled: 89, replied: 22, meetings: 5, opens: 89,
    tags: ['nigeria', 'smb', 'whatsapp'],
    steps: [
      { type: 'whatsapp', day: 0, subject: 'Initial WhatsApp intro', body: 'Hi {{first_name}}! 👋 I\'m reaching out from RVNU...' },
      { type: 'whatsapp', day: 3, subject: 'Follow-up with value', body: 'Hey {{first_name}}, just wanted to follow up...' },
      { type: 'whatsapp', day: 7, subject: 'Case study share', body: 'Hi {{first_name}}, thought this might be relevant...' },
    ]
  },
  {
    id: 3, name: 'Inbound Lead Nurture', channel: 'email', status: 'active',
    enrolled: 234, replied: 67, meetings: 19, opens: 156,
    tags: ['inbound', 'nurture'],
    steps: [
      { type: 'email', day: 0, subject: 'Welcome — here\'s what to expect', body: 'Hi {{first_name}}, thanks for your interest...' },
      { type: 'email', day: 2, subject: 'How teams like yours use RVNU', body: 'Hi {{first_name}}, I wanted to share...' },
      { type: 'email', day: 5, subject: 'Quick question', body: 'Hi {{first_name}}, just checking in...' },
    ]
  },
  {
    id: 4, name: 'Re-engagement — Cold Leads', channel: 'email', status: 'paused',
    enrolled: 47, replied: 8, meetings: 2, opens: 18,
    tags: ['cold', 're-engagement'],
    steps: [
      { type: 'email', day: 0, subject: 'Still relevant for {{company}}?', body: 'Hi {{first_name}}, it\'s been a while...' },
      { type: 'email', day: 5, subject: 'One last thought', body: 'Hi {{first_name}}, I\'ll keep this brief...' },
    ]
  },
  {
    id: 5, name: 'Event Follow-up Sequence', channel: 'multi-channel', status: 'draft',
    enrolled: 0, replied: 0, meetings: 0, opens: 0,
    tags: ['event', 'follow-up'],
    steps: []
  },
];

function SequenceRow({ seq, isSelected, onSelect, onToggleStatus }) {
  const replyRate = seq.enrolled > 0 ? ((seq.replied / seq.enrolled) * 100).toFixed(1) : 0;
  const meetingRate = seq.enrolled > 0 ? ((seq.meetings / seq.enrolled) * 100).toFixed(1) : 0;
  const ChannelIcon = seq.channel === 'multi-channel' ? Zap : (channelIcons[seq.channel] || Mail);
  const channelColor = seq.channel === 'multi-channel' ? 'text-amber-400' : (channelColors[seq.channel] || 'text-blue-400');

  return (
    <div onClick={() => onSelect(seq)}
      className={`flex items-center gap-4 px-5 py-4 border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
      <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0`}>
        <ChannelIcon className={`w-4 h-4 ${channelColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-foreground truncate">{seq.name}</p>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${statusBadge[seq.status]}`}>
            {seq.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {seq.tags.map(t => <span key={t} className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{t}</span>)}
        </div>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm flex-shrink-0">
        <div className="text-center">
          <p className="font-bold text-foreground">{seq.enrolled}</p>
          <p className="text-[10px] text-muted-foreground">Enrolled</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-primary">{replyRate}%</p>
          <p className="text-[10px] text-muted-foreground">Reply</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-cyan-400">{meetingRate}%</p>
          <p className="text-[10px] text-muted-foreground">Meeting</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button onClick={e => { e.stopPropagation(); onToggleStatus(seq.id); }}
          className={`p-1.5 rounded-md transition-colors ${seq.status === 'active' ? 'hover:bg-amber-500/10 text-amber-400' : 'hover:bg-primary/10 text-primary'}`}>
          {seq.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function StepEditor({ step, index, onUpdate, onRemove, onOpenPersonalize }) {
  const Icon = channelIcons[step.type] || Mail;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full ${channelBg[step.type] || 'bg-secondary'} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${channelColors[step.type] || 'text-muted-foreground'}`} />
        </div>
        {index < 10 && <div className="w-px h-8 bg-border/40 mt-1" />}
      </div>
      <div className="flex-1 pb-4">
        <div className="glass rounded-lg p-3 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <select value={step.type} onChange={e => onUpdate(index, { ...step, type: e.target.value })}
              className="bg-secondary text-foreground text-xs rounded-md px-2 py-1 border border-border/50 outline-none">
              <option value="email">Email</option>
              <option value="linkedin">LinkedIn</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="call">Call Task</option>
            </select>
            <span className="text-xs text-muted-foreground">Day</span>
            <input type="number" value={step.day} min={0}
              onChange={e => onUpdate(index, { ...step, day: parseInt(e.target.value) || 0 })}
              className="w-14 bg-secondary text-foreground text-xs rounded-md px-2 py-1 border border-border/50 outline-none" />
            <button onClick={() => onRemove(index)} className="ml-auto text-muted-foreground hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <Input value={step.subject} onChange={e => onUpdate(index, { ...step, subject: e.target.value })}
            placeholder="Subject / Task description" className="text-xs mb-2 h-8" />
          <Textarea value={step.body} onChange={e => onUpdate(index, { ...step, body: e.target.value })}
            placeholder="Message body... use {{first_name}}, {{company}} for personalization"
            className="text-xs resize-none" rows={2} />
          <button onClick={onOpenPersonalize} type="button"
            className="mt-1.5 flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors">
            <Sparkles className="w-2.5 h-2.5" /> AI Personalize — analyze a company website
          </button>
          <BranchingStepEditor step={step} index={index} onUpdate={onUpdate} />
        </div>
      </div>
    </div>
  );
}

function CreateSequenceModal({ onClose, onSave, onOpenPersonalize }) {
  const [name, setName] = useState('');
  const [steps, setSteps] = useState([{ type: 'email', day: 0, subject: '', body: '' }]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const addStep = () => setSteps([...steps, { type: 'email', day: (steps[steps.length - 1]?.day || 0) + 3, subject: '', body: '' }]);
  const updateStep = (i, s) => setSteps(steps.map((st, idx) => idx === i ? s : st));
  const removeStep = (i) => setSteps(steps.filter((_, idx) => idx !== i));

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert B2B sales sequence writer for African and emerging markets.
      
Generate a complete outbound sequence based on this goal: "${aiPrompt}"

Return a JSON object with:
- name: sequence name (string)
- steps: array of steps, each with:
  - type: "email" | "linkedin" | "whatsapp" | "sms" | "call"
  - day: number (when to send, starting from 0)
  - subject: string (subject line or task title)
  - body: string (message body, use {{first_name}} and {{company}} placeholders)

Return 4-6 steps. Make the messaging specific, personalized, and relevant to the goal.`,
      response_json_schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          steps: { type: 'array', items: { type: 'object', properties: {
            type: { type: 'string' }, day: { type: 'number' },
            subject: { type: 'string' }, body: { type: 'string' }
          }}}
        }
      }
    });
    if (result?.name) setName(result.name);
    if (result?.steps?.length) setSteps(result.steps);
    setAiLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl border border-border/60 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <h2 className="font-bold text-foreground">Create Sequence</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* AI Generator */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Generate with AI</span>
            </div>
            <div className="flex gap-2">
              <Input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. 5-step sequence for fintech CFOs in Lagos focused on cost reduction"
                className="text-sm flex-1" />
              <Button onClick={generateWithAI} disabled={aiLoading || !aiPrompt.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiLoading ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Sequence Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fintech CTO — Q3 Outbound" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steps ({steps.length})</label>
              <button onClick={addStep} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>
            <div className="space-y-0">
              {steps.map((step, i) => (
                <StepEditor key={i} step={step} index={i} onUpdate={updateStep} onRemove={removeStep} onOpenPersonalize={onOpenPersonalize} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-border/30">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ name: name || 'New Sequence', steps, status: 'draft', channel: 'multi-channel', enrolled: 0, replied: 0, meetings: 0, opens: 0, tags: [] })}
            disabled={!name.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Save Sequence
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Outreach() {
  const [sequences, setSequences] = useState(initialSequences);
  const [selectedSeq, setSelectedSeq] = useState(initialSequences[0]);
  const [showCreate, setShowCreate] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTaskQueue, setShowTaskQueue] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [showProspects, setShowProspects] = useState(false);

  const totalEnrolled = sequences.reduce((s, seq) => s + seq.enrolled, 0);
  const totalReplied = sequences.reduce((s, seq) => s + seq.replied, 0);
  const totalMeetings = sequences.reduce((s, seq) => s + seq.meetings, 0);

  const toggleStatus = (id) => {
    setSequences(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next = s.status === 'active' ? 'paused' : s.status === 'paused' ? 'active' : 'active';
      return { ...s, status: next };
    }));
  };

  const saveSequence = (data) => {
    const newSeq = { ...data, id: Date.now() };
    setSequences(prev => [...prev, newSeq]);
    setSelectedSeq(newSeq);
    setShowCreate(false);
  };

  const duplicateSequence = (seq) => {
    const copy = { ...seq, id: Date.now(), name: `${seq.name} (Copy)`, status: 'draft', enrolled: 0, replied: 0, meetings: 0, opens: 0 };
    setSequences(prev => [...prev, copy]);
  };

  const useTemplate = (template) => {
    const newSeq = {
      id: Date.now(), name: template.name, channel: template.channel, status: 'draft',
      enrolled: 0, replied: 0, meetings: 0, opens: 0, tags: template.tags,
      steps: template.steps_data
    };
    setSequences(prev => [...prev, newSeq]);
    setSelectedSeq(newSeq);
    setShowTemplates(false);
  };

  const getAISuggestion = async () => {
    if (!selectedSeq) return;
    setAiSuggesting(true);
    setAiSuggestion(null);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this outreach sequence and suggest ONE specific improvement:
Sequence: "${selectedSeq.name}"
Steps: ${selectedSeq.steps.length} steps
Reply rate: ${selectedSeq.enrolled > 0 ? ((selectedSeq.replied/selectedSeq.enrolled)*100).toFixed(1) : 0}%
Meeting rate: ${selectedSeq.enrolled > 0 ? ((selectedSeq.meetings/selectedSeq.enrolled)*100).toFixed(1) : 0}%
Tags: ${selectedSeq.tags.join(', ')}

Give a concise, actionable suggestion (1-2 sentences) to improve performance.`,
    });
    setAiSuggestion(result);
    setAiSuggesting(false);
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Sequences" subtitle="AI-powered multichannel outreach engine" />

      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Sequences', value: sequences.filter(s => s.status === 'active').length, icon: Zap, color: 'text-primary' },
            { label: 'Total Enrolled', value: totalEnrolled.toLocaleString(), icon: Users, color: 'text-cyan-400' },
            { label: 'Overall Reply Rate', value: `${totalEnrolled > 0 ? ((totalReplied/totalEnrolled)*100).toFixed(1) : 0}%`, icon: Reply, color: 'text-violet-400' },
            { label: 'Meetings Booked', value: totalMeetings, icon: TrendingUp, color: 'text-amber-400' },
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

        <div className="grid lg:grid-cols-5 gap-4">
          {/* Sequences List */}
          <div className="lg:col-span-3 glass rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <h3 className="font-bold text-foreground">All Sequences</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowTaskQueue(!showTaskQueue)} className="gap-1.5 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                  <ListTodo className="w-3.5 h-3.5" /> Task Queue
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowTemplates(true)} className="gap-1.5 text-xs border-border/60">
                  <BookOpen className="w-3.5 h-3.5" /> Templates
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowPersonalize(true)} className="gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/10">
                  <Sparkles className="w-3.5 h-3.5" /> AI Personalize
                </Button>
                <Button size="sm" onClick={() => setShowCreate(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                  <Plus className="w-3.5 h-3.5" /> New Sequence
                </Button>
              </div>
            </div>
            <div>
              {sequences.map(seq => (
                <SequenceRow key={seq.id} seq={seq} isSelected={selectedSeq?.id === seq.id}
                  onSelect={setSelectedSeq} onToggleStatus={toggleStatus} />
              ))}
            </div>
          </div>

          {/* Task Queue or Sequence Detail */}
          <div className="lg:col-span-2 glass rounded-xl p-5">
            {showTaskQueue ? (
              <TaskQueuePanel onClose={() => setShowTaskQueue(false)} />
            ) : selectedSeq ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-sm">{selectedSeq.name}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge[selectedSeq.status]}`}>
                      {selectedSeq.status}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => setShowProspects(true)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-primary" title="Manage Prospects">
                      <Users className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => duplicateSequence(selectedSeq)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground" title="Duplicate">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Performance */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: 'Enrolled', value: selectedSeq.enrolled, color: 'text-foreground' },
                    { label: 'Opens', value: selectedSeq.opens, color: 'text-cyan-400' },
                    { label: 'Replies', value: selectedSeq.replied, color: 'text-primary' },
                    { label: 'Meetings', value: selectedSeq.meetings, color: 'text-amber-400' },
                  ].map(m => (
                    <div key={m.label} className="text-center p-2 rounded-lg bg-secondary/50">
                      <p className={`text-base font-black ${m.color}`}>{m.value}</p>
                      <p className="text-[10px] text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Steps */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Sequence Steps ({selectedSeq.steps.length})
                  </p>
                  <div className="space-y-0 max-h-52 overflow-y-auto pr-1">
                    {selectedSeq.steps.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No steps yet. Edit to add steps.</p>
                    ) : selectedSeq.steps.map((step, i) => {
                      const Icon = channelIcons[step.type] || Mail;
                      return (
                        <div key={i} className="flex items-start gap-3 py-1.5">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-6 h-6 rounded-full ${channelBg[step.type] || 'bg-secondary'} flex items-center justify-center`}>
                              <Icon className={`w-3 h-3 ${channelColors[step.type]}`} />
                            </div>
                            {i < selectedSeq.steps.length - 1 && <div className="w-px h-4 bg-border/40 mt-0.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{step.subject}</p>
                            <p className="text-[10px] text-muted-foreground mb-1">Day {step.day} · {step.type}</p>
                            <StepExecutionStatus step={step} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Insight */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold text-primary">AI Copilot</span>
                    </div>
                    <button onClick={getAISuggestion} disabled={aiSuggesting}
                      className="text-[10px] text-primary/70 hover:text-primary flex items-center gap-1">
                      {aiSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {aiSuggesting ? 'Analyzing...' : 'Refresh'}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {aiSuggestion || (selectedSeq.replied > 0
                      ? `Reply rate of ${((selectedSeq.replied/selectedSeq.enrolled)*100).toFixed(1)}% — consider A/B testing your subject lines to push above 25%.`
                      : 'Click Refresh for AI-powered optimization suggestions for this sequence.')}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                Select a sequence to view details
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCreate && <CreateSequenceModal onClose={() => setShowCreate(false)} onSave={saveSequence} onOpenPersonalize={() => setShowPersonalize(true)} />}
        {showTemplates && <SequenceTemplates onClose={() => setShowTemplates(false)} onUse={useTemplate} />}
      </AnimatePresence>
      {showPersonalize && <AIPersonalizePanel onClose={() => setShowPersonalize(false)} />}
      {showProspects && <ProspectManager sequence={selectedSeq} onClose={() => setShowProspects(false)} />}
    </div>
  );
}