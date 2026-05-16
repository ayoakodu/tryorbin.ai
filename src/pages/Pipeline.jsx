import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Plus, DollarSign, TrendingUp, AlertTriangle, User,
  MoreHorizontal, Sparkles, Loader2, X, Calendar, Edit3,
  ChevronRight, CheckCircle2, Clock, FileText, ClipboardList,
  MessageSquare, Users
} from 'lucide-react';
import MeetingPrepPanel from '@/components/pipeline/MeetingPrepPanel';
import ObjectionHandler from '@/components/pipeline/ObjectionHandler';
import ForecastChart from '@/components/pipeline/ForecastChart';
import TeamComments from '@/components/collaboration/TeamComments';
import TaskAssignment from '@/components/collaboration/TaskAssignment';
import DealCopilotPanel from '@/components/copilot/DealCopilotPanel';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const stages = [
  { id: 'prospecting', label: 'Prospecting', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'qualification', label: 'Qualification', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { id: 'proposal', label: 'Proposal', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'negotiation', label: 'Negotiation', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'closed_won', label: 'Closed Won', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
];

const initialDealsData = {
  prospecting: [
    { id: 1, title: 'Flutterwave Enterprise', company: 'Flutterwave', value: 85000, probability: 20, contact: 'Amara Diallo', days: 3, risk: false, notes: '' },
    { id: 2, title: 'Paystack API Integration', company: 'Paystack', value: 42000, probability: 30, contact: 'Tunde Okafor', days: 7, risk: false, notes: '' },
    { id: 3, title: 'Wave Mobile Suite', company: 'Wave', value: 28000, probability: 25, contact: 'Kweku Mensah', days: 12, risk: false, notes: '' },
  ],
  qualification: [
    { id: 4, title: 'Andela Talent Platform', company: 'Andela', value: 120000, probability: 45, contact: 'Chioma Eze', days: 8, risk: false, notes: '' },
    { id: 5, title: 'Yoco Growth Package', company: 'Yoco', value: 67000, probability: 50, contact: 'Kefilwe M.', days: 15, risk: true, notes: 'No response in 2 weeks' },
  ],
  proposal: [
    { id: 6, title: 'Moniepoint Platform', company: 'Moniepoint', value: 195000, probability: 65, contact: 'Aisha Kamara', days: 5, risk: false, notes: '' },
    { id: 7, title: 'Chipper Cash Suite', company: 'Chipper', value: 88000, probability: 60, contact: 'Emmanuel D.', days: 18, risk: true, notes: 'Pending legal review' },
  ],
  negotiation: [
    { id: 8, title: 'Opay Enterprise Deal', company: 'OPay', value: 245000, probability: 80, contact: 'Chidi Nwosu', days: 2, risk: false, notes: '' },
  ],
  closed_won: [
    { id: 9, title: 'PalmPay Annual License', company: 'PalmPay', value: 180000, probability: 100, contact: 'Sarah Adekunle', days: 0, risk: false, notes: 'Signed and onboarded' },
  ],
};

function DealCard({ deal, onMove, onEdit, onCollab, stages, currentStage }) {
  const [showMenu, setShowMenu] = useState(false);
  const otherStages = stages.filter(s => s.id !== currentStage);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 hover:border-border transition-all duration-200 cursor-pointer group relative">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground leading-tight pr-2">{deal.title}</h4>
        <div className="relative">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={e => { e.stopPropagation(); onCollab(deal); }}
              className="text-muted-foreground hover:text-primary" title="AI Copilot & Team">
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          {showMenu && (
            <div className="absolute right-0 top-6 z-20 glass rounded-xl border border-border/60 shadow-xl min-w-[160px] py-1 overflow-hidden">
              <button onClick={() => { onEdit(deal, currentStage); setShowMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary/60 w-full text-left">
                <Edit3 className="w-3.5 h-3.5" /> Edit Deal
              </button>
              <div className="border-t border-border/30 my-1" />
              <p className="px-3 py-1 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Move to</p>
              {otherStages.map(s => (
                <button key={s.id} onClick={() => { onMove(deal, currentStage, s.id); setShowMenu(false); }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary/60 w-full text-left ${s.color}`}>
                  <ChevronRight className="w-3 h-3" /> {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center">
          <User className="w-3 h-3 text-muted-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">{deal.company}</span>
        {deal.risk && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 ml-auto" />}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-primary">${deal.value.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground font-mono">{deal.probability}%</span>
      </div>

      <div className="mt-2.5">
        <div className="w-full bg-border rounded-full h-1">
          <div className="bg-primary h-1 rounded-full transition-all" style={{ width: `${deal.probability}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <span className="text-[11px] text-muted-foreground">{deal.contact}</span>
        {deal.days > 0 && (
          <span className={`text-[11px] font-medium ${deal.days > 14 ? 'text-amber-400' : 'text-muted-foreground'}`}>
            {deal.days}d ago
          </span>
        )}
      </div>
      {deal.notes && (
        <p className="text-[10px] text-muted-foreground mt-2 truncate italic">"{deal.notes}"</p>
      )}
    </motion.div>
  );
}

export default function Pipeline() {
  const [deals, setDeals] = useState(initialDealsData);
  const [showAdd, setShowAdd] = useState(false);
  const [addStage, setAddStage] = useState('prospecting');
  const [editDeal, setEditDeal] = useState(null);
  const [editStage, setEditStage] = useState(null);
  const [aiInsight, setAiInsight] = useState('2 deals in Proposal stage haven\'t had activity in 18+ days. AI can generate personalized follow-up messages for each — click to take action now.');
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({ title: '', company: '', contact: '', value: '', probability: '30', notes: '' });
  const [meetingPrepDeal, setMeetingPrepDeal] = useState(null);
  const [objectionDeal, setObjectionDeal] = useState(null);
  const [collabDeal, setCollabDeal] = useState(null);
  const [collabTab, setCollabTab] = useState('ai');
  const [aiCopilotDeal, setAiCopilotDeal] = useState(null);
  const [aiCopilotStage, setAiCopilotStage] = useState(null);
  const { toast } = useToast();

  const totalValue = Object.values(deals).flat().reduce((sum, d) => sum + d.value, 0);
  const wonValue = (deals.closed_won || []).reduce((sum, d) => sum + d.value, 0);
  const weightedValue = Object.values(deals).flat().reduce((sum, d) => sum + (d.value * d.probability / 100), 0);
  const atRisk = Object.values(deals).flat().filter(d => d.risk).length;

  const moveDeal = (deal, fromStage, toStage) => {
    setDeals(prev => {
      const updated = { ...prev };
      updated[fromStage] = prev[fromStage].filter(d => d.id !== deal.id);
      updated[toStage] = [...(prev[toStage] || []), { ...deal }];
      return updated;
    });
    toast({ title: 'Deal moved', description: `"${deal.title}" moved to ${stages.find(s => s.id === toStage)?.label}` });
  };

  const openEdit = (deal, stage) => {
    setEditDeal(deal);
    setEditStage(stage);
    setForm({ title: deal.title, company: deal.company, contact: deal.contact, value: String(deal.value), probability: String(deal.probability), notes: deal.notes || '' });
  };

  const saveDeal = () => {
    if (editDeal) {
      setDeals(prev => ({
        ...prev,
        [editStage]: prev[editStage].map(d => d.id === editDeal.id ? {
          ...d, title: form.title, company: form.company, contact: form.contact,
          value: Number(form.value), probability: Number(form.probability), notes: form.notes
        } : d)
      }));
      toast({ title: 'Deal updated!' });
      setEditDeal(null);
    } else {
      const newDeal = {
        id: Date.now(), title: form.title, company: form.company, contact: form.contact,
        value: Number(form.value), probability: Number(form.probability), days: 0, risk: false, notes: form.notes
      };
      setDeals(prev => ({ ...prev, [addStage]: [...(prev[addStage] || []), newDeal] }));
      toast({ title: 'Deal created!' });
      setShowAdd(false);
    }
    setForm({ title: '', company: '', contact: '', value: '', probability: '30', notes: '' });
  };

  const getAIInsight = async () => {
    setAiLoading(true);
    const allDeals = Object.entries(deals).flatMap(([stage, ds]) => ds.map(d => ({ ...d, stage })));
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a GTM AI copilot. Analyze this pipeline and give ONE specific, actionable insight in 2 sentences:
Deals: ${JSON.stringify(allDeals.map(d => ({ title: d.title, stage: d.stage, value: d.value, probability: d.probability, days: d.days, risk: d.risk })))}
Focus on risk, stale deals, or quick wins.`,
    });
    setAiInsight(result);
    setAiLoading(false);
  };

  const openAddForStage = (stageId) => {
    setAddStage(stageId);
    setEditDeal(null);
    setForm({ title: '', company: '', contact: '', value: '', probability: '30', notes: '' });
    setShowAdd(true);
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Pipeline" subtitle="Lightweight CRM — track deals, activity, and AI-powered next actions" />

      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Pipeline', value: `$${(totalValue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-primary' },
            { label: 'Weighted Value', value: `$${(weightedValue / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-cyan-400' },
            { label: 'Won This Month', value: `$${(wonValue / 1000).toFixed(0)}K`, icon: CheckCircle2, color: 'text-primary' },
            { label: 'Deals At Risk', value: atRisk, icon: AlertTriangle, color: 'text-amber-400' },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Forecast Chart */}
        <ForecastChart deals={deals} />

        {/* AI Insight Banner */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-black" />
          </div>
          <p className="text-sm text-foreground flex-1">
            <span className="font-semibold text-primary">AI Copilot: </span>
            {aiLoading ? 'Analyzing pipeline...' : aiInsight}
          </p>
          <Button size="sm" variant="outline" onClick={getAIInsight} disabled={aiLoading}
            className="border-primary/30 text-primary hover:bg-primary/10 whitespace-nowrap text-xs gap-1.5">
            {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {aiLoading ? 'Analyzing...' : 'Refresh AI'}
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {stages.map((stage) => {
              const stageDeals = deals[stage.id] || [];
              const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
              return (
                <div key={stage.id} className="w-72 flex flex-col">
                  <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 border ${stage.bg} ${stage.border}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${stage.color}`}>{stage.label}</span>
                      <span className="text-xs text-muted-foreground">({stageDeals.length})</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">${(stageValue / 1000).toFixed(0)}K</span>
                  </div>

                  <div className="space-y-3 flex-1">
                    <AnimatePresence>
                      {stageDeals.map(deal => (
                        <DealCard key={deal.id} deal={deal} currentStage={stage.id}
                          stages={stages} onMove={moveDeal} onEdit={openEdit} onCollab={setCollabDeal} />
                      ))}
                    </AnimatePresence>
                  </div>

                  <button onClick={() => openAddForStage(stage.id)}
                    className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-border/40 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors w-full">
                    <Plus className="w-3.5 h-3.5" /> Add Deal
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Collaboration sidebar */}
      <AnimatePresence>
        {collabDeal && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border/60 shadow-2xl z-40 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div>
                <p className="text-sm font-bold text-foreground">{collabDeal.title}</p>
                <p className="text-xs text-muted-foreground">{collabDeal.company}</p>
              </div>
              <button onClick={() => setCollabDeal(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Bar */}
            <div className="flex border-b border-border/30 px-3 pt-2 gap-1">
              {[['ai', 'AI Copilot'], ['team', 'Team'], ['tools', 'Tools']].map(([tab, label]) => (
                <button key={tab} onClick={() => setCollabTab(tab)}
                  className={`text-xs px-3 py-2 rounded-t-lg font-medium transition-colors ${collabTab === tab ? 'bg-secondary text-foreground border border-border/40 border-b-0' : 'text-muted-foreground hover:text-foreground'}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {collabTab === 'ai' && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">AI Copilot analyzes this deal and generates contextual recommendations.</p>
                  <button onClick={() => { setAiCopilotDeal(collabDeal); setAiCopilotStage(Object.entries(deals).find(([, ds]) => ds.some(d => d.id === collabDeal.id))?.[0] || 'prospecting'); }}
                    className="w-full p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary font-semibold flex items-center gap-2 justify-center hover:bg-primary/20 transition-colors">
                    <Sparkles className="w-4 h-4" /> Open AI Copilot
                  </button>
                  <div className="space-y-2">
                    {[
                      { label: 'Meeting Prep', action: () => { setMeetingPrepDeal(collabDeal); setCollabDeal(null); }, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', icon: ClipboardList },
                      { label: 'Objection Handler', action: () => { setObjectionDeal(collabDeal); setCollabDeal(null); }, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', icon: MessageSquare },
                    ].map(item => (
                      <button key={item.label} onClick={item.action}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 justify-center hover:opacity-80 transition-opacity ${item.color}`}>
                        <item.icon className="w-3.5 h-3.5" /> {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {collabTab === 'team' && (
                <div className="space-y-6">
                  <TaskAssignment entityId={collabDeal.id} />
                  <TeamComments entityId={collabDeal.id} entityType="deal" />
                </div>
              )}
              {collabTab === 'tools' && (
                <div className="space-y-3 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Deal Info</p>
                  {[
                    { label: 'Value', value: `$${collabDeal.value?.toLocaleString()}` },
                    { label: 'Contact', value: collabDeal.contact },
                    { label: 'Probability', value: `${collabDeal.probability}%` },
                    { label: 'Last Activity', value: collabDeal.days > 0 ? `${collabDeal.days} days ago` : 'Today' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-1.5 border-b border-border/20">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium text-foreground">{row.value}</span>
                    </div>
                  ))}
                  {collabDeal.notes && (
                    <div className="p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground italic">"{collabDeal.notes}"</div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {meetingPrepDeal && <MeetingPrepPanel deal={meetingPrepDeal} onClose={() => setMeetingPrepDeal(null)} />}
      {objectionDeal && <ObjectionHandler deal={objectionDeal} onClose={() => setObjectionDeal(null)} />}
      <AnimatePresence>
        {aiCopilotDeal && <DealCopilotPanel deal={aiCopilotDeal} currentStage={aiCopilotStage} onClose={() => setAiCopilotDeal(null)} />}
      </AnimatePresence>

      {/* Add/Edit Deal Dialog */}
      <Dialog open={showAdd || !!editDeal} onOpenChange={(open) => { if (!open) { setShowAdd(false); setEditDeal(null); } }}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>{editDeal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Deal Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Flutterwave Enterprise" className="bg-secondary/50 border-border/60" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Company</Label>
                <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                  placeholder="Flutterwave" className="bg-secondary/50 border-border/60" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Contact</Label>
                <Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                  placeholder="Amara Diallo" className="bg-secondary/50 border-border/60" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Value ($)</Label>
                <Input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                  placeholder="50000" className="bg-secondary/50 border-border/60" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Probability (%)</Label>
                <Input type="number" min="0" max="100" value={form.probability} onChange={e => setForm({ ...form, probability: e.target.value })}
                  placeholder="30" className="bg-secondary/50 border-border/60" />
              </div>
            </div>
            {!editDeal && (
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Stage</Label>
                <Select value={addStage} onValueChange={setAddStage}>
                  <SelectTrigger className="bg-secondary/50 border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Add deal notes..." className="bg-secondary/50 border-border/60 resize-none" rows={2} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => { setShowAdd(false); setEditDeal(null); }} className="flex-1 border-border/60">Cancel</Button>
              <Button onClick={saveDeal} disabled={!form.title} className="flex-1 bg-primary text-primary-foreground">
                {editDeal ? 'Save Changes' : 'Create Deal'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}