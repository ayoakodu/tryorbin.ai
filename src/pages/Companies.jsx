import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Plus, Building2, Globe, Users, 
  TrendingUp, MoreHorizontal, MapPin, Sparkles, ExternalLink
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const companies = [
  { id: 1, name: 'Flutterwave', domain: 'flutterwave.com', industry: 'Fintech', size: '1000+', country: 'Nigeria', status: 'prospect', tier: 'enterprise', intent_score: 94, contacts_count: 8, revenue: '$100M+', technologies: ['Salesforce', 'HubSpot', 'AWS'] },
  { id: 2, name: 'Paystack', domain: 'paystack.com', industry: 'Payments', size: '501-1000', country: 'Nigeria', status: 'customer', tier: 'enterprise', intent_score: 72, contacts_count: 5, revenue: '$50-100M', technologies: ['Zendesk', 'Slack', 'GCP'] },
  { id: 3, name: 'Andela', domain: 'andela.com', industry: 'Tech', size: '1000+', country: 'Nigeria', status: 'prospect', tier: 'enterprise', intent_score: 65, contacts_count: 6, revenue: '$50-100M', technologies: ['HubSpot', 'Workday', 'Azure'] },
  { id: 4, name: 'Yoco', domain: 'yoco.com', industry: 'Payments', size: '201-500', country: 'South Africa', status: 'prospect', tier: 'mid-market', intent_score: 78, contacts_count: 4, revenue: '$10-50M', technologies: ['Pipedrive', 'Mailchimp', 'AWS'] },
  { id: 5, name: 'Wave', domain: 'wave.com', industry: 'Fintech', size: '201-500', country: 'Senegal', status: 'prospect', tier: 'mid-market', intent_score: 61, contacts_count: 3, revenue: '$10-50M', technologies: ['Intercom', 'Stripe', 'GCP'] },
  { id: 6, name: 'Moniepoint', domain: 'moniepoint.com', industry: 'Fintech', size: '501-1000', country: 'Nigeria', status: 'customer', tier: 'enterprise', intent_score: 87, contacts_count: 7, revenue: '$50-100M', technologies: ['Salesforce', 'AWS', 'Tableau'] },
  { id: 7, name: 'OPay', domain: 'opayweb.com', industry: 'Payments', size: '1000+', country: 'Nigeria', status: 'prospect', tier: 'enterprise', intent_score: 82, contacts_count: 4, revenue: '$100M+', technologies: ['Oracle', 'AWS', 'Elastic'] },
  { id: 8, name: 'Chipper Cash', domain: 'chippercash.com', industry: 'Fintech', size: '201-500', country: 'Ghana', status: 'prospect', tier: 'mid-market', intent_score: 58, contacts_count: 5, revenue: '$10-50M', technologies: ['Hubspot', 'Segment', 'GCP'] },
];

const statusColors = {
  prospect: 'bg-blue-50 text-blue-700 border-blue-200',
  customer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  churned: 'bg-red-50 text-red-700 border-red-200',
  partner: 'bg-violet-50 text-violet-700 border-violet-200',
};

const tierBadge = {
  enterprise: 'bg-amber-50 text-amber-700',
  'mid-market': 'bg-violet-50 text-violet-700',
  smb: 'bg-slate-100 text-slate-600',
};

export default function Companies() {
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  const filtered = companies.filter(c => {
    const matchSearch = search === '' || c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase());
    const matchIndustry = industryFilter === 'all' || c.industry === industryFilter;
    return matchSearch && matchIndustry;
  });

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <TopBar title="Companies" subtitle={`${companies.length} companies in your database`} />
      
      <div className="p-6 space-y-5">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies..." className="pl-10 bg-secondary/50 border-border/50" />
          </div>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-40 bg-secondary/50 border-border/50">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="Fintech">Fintech</SelectItem>
              <SelectItem value="Payments">Payments</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
            <Sparkles className="w-3.5 h-3.5" /> AI Suggest Accounts
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Add Company
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: companies.length },
            { label: 'Enterprise', value: companies.filter(c => c.tier === 'enterprise').length },
            { label: 'Customers', value: companies.filter(c => c.status === 'customer').length },
            { label: 'Avg Intent', value: `${Math.round(companies.reduce((s,c) => s + c.intent_score, 0) / companies.length)}/100` },
          ].map(s => (
            <div key={s.label} className="glass rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="font-bold text-primary">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Company Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((company, i) => (
            <motion.div key={company.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-5 hover:border-border transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{company.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{company.domain}</span>
                    </div>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[company.status]}`}>{company.status}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tierBadge[company.tier]}`}>{company.tier}</span>
                <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{company.industry}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                <div>
                  <p className="text-xs font-bold text-foreground">{company.size}</p>
                  <p className="text-[10px] text-muted-foreground">Employees</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{company.contacts_count}</p>
                  <p className="text-[10px] text-muted-foreground">Contacts</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 justify-center">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground">{company.country}</p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">Intent Score</span>
                  <span className="text-[10px] font-mono text-primary">{company.intent_score}/100</span>
                </div>
                <Progress value={company.intent_score} className="h-1" />
              </div>

              <div className="flex flex-wrap gap-1">
                {company.technologies.slice(0, 3).map(t => (
                  <span key={t} className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}