import { useState, useEffect } from 'react';
import { Mail, Inbox, Send, Star, Archive, Trash2, Search, Plus, RefreshCw, AlertCircle, X, ArrowLeft, Menu } from 'lucide-react';
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
  { id: 1, from: 'Chisom Okafor', email: 'chisom@flutterwave.com', subject: 'Re: Partnership Proposal', preview: "Thanks for reaching out! I reviewed the proposal and I think there's a strong fit here...", time: '10:24 AM', read: false, starred: true,  folder: 'inbox' },
  { id: 2, from: 'Amara Nwosu',   email: 'amara@paystack.com',    subject: 'Quick question about your pricing', preview: 'Hi, I came across your platform and wanted to understand the enterprise tier better...', time: '9:05 AM',  read: false, starred: false, folder: 'inbox' },
  { id: 3, from: 'David Mensah',  email: 'david@mtn.com',         subject: 'Follow-up: Demo call',    preview: "Just following up on our call last week. Did you get a chance to review the deck?", time: 'Yesterday', read: true,  starred: false, folder: 'inbox' },
  { id: 4, from: 'Sarah Obi',     email: 'sarah@zenith.ng',       subject: 'Intro call booked ✓',     preview: "Great connecting! I've added the calendar invite. Looking forward to our chat.", time: 'Yesterday', read: true,  starred: true,  folder: 'inbox' },
  { id: 5, from: 'Kemi Adeyemi',  email: 'kemi@access.bank',      subject: 'Proposal feedback',       preview: "We've reviewed the proposal internally and have a few clarifying questions...", time: 'Mon',       read: true,  starred: false, folder: 'inbox' },
];

const BLANK_COMPOSE = { to: '', subject: '', body: '' };

