import { CheckCircle2, AlertTriangle, XCircle, Clock, Server, Wifi, Database, Cpu, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const SERVICES = [
  { name: 'Email Sending (SMTP)',   status: 'operational', latency: '12ms',  uptime: '99.97%' },
  { name: 'Inbox Sync',            status: 'operational', latency: '340ms', uptime: '99.91%' },
  { name: 'AI Generation',         status: 'operational', latency: '1.2s',  uptime: '99.85%' },
  { name: 'Tracking Pixels',       status: 'degraded',    latency: '820ms', uptime: '98.40%' },
  { name: 'Webhook Processor',     status: 'operational', latency: '45ms',  uptime: '99.99%' },
  { name: 'Sequence Engine',       status: 'operational', latency: '28ms',  uptime: '99.95%' },
  { name: 'Database',              status: 'operational', latency: '8ms',   uptime: '99.99%' },
  { name: 'LinkedIn Companion',    status: 'offline',     latency: '—',     uptime: '94.10%' },
];

const INCIDENTS = [
  { title: 'Tracking pixel latency elevated',     status: 'monitoring', time: '2 hr ago',    severity: 'medium' },
  { title: 'LinkedIn Companion offline — investigating', status: 'investigating', time: '3 hr ago', severity: 'high' },
  { title: 'Email sending delay resolved',        status: 'resolved',   time: '1d ago',      severity: 'low' },
];

const STATUS_CONFIG = {
  operational: { label: 'Operational', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500', icon: CheckCircle2 },
  degraded:    { label: 'Degraded',    color: 'text-amber-600',   bg: 'bg-amber-50',   dot: 'bg-amber-400 animate-pulse', icon: AlertTriangle },
  offline:     { label: 'Offline',     color: 'text-red-600',     bg: 'bg-red-50',     dot: 'bg-red-500',    icon: XCircle },
};

const SEVERITY_CONFIG = {
  high:   'bg-red-50 text-red-600 border-red-200',
  medium: 'bg-amber-50 text-amber-600 border-amber-200',
  low:    'bg-emerald-50 text-emerald-600 border-emerald-200',
};

const INCIDENT_STATUS = {
  investigating: 'bg-red-100 text-red-700',
  monitoring:    'bg-amber-100 text-amber-700',
  resolved:      'bg-emerald-100 text-emerald-700',
};

export default function SystemHealthDashboard() {
  const allOk = SERVICES.filter(s => s.status === 'operational').length;
  const degraded = SERVICES.filter(s => s.status === 'degraded').length;
  const offline = SERVICES.filter(s => s.status === 'offline').length;

  const overallStatus = offline > 0 ? 'outage' : degraded > 0 ? 'degraded' : 'operational';
  const overallStyle = {
    operational: { label: 'All Systems Operational', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    degraded:    { label: 'Partial Degradation',     color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
    outage:      { label: 'Service Disruption',       color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  }[overallStatus];

  return (
    <div className="space-y-5">
      {/* Overall status */}
      <div className={cn('rounded-xl border p-4 flex items-center gap-3', overallStyle.bg)}>
        <Activity className={cn('w-5 h-5', overallStyle.color)} />
        <div className="flex-1">
          <p className={cn('text-sm font-bold', overallStyle.color)}>{overallStyle.label}</p>
          <p className="text-[11px] text-slate-500">{allOk}/{SERVICES.length} services operational</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-emerald-600 font-semibold">{allOk} OK</span>
          {degraded > 0 && <span className="text-amber-600 font-semibold">{degraded} Degraded</span>}
          {offline > 0 && <span className="text-red-600 font-semibold">{offline} Offline</span>}
        </div>
      </div>

      {/* Service grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Server className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-slate-800">Service Status</h3>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wide text-[10px]">
              <th className="px-5 py-2.5 text-left font-semibold">Service</th>
              <th className="px-4 py-2.5 text-left font-semibold">Status</th>
              <th className="px-4 py-2.5 text-left font-semibold">Latency</th>
              <th className="px-4 py-2.5 text-left font-semibold">Uptime (30d)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {SERVICES.map((svc) => {
              const s = STATUS_CONFIG[svc.status];
              const StatusIcon = s.icon;
              return (
                <tr key={svc.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{svc.name}</td>
                  <td className="px-4 py-3">
                    <span className={cn('flex items-center gap-1.5 w-fit text-[10px] font-semibold px-2 py-0.5 rounded-full', s.color, s.bg)}>
                      <div className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">{svc.latency}</td>
                  <td className="px-4 py-3">
                    <span className={cn('font-semibold', parseFloat(svc.uptime) >= 99.9 ? 'text-emerald-600' : parseFloat(svc.uptime) >= 99 ? 'text-amber-600' : 'text-red-500')}>
                      {svc.uptime}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Incident log */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-800">Recent Incidents</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {INCIDENTS.map((inc, i) => (
            <div key={i} className={cn('flex items-start gap-3 px-5 py-3.5', SEVERITY_CONFIG[inc.severity].split(' ')[0])}>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-800">{inc.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{inc.time}</p>
              </div>
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize', INCIDENT_STATUS[inc.status])}>{inc.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}