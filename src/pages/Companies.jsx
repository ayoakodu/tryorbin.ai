import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { invokeLLM } from '@/lib/anthropic';
import {
  Search, Plus, Building2, Globe, Users,
  TrendingUp, MapPin, Sparkles, X, Loader2, ChevronRight
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const INITIAL_COMPANIES = [
  { id: 1, name: 'Flutterwave', domain: 'flutterwave.com', industry: 'Fintech', size: '1000+', country: 'Nigeria', status: 'prospect', tier: 'enterprise', intent_score: 94, contacts_count: 8, revenue: '$100M+', technologies: ['Salesforce', 'HubSpot', 'AWS'] },
  { id: 2, name: 'Paystack', domain: 'paystack.com', industry: 'Payments', size: '501-1000', country: 'Nigeria', status: 'customer', tier: 'enterprise', intent_score: 72, contacts_count: 5, revenue: '$50-100M', technologies: ['Zendesk', 'Slack', 'GCP'] },
  { id: 3, name: 'Andela', domain: 'andela.com', industry: 'Tech', size: '1000+', country: 'Nigeria', status: 'prospect', tier: 'enterprise', intent_score: 65, contacts_count: 6, revenue: '$50-100M', technologies: ['HubSpot', 'Workday', 'Azure'] },
  { id: 4, name: 'Yoco', domain: 'yoco.com', industry: 'Payments', size: '201-500', country: 'South Africa', status: 'prospect', tier: 'mid-market', intent_score: 78, contacts_count: 4, revenue: '$10-50M', technologies: ['Pipedrive', 'Mailchimp', 'AWS'] },
  { id: 5, name: 'Wave', domain: 'wave.com', industry: 'Fintech', size: '201-500', country: 'Senegal', status: 'prospect', tier: 'mid-market', intent_score: 61, contacts_count: 3, revenue: '$10-50M', technologies: ['Intercom', 'Stripe', 'GCP'] },
  { id: 6, name: 'Moniepoint', domain: 'moniepoint.com', industry: 'Fintech', size: '501-1000', country: 'Nigeria', status: 'customer', tier: 'enterprise', intent_score: 87, contacts_count: 7, revenue: '$50-100M', technologies: ['Salesforce', 'AWS', 'Tableau'] },
  { id: 7, name: 'OPay', domain: 'opayweb.com', industry: 'Payments', size: '1000+', country: 'Nigeria', status: 'prospect', tier: 'enterprise', intent_score: 82, contacts_count: 4, revenue: '$100M+', technologies: ['Oracle', 'AWS', 'Elastic'] },
  { id: 8, name: 'Chipper Cash', domain: 'chippercash.com', industry: 'Fintech', size: '201-500', country: 'Ghana', status: 'prospect', tier: 'mid-market', intent_score: 58, contacts_count: 5, revenue: '$10-50M', technologies: ['HubSpot', 'Segment', 'GCP'] },
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

const BLANK_FORM = { name: '', domain: '', industry: 'Fintech', size: '201-500', country: 'Nigeria', status: 'prospect', tier: 'mid-market', revenue: '', technologies: '' };

export default function Companies() {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const filtered = companies.filter(c => {
    const matchSearch = search === '' || c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase());
    const matchIndustry = industryFilter === 'all' || c.industry === industryFilter;
    return matchSearch && matchIndustry;
  });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newCompany = {
      id: Date.now(),
      ...form,
      intent_score: Math.floor(Math.random() * 30) + 50,
      contacts_count: 0,
      technologies: form.technologies ? form.technologies.split(',').map(t => t.trim()) : [],
    };
    setCompanies(prev => [newCompany, ...prev]);
    setForm(BLANK_FORM);
    setShowAdd(false);
  };

  const handleAISuggest = async () => {
    setAiLoading(true);
    setAiSuggestions(null);
    const existing = companies.map(c => c.name).join(', ');
    const result = await invokeLLM(`You are a B2B GTM advisor for African markets. Based on this existing account list: ${existing}

Suggest 4 new high-fit accounts to add. These should be real African tech/fintech companies NOT already in the list above.

For each, provide:
- Company name
- Why they're a good fit (1 sentence)
- Country
- Estimated size

Format as a numbered list. Be specific and realistic.`);
    setAiSuggestions(result);
    setAiLoading(false);
  };

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
          <Button variant="outline" size="sm" onClick={handleAISuggest} disabled={aiLoading}
            className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {aiLoading ? 'Analyzing...' : 'AI Suggest Accounts'}
          </Button>
          <Button onClick={() => setShowAdd(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Add Company
          </Button>
        </div>

        {/* AI Suggestions Banner */}
        <AnimatePresence>
          {aiSuggestions && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-700 mb-1.5">AI Account Suggestions</p>
                    <p className="text-xs text-emerald-800 whitespace-pre-wrap leading-relaxed">{aiSuggestions}</p>
                  </div>
                </div>
                <button onClick={() => setAiSuggestions(null)} className="text-emerald-400 hover:text-emerald-600 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Company Form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">Add Company</p>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Company name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="text-sm" />
                <Input placeholder="Domain (e.g. company.com)" value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))} className="text-sm" />
                <select className="h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}>
                  {['Fintech', 'Payments', 'Tech', 'SaaS', 'E-commerce', 'Healthcare', 'Logistics'].map(i => <option key={i}>{i}</option>)}
                </select>
                <Input placeholder="Country" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className="text-sm" />
                <select className="h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700" value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))}>
                  {['1-50', '51-200', '201-500', '501-1000', '1000+'].map(s => <option key={s}>{s}</option>)}
                </select>
                <select className="h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {['prospect', 'customer', 'partner', 'churned'].map(s => <option key={s}>{s}</option>)}
                </select>
                <select className="h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700" value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))}>
                  {['enterprise', 'mid-market', 'smb'].map(t => <option key={t}>{t}</option>)}
                </select>
                <Input placeholder="Technologies (comma separated)" value={form.technologies} onChange={e => setForm(p => ({ ...p, technologies: e.target.value }))} className="text-sm" />
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={handleAdd} className="bg-primary text-white text-xs">Save Company</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAdd(false)} className="text-xs">Cancel</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                {(company.technologies || []).slice(0, 3).map(t => (
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
