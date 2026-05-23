import { AlertTriangle, CheckCircle2, XCircle, Mail, Shield, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const diagnostics = [
  {
    category: 'Email Deliverability',
    icon: Mail,
    checks: [
      { label: 'Mailbox connected', status: 'warning', detail: 'No mailbox linked. Connect your email to start sending.', action: 'Connect mailbox', route: '/integrations' },
      { label: 'SPF record configured', status: 'warning', detail: 'SPF not detected on your sending domain.', action: 'Configure', route: '/deliverability' },
      { label: 'DKIM record configured', status: 'warning', detail: 'DKIM not detected. Emails may land in spam.', action: 'Configure', route: '/deliverability' },
      { label: 'DMARC policy active', status: 'error', detail: 'No DMARC policy found. High risk for phishing flags.', action: 'Fix now', route: '/deliverability' },
    ]
  },
  {
    category: 'AI Content Center',
    icon: Zap,
    checks: [
      { label: 'Value proposition defined', status: 'warning', detail: 'Update your AI content center to tailor research to your offering.', action: 'Review settings', route: '/settings' },
      { label: 'Brand voice configured', status: 'ok', detail: 'AI Copilot is using default tone settings.' },
      { label: 'Personalization variables set', status: 'ok', detail: '{{first_name}}, {{company}}, and {{title}} are mapped.' },
    ]
  },
  {
    category: 'Sequence Health',
    icon: Shield,
    checks: [
      { label: 'No sequences with 0 steps', status: 'warning', detail: '1 sequence (Event Follow-up) has no steps configured.', action: 'Build steps', route: '/sequence-builder' },
      { label: 'Sending limits respected', status: 'ok', detail: 'Daily sending volume is within safe limits.' },
      { label: 'Follow-up intervals ≥ 2 days', status: 'ok', detail: 'All active sequences maintain healthy follow-up spacing.' },
    ]
  },
];

const statusIcon = {
  ok: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />,
  warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />,
  error: <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />,
};

const statusBg = {
  ok: '',
  warning: 'bg-amber-50 border-amber-100',
  error: 'bg-red-50 border-red-100',
};

export default function SequenceDiagnosticsTab() {
  const navigate = useNavigate();

  const allChecks = diagnostics.flatMap(d => d.checks);
  const errors = allChecks.filter(c => c.status === 'error').length;
  const warnings = allChecks.filter(c => c.status === 'warning').length;
  const passing = allChecks.filter(c => c.status === 'ok').length;

  return (
    <div className="p-5 space-y-5">
      {/* Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-5">
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-700 mb-0.5">System Health</p>
          <p className="text-[11px] text-slate-500">
            {errors > 0 ? `${errors} critical issue${errors > 1 ? 's' : ''} need attention.` : warnings > 0 ? `${warnings} warning${warnings > 1 ? 's' : ''} detected.` : 'All systems healthy.'}
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-center">
            <p className="text-base font-bold text-red-500">{errors}</p>
            <p className="text-[10px] text-slate-400">Errors</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-amber-500">{warnings}</p>
            <p className="text-[10px] text-slate-400">Warnings</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-emerald-500">{passing}</p>
            <p className="text-[10px] text-slate-400">Passing</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {diagnostics.map(cat => {
          const CatIcon = cat.icon;
          return (
            <div key={cat.category} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
                <CatIcon className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-bold text-slate-700">{cat.category}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {cat.checks.map((check, i) => (
                  <div key={i} className={`flex items-start gap-3 px-4 py-3 ${check.status !== 'ok' ? statusBg[check.status] + ' border-l-2' : ''}`}>
                    <div className="mt-0.5">{statusIcon[check.status]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700">{check.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{check.detail}</p>
                    </div>
                    {check.action && check.route && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(check.route)}
                        className="h-6 text-[10px] px-2 flex-shrink-0 border-slate-300"
                      >
                        {check.action}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}