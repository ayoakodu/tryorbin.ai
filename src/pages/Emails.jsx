import { useState } from 'react';
import { Mail, Inbox, Send, Star, Archive, Trash2, Search, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const FOLDERS = [
  { id: 'inbox',   label: 'Inbox',   icon: Inbox,   count: 12 },
  { id: 'sent',    label: 'Sent',    icon: Send,    count: 0  },
  { id: 'starred', label: 'Starred', icon: Star,    count: 3  },
  { id: 'archive', label: 'Archive', icon: Archive, count: 0  },
  { id: 'trash',   label: 'Trash',   icon: Trash2,  count: 0  },
];

const SAMPLE_EMAILS = [
  { id: 1, from: 'Chisom Okafor', email: 'chisom@flutterwave.com', subject: 'Re: Partnership Proposal', preview: 'Thanks for reaching out! I reviewed the proposal and I think there\'s a strong fit here...', time: '10:24 AM', read: false, starred: true,  folder: 'inbox' },
  { id: 2, from: 'Amara Nwosu',   email: 'amara@paystack.com',    subject: 'Quick question about your pricing', preview: 'Hi, I came across your platform and wanted to understand the enterprise tier better...', time: '9:05 AM',  read: false, starred: false, folder: 'inbox' },
  { id: 3, from: 'David Mensah',  email: 'david@mtn.com',         subject: 'Follow-up: Demo call',    preview: 'Just following up on our call last week. Did you get a chance to review the deck?', time: 'Yesterday', read: true,  starred: false, folder: 'inbox' },
  { id: 4, from: 'Sarah Obi',     email: 'sarah@zenith.ng',       subject: 'Intro call booked ✓',     preview: 'Great connecting! I\'ve added the calendar invite. Looking forward to our chat.', time: 'Yesterday', read: true,  starred: true,  folder: 'inbox' },
  { id: 5, from: 'Kemi Adeyemi',  email: 'kemi@access.bank',      subject: 'Proposal feedback',       preview: 'We\'ve reviewed the proposal internally and have a few clarifying questions...', time: 'Mon',       read: true,  starred: false, folder: 'inbox' },
];

export default function Emails() {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_EMAILS.filter(e =>
    e.folder === activeFolder &&
    (search === '' || e.from.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-full bg-background">

      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Button size="sm" className="w-full gap-2 bg-primary text-primary-foreground">
            <Plus className="w-4 h-4" /> Compose
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {FOLDERS.map(f => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => { setActiveFolder(f.id); setSelectedEmail(null); }}
                className={cn(
                  'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeFolder === f.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{f.label}</span>
                {f.count > 0 && (
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{f.count}</Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Email list */}
      <div className="w-80 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-3 border-b border-border flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search emails…"
              className="pl-8 h-8 text-sm"
            />
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 p-8">
              <Mail className="w-8 h-8 opacity-30" />
              <p className="text-sm">No emails here</p>
            </div>
          ) : filtered.map(email => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={cn(
                'w-full text-left px-4 py-3 transition-colors hover:bg-muted/50',
                selectedEmail?.id === email.id && 'bg-primary/5 border-l-2 border-primary',
                !email.read && 'bg-blue-50/30'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn('text-sm truncate', !email.read && 'font-semibold text-foreground', email.read && 'text-muted-foreground')}>
                  {email.from}
                </span>
                <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">{email.time}</span>
              </div>
              <p className={cn('text-xs truncate mb-0.5', !email.read ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                {email.subject}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{email.preview}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Email detail */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {selectedEmail ? (
          <>
            <div className="px-8 py-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-2">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{selectedEmail.from[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedEmail.from}</p>
                  <p className="text-xs text-muted-foreground">{selectedEmail.email}</p>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">{selectedEmail.time}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <p className="text-sm text-foreground leading-relaxed">{selectedEmail.preview}</p>
              <p className="text-sm text-foreground leading-relaxed mt-4">
                Looking forward to hearing back from you. Please don't hesitate to reach out if you have any questions.
              </p>
              <p className="text-sm text-foreground leading-relaxed mt-4">Best regards,<br />{selectedEmail.from}</p>
            </div>
            <div className="px-8 py-4 border-t border-border">
              <Button size="sm" className="gap-2">
                <Send className="w-3.5 h-3.5" /> Reply
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
            <Mail className="w-12 h-12 opacity-20" />
            <p className="text-sm">Select an email to read</p>
          </div>
        )}
      </div>
    </div>
  );
}