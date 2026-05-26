import { useState } from 'react';
import { ShieldCheck, Zap, Globe, TrendingUp, AlertTriangle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DOMAIN_CHECKS = [
  { label: 'SPF Record',   status: 'pass',    detail: 'v=spf1 include:_spf.google.com ~all' },
  { label: 'DKIM',         status: 'pass',    detail: 'Selector: google · 2048-bit key' },
  { label: 'DMARC',        status: 'warning', detail: 'p=none — consider upgrading to quarantine/reject' },
  { label: 'MX Records',   status: 'pass',    detail: 'aspmx.l.google.com (priority 1)' },
  { label: 'Reverse DNS',  status: 'pass',    detail: 'mail.yourdomain.com resolves correctly' },
  { label: 'Blacklists',   status: 'pass',    detail: 'Not listed on any major blacklists' },
];

const METRICS = [
  { label: 'Inbox Rate',       value: '94.2%', trend: '+1.3%', good: true  },
  { label: 'Spam Rate',        value: '0.8%',  trend: '-0.2%', good: true  },
  { label: 'Bounce Rate',      value: '2.1%',  trend: '+0.4%', good: false },
  { label: 'Unsubscribe Rate', value: '0.3%',  trend: '0.0%',  good: true  },
];

const WARMUP_DATA = [
  { day: 'Day 1',  sent: 20,  inbox: 19 },
  { day: 'Day 3',  sent: 40,  inbox: 38 },
  { day: 'Day 7',  sent: 80,  inbox: 76 },
  { day: 'Day 14', sent: 150, inbox: 143 },
  { day: 'Day 21', sent: 250, inbox: 241 },
  { day: 'Day 30', sent: 400, inbox: 388 },
];

const statusIcon = (status) => {
  if (status === 'pass')    return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  return <XCircle className="w-4 h-4 text-red-500" />;
};

const statusBadge = (status) => {
  if (status === 'pass')    return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Pass</Badge>;
  if (status === 'warning') return <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">Warning</Badge>;
  return <Badge className="bg-red-50 text-red-700 border-red-200 text-[10px]">Fail</Badge>;
};

export default function Deliverability() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview',  label: 'Overview'   },
    { id: 'dns',       label: 'DNS & Auth' },
    { id: 'warmup',    label: 'Warmup'     },
    { id: 'blacklist', label: 'Blacklists' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Deliverability</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitor your email sending reputation and authentication</p>
        </div>
        <Button size="sm" variant="outline" className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" /> Run Check
        </Button>
      </div>

      {/* Score card */}
      <div className="bg-card rounded-2xl border border-border p-6 flex items-center gap-8">
        <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-emerald-200 bg-emerald-50 flex-shrink-0">
          <span className="text-3xl font-bold text-emerald-600">92</span>
          <span className="text-[11px] text-emerald-500 font-medium">/ 100</span>
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold text-foreground">Good Deliverability Score</p>
          <p className="text-sm text-muted-foreground mt-1">Your sending reputation is healthy. Fix the DMARC warning to reach an excellent score.</p>
          <div className="flex flex-wrap gap-3 mt-3">
            {METRICS.map(m => (
              <div key={m.label} className="bg-muted/50 rounded-xl px-4 py-2.5 text-center min-w-[100px]">
                <p className="text-lg font-bold text-foreground">{m.value}</p>
                <p className="text-[11px] text-muted-foreground">{m.label}</p>
                <p className={cn('text-[10px] font-semibold mt-0.5', m.good ? 'text-emerald-600' : 'text-red-500')}>{m.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Authentication Status</h3>
            </div>
            <div className="space-y-3">
              {DOMAIN_CHECKS.slice(0, 3).map(c => (
                <div key={c.label} className="flex items-center gap-3">
                  {statusIcon(c.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{c.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.detail}</p>
                  </div>
                  {statusBadge(c.status)}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Infrastructure</h3>
            </div>
            <div className="space-y-3">
              {DOMAIN_CHECKS.slice(3).map(c => (
                <div key={c.label} className="flex items-center gap-3">
                  {statusIcon(c.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{c.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.detail}</p>
                  </div>
                  {statusBadge(c.status)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dns' && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Check</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DOMAIN_CHECKS.map(c => (
                <tr key={c.label} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-foreground flex items-center gap-2">
                    {statusIcon(c.status)} {c.label}
                  </td>
                  <td className="px-5 py-3.5">{statusBadge(c.status)}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{c.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'warmup' && (
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Mailbox Warmup Progress</h3>
            <Badge className="ml-auto bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Active</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-semibold text-muted-foreground">Period</th>
                  <th className="text-left py-2 text-xs font-semibold text-muted-foreground">Sent</th>
                  <th className="text-left py-2 text-xs font-semibold text-muted-foreground">Inbox</th>
                  <th className="text-left py-2 text-xs font-semibold text-muted-foreground">Inbox Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {WARMUP_DATA.map(row => (
                  <tr key={row.day} className="hover:bg-muted/20">
                    <td className="py-2.5 font-medium text-foreground">{row.day}</td>
                    <td className="py-2.5 text-muted-foreground">{row.sent}</td>
                    <td className="py-2.5 text-muted-foreground">{row.inbox}</td>
                    <td className="py-2.5">
                      <span className="text-emerald-600 font-semibold">
                        {Math.round((row.inbox / row.sent) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'blacklist' && (
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Blacklist Monitoring</h3>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">All Clear</p>
              <p className="text-xs text-emerald-600">Your IP and domain are not listed on any major blacklists. Last checked: just now.</p>
            </div>
          </div>
          <div className="space-y-2">
            {['Spamhaus', 'SORBS', 'SpamCop', 'Barracuda', 'MXToolbox', 'URIBL'].map(bl => (
              <div key={bl} className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-muted/30 border border-border">
                <span className="text-sm font-medium text-foreground">{bl}</span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Not Listed</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}