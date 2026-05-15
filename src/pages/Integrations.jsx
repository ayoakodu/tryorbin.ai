import { motion } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Plus, Zap, Globe, ArrowRight } from 'lucide-react';

const integrations = [
  { name: 'HubSpot', category: 'CRM', status: 'available', desc: 'Sync contacts, deals, and activities with HubSpot CRM.', color: '#FF7A59' },
  { name: 'Salesforce', category: 'CRM', status: 'available', desc: 'Bidirectional sync with Salesforce CRM and pipelines.', color: '#00A1E0' },
  { name: 'LinkedIn', category: 'Social', status: 'available', desc: 'LinkedIn Sales Navigator integration for prospecting.', color: '#0077B5' },
  { name: 'Google Workspace', category: 'Productivity', status: 'available', desc: 'Gmail, Calendar, and Drive integration.', color: '#4285F4' },
  { name: 'Slack', category: 'Communication', status: 'available', desc: 'Get deal alerts and team notifications in Slack.', color: '#4A154B' },
  { name: 'WhatsApp Business', category: 'Messaging', status: 'available', desc: 'Send outreach and campaigns via WhatsApp API.', color: '#25D366' },
  { name: 'Outlook', category: 'Email', status: 'available', desc: 'Microsoft 365 email and calendar sync.', color: '#0078D4' },
  { name: 'Mailchimp', category: 'Email Marketing', status: 'available', desc: 'Sync audiences and campaign data.', color: '#FFE01B' },
  { name: 'Meta Ads', category: 'Advertising', status: 'coming_soon', desc: 'Facebook and Instagram ad campaign management.', color: '#1877F2' },
  { name: 'Google Ads', category: 'Advertising', status: 'coming_soon', desc: 'Sync pipeline attribution with Google Ads.', color: '#4285F4' },
  { name: 'Apollo.io', category: 'Data', status: 'coming_soon', desc: 'Import prospect data from Apollo databases.', color: '#5D5DFF' },
  { name: 'Clearbit', category: 'Enrichment', status: 'coming_soon', desc: 'Enrich contacts and companies with Clearbit data.', color: '#00A4BD' },
  { name: 'Twilio', category: 'SMS', status: 'coming_soon', desc: 'SMS outreach via Twilio infrastructure.', color: '#F22F46' },
  { name: 'Zoom', category: 'Meetings', status: 'coming_soon', desc: 'Auto-log Zoom meetings and recordings.', color: '#2D8CFF' },
  { name: 'Stripe', category: 'Payments', status: 'coming_soon', desc: 'Revenue data and subscription insights.', color: '#6772E5' },
  { name: 'Zapier', category: 'Automation', status: 'coming_soon', desc: 'Connect RVNU to 5,000+ apps via Zapier.', color: '#FF4A00' },
];

const categoryColors = {
  CRM: 'bg-blue-500/10 text-blue-400',
  Social: 'bg-blue-600/10 text-blue-500',
  Productivity: 'bg-yellow-500/10 text-yellow-400',
  Communication: 'bg-violet-500/10 text-violet-400',
  Messaging: 'bg-primary/10 text-primary',
  Email: 'bg-cyan-500/10 text-cyan-400',
  'Email Marketing': 'bg-amber-500/10 text-amber-400',
  Advertising: 'bg-orange-500/10 text-orange-400',
  Data: 'bg-indigo-500/10 text-indigo-400',
  Enrichment: 'bg-teal-500/10 text-teal-400',
  SMS: 'bg-red-500/10 text-red-400',
  Meetings: 'bg-blue-500/10 text-blue-400',
  Payments: 'bg-violet-500/10 text-violet-400',
  Automation: 'bg-orange-500/10 text-orange-400',
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
            <h3 className="font-bold text-foreground mb-1">Unified Integration Hub</h3>
            <p className="text-sm text-muted-foreground">Connect your entire GTM stack. RVNU syncs bidirectionally with your CRM, email, messaging, and data tools — keeping everything in one place.</p>
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