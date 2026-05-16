import { motion } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Plus, Zap, Globe, ArrowRight } from 'lucide-react';

const integrations = [
  { name: 'WhatsApp Business', category: 'Messaging', status: 'available', desc: 'Connect your WhatsApp Business API to send campaigns, sequences, and track engagement natively.', color: '#25D366' },
  { name: 'Gmail', category: 'Email', status: 'available', desc: 'Send sequences from your Gmail account with open and click tracking built in.', color: '#EA4335' },
  { name: 'Outlook', category: 'Email', status: 'available', desc: 'Microsoft 365 email sending with full sequence automation and calendar sync.', color: '#0078D4' },
  { name: 'Google Calendar', category: 'Scheduling', status: 'available', desc: 'Auto-log meetings and sync booked calls directly from your sequences.', color: '#4285F4' },
  { name: 'Slack', category: 'Notifications', status: 'available', desc: 'Get real-time deal alerts, reply notifications, and team activity updates in Slack.', color: '#4A154B' },
  { name: 'HubSpot', category: 'CRM', status: 'available', desc: 'Bidirectional contact and deal sync — keep HubSpot updated as you execute in RVNU.', color: '#FF7A59' },
  { name: 'Salesforce', category: 'CRM', status: 'available', desc: 'Sync pipeline activity, contacts, and deal stages with Salesforce in real time.', color: '#00A1E0' },
  { name: 'LinkedIn', category: 'Social', status: 'available', desc: 'Log LinkedIn outreach tasks and track engagement as part of multichannel sequences.', color: '#0077B5' },
  { name: 'Zapier', category: 'Automation', status: 'coming_soon', desc: 'Connect RVNU workflows to 5,000+ apps via Zapier triggers and actions.', color: '#FF4A00' },
  { name: 'Twilio', category: 'SMS', status: 'coming_soon', desc: 'SMS outreach and automated follow-ups via Twilio infrastructure.', color: '#F22F46' },
  { name: 'Zoom', category: 'Meetings', status: 'coming_soon', desc: 'Auto-log Zoom meetings, transcribe calls, and generate AI meeting summaries.', color: '#2D8CFF' },
  { name: 'Apollo.io', category: 'Prospecting', status: 'coming_soon', desc: 'Import and enrich prospect lists directly from Apollo into your sequences.', color: '#5D5DFF' },
  { name: 'Microsoft Teams', category: 'Notifications', status: 'coming_soon', desc: 'Team notifications and deal alerts delivered to Microsoft Teams channels.', color: '#5059C9' },
  { name: 'Calendly', category: 'Scheduling', status: 'coming_soon', desc: 'Embed Calendly booking links in sequences and track meeting conversions.', color: '#006BFF' },
  { name: 'Google Ads', category: 'Advertising', status: 'coming_soon', desc: 'Sync pipeline attribution with Google Ads for closed-loop revenue reporting.', color: '#4285F4' },
  { name: 'Stripe', category: 'Revenue', status: 'coming_soon', desc: 'Pull revenue and subscription data into pipeline forecasting and analytics.', color: '#6772E5' },
];

const categoryColors = {
  CRM: 'bg-blue-500/10 text-blue-400',
  Social: 'bg-blue-600/10 text-blue-500',
  Messaging: 'bg-primary/10 text-primary',
  Email: 'bg-cyan-500/10 text-cyan-400',
  Notifications: 'bg-violet-500/10 text-violet-400',
  Scheduling: 'bg-amber-500/10 text-amber-400',
  Automation: 'bg-orange-500/10 text-orange-400',
  SMS: 'bg-red-500/10 text-red-400',
  Prospecting: 'bg-indigo-500/10 text-indigo-400',
  Revenue: 'bg-primary/10 text-primary',
  Advertising: 'bg-orange-500/10 text-orange-400',
};

export default function Integrations() {
  const available = integrations.filter(i => i.status === 'available');
  const coming = integrations.filter(i => i.status === 'coming_soon');

  return (
    <div className="min-h-screen">
      <TopBar title="Integrations" subtitle="Connect RVNU to your existing tools" />
      
      <div className="p-6 space-y-6">
        {/* Hero */}
        <div className="glass rounded-xl p-6 border border-primary/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1">GTM Execution Integrations</h3>
            <p className="text-sm text-muted-foreground">Connect your execution stack. RVNU integrates with your email, WhatsApp, CRM, and automation tools so every workflow runs end-to-end without switching tabs.</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 whitespace-nowrap">
            <Globe className="w-4 h-4" /> Browse All
          </Button>
        </div>

        {/* Available */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-foreground">Available Integrations</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{available.length}</span>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {available.map((integration, i) => (
              <motion.div key={integration.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4 hover:border-border transition-all group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: integration.color + '20', color: integration.color, border: `1px solid ${integration.color}30` }}>
                    {integration.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{integration.name}</h4>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${categoryColors[integration.category] || 'bg-secondary text-muted-foreground'}`}>
                      {integration.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{integration.desc}</p>
                <Button size="sm" className="w-full text-xs bg-primary/10 text-primary hover:bg-primary/20 border-0">
                  Connect <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-foreground">Coming Soon</h3>
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-medium">{coming.length}</span>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {coming.map((integration, i) => (
              <div key={integration.name} className="glass rounded-xl p-4 opacity-60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: integration.color + '15', color: integration.color }}>
                    {integration.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{integration.name}</h4>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${categoryColors[integration.category] || 'bg-secondary text-muted-foreground'}`}>
                      {integration.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{integration.desc}</p>
                <div className="w-full py-1.5 text-center text-xs text-muted-foreground border border-border/50 rounded-lg">
                  Coming Soon
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}