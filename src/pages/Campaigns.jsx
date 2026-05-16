import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Sparkles, Play, Pause, BarChart3, Users, 
  Mail, MousePointer, TrendingUp, Calendar, Eye,
  MoreHorizontal, Megaphone, ChevronRight, Zap
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const campaigns = [
  {
    id: 1, name: 'Q2 Fintech Decision Makers', type: 'email', status: 'active',
    goal: 'Generate 50 qualified meetings', target: 'Fintech CTOs, Nigeria + Ghana',
    total_contacts: 850, sent_count: 612, open_rate: 38.4, click_rate: 12.2, reply_rate: 8.7, conversion_rate: 3.2,
    start_date: '2026-04-01', tags: ['fintech', 'q2'],
  },
  {
    id: 2, name: 'LinkedIn ABM - Series B CEOs', type: 'linkedin', status: 'active',
    goal: 'Book 20 enterprise demos', target: 'Series B+ CEOs, East Africa',
    total_contacts: 320, sent_count: 320, open_rate: 68.2, click_rate: 22.4, reply_rate: 14.1, conversion_rate: 5.6,
    start_date: '2026-04-15', tags: ['abm', 'linkedin', 'enterprise'],
  },
  {
    id: 3, name: 'WhatsApp Product Launch Africa', type: 'whatsapp', status: 'completed',
    goal: 'Drive 500 signups', target: 'All segments — Africa-wide',
    total_contacts: 2100, sent_count: 2100, open_rate: 91.2, click_rate: 34.8, reply_rate: 21.3, conversion_rate: 8.9,
    start_date: '2026-03-01', tags: ['launch', 'africa'],
  },
  {
    id: 4, name: 'Mid-Market Nurture Journey', type: 'multi-channel', status: 'active',
    goal: 'Move 30 contacts to proposal stage', target: 'Mid-market companies, West Africa',
    total_contacts: 430, sent_count: 280, open_rate: 44.6, click_rate: 18.9, reply_rate: 11.2, conversion_rate: 4.1,
    start_date: '2026-04-20', tags: ['nurture', 'mid-market'],
  },
  {
    id: 5, name: 'Q3 Webinar — GTM in Africa', type: 'event', status: 'scheduled',
    goal: 'Register 200 attendees', target: 'Revenue leaders, pan-Africa',
    total_contacts: 0, sent_count: 0, open_rate: 0, click_rate: 0, reply_rate: 0, conversion_rate: 0,
    start_date: '2026-07-01', tags: ['webinar', 'event'],
  },
];

const typeColors = {
  email: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  linkedin: { bg: 'bg-blue-600/10', text: 'text-blue-500', border: 'border-blue-600/20' },
  whatsapp: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
  'multi-channel': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  event: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
};

const statusBadge = {
  active: 'bg-primary/20 text-primary border-primary/30',
  completed: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  scheduled: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  draft: 'bg-secondary text-muted-foreground border-border',
  paused: 'bg-destructive/20 text-destructive border-destructive/30',
};

function CampaignCard({ campaign }) {
  const tc = typeColors[campaign.type] || typeColors.email;
  const progress = campaign.total_contacts > 0 ? (campaign.sent_count / campaign.total_contacts) * 100 : 0;
  
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 hover:border-border transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${tc.bg} ${tc.text} ${tc.border}`}>
              {campaign.type}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge[campaign.status]}`}>
              {campaign.status}
            </span>
          </div>
          <h3 className="font-bold text-sm text-foreground leading-tight">{campaign.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{campaign.goal}</p>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-xs text-muted-foreground mb-4">
        <Users className="w-3 h-3 inline mr-1" />
        {campaign.target}
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
            <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <div className="flex flex-wrap gap-1 flex-1">
          {campaign.tags.map(t => <span key={t} className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">{t}</span>)}
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors">
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
          {campaign.status === 'active' ? (
            <button className="p-1.5 rounded-md hover:bg-amber-500/10 text-amber-400 transition-colors">
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors">
              <Play className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Campaigns() {
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalReach = campaigns.reduce((s, c) => s + c.total_contacts, 0);
  const avgOpenRate = campaigns.filter(c => c.open_rate > 0).reduce((s, c) => s + c.open_rate, 0) / campaigns.filter(c => c.open_rate > 0).length;

  return (
    <div className="min-h-screen">
      <TopBar title="Campaigns" subtitle="Launch, automate, and track multichannel engagement campaigns" />
      
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
              <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* AI Create Banner */}
        <div className="glass rounded-xl p-5 border border-primary/20 flex flex-col md:flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-sm mb-0.5">AI Campaign Builder</h3>
            <p className="text-xs text-muted-foreground">Describe your goal and RVNU AI generates the entire campaign — audience, messaging, channels, sequence steps, and schedule. Ready to launch in minutes.</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 whitespace-nowrap">
            <Sparkles className="w-4 h-4" /> Create with AI
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">All Campaigns</h3>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4" /> New Campaign
          </Button>
        </div>

        {/* Campaign Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </div>
  );
}