// Mobile panel states: 'folders' | 'list' | 'detail'
export default function Emails() {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [search, setSearch] = useState('');
  const [emails, setEmails] = useState(SAMPLE_EMAILS);
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState(BLANK_COMPOSE);
  const [mobilePanel, setMobilePanel] = useState('list'); // folders | list | detail

  useEffect(() => {
    const prefill = sessionStorage.getItem('compose_prefill');
    if (prefill) {
      try {
        const data = JSON.parse(prefill);
        setCompose(prev => ({ ...BLANK_COMPOSE, ...data }));
        setShowCompose(true);
        sessionStorage.removeItem('compose_prefill');
      } catch {}
    }
  }, []);

  const isShowingSampleData = true;

  const handleSend = () => {
    if (!compose.to.trim() || !compose.subject.trim()) return;
    const sent = { id: Date.now(), from: 'Me', email: compose.to, subject: compose.subject, preview: compose.body, time: 'Just now', read: true, starred: false, folder: 'sent' };
    setEmails(prev => [sent, ...prev]);
    setCompose(BLANK_COMPOSE);
    setShowCompose(false);
    setActiveFolder('sent');
  };

  const selectFolder = (id) => {
    setActiveFolder(id);
    setSelectedEmail(null);
    setMobilePanel('list');
  };

  const selectEmail = (email) => {
    setSelectedEmail(email);
    setMobilePanel('detail');
  };

  const filtered = emails.filter(e =>
    e.folder === activeFolder &&
    (search === '' || e.from.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase()))
  );

  const FolderSidebar = (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border">
        <Button size="sm" className="w-full gap-2 bg-primary text-primary-foreground" onClick={() => setShowCompose(true)}>
          <Plus className="w-4 h-4" /> Compose
        </Button>
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {FOLDERS.map(f => {
          const Icon = f.icon;
          return (
            <button key={f.id} onClick={() => selectFolder(f.id)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                activeFolder === f.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{f.label}</span>
              {f.count > 0 && <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{f.count}</Badge>}
            </button>
          );
        })}
      </nav>
    </div>
  );

  const EmailList = (
    <div className="flex flex-col h-full bg-card">
      <div className="p-3 border-b border-border flex items-center gap-2">
        {/* Mobile: back to folder list */}
        <button className="md:hidden text-muted-foreground hover:text-foreground flex-shrink-0" onClick={() => setMobilePanel('folders')}>
          <Menu className="w-4 h-4" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search emails…" className="pl-8 h-8 text-sm" />
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
          <button key={email.id} onClick={() => selectEmail(email)}
            className={cn(
              'w-full text-left px-4 py-3 transition-colors hover:bg-muted/50',
              selectedEmail?.id === email.id && 'bg-primary/5 border-l-2 border-primary',
              !email.read && 'bg-blue-50/30'
            )}>
            <div className="flex items-center justify-between mb-1">
              <span className={cn('text-sm truncate', !email.read ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
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
  );

  const EmailDetail = (
    <div className="flex flex-col h-full bg-background">
      {selectedEmail ? (
        <>
          <div className="px-4 md:px-8 py-4 md:py-5 border-b border-border flex items-start gap-3">
            {/* Mobile: back to list */}
            <button className="md:hidden text-muted-foreground hover:text-foreground flex-shrink-0 mt-1" onClick={() => setMobilePanel('list')}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-2 leading-snug">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{selectedEmail.from[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{selectedEmail.from}</p>
                  <p className="text-xs text-muted-foreground truncate">{selectedEmail.email}</p>
                </div>
                <span className="ml-auto text-xs text-muted-foreground flex-shrink-0">{selectedEmail.time}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">
            <p className="text-sm text-foreground leading-relaxed">{selectedEmail.preview}</p>
            <p className="text-sm text-foreground leading-relaxed mt-4">
              Looking forward to hearing back from you. Please don't hesitate to reach out if you have any questions.
            </p>
            <p className="text-sm text-foreground leading-relaxed mt-4">Best regards,<br />{selectedEmail.from}</p>
          </div>
          <div className="px-4 md:px-8 py-3 md:py-4 border-t border-border">
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
  );

  return (
    <div className="flex flex-col h-full bg-background">

      {/* Integration banner */}
      {isShowingSampleData && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-200 text-xs text-amber-700 flex-shrink-0">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Sample data shown — connect Gmail or Outlook in <a href="/integrations" className="font-semibold underline">Integrations</a> to see real emails.
        </div>
      )}

      {/* Desktop: three-column layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-52 flex-shrink-0 border-r border-border">{FolderSidebar}</div>
        <div className="w-80 flex-shrink-0 border-r border-border">{EmailList}</div>
        <div className="flex-1 overflow-hidden">{EmailDetail}</div>
      </div>

      {/* Mobile: single panel with navigation */}
      <div className="flex md:hidden flex-1 overflow-hidden">
        {mobilePanel === 'folders' && (
          <div className="w-full">{FolderSidebar}</div>
        )}
        {mobilePanel === 'list' && (
          <div className="w-full">{EmailList}</div>
        )}
        {mobilePanel === 'detail' && (
          <div className="w-full">{EmailDetail}</div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-end md:items-end md:justify-end p-0 md:p-6">
          {/* Mobile backdrop */}
          <div className="absolute inset-0 bg-black/40 md:hidden" onClick={() => setShowCompose(false)} />
          <div className="relative w-full md:w-[480px] bg-card border border-border rounded-t-2xl md:rounded-xl shadow-2xl flex flex-col"
            style={{ maxHeight: '90vh', height: '520px' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40 rounded-t-2xl md:rounded-t-xl">
              <p className="text-sm font-semibold text-foreground">New Message</p>
              <button onClick={() => setShowCompose(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col flex-1 p-4 gap-2 overflow-y-auto">
              <Input placeholder="To" value={compose.to} onChange={e => setCompose(p => ({ ...p, to: e.target.value }))} className="text-sm h-9" />
              <Input placeholder="Subject" value={compose.subject} onChange={e => setCompose(p => ({ ...p, subject: e.target.value }))} className="text-sm h-9" />
              <textarea
                placeholder="Write your message..."
                value={compose.body}
                onChange={e => setCompose(p => ({ ...p, body: e.target.value }))}
                className="flex-1 resize-none text-sm border border-input rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring min-h-[160px]"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
              <Button size="sm" className="gap-2 bg-primary text-primary-foreground" onClick={handleSend}>
                <Send className="w-3.5 h-3.5" /> Send
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setCompose(BLANK_COMPOSE); setShowCompose(false); }}>Discard</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
