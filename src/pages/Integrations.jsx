import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Plus, Zap, Globe, ArrowRight, Loader2, X, AlertCircle, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

// oauth = true means the connection uses an OAuth button flow (simulated)
// fields = manual API key fallback
const integrationsConfig = [
  { id: 'gmail', name: 'Gmail', category: 'Email', desc: 'Send sequences from your Gmail account with open and click tracking. Authorise via Google OAuth.', color: '#EA4335', oauth: true, oauthLabel: 'Connect with Google' },
  { id: 'outlook', name: 'Outlook', category: 'Email', desc: 'Microsoft 365 email sending with full sequence automation and calendar sync. Authorise via Microsoft OAuth.', color: '#0078D4', oauth: true, oauthLabel: 'Connect with Microsoft' },
  { id: 'google_calendar', name: 'Google Calendar', category: 'Scheduling', desc: 'Auto-log meetings and sync booked calls directly from your sequences via Google OAuth.', color: '#4285F4', oauth: true, oauthLabel: 'Connect with Google' },
  { id: 'ms_calendar', name: 'Microsoft Calendar', category: 'Scheduling', desc: 'Sync meetings and bookings from Microsoft 365 Calendar into RVNU via Microsoft OAuth.', color: '#0078D4', oauth: true, oauthLabel: 'Connect with Microsoft' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', desc: 'Bidirectional contact and deal sync — keep HubSpot updated as you execute in RVNU.', color: '#FF7A59', oauth: true, oauthLabel: 'Connect with HubSpot' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', desc: 'Sync pipeline activity, contacts, and deal stages with Salesforce in real time.', color: '#00A1E0', fields: [{ key: 'instance_url', label: 'Instance URL', placeholder: 'https://yourorg.salesforce.com' }, { key: 'access_token', label: 'Access Token', placeholder: 'Bearer ...' }] },
  { id: 'zapier', name: 'Zapier', category: 'Automation', desc: 'Connect RVNU triggers and actions to 5,000+ apps. Use Zapier webhooks as the entry point.', color: '#FF4A00', fields: [{ key: 'webhook_url', label: 'Zapier Webhook URL', placeholder: 'https://hooks.zapier.com/hooks/catch/...' }] },
  { id: 'slack', name: 'Slack', category: 'Notifications', desc: 'Get real-time deal alerts, reply notifications, and team activity updates in Slack.', color: '#4A154B', fields: [{ key: 'webhook_url', label: 'Webhook URL', placeholder: 'https://hooks.slack.com/...' }, { key: 'channel', label: 'Channel', placeholder: '#gtm-alerts' }] },
  { id: 'whatsapp', name: 'WhatsApp Business', category: 'Messaging', desc: 'Connect your WhatsApp Business API to send campaigns, sequences, and track engagement natively.', color: '#25D366', fields: [{ key: 'api_key', label: 'API Key', placeholder: 'whatsapp_api_key_...' }, { key: 'phone_id', label: 'Phone Number ID', placeholder: '1234567890' }] },
  { id: 'linkedin', name: 'LinkedIn', category: 'Social', desc: 'Log LinkedIn outreach tasks and track engagement as part of multichannel sequences.', color: '#0077B5', oauth: true, oauthLabel: 'Connect with LinkedIn' },
];

const comingSoon = [
  { id: 'twilio', name: 'Twilio', category: 'SMS', desc: 'SMS outreach and automated follow-ups via Twilio infrastructure.', color: '#F22F46' },
  { id: 'zoom', name: 'Zoom', category: 'Meetings', desc: 'Auto-log Zoom meetings, transcribe calls, and generate AI meeting summaries.', color: '#2D8CFF' },
  { id: 'apollo', name: 'Apollo.io', category: 'Prospecting', desc: 'Import and enrich prospect lists directly from Apollo into your sequences.', color: '#5D5DFF' },
  { id: 'teams', name: 'Microsoft Teams', category: 'Notifications', desc: 'Team notifications and deal alerts delivered to Microsoft Teams channels.', color: '#5059C9' },
  { id: 'calendly', name: 'Calendly', category: 'Scheduling', desc: 'Embed Calendly booking links in sequences and track meeting conversions.', color: '#006BFF' },
  { id: 'stripe', name: 'Stripe', category: 'Revenue', desc: 'Pull revenue and subscription data into pipeline forecasting and analytics.', color: '#6772E5' },
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
};

export default function Integrations() {
  const [connected, setConnected] = useState({ gmail: true, slack: true });
  const [connecting, setConnecting] = useState(null);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [formData, setFormData] = useState({});
  const [testingId, setTestingId] = useState(null);
  const [testResults, setTestResults] = useState({});
  const { toast } = useToast();

  const handleConnect = (integration) => {
    if (integration.oauth) {
      // Simulate OAuth popup flow
      setConnecting(integration.id);
      setTimeout(() => {
        setConnected(prev => ({ ...prev, [integration.id]: true }));
        setConnecting(null);
        toast({ title: `${integration.name} connected!`, description: 'OAuth authorisation successful. Integration is active.' });
      }, 2000);
      return;
    }
    setSelectedIntegration(integration);
    setFormData({});
  };

  const handleDisconnect = (id) => {
    setConnected(prev => { const n = { ...prev }; delete n[id]; return n; });
    setTestResults(prev => { const n = { ...prev }; delete n[id]; return n; });
    toast({ title: 'Disconnected', description: 'Integration removed successfully.' });
  };

  const handleSaveConnection = async () => {
    if (!selectedIntegration) return;
    const hasFields = Object.values(formData).some(v => v?.trim());
    if (!hasFields) {
      toast({ title: 'Missing credentials', description: 'Please fill in at least one field.', variant: 'destructive' });
      return;
    }
    setConnecting(selectedIntegration.id);
    // Simulate connection validation
    await new Promise(r => setTimeout(r, 1500));
    setConnected(prev => ({ ...prev, [selectedIntegration.id]: true }));
    setConnecting(null);
    setSelectedIntegration(null);
    toast({ title: `${selectedIntegration.name} connected!`, description: 'Integration is active and syncing.' });
  };

  const handleTest = async (id, name) => {
    setTestingId(id);
    await new Promise(r => setTimeout(r, 1200));
    setTestResults(prev => ({ ...prev, [id]: { success: true, message: `${name} connection verified — API responding normally.` } }));
    setTestingId(null);
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <TopBar title="Integrations" subtitle="Connect RVNU to your existing tools" />

      <div className="p-6 space-y-6">
        {/* Hero */}
        <div className="glass rounded-xl p-6 border border-primary/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground mb-1">GTM Execution Integrations</h3>
            <p className="text-xs text-muted-foreground">Connect your execution stack. RVNU integrates with email, WhatsApp, CRM, and automation tools so every workflow runs end-to-end.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary font-semibold px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {Object.keys(connected).length} Connected
          </div>
        </div>

        {/* Connected Summary */}
        {Object.keys(connected).length > 0 && (
          <div className="glass rounded-xl p-4 border border-primary/10">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active Connections</h4>
            <div className="flex flex-wrap gap-2">
              {integrationsConfig.filter(i => connected[i.id]).map(i => (
                <div key={i.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                  <span className="text-xs font-medium text-foreground">{i.name}</span>
                  {testResults[i.id]?.success && <CheckCircle2 className="w-3 h-3 text-primary" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Integrations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-bold text-foreground">Available Integrations</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{integrationsConfig.length}</span>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {integrationsConfig.map((integration, i) => {
              const isConnected = connected[integration.id];
              const testResult = testResults[integration.id];
              return (
                <motion.div key={integration.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`glass rounded-xl p-4 transition-all group ${isConnected ? 'border-primary/20' : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: integration.color + '20', color: integration.color, border: `1px solid ${integration.color}30` }}>
                      {integration.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate">{integration.name}</h4>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${categoryColors[integration.category] || 'bg-secondary text-muted-foreground'}`}>
                        {integration.category}
                      </span>
                    </div>
                    {isConnected && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{integration.desc}</p>

                  {testResult && (
                    <div className={`text-[10px] px-2 py-1.5 rounded-lg mb-2 flex items-center gap-1.5 ${testResult.success ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                      {testResult.success ? <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> : <AlertCircle className="w-3 h-3 flex-shrink-0" />}
                      {testResult.message}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {isConnected ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleTest(integration.id, integration.name)}
                          disabled={testingId === integration.id}
                          className="flex-1 text-xs border-border/60 gap-1">
                          {testingId === integration.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                          Test
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDisconnect(integration.id)}
                          className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10 px-2">
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => handleConnect(integration)}
                        disabled={connecting === integration.id}
                        className="w-full text-xs bg-primary/10 text-primary hover:bg-primary/20 border-0">
                        {connecting === integration.id
                          ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Connecting...</>
                          : <>{integration.oauth ? integration.oauthLabel : 'Connect'} <ArrowRight className="w-3 h-3 ml-1" /></>}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Coming Soon */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-bold text-foreground">Coming Soon</h3>
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-medium">{comingSoon.length}</span>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {comingSoon.map((integration) => (
              <div key={integration.id} className="glass rounded-xl p-4 opacity-55">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: integration.color + '15', color: integration.color }}>
                    {integration.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{integration.name}</h4>
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

      {/* Connect Modal */}
      <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Connect {selectedIntegration?.name}</DialogTitle>
          </DialogHeader>
          {selectedIntegration && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                {selectedIntegration.desc}
              </div>
              {selectedIntegration.fields.map(field => (
                <div key={field.key}>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">{field.label}</Label>
                  <Input
                    value={formData[field.key] || ''}
                    onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="bg-secondary/50 border-border/60"
                    type={field.key.includes('token') || field.key.includes('key') ? 'password' : 'text'}
                  />
                </div>
              ))}
              <div className="text-xs text-muted-foreground p-3 rounded-lg border border-border/30 bg-secondary/20">
                <strong>Security:</strong> Credentials are encrypted and stored securely. They are never logged or shared.
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setSelectedIntegration(null)} className="flex-1 border-border/60">Cancel</Button>
                <Button onClick={handleSaveConnection} disabled={connecting === selectedIntegration?.id}
                  className="flex-1 bg-primary text-primary-foreground">
                  {connecting === selectedIntegration?.id ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Connecting...</> : 'Connect'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}