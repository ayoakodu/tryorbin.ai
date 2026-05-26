import { useState } from 'react';
import { Server, CheckCircle2, Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const PROVIDERS = [
  { id: 'mailgun',  name: 'Mailgun',     desc: 'Transactional email API', color: 'border-red-200 hover:border-red-300', activeColor: 'border-red-400 bg-red-50' },
  { id: 'sendgrid', name: 'SendGrid',    desc: 'Email delivery platform',  color: 'border-blue-200 hover:border-blue-300', activeColor: 'border-blue-400 bg-blue-50' },
  { id: 'ses',      name: 'Amazon SES',  desc: 'AWS email service',        color: 'border-amber-200 hover:border-amber-300', activeColor: 'border-amber-400 bg-amber-50' },
  { id: 'smtp',     name: 'Custom SMTP', desc: 'Any SMTP server',          color: 'border-slate-200 hover:border-slate-300', activeColor: 'border-slate-400 bg-slate-50' },
];

const SENDERS = [
  { email: 'outreach@rvnu.io', name: 'RVNU Outreach', status: 'verified',  provider: 'Mailgun' },
  { email: 'sales@rvnu.io',    name: 'RVNU Sales',    status: 'verified',  provider: 'Mailgun' },
  { email: 'hello@rvnu.io',    name: 'RVNU Hello',    status: 'pending',   provider: 'SendGrid' },
];

export default function SMTPConfigPanel() {
  const [selectedProvider, setSelectedProvider] = useState('mailgun');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showSecret, setShowSecret] = useState(false);
  const [config, setConfig] = useState({ host: 'smtp.mailgun.org', port: '587', username: 'postmaster@rvnu.io', password: '', encryption: 'TLS' });

  const handleTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult('success');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Provider selection */}
      <div>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Sending Provider</p>
        <div className="grid grid-cols-2 gap-3">
          {PROVIDERS.map((p) => (
            <button key={p.id} onClick={() => setSelectedProvider(p.id)}
              className={cn('flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all', selectedProvider === p.id ? p.activeColor : cn('bg-white', p.color))}>
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <Server className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{p.name}</p>
                <p className="text-[10px] text-slate-500">{p.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SMTP fields */}
      <div>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Connection Settings</p>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {[
            { label: 'SMTP Host', key: 'host', type: 'text', placeholder: 'smtp.mailgun.org' },
            { label: 'Port', key: 'port', type: 'number', placeholder: '587' },
            { label: 'Username', key: 'username', type: 'text', placeholder: 'postmaster@yourdomain.com' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="flex items-center gap-4 px-5 py-3">
              <span className="text-[11px] font-semibold text-slate-600 w-28 flex-shrink-0">{label}</span>
              <Input type={type} value={config[key]} onChange={e => setConfig(c => ({ ...c, [key]: e.target.value }))}
                placeholder={placeholder} className="flex-1 h-8 text-xs border-0 shadow-none px-0 focus-visible:ring-0" />
            </div>
          ))}
          <div className="flex items-center gap-4 px-5 py-3">
            <span className="text-[11px] font-semibold text-slate-600 w-28 flex-shrink-0">API Key / Password</span>
            <div className="flex-1 relative">
              <Input type={showSecret ? 'text' : 'password'} value={config.password} onChange={e => setConfig(c => ({ ...c, password: e.target.value }))}
                placeholder="Enter API key or SMTP password" className="flex-1 h-8 text-xs border-0 shadow-none px-0 focus-visible:ring-0 pr-8" />
              <button onClick={() => setShowSecret(v => !v)} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 px-5 py-3">
            <span className="text-[11px] font-semibold text-slate-600 w-28 flex-shrink-0">Encryption</span>
            <select value={config.encryption} onChange={e => setConfig(c => ({ ...c, encryption: e.target.value }))}
              className="flex-1 h-8 text-xs bg-transparent border-0 outline-none text-slate-700 cursor-pointer">
              {['TLS', 'SSL', 'None'].map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Test connection */}
      <div className="flex items-center gap-3">
        <Button onClick={handleTest} disabled={testing} variant="outline" className="text-xs h-8 gap-1.5">
          {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5" />}
          {testing ? 'Testing…' : 'Test Connection'}
        </Button>
        {testResult === 'success' && (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Connection successful
          </span>
        )}
        {testResult === 'error' && (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600">
            <AlertTriangle className="w-3.5 h-3.5" /> Connection failed — check credentials
          </span>
        )}
        <Button className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs">Save Configuration</Button>
      </div>

      {/* Sender identities */}
      <div>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Sender Identities</p>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {SENDERS.map((s) => (
            <div key={s.email} className="flex items-center gap-3 px-5 py-3.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-emerald-700">{s.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-800">{s.email}</p>
                <p className="text-[10px] text-slate-400">{s.name} · {s.provider}</p>
              </div>
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', s.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200')}>
                {s.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}