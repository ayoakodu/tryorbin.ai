import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { invokeLLMJson } from '@/lib/anthropic';
import {
  Plus, Sparkles, Play, Pause, BarChart3, Users,
  MoreHorizontal, Loader2, X, Mail, MessageCircle,
  Linkedin, Phone, Zap, Target, Calendar, Radio, Newspaper, Globe
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const initialCampaigns = [
  { id: 1, name: 'Q2 Fintech Decision Makers', type: 'outbound', status: 'active', goal: 'Generate 50 qualified meetings', target: 'Fintech CTOs, Nigeria + Ghana', total_contacts: 850, sent_count: 612, open_rate: 38.4, click_rate: 12.2, reply_rate: 8.7, conversion_rate: 3.2, tags: ['fintech', 'q2'] },
  { id: 2, name: 'LinkedIn ABM - Series B CEOs', type: 'outbound', status: 'active', goal: 'Book 20 enterprise demos', target: 'Series B+ CEOs, East Africa', total_contacts: 320, sent_count: 320, open_rate: 68.2, click_rate: 22.4, reply_rate: 14.1, conversion_rate: 5.6, tags: ['abm', 'linkedin', 'enterprise'] },
  { id: 3, name: 'WhatsApp Product Launch Africa', type: 'broadcast', status: 'completed', goal: 'Drive 500 signups', target: 'All segments — Africa-wide', total_contacts: 2100, sent_count: 2100, open_rate: 91.2, click_rate: 34.8, reply_rate: 21.3, conversion_rate: 8.9, tags: ['launch', 'africa'] },
  { id: 4, name: 'Mid-Market Nurture Journey', type: 'nurture', status: 'active', goal: 'Move 30 contacts to proposal stage', target: 'Mid-market companies, West Africa', total_contacts: 430, sent_count: 280, open_rate: 44.6, click_rate: 18.9, reply_rate: 11.2, conversion_rate: 4.1, tags: ['nurture', 'mid-market'] },
  { id: 5, name: 'Q3 Webinar — GTM in Africa', type: 'webinar', status: 'scheduled', goal: 'Register 200 attendees', target: 'Revenue leaders, pan-Africa', total_contacts: 0, sent_count: 0, open_rate: 0, click_rate: 0, reply_rate: 0, conversion_rate: 0, tags: ['webinar', 'event'] },
  { id: 6, name: 'June Product Update Newsletter', type: 'newsletter', status: 'draft', goal: 'Keep customers informed on new features', target: 'All active customers', total_contacts: 1200, sent_count: 0, open_rate: 0, click_rate: 0, reply_rate: 0, conversion_rate: 0, tags: ['newsletter', 'product'] },
];

const typeConfig = {
  outbound:      { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    label: 'Outbound' },
  broadcast:     { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Broadcast' },
  newsletter:    { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  label: 'Newsletter' },
  nurture:       { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'Nurture' },
  webinar:       { bg: 'bg-pink-50',    text: 'text-pink-700',    border: 'border-pink-200',    label: 'Webinar' },
  'multi-channel':{ bg: 'bg-cyan-50',   text: 'text-cyan-700',    border: 'border-cyan-200',    label: 'Multi-channel' },
  lifecycle:     { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200',  label: 'Lifecycle' },
  whatsapp:      { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'WhatsApp' },
};

const statusBadge = {
  active:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  draft:     'bg-slate-100 text-slate-600 border-slate-200',
  paused:    'bg-red-50 text-red-700 border-red-200',
};

// Quick-create templates for broadcast/newsletter/webinar etc.
const quickTemplates = [
  { label: 'WhatsApp Broadcast', type: 'broadcast', icon: MessageCircle, goal: 'Reach all contacts via WhatsApp blast', target: '' },
  { label: 'Newsletter', type: 'newsletter', icon: Newspaper, goal: 'Share company news and product updates', target: '' },
  { label: 'Webinar Campaign', type: 'webinar', icon: Calendar, goal: 'Drive registrations for upcoming webinar', target: '' },
  { label: 'Product Announcement', type: 'broadcast', icon: Radio, goal: 'Announce new product or feature launch', target: '' },
];

function CampaignCard({ campaign, onToggle, onEdit, onDelete }) {
  const tc = typeConfig[campaign.type] || typeConfig.outbound;
  const progress = campaign.total_contacts > 0 ? (campaign.sent_count / campaign.total_contacts) * 100 : 0;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 hover:border-border transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${tc.bg} ${tc.text} ${tc.border}`}>{tc.label}</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge[campaign.status]}`}>{campaign.status}</span>
          </div>
          <h3 className="font-bold text-xs text-foreground leading-tight">{campaign.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{campaign.goal}</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="text-muted-foreground hover:text-foreground p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-7 z-20 glass rounded-xl border border-border/60 shadow-xl min-w-[140px] py-1">
              <button onClick={() => { onEdit(campaign); setShowMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary/60 w-full text-left">Edit Campaign</button>
              <button onClick={() => { onToggle(campaign.id); setShowMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary/60 w-full text-left">
                {campaign.status === 'active' ? 'Pause' : 'Resume'}
              </button>
              <button onClick={() => { onDelete(campaign.id); setShowMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-secondary/60 w-full text-left">Delete</button>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        <Users className="w-3 h-3 inline mr-1" />{campaign.target}
      </p>

      {campaign.total_contacts > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono text-foreground">{campaign.sent_count} / {campaign.total_contacts}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Open', value: `${campaign.open_rate}%`, color: 'text-foreground' },
          { label: 'Click', value: `${campaign.click_rate}%`, color: 'text-cyan-400' },
          { label: 'Reply', value: `${campaign.reply_rate}%`, color: 'text-primary' },
          { label: 'Convert', value: `${campaign.conversion_rate}%`, color: 'text-violet-400' },
        ].map(m => (
          <div key={m.label} className="text-center p-2 rounded-lg bg-secondary/40">
            <p className={`text-xs font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4 items-center">
        <div className="flex flex-wrap gap-1 flex-1">
          {campaign.tags.map(t => <span key={t} className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">{t}</span>)}
        </div>
        <button onClick={() => onToggle(campaign.id)}
          className={`p-1.5 rounded-md transition-colors ${campaign.status === 'active' ? 'hover:bg-amber-500/10 text-amber-400' : 'hover:bg-primary/10 text-primary'}`}>
          {campaign.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    </motion.div>
  );
}

const emptyForm = { name: '', type: 'outbound', goal: '', target: '', total_contacts: '', tags: '' };

function CampaignModal({ campaign, onClose, onSave, aiGenerating, onAIGenerate, aiPrompt, setAiPrompt, prefill }) {
  const [form, setForm] = useState(campaign ? {
    name: campaign.name, type: campaign.type, goal: campaign.goal,
    target: campaign.target, total_contacts: String(campaign.total_contacts), tags: campaign.tags.join(', ')
  } : prefill ? { ...emptyForm, ...prefill } : { ...emptyForm });

  const handleSave = () => {
    onSave({ ...form, total_contacts: Number(form.total_contacts) || 0, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{campaign ? 'Edit Campaign' : 'Create Campaign'}</DialogTitle>
        </DialogHeader>

        {!campaign && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-2">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Generate with AI</span>
            </div>
            <div className="flex gap-2">
              <Input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. WhatsApp broadcast to fintech CFOs in Lagos about our new product"
                className="text-sm flex-1" />
              <Button onClick={() => onAIGenerate(form, setForm)} disabled={aiGenerating || !aiPrompt.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
                {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Campaign Name *</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="June Newsletter — Product Updates" className="bg-secondary/50 border-border/60" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Campaign Type</Label>
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                <SelectTrigger className="bg-secondary/50 border-border/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(typeConfig).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Total Contacts</Label>
              <Input type="number" value={form.total_contacts} onChange={e => setForm({ ...form, total_contacts: e.target.value })}
                placeholder="500" className="bg-secondary/50 border-border/60" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Campaign Goal</Label>
            <Input value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}
              placeholder="Drive 200 webinar signups" className="bg-secondary/50 border-border/60" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Target Audience</Label>
            <Input value={form.target} onChange={e => setForm({ ...form, target: e.target.value })}
              placeholder="Fintech CTOs, Nigeria + Ghana" className="bg-secondary/50 border-border/60" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Tags (comma-separated)</Label>
            <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="broadcast, q2, whatsapp" className="bg-secondary/50 border-border/60" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-border/60">Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name} className="flex-1 bg-primary text-primary-foreground">
              {campaign ? 'Save Changes' : 'Create Campaign'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [modalPrefill, setModalPrefill] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalReach = campaigns.reduce((s, c) => s + c.total_contacts, 0);
  const avgOpenRate = campaigns.filter(c => c.open_rate > 0).reduce((s, c) => s + c.open_rate, 0) / (campaigns.filter(c => c.open_rate > 0).length || 1);

  const filteredCampaigns = filterType === 'all' ? campaigns : campaigns.filter(c => c.type === filterType);

  const toggleCampaign = (id) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id !== id) return c;
      return { ...c, status: c.status === 'active' ? 'paused' : 'active' };
    }));
  };

  const deleteCampaign = (id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Campaign deleted' });
  };

  const saveCampaign = (data) => {
    if (editingCampaign) {
      setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? { ...c, ...data } : c));
      toast({ title: 'Campaign updated!' });
    } else {
      const newCampaign = { ...data, id: Date.now(), status: 'draft', sent_count: 0, open_rate: 0, click_rate: 0, reply_rate: 0, conversion_rate: 0 };
      setCampaigns(prev => [...prev, newCampaign]);
      toast({ title: 'Campaign created!' });
    }
    setShowModal(false);
    setEditingCampaign(null);
    setModalPrefill(null);
    setAiPrompt('');
  };

  const openWithTemplate = (tpl) => {
    setEditingCampaign(null);
    setModalPrefill({ type: tpl.type, goal: tpl.goal, name: tpl.label, target: tpl.target });
    setShowModal(true);
  };

  const handleAIGenerate = async (form, setForm) => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    const result = await invokeLLMJson(`Generate a B2B GTM campaign brief for: "${aiPrompt}"
Return JSON with: name (string), type (one of: outbound/broadcast/newsletter/nurture/webinar/multi-channel/lifecycle/whatsapp), goal (string), target (string), tags (array of strings).
Keep it specific and actionable for African/emerging markets.`);
    if (result?.name) {
      setForm(prev => ({ ...prev, name: result.name, type: result.type || prev.type, goal: result.goal || prev.goal, target: result.target || prev.target, tags: (result.tags || []).join(', ') }));
    }
    setAiGenerating(false);
  };

  const filterTabs = ['all', ...Object.keys(typeConfig)];

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <TopBar title="Campaigns" subtitle="Launch outbound, broadcasts, newsletters, webinars, and lifecycle campaigns" />

      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Campaigns', value: activeCampaigns, color: 'text-primary' },
            { label: 'Total Reach', value: totalReach.toLocaleString(), color: 'text-cyan-400' },
            { label: 'Avg Open Rate', value: `${avgOpenRate.toFixed(1)}%`, color: 'text-violet-400' },
            { label: 'Meetings Generated', value: '47', color: 'text-amber-400' },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4">
              <span className="text-xs text-muted-foreground block mb-2">{s.label}</span>
              <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Quick launch templates */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">Quick Launch</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickTemplates.map((tpl) => (
              <button key={tpl.label} onClick={() => openWithTemplate(tpl)}
                className="glass rounded-xl p-3.5 flex items-center gap-2.5 text-left hover:border-primary/30 hover:bg-primary/5 transition-all group">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <tpl.icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-[11px] font-semibold text-foreground leading-tight">{tpl.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Create Banner */}
        <div className="glass rounded-xl p-5 border border-primary/20 flex flex-col md:flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-xs mb-0.5">AI Campaign Builder</h3>
            <p className="text-xs text-muted-foreground">Describe your goal and Orbin AI generates the entire campaign — audience, messaging, channels, and schedule. Ready in minutes.</p>
          </div>
          <Button onClick={() => { setEditingCampaign(null); setModalPrefill(null); setShowModal(true); }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 whitespace-nowrap">
            <Sparkles className="w-4 h-4" /> Create with AI
          </Button>
        </div>

        {/* Filter tabs + header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit overflow-x-auto flex-shrink-0">
            {filterTabs.map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-[10px] font-semibold capitalize whitespace-nowrap transition-all ${filterType === t ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                {t === 'all' ? 'All' : typeConfig[t]?.label || t}
              </button>
            ))}
          </div>
          <Button onClick={() => { setEditingCampaign(null); setModalPrefill(null); setShowModal(true); }}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0">
            <Plus className="w-4 h-4" /> New Campaign
          </Button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign}
                onToggle={toggleCampaign}
                onEdit={(c) => { setEditingCampaign(c); setModalPrefill(null); setShowModal(true); }}
                onDelete={deleteCampaign} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {showModal && (
        <CampaignModal
          campaign={editingCampaign}
          prefill={modalPrefill}
          onClose={() => { setShowModal(false); setEditingCampaign(null); setModalPrefill(null); setAiPrompt(''); }}
          onSave={saveCampaign}
          aiGenerating={aiGenerating}
          onAIGenerate={handleAIGenerate}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
        />
      )}
    </div>
  );
}