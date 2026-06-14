import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, AlertTriangle, Ban, Send, Activity, Sparkles, Paperclip, Webhook
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import EmailAnalyticsDashboard from '@/components/email/EmailAnalyticsDashboard';
import BounceManagementDashboard from '@/components/email/BounceManagementDashboard';
import UnsubscribeManager from '@/components/email/UnsubscribeManager';
import EmailQueueDashboard from '@/components/email/EmailQueueDashboard';
import AttachmentManager from '@/components/email/AttachmentManager';
import AIUsageDashboard from '@/components/email/AIUsageDashboard';
import WebhookEventMonitor from '@/components/email/WebhookEventMonitor';
import SystemHealthDashboard from '@/components/email/SystemHealthDashboard';

const TABS = [
  { id: 'analytics',   label: 'Analytics',    icon: BarChart3 },
  { id: 'bounces',     label: 'Bounces',       icon: AlertTriangle },
  { id: 'unsubscribe', label: 'Suppression',   icon: Ban },
  { id: 'queue',       label: 'Queue',         icon: Send },
  { id: 'attachments', label: 'Attachments',   icon: Paperclip },
  { id: 'ai',          label: 'AI Usage',      icon: Sparkles },
  { id: 'webhooks',    label: 'Events',        icon: Activity },
  { id: 'health',      label: 'System Health', icon: Webhook },
];

export default function EmailOps() {
  const [tab, setTab] = useState('analytics');

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <TopBar title="Email Operations" subtitle="Analytics, bounces, queue, attachments, and system health" />
      <div className="p-4 md:p-6">
        {/* Tab nav — scrollable on mobile */}
        <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => {
            const TIcon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 md:px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${tab === t.id ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                <TIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
          {tab === 'analytics'   && <EmailAnalyticsDashboard />}
          {tab === 'bounces'     && <BounceManagementDashboard />}
          {tab === 'unsubscribe' && <UnsubscribeManager />}
          {tab === 'queue'       && <EmailQueueDashboard />}
          {tab === 'attachments' && <AttachmentManager />}
          {tab === 'ai'          && <AIUsageDashboard />}
          {tab === 'webhooks'    && <WebhookEventMonitor />}
          {tab === 'health'      && <SystemHealthDashboard />}
        </motion.div>
      </div>
    </div>
  );
}