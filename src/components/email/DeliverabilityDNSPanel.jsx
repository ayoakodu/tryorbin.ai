import { useState } from 'react';
import { ShieldCheck, Globe, CheckCircle2, AlertTriangle, Clock, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const DNS_RECORDS = [
  {
    type: 'SPF',
    domain: 'rvnu.io',
    status: 'pass',
    record: 'v=spf1 include:_spf.google.com include:mailgun.org ~all',
    instructions: 'Add a TXT record to your DNS with the value above. This authorizes RVNU to send on behalf of your domain.',
  },
  {
    type: 'DKIM',
    domain: 'rvnu.io',
    status: 'pass',
    record: 'k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2+...truncated',
    instructions: 'Add a TXT record with the hostname selector._domainkey.rvnu.io pointing to the DKIM public key.',
  },
  {
    type: 'DMARC',
    domain: 'rvnu.io',
    status: 'pass',
    record: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@rvnu.io; pct=100',
    instructions: 'Add a TXT record at _dmarc.rvnu.io. Start with p=none while monitoring, then move to quarantine.',
  },
  {
    type: 'DKIM',
    domain: 'mail.rvnu.io',
    status: 'pending',
    record: 'k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8x+...truncated',
    instructions: 'DKIM key not yet detected. Ensure the DNS record has propagated (can take up to 48 hours).',
  },
  {
    type: 'DMARC',
    domain: 'mail.rvnu.io',
    status: 'fail',
    record: '—',
    instructions: 'No DMARC record found. Add a TXT record at _dmarc.mail.rvnu.io to protect your sending reputation.',
  },
];

const STATUS_STYLE = {
  pass:    { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 },
  fail:    { color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200',     icon: AlertTriangle },
  pending: { color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   icon: Clock },
};

function DNSRow({ record }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const s = STATUS_STYLE[record.status];
  const StatusIcon = s.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(record.record);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('rounded-xl border transition-all', s.border, expanded ? cn(s.bg, 'shadow-sm') : 'border-slate-200 bg-white')}>
      <button className="w-full flex items-center gap-3 px-5 py-3.5 text-left" onClick={() => setExpanded(v => !v)}>
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', s.color, s.bg, s.border)}>{record.type}</span>
        <span className="text-xs font-medium text-slate-700 flex-1">{record.domain}</span>
        <div className={cn('flex items-center gap-1.5 text-[11px] font-semibold', s.color)}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span className="capitalize">{record.status}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-3 border-t border-slate-100">
          <div className="mt-3">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">DNS Record Value</p>
            <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-2.5">
              <code className="flex-1 text-[11px] font-mono text-emerald-400 break-all">{record.record}</code>
              <button onClick={handleCopy} className="flex-shrink-0 text-[11px] text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-xl bg-white border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-slate-600 leading-relaxed">{record.instructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeliverabilityDNSPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-slate-800">DNS Authentication Records</h3>
        <span className="ml-auto text-[11px] text-slate-400">Click a record to view setup instructions</span>
      </div>
      {DNS_RECORDS.map((r, i) => <DNSRow key={i} record={r} />)}
    </div>
  );
}