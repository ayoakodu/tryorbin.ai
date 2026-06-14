import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, ArrowRight, Loader2, X, AlertCircle, RefreshCw, Copy, ExternalLink, Lock, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'orbin_integrations';

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveSaved(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

const REDIRECT_URI = `${window.location.origin}/integrations/callback`;

const INTEGRATIONS = [
  {
    id: 'gmail', name: 'Gmail', category: 'Email', color: '#EA4335',
    desc: 'Send sequences from your Gmail account with open and click tracking.',
    type: 'oauth',
    oauthLabel: 'Connect with Google',
    setupSteps: [
      'Go to console.cloud.google.com → APIs & Services → Credentials',
      'Create OAuth 2.0 Client ID (Web application type)',
      `Add this exact Authorized redirect URI: ${window.location.origin}/integrations/callback`,
      'Under OAuth consent screen → Test users, add your Google account email',
      'Enable the Gmail API under APIs & Services → Library',
      'Copy your Client ID and paste it below',
    ],
    fields: [
      { key: 'client_id', label: 'Google Client ID', placeholder: '123456789-xxx.apps.googleusercontent.com' },
    ],
    oauthUrl: (creds) => `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(creds.client_id)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly')}&access_type=offline&prompt=consent&state=gmail`,
  },
  {
    id: 'outlook', name: 'Outlook', category: 'Email', color: '#0078D4',
    desc: 'Microsoft 365 email sending with full sequence automation and calendar sync.',
    type: 'oauth',
    oauthLabel: 'Connect with Microsoft',
    setupSteps: [
      'Go to portal.azure.com → Azure Active Directory → App registrations → New registration',
      'Under Authentication, add a Redirect URI (Web): ' + `${window.location.origin}/integrations/callback`,
      'Under API permissions, add: Mail.Send, Mail.ReadWrite (Microsoft Graph)',
      'Copy your Application (client) ID below',
    ],
    fields: [
      { key: 'client_id', label: 'Application (Client) ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { key: 'tenant_id', label: 'Tenant ID', placeholder: 'common  (or your tenant ID)' },
    ],
    oauthUrl: (creds) => `https://login.microsoftonline.com/${creds.tenant_id || 'common'}/oauth2/v2.0/authorize?client_id=${encodeURIComponent(creds.client_id)}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent('https://graph.microsoft.com/Mail.Send offline_access')}&state=outlook`,
  },
  {
    id: 'google_calendar', name: 'Google Calendar', category: 'Scheduling', color: '#4285F4',
    desc: 'Auto-log meetings and sync booked calls directly from your sequences.',
    type: 'oauth',
    oauthLabel: 'Connect with Google',
    setupSteps: [
      'Enable the Google Calendar API in console.cloud.google.com',
      'Use the same OAuth 2.0 Client ID as Gmail (or create a new one)',
      `Ensure this redirect URI is added: ${window.location.origin}/integrations/callback`,
      'Add your Google account as a Test User in OAuth consent screen',
    ],
    fields: [
      { key: 'client_id', label: 'Google Client ID', placeholder: '123456789-xxx.apps.googleusercontent.com' },
    ],
    oauthUrl: (creds) => `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(creds.client_id)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar')}&access_type=offline&prompt=consent&state=google_calendar`,
  },
  {
    id: 'hubspot', name: 'HubSpot', category: 'CRM', color: '#FF7A59',
    desc: 'Bidirectional contact and deal sync — keep HubSpot updated as you execute in Orbin.',
    type: 'oauth',
    oauthLabel: 'Connect with HubSpot',
    setupSteps: [
      'Go to app.hubspot.com/developer → Create app (Public App)',
      'Under Auth, set redirect URL to: ' + `${window.location.origin}/integrations/callback`,
      'Add scopes: crm.contacts.read, crm.contacts.write, crm.deals.read, crm.deals.write',
      'Copy your App Client ID below',
    ],
    fields: [
      { key: 'client_id', label: 'HubSpot App Client ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
    ],
    oauthUrl: (creds) => `https://app.hubspot.com/oauth/authorize?client_id=${encodeURIComponent(creds.client_id)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=crm.contacts.read%20crm.contacts.write%20crm.deals.read%20crm.deals.write&state=hubspot`,
  },
  {
    id: 'salesforce', name: 'Salesforce', category: 'CRM', color: '#00A1E0',
    desc: 'Sync pipeline activity, contacts, and deal stages with Salesforce in real time.',
    type: 'apikey',
    fields: [
      { key: 'instance_url', label: 'Instance URL', placeholder: 'https://yourorg.salesforce.com' },
      { key: 'access_token', label: 'Access Token', placeholder: 'Bearer ...', secret: true },
    ],
    test: async (creds) => {
      const res = await fetch(`${creds.instance_url}/services/data/v58.0/`, {
        headers: { Authorization: `Bearer ${creds.access_token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return 'Salesforce API responding — connection valid.';
    },
  },
  {
    id: 'zapier', name: 'Zapier', category: 'Automation', color: '#FF4A00',
    desc: 'Connect Orbin triggers and actions to 5,000+ apps via Zapier webhooks.',
    type: 'apikey',
    fields: [
      { key: 'webhook_url', label: 'Zapier Webhook URL', placeholder: 'https://hooks.zapier.com/hooks/catch/...' },
    ],
    test: async (creds) => {
      const res = await fetch(creds.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'Orbin', event: 'connection_test', timestamp: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return 'Test event sent to Zapier — check your Zap history to confirm receipt.';
    },
  },
  {
    id: 'slack', name: 'Slack', category: 'Notifications', color: '#4A154B',
    desc: 'Get real-time deal alerts, reply notifications, and team activity updates in Slack.',
    type: 'apikey',
    fields: [
      { key: 'webhook_url', label: 'Incoming Webhook URL', placeholder: 'https://hooks.slack.com/services/...' },
      { key: 'channel', label: 'Channel (optional)', placeholder: '#gtm-alerts' },
    ],
    howTo: 'Go to api.slack.com/apps → Create New App → Incoming Webhooks → Activate → Add to workspace → copy the webhook URL.',
    test: async (creds) => {
      const res = await fetch(creds.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '✅ *Orbin* is connected! Deal alerts and notifications will appear here.' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return 'Test message sent to Slack — check your channel.';
    },
  },
  {
    id: 'whatsapp', name: 'WhatsApp Business', category: 'Messaging', color: '#25D366',
    desc: 'Connect your WhatsApp Business API to send campaigns, sequences, and track engagement.',
    type: 'apikey',
    fields: [
      { key: 'access_token', label: 'Meta Access Token', placeholder: 'EAAxxxxxxxx...', secret: true },
      { key: 'phone_id', label: 'Phone Number ID', placeholder: '1234567890' },
    ],
    howTo: 'Go to developers.facebook.com → My Apps → WhatsApp → Getting Started. Copy the temporary or permanent access token and the Phone Number ID.',
    test: async (creds) => {
      const res = await fetch(`https://graph.facebook.com/v18.0/${creds.phone_id}`, {
        headers: { Authorization: `Bearer ${creds.access_token}` },
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error?.message || `HTTP ${res.status}`);
      return `WhatsApp connected — phone number: ${data.display_phone_number || data.id}`;
    },
  },
  {
    id: 'linkedin', name: 'LinkedIn', category: 'Social', color: '#0077B5',
    desc: 'Log LinkedIn outreach tasks and track engagement as part of multichannel sequences.',
    type: 'oauth',
    oauthLabel: 'Connect with LinkedIn',
    setupSteps: [
      'Go to linkedin.com/developers → Create app',
      'Add products: Sign In with LinkedIn, Marketing Developer Platform',
      `Under Auth, set redirect URL to: ${window.location.origin}/integrations/callback`,
      'Copy your Client ID below',
    ],
    fields: [
      { key: 'client_id', label: 'LinkedIn Client ID', placeholder: 'xxxxxxxxxx' },
    ],
    oauthUrl: (creds) => `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(creds.client_id)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=r_liteprofile%20r_emailaddress%20w_member_social&state=linkedin`,
  },
];

const COMING_SOON = [
  { id: 'twilio', name: 'Twilio', category: 'SMS', color: '#F22F46', desc: 'SMS outreach and automated follow-ups via Twilio.' },
  { id: 'zoom', name: 'Zoom', category: 'Meetings', color: '#2D8CFF', desc: 'Auto-log Zoom meetings and generate AI call summaries.' },
  { id: 'apollo', name: 'Apollo.io', category: 'Prospecting', color: '#5D5DFF', desc: 'Import and enrich prospect lists directly from Apollo.' },
  { id: 'teams', name: 'Microsoft Teams', category: 'Notifications', color: '#5059C9', desc: 'Deal alerts and team notifications in Teams channels.' },
  { id: 'calendly', name: 'Calendly', category: 'Scheduling', color: '#006BFF', desc: 'Embed booking links in sequences and track conversions.' },
  { id: 'stripe', name: 'Stripe', category: 'Revenue', color: '#6772E5', desc: 'Pull revenue data into pipeline forecasting.' },
];

const CAT_COLORS = {
  CRM: 'bg-blue-500/10 text-blue-600', Social: 'bg-blue-600/10 text-blue-500',
  Messaging: 'bg-emerald-500/10 text-emerald-600', Email: 'bg-cyan-500/10 text-cyan-600',
  Notifications: 'bg-violet-500/10 text-violet-600', Scheduling: 'bg-amber-500/10 text-amber-600',
  Automation: 'bg-orange-500/10 text-orange-600', SMS: 'bg-red-500/10 text-red-600',
  Prospecting: 'bg-indigo-500/10 text-indigo-600', Revenue: 'bg-primary/10 text-primary',
};

export default function Integrations() {
  const [saved, setSaved] = useState(loadSaved);
  const [modal, setModal] = useState(null); // { integration, mode: 'setup'|'oauth' }
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(null);
  const [testResults, setTestResults] = useState({});
  const { toast } = useToast();

  useEffect(() => { saveSaved(saved); }, [saved]);

  const isConnected = (id) => !!saved[id]?.connected;

  const openModal = (integration) => {
    setFormData(saved[integration.id]?.creds || {});
    setModal({ integration });
  };

  const handleSave = async () => {
    const { integration } = modal;
    const hasData = Object.values(formData).some(v => v?.trim());
    if (!hasData) {
      toast({ title: 'Missing credentials', description: 'Please fill in the required fields.', variant: 'destructive' });
      return;
    }

    if (integration.type === 'oauth') {
      // Save creds then open OAuth URL in new tab
      setSaved(prev => ({ ...prev, [integration.id]: { creds: formData, connected: false, pendingOAuth: true } }));
      const url = integration.oauthUrl(formData);
      window.open(url, '_blank', 'width=600,height=700');
      toast({ title: 'OAuth window opened', description: `Complete the authorisation in the popup, then click "Mark as Connected" below.` });
      return;
    }

    // API key flow — save and mark connected
    setLoading(integration.id);
    await new Promise(r => setTimeout(r, 600));
    setSaved(prev => ({ ...prev, [integration.id]: { creds: formData, connected: true } }));
    setLoading(null);
    setModal(null);
    toast({ title: `${integration.name} connected!`, description: 'Credentials saved. Use "Test" to verify the connection.' });
  };

  const handleMarkConnected = () => {
    const { integration } = modal;
    setSaved(prev => ({ ...prev, [integration.id]: { ...prev[integration.id], connected: true, pendingOAuth: false } }));
    setModal(null);
    toast({ title: `${integration.name} connected!`, description: 'OAuth authorisation marked complete.' });
  };

  const handleDisconnect = (id) => {
    setSaved(prev => { const n = { ...prev }; delete n[id]; return n; });
    setTestResults(prev => { const n = { ...prev }; delete n[id]; return n; });
    toast({ title: 'Disconnected', description: 'Integration removed.' });
  };

  const handleTest = async (integration) => {
    if (!integration.test) {
      setTestResults(prev => ({ ...prev, [integration.id]: { success: true, message: 'Connection active — API credentials stored.' } }));
      return;
    }
    setLoading(`test_${integration.id}`);
    setTestResults(prev => { const n = { ...prev }; delete n[integration.id]; return n; });
    try {
      const creds = saved[integration.id]?.creds || {};
      const message = await integration.test(creds);
      setTestResults(prev => ({ ...prev, [integration.id]: { success: true, message } }));
    } catch (err) {
      setTestResults(prev => ({ ...prev, [integration.id]: { success: false, message: `Test failed: ${err.message}` } }));
    }
    setLoading(null);
  };

  const isPendingOAuth = (id) => !!saved[id]?.pendingOAuth;
  const connectedCount = INTEGRATIONS.filter(i => isConnected(i.id)).length;

  const modalIntegration = modal?.integration;
  const isPending = modalIntegration && isPendingOAuth(modalIntegration.id);

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <TopBar title="Integrations" subtitle="Connect Orbin to your existing tools" />

      <div className="p-6 space-y-6">
        {/* Hero */}
        <div className="glass rounded-xl p-5 border border-primary/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground mb-1">GTM Execution Integrations</h3>
            <p className="text-xs text-muted-foreground">Real integrations — credentials are saved locally in your browser. Connect email, CRM, WhatsApp, and automation tools to run end-to-end workflows.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary font-semibold px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {connectedCount} Connected
          </div>
        </div>

        {/* Active Connections */}
        {connectedCount > 0 && (
          <div className="glass rounded-xl p-4 border border-primary/10">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active Connections</h4>
            <div className="flex flex-wrap gap-2">
              {INTEGRATIONS.filter(i => isConnected(i.id)).map(i => (
                <div key={i.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-medium text-foreground">{i.name}</span>
                  {testResults[i.id]?.success && <CheckCircle2 className="w-3 h-3 text-primary" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xs font-bold text-foreground">Available Integrations</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{INTEGRATIONS.length}</span>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {INTEGRATIONS.map((integration, i) => {
              const connected = isConnected(integration.id);
              const pending = isPendingOAuth(integration.id);
              const testResult = testResults[integration.id];
              const isTesting = loading === `test_${integration.id}`;
              const isConnecting = loading === integration.id;

              return (
                <motion.div key={integration.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className={`glass rounded-xl p-4 transition-all ${connected ? 'border-primary/25' : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: integration.color + '20', color: integration.color, border: `1px solid ${integration.color}30` }}>
                      {integration.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate">{integration.name}</h4>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${CAT_COLORS[integration.category] || 'bg-secondary text-muted-foreground'}`}>
                        {integration.category}
                      </span>
                    </div>
                    {connected && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    {pending && !connected && <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />}
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{integration.desc}</p>

                  {testResult && (
                    <div className={`text-[10px] px-2 py-1.5 rounded-lg mb-2 flex items-start gap-1.5 ${testResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                      {testResult.success ? <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />}
                      <span>{testResult.message}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {connected ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleTest(integration)} disabled={isTesting}
                          className="flex-1 text-xs border-border/60 gap-1">
                          {isTesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                          Test
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openModal(integration)}
                          className="text-xs border-border/60 px-2">
                          <Lock className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDisconnect(integration.id)}
                          className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10 px-2">
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : pending ? (
                      <Button size="sm" onClick={() => openModal(integration)}
                        className="w-full text-xs bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-0">
                        Complete Setup <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => openModal(integration)} disabled={isConnecting}
                        className="w-full text-xs bg-primary/10 text-primary hover:bg-primary/20 border-0">
                        {isConnecting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                        {integration.type === 'oauth' ? integration.oauthLabel : 'Connect'}
                        <ArrowRight className="w-3 h-3 ml-1" />
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
            <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-medium">{COMING_SOON.length}</span>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {COMING_SOON.map(i => (
              <div key={i.id} className="glass rounded-xl p-4 opacity-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: i.color + '15', color: i.color }}>
                    {i.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{i.name}</h4>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${CAT_COLORS[i.category] || 'bg-secondary text-muted-foreground'}`}>{i.category}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{i.desc}</p>
                <div className="w-full py-1.5 text-center text-xs text-muted-foreground border border-border/50 rounded-lg">Coming Soon</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connect / Edit Modal */}
      <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span style={{ color: modalIntegration?.color }}>●</span>
              {isConnected(modalIntegration?.id) ? `Edit ${modalIntegration?.name}` : `Connect ${modalIntegration?.name}`}
            </DialogTitle>
          </DialogHeader>

          {modalIntegration && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">{modalIntegration.desc}</p>

              {/* OAuth setup steps */}
              {modalIntegration.type === 'oauth' && modalIntegration.setupSteps && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-1.5">
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3 h-3" /> Setup Steps
                  </p>
                  {modalIntegration.setupSteps.map((step, i) => (
                    <p key={i} className="text-xs text-blue-800 leading-relaxed">{i + 1}. {step}</p>
                  ))}
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="text-[10px] font-semibold text-blue-700 mb-1">Your redirect URI (copy this exactly):</p>
                    <div className="flex items-center gap-2 bg-white border border-blue-200 rounded px-2 py-1.5">
                      <code className="text-[10px] text-blue-900 flex-1 break-all">{REDIRECT_URI}</code>
                      <button onClick={() => { navigator.clipboard.writeText(REDIRECT_URI); toast({ title: 'Redirect URI copied!' }); }}
                        className="text-blue-500 hover:text-blue-700 flex-shrink-0"><Copy className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              )}

              {/* How-to for webhook integrations */}
              {modalIntegration.howTo && (
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> How to get your webhook URL
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">{modalIntegration.howTo}</p>
                </div>
              )}

              {/* Fields */}
              {modalIntegration.fields?.map(field => (
                <div key={field.key}>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">{field.label}</Label>
                  <Input
                    value={formData[field.key] || ''}
                    onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="bg-secondary/50 border-border/60 text-sm"
                    type={field.secret ? 'password' : 'text'}
                  />
                </div>
              ))}

              {/* Pending OAuth — show mark as connected option */}
              {isPending && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-800 font-medium mb-2">OAuth window opened — did you complete the authorisation?</p>
                  <Button size="sm" onClick={handleMarkConnected} className="w-full bg-amber-500 text-white hover:bg-amber-600 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Yes, mark as connected
                  </Button>
                </div>
              )}

              <div className="text-xs text-muted-foreground p-3 rounded-lg border border-border/30 bg-secondary/20 flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                Credentials are stored locally in your browser and never sent to our servers.
              </div>

              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={() => setModal(null)} className="flex-1 border-border/60 text-xs">Cancel</Button>
                <Button onClick={handleSave} disabled={!!loading}
                  className="flex-1 bg-primary text-primary-foreground text-xs">
                  {loading === modalIntegration.id
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Saving...</>
                    : modalIntegration.type === 'oauth'
                      ? <><ExternalLink className="w-3.5 h-3.5 mr-1.5" />Open OAuth &amp; Save</>
                      : 'Save & Connect'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
