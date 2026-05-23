import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Plus, Play, Pause, Mail, MessageCircle,
  Phone, MoreHorizontal, Sparkles, Users, TrendingUp,
  Reply, Zap, X, Loader2,
  BarChart3, BookOpen, ListTodo, ArrowRight, Clock, Edit3, Copy,
  AlertTriangle, Activity, Stethoscope
} from 'lucide-react';
import { Linkedin } from 'lucide-react';
import SequenceTemplates from '@/components/outreach/SequenceTemplates';
import TaskQueuePanel from '@/components/outreach/TaskQueuePanel';
import AIPersonalizePanel from '@/components/ai/AIPersonalizePanel';
import ProspectManager from '@/components/outreach/ProspectManager';
import SequenceActivationPage from '@/components/outreach/SequenceActivationPage';
import SequenceAnalyticsTab from '@/components/outreach/SequenceAnalyticsTab';
import SequenceDiagnosticsTab from '@/components/outreach/SequenceDiagnosticsTab';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const channelIcons = { email: Mail, linkedin: Linkedin, whatsapp: MessageCircle, sms: MessageCircle, call: Phone };
const channelColors = { email: 'text-blue-400', linkedin: 'text-blue-500', whatsapp: 'text-emerald-500', sms: 'text-violet-400', call: 'text-amber-400' };
const channelBg = { email: 'bg-blue-50', linkedin: 'bg-blue-50', whatsapp: 'bg-emerald-50', sms: 'bg-violet-50', call: 'bg-amber-50' };

const statusBadge = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
};

