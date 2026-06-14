import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Mail, Globe, Shield, Palette, Users, Plug, ChevronRight, Check, Plus, Server, Brain } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BrowserCompanionSettings from '@/components/settings/BrowserCompanionSettings';
import MailboxConnectionCard from '@/components/email/MailboxConnectionCard';
import ConnectMailboxModal from '@/components/email/ConnectMailboxModal';
import SMTPConfigPanel from '@/components/email/SMTPConfigPanel';
import DashboardAIPreferences from '@/components/settings/DashboardAIPreferences';
import { AnimatePresence } from 'framer-motion';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'workspace', label: 'Workspace', icon: Globe },
  { id: 'dashboard_ai', label: 'Dashboard & AI', icon: Brain },
  { id: 'email', label: 'Email Connection', icon: Mail },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'team', label: 'Team & Access', icon: Users },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'smtp', label: 'SMTP & Sending', icon: Server },
  { id: 'linkedin', label: 'Browser Companion', icon: Linkedin },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)} className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${value ? 'bg-emerald-500' : 'bg-slate-200'}`}>
    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const Section = ({ title, children }) => (
  <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
    <h3 className="text-sm font-bold text-slate-800 mb-5">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, hint, children }) => (
  <div className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0">
    <div className="flex-1 mr-6">
      <p className="text-xs font-medium text-slate-700">{label}</p>
      {hint && <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

export default function Settings() {
  const [active, setActive] = useState('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({ name: 'John Doe', email: 'john@orbin-ai.io', title: 'Head of Sales', phone: '+234 810 000 0000' });
  const [workspace, setWorkspace] = useState({ name: 'Orbin AI Workspace', timezone: 'Africa/Lagos', language: 'English' });
  const [notifs, setNotifs] = useState({ emailDigest: true, taskReminders: true, dealAlerts: true, teamActivity: false, aiInsights: true, campaignReports: true });
  const [appearance, setAppearance] = useState({ theme: 'light', density: 'comfortable' });
  const [emailConnected] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [mailboxes, setMailboxes] = useState([
    { email: 'john@orbin-ai.io',      provider: 'gmail',   label: 'Primary',   state: 'connected',   lastSync: '2 min ago', stats: { Sent: 54, Received: 12, Tracked: 41 } },
    { email: 'outreach@orbin-ai.io',  provider: 'gmail',   label: 'Outreach',  state: 'connected',   lastSync: '5 min ago', stats: { Sent: 180, Received: 3, Tracked: 154 } },
    { email: 'sales@orbin-ai.io',     provider: 'outlook', label: 'Sales',     state: 'expired',     lastSync: '2d ago',    stats: null, errorMessage: 'Session token expired — reconnect to resume sync' },
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', color: '#0f172a' }}>
      <TopBar title="Settings" subtitle="Manage your workspace, profile, and preferences" />
      <div className="p-6 flex gap-6">

        {/* Left Nav */}
        <div className="w-48 flex-shrink-0">
          <div className="rounded-xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors border-b border-slate-50 last:border-0 ${active === s.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <s.icon className={`w-3.5 h-3.5 ${active === s.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                {s.label}
                {active === s.id && <ChevronRight className="w-3 h-3 ml-auto text-emerald-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-3xl space-y-5">

          {active === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Section title="Profile Details">
                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">JD</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{profile.name}</p>
                    <p className="text-xs text-slate-500">{profile.email}</p>
                    <button className="text-xs text-emerald-600 mt-1 hover:underline">Change photo</button>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    ['Full Name', 'name', 'text'],
                    ['Email Address', 'email', 'email'],
                    ['Job Title', 'title', 'text'],
                    ['Phone', 'phone', 'tel'],
                  ].map(([label, key, type]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
                      <Input type={type} className="h-9 text-sm" value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              </Section>
            </motion.div>
          )}

          {active === 'dashboard_ai' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <DashboardAIPreferences onSave={handleSave} saved={saved} />
            </motion.div>
          )}

          {active === 'workspace' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Section title="Workspace Settings">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Workspace Name</label>
                    <Input className="h-9 text-sm" value={workspace.name} onChange={e => setWorkspace(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Timezone</label>
                    <select className="w-full h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700"
                      value={workspace.timezone} onChange={e => setWorkspace(p => ({ ...p, timezone: e.target.value }))}>
                      {['Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg', 'Africa/Cairo', 'Africa/Accra', 'UTC'].map(tz => (
                        <option key={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Language</label>
                    <select className="w-full h-9 px-3 rounded-md text-sm border border-slate-200 bg-white text-slate-700"
                      value={workspace.language} onChange={e => setWorkspace(p => ({ ...p, language: e.target.value }))}>
                      {['English', 'French', 'Arabic', 'Swahili', 'Portuguese'].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </Section>
            </motion.div>
          )}

          {active === 'email' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <Section title="Connected Mailboxes">
                <div className="space-y-3 mb-4">
                  {mailboxes.map((mb) => (
                    <MailboxConnectionCard
                      key={mb.email}
                      mailbox={mb}
                      onReconnect={() => setMailboxes(prev => prev.map(m => m.email === mb.email ? { ...m, state: 'reconnecting' } : m))}
                      onDisconnect={() => setMailboxes(prev => prev.map(m => m.email === mb.email ? { ...m, state: 'disconnected', stats: null } : m))}
                      onConnect={() => setShowConnectModal(true)}
                    />
                  ))}
                </div>
                <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => setShowConnectModal(true)}>
                  <Plus className="w-3.5 h-3.5" /> Add Mailbox
                </Button>
              </Section>

              <Section title="Sync Settings">
                <Field label="Sync Sent Emails" hint="Automatically log sent emails to contact timelines">
                  <Toggle value={true} onChange={() => {}} />
                </Field>
                <Field label="Email Tracking" hint="Track open and click rates on sent emails">
                  <Toggle value={true} onChange={() => {}} />
                </Field>
                <Field label="Signature" hint="Add your email signature to outgoing messages">
                  <Toggle value={false} onChange={() => {}} />
                </Field>
              </Section>

              <AnimatePresence>
                {showConnectModal && <ConnectMailboxModal onClose={() => setShowConnectModal(false)} onConnect={(provider) => {
                  setShowConnectModal(false);
                }} />}
              </AnimatePresence>
            </motion.div>
          )}

          {active === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Section title="Notification Preferences">
                {[
                  ['emailDigest', 'Daily Email Digest', 'Receive a daily summary of your pipeline and activity'],
                  ['taskReminders', 'Task Reminders', 'Get reminded about upcoming and overdue tasks'],
                  ['dealAlerts', 'Deal Alerts', 'Alerts when deals are updated or at risk'],
                  ['teamActivity', 'Team Activity', 'Notifications for team actions in shared workspaces'],
                  ['aiInsights', 'AI Insights', 'Receive AI-generated suggestions and recommendations'],
                  ['campaignReports', 'Campaign Reports', 'Weekly performance reports for active campaigns'],
                ].map(([key, label, hint]) => (
                  <Field key={key} label={label} hint={hint}>
                    <Toggle value={notifs[key]} onChange={v => setNotifs(p => ({ ...p, [key]: v }))} />
                  </Field>
                ))}
              </Section>
            </motion.div>
          )}

          {active === 'team' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Section title="Team & Access">
                <div className="space-y-3 mb-5">
                  {[
                    { name: 'John Doe', email: 'john@orbin-ai.io', role: 'Admin', avatar: 'JD', status: 'active' },
                    { name: 'Sara Boateng', email: 'sara@orbin-ai.io', role: 'Member', avatar: 'SB', status: 'active' },
                    { name: 'Ama Mensah', email: 'ama@orbin-ai.io', role: 'Member', avatar: 'AM', status: 'invite_pending' },
                  ].map(m => (
                    <div key={m.email} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[10px] font-bold">{m.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800">{m.name}</p>
                        <p className="text-[11px] text-slate-400">{m.email}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${m.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                        {m.status === 'active' ? m.role : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Invite Team Member
                </Button>
              </Section>
            </motion.div>
          )}

          {active === 'integrations' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <Section title="Connected Integrations">
                <div className="space-y-3">
                  {[
                    { name: 'Google Workspace', desc: 'Email, Calendar, Drive', connected: true },
                    { name: 'LinkedIn Sales Navigator', desc: 'Prospect outreach', connected: false },
                    { name: 'HubSpot CRM', desc: 'Two-way contact sync', connected: false },
                    { name: 'Slack', desc: 'Team notifications', connected: true },
                    { name: 'WhatsApp Business API', desc: 'Messaging channel', connected: false },
                  ].map(int => (
                    <div key={int.name} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        <Plug className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800">{int.name}</p>
                        <p className="text-[11px] text-slate-400">{int.desc}</p>
                      </div>
                      {int.connected ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Connected</span>
                      ) : (
                        <Button size="sm" variant="outline" className="text-xs h-7">Connect</Button>
                      )}
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Browser Companion">
                <BrowserCompanionSettings />
              </Section>
            </motion.div>
          )}

          {active === 'smtp' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Section title="SMTP & Sending Configuration">
                <SMTPConfigPanel />
              </Section>
            </motion.div>
          )}

          {active === 'linkedin' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Section title="Browser Companion">
                <BrowserCompanionSettings />
              </Section>
            </motion.div>
          )}

          {active === 'security' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Section title="Security & Access">
                <Field label="Two-Factor Authentication" hint="Require 2FA on login for your account">
                  <Toggle value={false} onChange={() => {}} />
                </Field>
                <Field label="Session Timeout" hint="Automatically log out after 30 minutes of inactivity">
                  <Toggle value={true} onChange={() => {}} />
                </Field>
                <div className="mt-4">
                  <Button size="sm" variant="outline" className="text-xs">Change Password</Button>
                </div>
              </Section>
            </motion.div>
          )}

          {active === 'appearance' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Section title="Appearance">
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-600 mb-2">Theme</p>
                  <div className="flex gap-3">
                    {['light', 'dark', 'system'].map(t => (
                      <button key={t} onClick={() => setAppearance(p => ({ ...p, theme: t }))}
                        className={`flex-1 py-2.5 rounded-lg border text-xs font-medium capitalize transition-all ${appearance.theme === t ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-2">Density</p>
                  <div className="flex gap-3">
                    {['compact', 'comfortable', 'spacious'].map(d => (
                      <button key={d} onClick={() => setAppearance(p => ({ ...p, density: d }))}
                        className={`flex-1 py-2.5 rounded-lg border text-xs font-medium capitalize transition-all ${appearance.density === d ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </Section>
            </motion.div>
          )}

          {/* Save Button */}
          {['profile', 'workspace', 'notifications', 'appearance'].includes(active) && (
            <div className="flex items-center gap-3">
              <Button size="sm" className="bg-primary text-white text-xs" onClick={handleSave}>
                {saved ? <><Check className="w-3.5 h-3.5 mr-1" /> Saved!</> : 'Save Changes'}
              </Button>
              <p className="text-xs text-slate-400">Changes are saved to your workspace.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}