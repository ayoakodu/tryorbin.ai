import { motion } from 'framer-motion';
import { 
  Target, Plus, Building2, Users, TrendingUp, Mail,
  ChevronRight, Sparkles, Eye, Star, AlertCircle, Zap
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const targetAccounts = [
  { 
    name: 'Flutterwave', industry: 'Fintech', size: '1000+', tier: 'enterprise',
    contacts: 8, engaged: 6, intent_score: 94, stage: 'proposal',
    signals: ['Visited pricing page 3x', 'Downloaded ROI calculator', 'LinkedIn engagement'],
    buying_committee: [
      { name: 'Amara Diallo', title: 'VP Sales', engagement: 'high', status: 'champion' },
      { name: 'Bisi Adeleke', title: 'CTO', engagement: 'medium', status: 'influencer' },
      { name: 'Femi Johnson', title: 'CFO', engagement: 'low', status: 'economic_buyer' },
    ]
  },
  { 
    name: 'Moniepoint', industry: 'Fintech', size: '501-1000', tier: 'enterprise',
    contacts: 5, engaged: 4, intent_score: 87, stage: 'qualification',
    signals: ['Integration docs viewed', 'Competitor comparison search', 'Job posting for RevOps'],
    buying_committee: [
      { name: 'Aisha Kamara', title: 'BD Director', engagement: 'high', status: 'champion' },
      { name: 'Chidi Nwosu', title: 'CEO', engagement: 'medium', status: 'economic_buyer' },
    ]
  },
  { 
    name: 'Andela', industry: 'Tech', size: '1000+', tier: 'enterprise',
    contacts: 6, engaged: 3, intent_score: 72, stage: 'prospecting',
    signals: ['Website visits from HQ IP', 'LinkedIn ad engagement'],
    buying_committee: [
      { name: 'Chioma Eze', title: 'Revenue Lead', engagement: 'medium', status: 'champion' },
      { name: 'James Park', title: 'CFO', engagement: 'low', status: 'economic_buyer' },
    ]
  },
  { 
    name: 'OPay', industry: 'Payments', size: '1000+', tier: 'enterprise',
    contacts: 4, engaged: 3, intent_score: 81, stage: 'negotiation',
    signals: ['Contract template downloaded', 'Legal team involved', 'Pricing discussion'],
    buying_committee: [
      { name: 'Sarah Adekunle', title: 'VP Operations', engagement: 'high', status: 'champion' },
      { name: 'Wei Liu', title: 'CEO', engagement: 'high', status: 'economic_buyer' },
    ]
  },
];

const tierColors = {
  enterprise: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'mid-market': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  smb: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const stageColors = {
  prospecting: 'text-blue-400',
  qualification: 'text-violet-400',
  proposal: 'text-amber-400',
  negotiation: 'text-orange-400',
  closed_won: 'text-primary',
};

const engagementColor = {
  high: 'bg-primary/20 text-primary',
  medium: 'bg-amber-400/20 text-amber-400',
  low: 'bg-secondary text-muted-foreground',
};

const statusLabel = {
  champion: '⭐ Champion',
  influencer: '🔗 Influencer',
  economic_buyer: '💰 Economic Buyer',
  blocker: '🚫 Blocker',
};

export default function ABM() {
  return (
    <div className="min-h-screen">
      <TopBar title="Account-Based Marketing" subtitle="Target account intelligence and coordination" />
      
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Target Accounts', value: '47', color: 'text-primary' },
            { label: 'Buying Committee Members', value: '234', color: 'text-cyan-400' },
            { label: 'Avg Intent Score', value: '78/100', color: 'text-amber-400' },
            { label: 'Enterprise Pipeline', value: '$1.8M', color: 'text-violet-400' },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4">
              <span className="text-xs text-muted-foreground block mb-2">{s.label}</span>
              <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* AI Recommendation */}
        <div className="glass rounded-xl p-5 border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="text-sm font-bold">AI Account Intelligence</h3>
              <p className="text-xs text-muted-foreground">Updated 12 minutes ago</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10', text: 'OPay showing strong purchase signals — CEO engaged with pricing page. Recommend immediate outreach.' },
              { icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', text: 'Flutterwave buying committee coverage at 75%. Add CFO contact to improve deal velocity.' },
              { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-400/10', text: '3 new companies matching your ICP identified: Interswitch, PiggyVest, TeamApt.' },
            ].map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40">
                <div className={`w-7 h-7 rounded-lg ${rec.bg} flex items-center justify-center flex-shrink-0`}>
                  <rec.icon className={`w-3.5 h-3.5 ${rec.color}`} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{rec.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Target Accounts */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">Target Account List</h3>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            <Plus className="w-4 h-4" /> Add Account
          </Button>
        </div>

        <div className="space-y-4">
          {targetAccounts.map((account, i) => (
            <motion.div key={account.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass rounded-xl p-5 hover:border-border transition-all cursor-pointer">
              <div className="grid lg:grid-cols-3 gap-5">
                {/* Company Info */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{account.name}</h4>
                      <p className="text-xs text-muted-foreground">{account.industry} · {account.size} employees</p>
                    </div>
                    <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tierColors[account.tier]}`}>
                      {account.tier}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Intent Score</span>
                    <span className="text-xs font-bold text-primary">{account.intent_score}/100</span>
                  </div>
                  <Progress value={account.intent_score} className="h-1.5 mb-3" />
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold capitalize ${stageColors[account.stage]}`}>{account.stage.replace('_', ' ')}</span>
                    <span className="text-muted-foreground">{account.engaged}/{account.contacts} contacts engaged</span>
                  </div>
                </div>

                {/* Buying Committee */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Buying Committee</p>
                  <div className="space-y-2">
                    {account.buying_committee.map((person) => (
                      <div key={person.name} className="flex items-center gap-2.5 p-2 rounded-lg bg-secondary/40">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {person.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{person.name}</p>
                          <p className="text-[10px] text-muted-foreground">{person.title}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${engagementColor[person.engagement]}`}>
                            {person.engagement}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Intent Signals */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Intent Signals</p>
                  <div className="space-y-2 mb-4">
                    {account.signals.map((signal, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">{signal}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs border-primary/30 text-primary hover:bg-primary/10">
                      <Mail className="w-3 h-3 mr-1" /> Engage
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs border-border/50 text-muted-foreground hover:text-foreground">
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}