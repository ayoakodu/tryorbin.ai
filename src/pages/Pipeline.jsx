import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, DollarSign, TrendingUp, Calendar, 
  MoreHorizontal, ChevronRight, Sparkles, AlertTriangle, User
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';

const stages = [
  { id: 'prospecting', label: 'Prospecting', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'qualification', label: 'Qualification', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { id: 'proposal', label: 'Proposal', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'negotiation', label: 'Negotiation', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'closed_won', label: 'Closed Won', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
];

const initialDeals = {
  prospecting: [
    { id: 1, title: 'Flutterwave Enterprise', company: 'Flutterwave', value: 85000, probability: 20, contact: 'Amara Diallo', days: 3, risk: false },
    { id: 2, title: 'Paystack API Integration', company: 'Paystack', value: 42000, probability: 30, contact: 'Tunde Okafor', days: 7, risk: false },
    { id: 3, title: 'Wave Mobile Suite', company: 'Wave', value: 28000, probability: 25, contact: 'Kweku Mensah', days: 12, risk: false },
  ],
  qualification: [
    { id: 4, title: 'Andela Talent Platform', company: 'Andela', value: 120000, probability: 45, contact: 'Chioma Eze', days: 8, risk: false },
    { id: 5, title: 'Yoco Growth Package', company: 'Yoco', value: 67000, probability: 50, contact: 'Kefilwe M.', days: 15, risk: true },
  ],
  proposal: [
    { id: 6, title: 'Moniepoint Platform', company: 'Moniepoint', value: 195000, probability: 65, contact: 'Aisha Kamara', days: 5, risk: false },
    { id: 7, title: 'Chipper Cash Suite', company: 'Chipper', value: 88000, probability: 60, contact: 'Emmanuel D.', days: 18, risk: true },
  ],
  negotiation: [
    { id: 8, title: 'Opay Enterprise Deal', company: 'OPay', value: 245000, probability: 80, contact: 'Chidi Nwosu', days: 2, risk: false },
  ],
  closed_won: [
    { id: 9, title: 'PalmPay Annual License', company: 'PalmPay', value: 180000, probability: 100, contact: 'Sarah Adekunle', days: 0, risk: false },
  ],
};

function DealCard({ deal }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 hover:border-border transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground leading-tight pr-2">{deal.title}</h4>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center">
          <User className="w-3 h-3 text-muted-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">{deal.company}</span>
        {deal.risk && (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 ml-auto" />
        )}
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
    </motion.div>
  );
}

export default function Pipeline() {
  const [deals] = useState(initialDeals);

  const totalValue = Object.values(deals).flat().reduce((sum, d) => sum + d.value, 0);
  const wonValue = (deals.closed_won || []).reduce((sum, d) => sum + d.value, 0);
  const weightedValue = Object.values(deals).flat().reduce((sum, d) => sum + (d.value * d.probability / 100), 0);

  return (
    <div className="min-h-screen">
      <TopBar title="Pipeline" subtitle="Lightweight CRM — track deals, activity, and AI-powered next actions" />
      
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Pipeline', value: `$${(totalValue/1000).toFixed(0)}K`, icon: DollarSign, color: 'text-primary' },
            { label: 'Weighted Value', value: `$${(weightedValue/1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-cyan-400' },
            { label: 'Won This Month', value: `$${(wonValue/1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-primary' },
            { label: 'Deals At Risk', value: Object.values(deals).flat().filter(d => d.risk).length, icon: AlertTriangle, color: 'text-amber-400' },
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

        {/* AI Insight Banner */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-black" />
          </div>
          <p className="text-sm text-foreground flex-1">
            <span className="font-semibold text-primary">AI Copilot:</span> 2 deals in Proposal stage haven't had activity in 18+ days. 
            <span className="text-muted-foreground"> AI can generate personalized follow-up messages for each — click to take action now.</span>
          </p>
          <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 whitespace-nowrap text-xs">
            Take Action
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
                      <span className={`w-2 h-2 rounded-full ${stage.bg.replace('/10', '/60')}`} 
                        style={{ background: stage.color.replace('text-', '').includes('primary') ? 'hsl(142 76% 52%)' : undefined }} />
                      <span className={`text-xs font-bold ${stage.color}`}>{stage.label}</span>
                      <span className="text-xs text-muted-foreground">({stageDeals.length})</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">${(stageValue/1000).toFixed(0)}K</span>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    {stageDeals.map(deal => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                  
                  <button className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-border/40 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors w-full">
                    <Plus className="w-3.5 h-3.5" /> Add Deal
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}