export const initialSequences = [
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
    <div
      onClick={() => onSelect(seq)}
      className={cn(
        'flex items-center gap-4 px-4 py-3.5 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer',
        isSelected && 'bg-emerald-50/50 border-l-2 border-l-emerald-500'
      )}
    >
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <ChannelIcon className={`w-4 h-4 ${channelColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs font-semibold text-slate-800 truncate">{seq.name}</p>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border flex-shrink-0 ${statusBadge[seq.status]}`}>
            {seq.status}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {seq.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{t}</span>
          ))}
        </div>
      </div>
      <div className="hidden md:flex items-center gap-5 text-xs flex-shrink-0">
        <div className="text-center">
          <p className="font-bold text-slate-700">{seq.enrolled}</p>
          <p className="text-[10px] text-slate-400">Enrolled</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-emerald-600">{replyRate}%</p>
          <p className="text-[10px] text-slate-400">Reply</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-cyan-500">{meetingRate}%</p>
          <p className="text-[10px] text-slate-400">Meeting</p>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={e => { e.stopPropagation(); onToggleStatus(seq.id); }}
          className={cn('p-1.5 rounded-md transition-colors',
            seq.status === 'active' ? 'hover:bg-amber-50 text-amber-500' : 'hover:bg-emerald-50 text-emerald-600'
          )}
        >
          {seq.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function CreateSequenceModal({ onClose, onSave, onOpenPersonalize }) {
  const [name, setName] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a B2B outreach sequence name and basic info for: "${aiPrompt}". Return JSON with: name (string), channel (email|whatsapp|multi-channel), tags (array of strings, max 3).`,
      response_json_schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          channel: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        }
      }
    });
    if (result?.name) setName(result.name);
    setAiLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">New Sequence</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">Generate name with AI</span>
            </div>
            <div className="flex gap-2">
              <Input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. Fintech CFOs in Lagos focused on cost reduction"
                className="text-xs flex-1 h-8" />
              <Button onClick={generateWithAI} disabled={aiLoading || !aiPrompt.trim()} size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs px-3">
                {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Sequence Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fintech CTO — Q3 Outbound" className="text-sm" />
          </div>
          <p className="text-[11px] text-slate-400">You'll build the workflow steps in the Sequence Builder after creating.</p>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={() => onSave({ name: name || 'New Sequence', steps: [], status: 'draft', channel: 'multi-channel', enrolled: 0, replied: 0, meetings: 0, opens: 0, tags: [] })}
            disabled={!name.trim()} className="bg-emerald-600 text-white hover:bg-emerald-700">
            Create Sequence
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Outreach() {
  const navigate = useNavigate();
  const [sequences, setSequences] = useState([]);
  const [selectedSeq, setSelectedSeq] = useState(initialSequences[0]);
  const [showCreate, setShowCreate] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTaskQueue, setShowTaskQueue] = useState(false);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [showProspects, setShowProspects] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [activeTab, setActiveTab] = useState('sequences');
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const alerts = [
    { id: 'ai-content', type: 'warning', message: 'Update your AI content center to ensure research is tailored to your unique value proposition.', action: 'Review settings', route: '/settings' },
    { id: 'mailbox', type: 'warning', message: 'You have no mailboxes linked. Please connect your email account to start managing and sending emails via RVNU.', action: 'Link mailbox', route: '/integrations' },
  ].filter(a => !dismissedAlerts.includes(a.id));

  const totalEnrolled = sequences.reduce((s, seq) => s + seq.enrolled, 0);
  const totalReplied = sequences.reduce((s, seq) => s + seq.replied, 0);
  const totalMeetings = sequences.reduce((s, seq) => s + seq.meetings, 0);

  const toggleStatus = (id) => {
    setSequences(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next = s.status === 'active' ? 'paused' : 'active';
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
    const newSeq = { id: Date.now(), name: template.name, channel: template.channel, status: 'draft', enrolled: 0, replied: 0, meetings: 0, opens: 0, tags: template.tags, steps: template.steps_data };
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
Reply rate: ${selectedSeq.enrolled > 0 ? ((selectedSeq.replied / selectedSeq.enrolled) * 100).toFixed(1) : 0}%
Meeting rate: ${selectedSeq.enrolled > 0 ? ((selectedSeq.meetings / selectedSeq.enrolled) * 100).toFixed(1) : 0}%

Give a concise, actionable suggestion (1-2 sentences) to improve performance.`,
    });
    setAiSuggestion(result);
    setAiSuggesting(false);
  };

  // Activation/onboarding experience for first-time users
  if (sequences.length === 0) {
    return (
      <div className="flex-1 flex flex-col min-h-0" style={{ background: '#f8fafc' }}>
        <TopBar title="Sequences" subtitle="AI-powered multichannel outreach engine" />
        <div className="flex items-center justify-end gap-2 px-6 py-2 border-b border-slate-200 bg-white">
          <Button size="sm" variant="outline" onClick={() => setShowCreate(true)}
            className="gap-1.5 text-[11px] h-7">
            <Plus className="w-3 h-3" /> Create sequence
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}
            className="gap-1.5 text-[11px] h-7 bg-emerald-600 text-white hover:bg-emerald-700">
            <Sparkles className="w-3 h-3" /> Create with AI
          </Button>
        </div>
        <SequenceActivationPage
          onCreateAI={() => setShowCreate(true)}
          onCreate={() => setShowCreate(true)}
          alerts={alerts}
          onDismissAlert={(id) => setDismissedAlerts(p => [...p, id])}
        />
        <AnimatePresence>
          {showCreate && <CreateSequenceModal onClose={() => setShowCreate(false)} onSave={saveSequence} onOpenPersonalize={() => setShowPersonalize(true)} />}
        </AnimatePresence>
        {showPersonalize && <AIPersonalizePanel onClose={() => setShowPersonalize(false)} />}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: '#f8fafc' }}>
      <TopBar title="Sequences" subtitle="AI-powered multichannel outreach engine" />

      {/* Tabs Bar */}
      <div className="flex items-center justify-between px-5 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-0">
          {[
            { id: 'sequences', label: 'All Sequences', icon: ListTodo },
            { id: 'analytics', label: 'Analytics', icon: Activity },
            { id: 'diagnostics', label: 'Diagnostics', icon: Stethoscope },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'sequences' && (
          <Button size="sm" onClick={() => setShowCreate(true)}
            className="gap-1.5 text-[11px] h-7 bg-emerald-600 text-white hover:bg-emerald-700">
            <Plus className="w-3 h-3" /> Create sequence
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* Contextual Alerts */}
        {activeTab === 'sequences' && alerts.length > 0 && (
          <div className="px-5 pt-4 space-y-2">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="flex-1 text-[11px] text-amber-800">{alert.message}</p>
                <button
                  onClick={() => navigate(alert.route)}
                  className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2 flex-shrink-0"
                >
                  {alert.action}
                </button>
                <button onClick={() => setDismissedAlerts(p => [...p, alert.id])} className="text-amber-400 hover:text-amber-600 flex-shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'analytics' && <SequenceAnalyticsTab sequences={sequences} />}
        {activeTab === 'diagnostics' && <SequenceDiagnosticsTab />}

        {activeTab === 'sequences' && (
          <div className="p-5 space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Active Sequences', value: sequences.filter(s => s.status === 'active').length, icon: Zap, color: 'text-emerald-600' },
                { label: 'Total Enrolled', value: totalEnrolled.toLocaleString(), icon: Users, color: 'text-cyan-500' },
                { label: 'Overall Reply Rate', value: `${totalEnrolled > 0 ? ((totalReplied / totalEnrolled) * 100).toFixed(1) : 0}%`, icon: Reply, color: 'text-violet-500' },
                { label: 'Meetings Booked', value: totalMeetings, icon: TrendingUp, color: 'text-amber-500' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-slate-500">{s.label}</span>
                    <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                  </div>
                  <span className={`text-base font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-4">
                {/* Left: Sequences List */}
                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-800">All Sequences</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setShowTaskQueue(!showTaskQueue)}
                        className="gap-1.5 text-[11px] h-7 border-blue-200 text-blue-600 hover:bg-blue-50">
                        <ListTodo className="w-3 h-3" /> Task Queue
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowTemplates(true)}
                        className="gap-1.5 text-[11px] h-7">
                        <BookOpen className="w-3 h-3" /> Templates
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowPersonalize(true)}
                        className="gap-1.5 text-[11px] h-7 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        <Sparkles className="w-3 h-3" /> AI
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

                {/* Right: Preview Panel */}
                <div className="lg:col-span-2">
                  {showTaskQueue ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <TaskQueuePanel onClose={() => setShowTaskQueue(false)} />
                    </div>
                  ) : selectedSeq ? (
                    <SequencePreviewPanel
                      seq={selectedSeq}
                      onOpenBuilder={() => navigate(`/sequence-builder?id=${selectedSeq.id}`)}
                      onDuplicate={() => duplicateSequence(selectedSeq)}
                      onManageProspects={() => setShowProspects(true)}
                      aiSuggestion={aiSuggestion}
                      aiSuggesting={aiSuggesting}
                      onGetAISuggestion={getAISuggestion}
                    />
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-xl flex items-center justify-center h-48 text-slate-400 text-sm">
                      Select a sequence to preview
                    </div>
                  )}
                </div>
              </div>
          </div>
        )}
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

function SequencePreviewPanel({ seq, onOpenBuilder, onDuplicate, onManageProspects, aiSuggestion, aiSuggesting, onGetAISuggestion }) {
  const replyRate = seq.enrolled > 0 ? ((seq.replied / seq.enrolled) * 100).toFixed(1) : 0;
  const meetingRate = seq.enrolled > 0 ? ((seq.meetings / seq.enrolled) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">

      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-slate-800 truncate leading-tight">{seq.name}</h3>
            <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full border mt-1 ${statusBadge[seq.status]}`}>
              {seq.status}
            </span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={onManageProspects} title="Manage Prospects"
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600">
              <Users className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDuplicate} title="Duplicate"
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-px bg-slate-100 border-b border-slate-100">
        {[
          { label: 'Enrolled', value: seq.enrolled, color: 'text-slate-700' },
          { label: 'Opens', value: seq.opens, color: 'text-cyan-600' },
          { label: 'Reply', value: `${replyRate}%`, color: 'text-emerald-600' },
          { label: 'Meetings', value: seq.meetings, color: 'text-amber-600' },
        ].map(m => (
          <div key={m.label} className="bg-white text-center py-2.5">
            <p className={`text-xs font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[10px] text-slate-400">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Mini Workflow Preview */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Workflow Preview
          </p>
          <span className="text-[10px] text-slate-400">{seq.steps.length} steps</span>
        </div>

        {seq.steps.length === 0 ? (
          <p className="text-[11px] text-slate-400 py-2">No steps yet. Open the builder to add steps.</p>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap">
            {seq.steps.map((step, i) => {
              const Icon = channelIcons[step.type] || Mail;
              return (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${channelBg[step.type] || 'bg-slate-100'}`}>
                    <Icon className={`w-3 h-3 ${channelColors[step.type] || 'text-slate-400'}`} />
                    <span className="text-[10px] text-slate-600 font-medium">D{step.day}</span>
                  </div>
                  {i < seq.steps.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {seq.steps.length > 0 && (
          <div className="flex items-center gap-3 mt-2.5">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{seq.steps[seq.steps.length - 1]?.day || 0} day span</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <BarChart3 className="w-3 h-3" />
              <span>{meetingRate}% meeting rate</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Insight */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span className="text-[11px] font-semibold text-slate-700">AI Insight</span>
          </div>
          <button onClick={onGetAISuggestion} disabled={aiSuggesting}
            className="text-[10px] text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            {aiSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {aiSuggesting ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {aiSuggestion || (seq.replied > 0
            ? `Reply rate of ${replyRate}% — consider A/B testing subject lines to push above 25%.`
            : 'Click Analyze for AI-powered optimization suggestions.')}
        </p>
      </div>

      {/* Primary CTA */}
      <div className="px-4 py-3">
        <Button onClick={onOpenBuilder} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 gap-2">
          <Edit3 className="w-3.5 h-3.5" />
          Open Workflow Builder
          <ArrowRight className="w-3.5 h-3.5 ml-auto" />
        </Button>
      </div>
    </div>
  );
}