import { AlertCircle, Clock, Wifi, WifiOff } from 'lucide-react';

const channelIntegrationStatus = {
  email: { connected: false, label: 'Email' },
  whatsapp: { connected: false, label: 'WhatsApp' },
  sms: { connected: false, label: 'SMS' },
  linkedin: { connected: null, label: 'LinkedIn' }, // task-based, no send
  call: { connected: null, label: 'Call' },          // task-based, no send
};

// Returns the execution mode for a given channel
export function getChannelExecutionMode(channel) {
  if (channel === 'linkedin' || channel === 'call') return 'task';
  const status = channelIntegrationStatus[channel];
  if (!status) return 'unknown';
  return status.connected ? 'live' : 'queued';
}

export function ChannelStatusBadge({ channel, className = '' }) {
  const mode = getChannelExecutionMode(channel);

  if (mode === 'task') {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 ${className}`}>
        <Clock className="w-2.5 h-2.5" />
        Task Created
      </span>
    );
  }

  if (mode === 'queued') {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 ${className}`}>
        <WifiOff className="w-2.5 h-2.5" />
        Awaiting Connection
      </span>
    );
  }

  if (mode === 'live') {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 ${className}`}>
        <Wifi className="w-2.5 h-2.5" />
        Live
      </span>
    );
  }

  return null;
}

export function StepExecutionStatus({ step }) {
  const mode = getChannelExecutionMode(step.type);

  const configs = {
    task: {
      label: 'Will create task in queue',
      color: 'text-blue-400',
      bg: 'bg-blue-500/5 border-blue-500/20',
      icon: Clock,
    },
    queued: {
      label: 'Queued — connect integration to send',
      color: 'text-amber-400',
      bg: 'bg-amber-500/5 border-amber-500/20',
      icon: AlertCircle,
    },
    live: {
      label: 'Ready to send via integration',
      color: 'text-primary',
      bg: 'bg-primary/5 border-primary/20',
      icon: Wifi,
    },
  };

  const cfg = configs[mode];
  if (!cfg) return null;
  const Icon = cfg.icon;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] ${cfg.bg} ${cfg.color}`}>
      <Icon className="w-2.5 h-2.5 flex-shrink-0" />
      <span>{cfg.label}</span>
    </div>
  );
}