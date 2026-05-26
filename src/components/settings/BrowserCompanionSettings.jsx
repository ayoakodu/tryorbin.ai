import { useState } from 'react';
import { motion } from 'framer-motion';
import { Chrome, Monitor, Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle2, Link, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Detect browser
function getBrowserInfo() {
  const ua = navigator.userAgent;
  if (ua.includes('Edg/')) return { name: 'Edge', supported: true };
  if (ua.includes('Chrome')) return { name: 'Chrome', supported: true };
  if (ua.includes('Firefox')) return { name: 'Firefox', supported: false };
  if (ua.includes('Safari')) return { name: 'Safari', supported: false };
  return { name: 'Unknown', supported: false };
}

const CONNECTION_STATES = {
  disconnected: {
    label: 'Not Connected',
    color: 'text-slate-400',
    bg: 'bg-slate-50 border-slate-200',
    dot: 'bg-slate-300',
    Icon: WifiOff,
  },
  connected: {
    label: 'Connected',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    dot: 'bg-emerald-500',
    Icon: Wifi,
  },
  connecting: {
    label: 'Connecting…',
    color: 'text-blue-500',
    bg: 'bg-blue-50 border-blue-200',
    dot: 'bg-blue-400',
    Icon: RefreshCw,
  },
  sync_error: {
    label: 'Sync Error',
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-200',
    dot: 'bg-red-400',
    Icon: AlertTriangle,
  },
};

export default function BrowserCompanionSettings() {
  const [status, setStatus]     = useState('disconnected');
  const [lastSync]              = useState(null);
  const browser                 = getBrowserInfo();
  const state                   = CONNECTION_STATES[status] || CONNECTION_STATES.disconnected;
  const StateIcon               = state.Icon;

  const handleConnect = () => {
    setStatus('connecting');
    // Simulate companion connect flow
    setTimeout(() => setStatus('connected'), 1800);
  };

  const handleDisconnect = () => setStatus('disconnected');

  const handleReconnect = () => {
    setStatus('connecting');
    setTimeout(() => setStatus('connected'), 1600);
  };

  return (
    <div className="space-y-4">
      {/* Browser compatibility banner */}
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-xl border text-[12px]',
        browser.supported
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-amber-50 border-amber-200 text-amber-700'
      )}>
        {browser.supported
          ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
        <span>
          {browser.supported
            ? `${browser.name} detected — Browser Companion is supported.`
            : `${browser.name} is not supported. Please use Chrome or Edge for the Browser Companion.`}
        </span>
      </div>

      {/* Connection status card */}
      <div className={cn('flex items-center gap-3 p-4 rounded-xl border', state.bg)}>
        <div className="relative flex-shrink-0">
          <StateIcon className={cn('w-5 h-5', state.color, status === 'connecting' && 'animate-spin')} />
          <div className={cn('absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white', state.dot)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-[13px] font-bold', state.color)}>{state.label}</p>
          {lastSync && (
            <p className="text-[10px] text-slate-400 mt-0.5">Last synced: {new Date(lastSync).toLocaleTimeString()}</p>
          )}
          {status === 'disconnected' && (
            <p className="text-[10px] text-slate-400 mt-0.5">Install the RVNU extension to enable LinkedIn workflow execution.</p>
          )}
          {status === 'sync_error' && (
            <p className="text-[10px] text-red-400 mt-0.5">Connection lost. Click reconnect to restore sync.</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {status === 'disconnected' && browser.supported && (
            <Button size="sm" onClick={handleConnect}
              className="text-[11px] h-7 bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
              <Link className="w-3 h-3" /> Connect
            </Button>
          )}
          {status === 'connected' && (
            <Button size="sm" variant="outline" onClick={handleDisconnect}
              className="text-[11px] h-7 border-slate-200 text-slate-600 gap-1.5">
              <Unlink className="w-3 h-3" /> Disconnect
            </Button>
          )}
          {(status === 'sync_error' || status === 'connecting') && (
            <Button size="sm" variant="outline" onClick={handleReconnect}
              className="text-[11px] h-7 border-slate-200 text-slate-600 gap-1.5">
              <RefreshCw className="w-3 h-3" /> Reconnect
            </Button>
          )}
        </div>
      </div>

      {/* Supported browsers info */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: 'Google Chrome', supported: true,  Icon: Chrome  },
          { name: 'Microsoft Edge', supported: true,  Icon: Monitor },
        ].map(b => (
          <div key={b.name} className={cn(
            'flex items-center gap-2.5 p-3 rounded-xl border text-[11px]',
            b.supported ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-50'
          )}>
            <b.Icon className={cn('w-4 h-4 flex-shrink-0', b.supported ? 'text-slate-600' : 'text-slate-400')} />
            <div>
              <p className="font-semibold text-slate-700">{b.name}</p>
              <p className="text-slate-400 text-[10px]">{b.supported ? 'Supported' : 'Not supported'}</p>
            </div>
            {b.supported && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* What the companion does */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">What the companion does</p>
        {[
          'Opens LinkedIn profiles, posts, and company pages directly from tasks',
          'Provides contextual prospect data overlays while browsing LinkedIn',
          'Keeps sequence task status in sync when you complete actions',
          'Never automates LinkedIn actions — all execution is manual and human-led',
        ].map(item => (
          <div key={item} className="flex items-start gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}