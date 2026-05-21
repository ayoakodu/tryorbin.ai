import { useState } from 'react';
import { ShieldCheck, Mail, Globe, AlertTriangle, CheckCircle2, Clock, TrendingUp, Activity, Inbox } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';

const tabs = ['Overview', 'Domains', 'Mailboxes'];

const mailboxes = [
  { email: 'outreach@rvnu.io', status: 'active', warmup: 'complete', dailyLimit: 80, sent: 54, reputation: 92 },
  { email: 'sales@rvnu.io', status: 'active', warmup: 'complete', dailyLimit: 100, sent: 71, reputation: 88 },
  { email: 'hello@rvnu.io', status: 'warming', warmup: 'in progress', dailyLimit: 30, sent: 18, reputation: 74 },
  { email: 'noreply@rvnu.io', status: 'inactive', warmup: 'paused', dailyLimit: 0, sent: 0, reputation: 61 },
];

const domains = [
  { domain: 'rvnu.io', spf: 'pass', dkim: 'pass', dmarc: 'pass', verified: true },
  { domain: 'mail.rvnu.io', spf: 'pass', dkim: 'pass', dmarc: 'fail', verified: false },
  { domain: 'outreach.rvnu.io', spf: 'pass', dkim: 'pending', dmarc: 'pending', verified: false },
];

function StatusPill({ value }) {
  const map = {
    pass: 'bg-emerald-100 text-emerald-700',
    fail: 'bg-red-100 text-red-600',
    pending: 'bg-amber-100 text-amber-700',
    active: 'bg-emerald-100 text-emerald-700',
    warming: 'bg-amber-100 text-amber-700',
    inactive: 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${map[value] || 'bg-slate-100 text-slate-500'}`}>
      {value}
    </span>
  );
}

function Overview() {
  const metrics = [
    { label: 'Deliverability Score', value: '87%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Bounce Rate', value: '1.4%', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Open Rate', value: '34.2%', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Reply Rate', value: '8.7%', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  const recommendations = [
    { icon: AlertTriangle, color: 'text-amber-500', text: 'DMARC not configured on mail.rvnu.io — configure to improve deliverability.' },
    { icon: Clock, color: 'text-blue-500', text: 'hello@rvnu.io is still warming up. Limit sends to 18/day until complete.' },
    { icon: CheckCircle2, color: 'text-emerald-600', text: 'SPF and DKIM passing on all primary domains. Good standing.' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center mb-3`}>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <p className="text-xl font-bold text-slate-800">{m.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-slate-800">Sending Activity</h3>
          </div>
          <div className="space-y-3">
            {mailboxes.filter(m => m.status !== 'inactive').map((m) => (
              <div key={m.email} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Inbox className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-700 truncate">{m.email}</p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(m.sent / m.dailyLimit) * 100}%` }} />
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">{m.sent}/{m.dailyLimit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-slate-800">Recommendations</h3>
          </div>
          <div className="space-y-3">
            {recommendations.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <r.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${r.color}`} />
                <p className="text-[11px] text-slate-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Domains() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <Globe className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-slate-800">Connected Domains</h3>
        <span className="ml-auto text-[10px] text-slate-400">{domains.length} domains</span>
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide text-[10px]">
            <th className="px-5 py-2.5 text-left font-semibold">Domain</th>
            <th className="px-4 py-2.5 text-left font-semibold">SPF</th>
            <th className="px-4 py-2.5 text-left font-semibold">DKIM</th>
            <th className="px-4 py-2.5 text-left font-semibold">DMARC</th>
            <th className="px-4 py-2.5 text-left font-semibold">Verified</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {domains.map((d) => (
            <tr key={d.domain} className="hover:bg-slate-50 transition-colors">
              <td className="px-5 py-3 font-medium text-slate-800">{d.domain}</td>
              <td className="px-4 py-3"><StatusPill value={d.spf} /></td>
              <td className="px-4 py-3"><StatusPill value={d.dkim} /></td>
              <td className="px-4 py-3"><StatusPill value={d.dmarc} /></td>
              <td className="px-4 py-3">
                {d.verified
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  : <AlertTriangle className="w-4 h-4 text-amber-400" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Mailboxes() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <Inbox className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-slate-800">Connected Mailboxes</h3>
        <span className="ml-auto text-[10px] text-slate-400">{mailboxes.length} mailboxes</span>
      </div>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide text-[10px]">
            <th className="px-5 py-2.5 text-left font-semibold">Mailbox</th>
            <th className="px-4 py-2.5 text-left font-semibold">Status</th>
            <th className="px-4 py-2.5 text-left font-semibold">Warmup</th>
            <th className="px-4 py-2.5 text-left font-semibold">Daily Limit</th>
            <th className="px-4 py-2.5 text-left font-semibold">Reputation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {mailboxes.map((m) => (
            <tr key={m.email} className="hover:bg-slate-50 transition-colors">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Mail className="w-3 h-3 text-emerald-700" />
                  </div>
                  <span className="font-medium text-slate-800">{m.email}</span>
                </div>
              </td>
              <td className="px-4 py-3"><StatusPill value={m.status} /></td>
              <td className="px-4 py-3 capitalize text-slate-600">{m.warmup}</td>
              <td className="px-4 py-3 text-slate-600">{m.dailyLimit > 0 ? `${m.dailyLimit}/day` : '—'}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${m.reputation >= 80 ? 'bg-emerald-500' : m.reputation >= 65 ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ width: `${m.reputation}%` }}
                    />
                  </div>
                  <span className="text-slate-600">{m.reputation > 0 ? `${m.reputation}%` : '—'}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Deliverability() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <TopBar title="Deliverability Suite" subtitle="Monitor sending health, domains, and mailbox performance" />
      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && <Overview />}
        {activeTab === 'Domains' && <Domains />}
        {activeTab === 'Mailboxes' && <Mailboxes />}
      </div>
    </div>
  );
}