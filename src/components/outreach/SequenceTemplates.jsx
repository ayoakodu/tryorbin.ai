import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Star, X, Search, Zap, Mail, MessageCircle, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const templates = [
  {
    id: 1, name: 'Fintech CTO Cold Outreach', channel: 'multi-channel', steps: 5, rating: 4.8,
    tags: ['fintech', 'cto', 'cold'],
    steps_data: [
      { type: 'email', day: 0, subject: 'Quick question about {{company}}\'s payment stack', body: 'Hi {{first_name}}, I noticed {{company}} recently expanded...' },
      { type: 'linkedin', day: 2, subject: 'LinkedIn connection request', body: 'Hi {{first_name}}, I work with fintech teams across Africa...' },
      { type: 'email', day: 5, subject: 'Case study: How Paystack 3x\'d meetings with Orbin AI', body: 'Hi {{first_name}}, wanted to share something relevant...' },
      { type: 'call', day: 8, subject: 'Discovery call attempt', body: 'Qualify budget, timeline, and decision process.' },
      { type: 'email', day: 12, subject: 'Last message from me', body: 'Hi {{first_name}}, I won\'t keep following up after this...' },
    ]
  },
  {
    id: 2, name: 'WhatsApp SMB Decision Maker', channel: 'whatsapp', steps: 3, rating: 4.6,
    tags: ['smb', 'whatsapp', 'nigeria'],
    steps_data: [
      { type: 'whatsapp', day: 0, subject: 'Warm intro message', body: 'Hi {{first_name}}! 👋 Quick question about {{company}}...' },
      { type: 'whatsapp', day: 3, subject: 'Value share', body: 'Hey {{first_name}}, thought you\'d find this useful...' },
      { type: 'whatsapp', day: 7, subject: 'Meeting request', body: 'Hi {{first_name}}, would love 15 mins to show you...' },
    ]
  },
  {
    id: 3, name: 'Inbound Lead Nurture', channel: 'email', steps: 4, rating: 4.9,
    tags: ['inbound', 'nurture'],
    steps_data: [
      { type: 'email', day: 0, subject: 'Welcome to Orbin AI — here\'s what to expect', body: 'Hi {{first_name}}, thanks for your interest...' },
      { type: 'email', day: 2, subject: 'How teams like {{company}} use Orbin AI', body: 'Hi {{first_name}}, I wanted to share...' },
      { type: 'email', day: 5, subject: 'Quick question', body: 'Hi {{first_name}}, just checking in...' },
      { type: 'call', day: 8, subject: 'Onboarding call', body: 'Check in on progress, answer questions.' },
    ]
  },
  {
    id: 4, name: 'SaaS VP Sales Outreach', channel: 'multi-channel', steps: 6, rating: 4.7,
    tags: ['saas', 'vp-sales', 'enterprise'],
    steps_data: [
      { type: 'email', day: 0, subject: 'Revenue team insight for {{company}}', body: 'Hi {{first_name}}, quick thought on {{company}}\'s outbound...' },
      { type: 'linkedin', day: 1, subject: 'LinkedIn note', body: 'Hi {{first_name}}, sent you an email — following up here...' },
      { type: 'email', day: 4, subject: 'Specifically for {{company}}\'s team', body: 'Hi {{first_name}}, built something relevant for you...' },
      { type: 'whatsapp', day: 7, subject: 'WhatsApp check-in', body: 'Hi {{first_name}}! Did my email land in the right place? 😊' },
      { type: 'call', day: 10, subject: 'Call attempt', body: 'Discovery + demo qualification' },
      { type: 'email', day: 14, subject: 'Circling back one more time', body: 'Hi {{first_name}}, this\'ll be my last touch...' },
    ]
  },
];

const channelIcon = { email: Mail, linkedin: Linkedin, whatsapp: MessageCircle, 'multi-channel': Zap };

export default function SequenceTemplates({ onUse, onClose }) {
  const [search, setSearch] = useState('');

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some(tag => tag.includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[85vh] overflow-hidden glass rounded-2xl border border-border/60 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <div>
            <h2 className="font-bold text-foreground">Sequence Templates</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Pre-built sequences ready to customize</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-border/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search templates..." className="pl-9 text-sm" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map(t => {
            const Icon = channelIcon[t.channel] || Mail;
            return (
              <div key={t.id} className="p-4 rounded-xl border border-border/30 bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{t.steps} steps</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <div className="flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] text-amber-400">{t.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => onUse(t)}
                    className="text-xs h-7 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                    <Copy className="w-3 h-3" /> Use Template
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {t.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}