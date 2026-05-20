import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Search, Inbox, Send, Star, Archive, Flag, Circle, CheckCircle, Paperclip, RefreshCw, Sparkles } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EMAILS = [
  { id: 1, folder: 'inbox', from: 'Amara Diallo', company: 'Flutterwave', subject: 'Re: Q3 Partnership Opportunity', preview: 'Hi, thanks for reaching out. I reviewed the proposal and I think there\'s a great fit here...', time: '9:42 AM', read: false, starred: true, hasAttachment: false },
  { id: 2, folder: 'inbox', from: 'Kemi Adeyemi', company: 'Yoco', subject: 'Meeting confirmed for tomorrow', preview: 'Just confirming our call at 10am. Looking forward to discussing the integration roadmap...', time: '8:15 AM', read: true, starred: false, hasAttachment: false },
  { id: 3, folder: 'inbox', from: 'Tunde Okafor', company: 'Paystack', subject: 'Follow-up: Enterprise Plan inquiry', preview: 'Following up on our conversation last week. We\'ve had a chance to review internally and...', time: 'Yesterday', read: false, starred: false, hasAttachment: true },
  { id: 4, folder: 'inbox', from: 'Nadia Hassan', company: 'Cellulant', subject: 'Intro from Ahmed', preview: 'Ahmed suggested I reach out — we\'re looking for a GTM platform for our East Africa expansion...', time: 'Yesterday', read: true, starred: false, hasAttachment: false },
  { id: 5, folder: 'inbox', from: 'Chioma Eze', company: 'OPay', subject: 'Product demo request', preview: 'We\'d love to see a live demo of RVNU for our sales team. Could we schedule something next week?', time: 'Mon', read: true, starred: true, hasAttachment: false },
  { id: 6, folder: 'sent', from: 'You → Amara Diallo', company: 'Flutterwave', subject: 'Q3 Partnership Opportunity', preview: 'Hi Amara, I wanted to reach out about a potential partnership opportunity in Q3...', time: '2d ago', read: true, starred: false, hasAttachment: false },
  { id: 7, folder: 'sent', from: 'You → Kemi Adeyemi', company: 'Yoco', subject: 'Meeting request: RVNU platform walk-through', preview: 'Hi Kemi, hope this finds you well. I\'d love to walk you through how we\'re helping GTM teams...', time: '3d ago', read: true, starred: false, hasAttachment: false },
];

export default function Emails() {
  const [tab, setTab] = useState('inbox');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(EMAILS[0]);

  const visible = EMAILS.filter(e => e.folder === tab && (
    e.from.toLowerCase().includes(search.toLowerCase()) ||
    e.subject.toLowerCase().includes(search.toLowerCase())
  ));

  const unread = EMAILS.filter(e => e.folder === 'inbox' && !e.read).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8fafc', color: '#0f172a' }}>
      <TopBar title="Emails" subtitle="Synced inbox and outreach messages" />
      <div className="flex flex-1 overflow-hidden mx-6 mb-6 mt-5 rounded-xl" style={{ border: '1px solid #e2e8f0', background: '#ffffff', height: 'calc(100vh - 120px)' }}>
        
        {/* Left panel */}
        <div className="w-72 flex flex-col border-r border-slate-100 flex-shrink-0">
          {/* Connected account */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-600 font-medium">john@rvnu.io</span>
            <button className="ml-auto text-slate-400 hover:text-slate-600"><RefreshCw className="w-3.5 h-3.5" /></button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {[['inbox', 'Inbox', unread], ['sent', 'Sent', 0]].map(([id, label, badge]) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${tab === id ? 'text-emerald-700 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}>
                {label}
                {badge > 0 && <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <Input placeholder="Search emails..." className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Email list */}
          <div className="flex-1 overflow-y-auto">
            {visible.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                <Mail className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-xs">No emails found</p>
              </div>
            )}
            {visible.map(email => (
              <button key={email.id} onClick={() => setSelected(email)}
                className={`w-full text-left px-4 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors ${selected?.id === email.id ? 'bg-emerald-50 border-l-2 border-l-emerald-500' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {!email.read && <Circle className="w-2 h-2 text-emerald-500 fill-emerald-500 flex-shrink-0" />}
                    <span className={`text-xs truncate ${!email.read ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>{email.from}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{email.time}</span>
                </div>
                <p className={`text-[11px] truncate mb-0.5 ${!email.read ? 'font-medium text-slate-700' : 'text-slate-600'}`}>{email.subject}</p>
                <p className="text-[10px] text-slate-400 truncate">{email.preview}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">{email.company}</span>
                  {email.hasAttachment && <Paperclip className="w-2.5 h-2.5 text-slate-400" />}
                  {email.starred && <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Email preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="flex items-center gap-3 px-6 py-3.5 border-b border-slate-100">
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-slate-800">{selected.subject}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{selected.from} · {selected.company} · {selected.time}</p>
                </div>
                <div className="flex gap-1">
                  {[
                    [Star, 'text-amber-400'],
                    [Archive, 'text-slate-400'],
                    [Flag, 'text-red-400'],
                  ].map(([Icon, color], i) => (
                    <button key={i} className={`p-2 hover:bg-slate-100 rounded-lg ${color}`}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-700">{selected.from.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{selected.from}</p>
                    <p className="text-xs text-slate-500">{selected.company}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{selected.preview}</p>
                <p className="text-sm text-slate-600 leading-relaxed mt-4">
                  Looking forward to continuing the conversation. Please let me know a time that works for a follow-up call.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <Button size="sm" className="bg-primary text-white text-xs">Reply</Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> AI Draft Reply
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">Forward</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Mail className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Select an email to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}