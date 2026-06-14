import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  MessageCircle, Send, Sparkles, Search, Plus,
  Phone, MoreHorizontal, Check, CheckCheck, Loader2,
  Smile, Paperclip, Mic, Users, TrendingUp, Reply,
  Clock, Archive, Star, Filter, UserCheck
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import VoiceNotePlayer from '@/components/whatsapp/VoiceNotePlayer';
import SharedInboxHeader from '@/components/whatsapp/SharedInboxHeader';

const conversationsData = [
{
  id: 1, name: 'Amara Diallo', company: 'Flutterwave', phone: '+234 801 234 5678',
    avatar: 'AD', status: 'online', unread: 2,
    lastMessage: 'Thanks for the demo, very impressive!', lastTime: '2m ago',
    tag: 'hot',
    messages: [
      { id: 1, role: 'sent', content: 'Hi Amara! 👋 Wanted to follow up on our earlier conversation about Orbin AI.', time: '10:30', status: 'read' },
      { id: 2, role: 'received', content: 'Hey! Yes, I\'ve been thinking about it. The AI features look really promising for our outbound team.', time: '10:45', status: 'read' },
      { id: 3, role: 'sent', content: 'Glad to hear it! Would love to show you how the sequencing engine works — it\'s designed exactly for teams like yours.', time: '10:47', status: 'read' },
      { id: 4, role: 'received', content: 'Thanks for the demo, very impressive!', time: '11:02', status: 'unread' },
    ]
  },
  {
    id: 2, name: 'Tunde Okafor', company: 'Paystack', phone: '+234 802 345 6789',
    avatar: 'TO', status: 'offline', unread: 0,
    lastMessage: 'Can we schedule a call next week?', lastTime: '1h ago',
    tag: 'warm',
    messages: [
      { id: 1, role: 'sent', content: 'Hi Tunde, hope all is well at Paystack! I wanted to reach out about something that could help your GTM team.', time: 'Yesterday', status: 'read' },
      { id: 2, role: 'received', content: 'Hi! Yes, always open to hear more. What\'s it about?', time: 'Yesterday', status: 'read' },
      { id: 3, role: 'sent', content: 'We\'re building an AI-native platform for outbound teams. Given your scale at Paystack, thought it might be relevant.', time: 'Yesterday', status: 'read' },
      { id: 4, role: 'received', content: 'Can we schedule a call next week?', time: '1h ago', status: 'read' },
    ]
  },
  {
    id: 3, name: 'Chioma Eze', company: 'Andela', phone: '+234 803 456 7890',
    avatar: 'CE', status: 'online', unread: 1,
    lastMessage: 'Sounds interesting, tell me more', lastTime: '3h ago',
    tag: 'warm',
    messages: [
      { id: 1, role: 'sent', content: 'Hi Chioma! 🚀 I help sales teams at companies like Andela automate their outbound with AI. Would love 5 mins of your time.', time: '3h ago', status: 'read' },
      { id: 2, role: 'received', content: 'Sounds interesting, tell me more', time: '3h ago', status: 'unread' },
    ]
  },
  {
    id: 4, name: 'Kefilwe Modise', company: 'Yoco', phone: '+27 71 234 5678',
    avatar: 'KM', status: 'offline', unread: 0,
    lastMessage: 'I\'ll review the proposal and get back to you', lastTime: 'Yesterday',
    tag: 'cold',
    messages: [
      { id: 1, role: 'sent', content: 'Hi Kefilwe! Following up on the proposal I sent over. Happy to answer any questions.', time: 'Yesterday', status: 'read' },
      { id: 2, role: 'received', content: 'I\'ll review the proposal and get back to you', time: 'Yesterday', status: 'read' },
    ]
  },
];

const tagColors = {
  hot: 'bg-red-50 text-red-700 border-red-200',
  warm: 'bg-amber-50 text-amber-700 border-amber-200',
  cold: 'bg-blue-50 text-blue-700 border-blue-200',
};

const templates = [
  { label: 'Initial Outreach', text: 'Hi {{first_name}}! 👋 I\'m reaching out from Orbin AI. We help GTM teams in Africa automate their outbound with AI. Would love to share how we could help {{company}}. Is now a good time?' },
  { label: 'Follow-up', text: 'Hi {{first_name}}, just following up on my previous message. We\'ve been helping similar companies improve their reply rates by 3x. Worth a quick chat?' },
  { label: 'Case Study', text: 'Hi {{first_name}}! 🚀 Thought this would be relevant — we recently helped a team like {{company}} book 40% more meetings using our AI sequencing. Happy to share details?' },
  { label: 'Meeting Request', text: 'Hi {{first_name}}, would you be open to a 20-min call this week to see how Orbin AI works? I can show you exactly how it applies to {{company}}\'s workflow.' },
];

export default function WhatsApp() {
  const [convs, setConvs] = useState(conversationsData);
  const [selected, setSelected] = useState(conversationsData[0]);
  const [assignedTo, setAssignedTo] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [selected]);

  const sendMessage = () => {
    if (!message.trim() || !selected) return;
    const newMsg = { id: Date.now(), role: 'sent', content: message, time: 'Now', status: 'sent' };
    setConvs(prev => prev.map(c => c.id === selected.id
      ? { ...c, messages: [...c.messages, newMsg], lastMessage: message, lastTime: 'Just now', unread: 0 }
      : c
    ));
    setSelected(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
    setMessage('');
  };

  const generateAIReply = async () => {
    if (!selected) return;
    setAiLoading(true);
    const lastReceived = [...selected.messages].reverse().find(m => m.role === 'received');
    const result = await base44.integrations.Core.InvokeLLM({ prompt: `You are writing a WhatsApp reply for a B2B sales rep in Africa.

Contact: ${selected.name} from ${selected.company}
Their last message: "${lastReceived?.content || 'No message yet'}"
Conversation context: GTM/sales outreach

Write a SHORT, friendly, and professional WhatsApp reply (2-3 sentences max).
Use conversational tone appropriate for WhatsApp. Be warm but direct.
Do not use formal email language. Use emojis sparingly if appropriate.
Just write the message text, nothing else.`});
    setMessage(result || '');
    setAiLoading(false);
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const filtered = convs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = convs.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8fafc' }}>
      <TopBar title="WhatsApp Inbox" subtitle="AI-powered WhatsApp GTM workflows" />

      {/* Stats bar */}
      <div className="px-6 pt-4 pb-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Active Conversations', value: convs.filter(c => c.status === 'online').length, color: 'text-primary', icon: MessageCircle },
            { label: 'Unread Messages', value: totalUnread, color: 'text-amber-400', icon: Reply },
            { label: 'Hot Leads', value: convs.filter(c => c.tag === 'hot').length, color: 'text-red-400', icon: TrendingUp },
            { label: 'Response Rate', value: '78%', color: 'text-cyan-400', icon: CheckCheck },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-3 flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color} flex-shrink-0`} />
              <div>
                <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main inbox layout */}
      <div className="flex flex-1 overflow-hidden px-6 pb-6 gap-4">
        {/* Conversations list */}
        <div className="w-80 flex-shrink-0 glass rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..." className="pl-9 h-8 text-xs" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(conv => (
              <div key={conv.id} onClick={() => setSelected(conv)}
                className={`flex items-center gap-3 p-3 border-b border-border/20 hover:bg-secondary/30 cursor-pointer transition-colors ${selected?.id === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {conv.avatar}
                  </div>
                  {conv.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold text-foreground truncate">{conv.name}</p>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-1">{conv.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0 ml-1">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-muted-foreground">{conv.company}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${tagColors[conv.tag]}`}>{conv.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        {selected ? (
          <div className="flex-1 glass rounded-xl flex flex-col overflow-hidden">
            {/* Shared inbox header */}
            <SharedInboxHeader assignedTo={assignedTo} onAssign={setAssignedTo} />

            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/30">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {selected.avatar}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-foreground">{selected.name}</p>
                <p className="text-xs text-muted-foreground">{selected.company} · {selected.phone}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${tagColors[selected.tag]}`}>{selected.tag}</span>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {selected.messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'sent' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'voice' ? (
                    <VoiceNotePlayer note={msg} />
                  ) : (
                    <div className={`max-w-[72%] px-3 py-2 rounded-2xl text-xs ${
                      msg.role === 'sent'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'glass border border-border/40 text-foreground rounded-bl-sm'
                    }`}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${msg.role === 'sent' ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-[10px] ${msg.role === 'sent' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{msg.time}</span>
                        {msg.role === 'sent' && (
                          msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-primary-foreground/80" /> : <Check className="w-3 h-3 text-primary-foreground/60" />
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              {/* Simulated voice note in Amara's conversation */}
              {selected.id === 1 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <VoiceNotePlayer note={{ duration: 8, sender: 'Amara Diallo', context: 'Nigeria', topic: 'requesting a product demo and asking about pricing' }} />
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Templates panel */}
            <AnimatePresence>
              {showTemplates && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border/30 overflow-hidden">
                  <div className="p-3 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Quick Templates</p>
                    <div className="grid grid-cols-2 gap-2">
                      {templates.map(t => (
                        <button key={t.label} onClick={() => { setMessage(t.text); setShowTemplates(false); }}
                          className="text-left p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary text-xs text-foreground transition-colors border border-border/30">
                          <p className="font-semibold text-primary mb-0.5">{t.label}</p>
                          <p className="text-muted-foreground line-clamp-1">{t.text}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input area */}
            <div className="p-4 border-t border-border/30 space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setShowTemplates(!showTemplates)}
                  className={`p-2 rounded-lg transition-colors text-xs flex items-center gap-1.5 border ${showTemplates ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary/50 text-muted-foreground border-border/40 hover:text-foreground'}`}>
                  <Smile className="w-3.5 h-3.5" /> Templates
                </button>
                <button onClick={generateAIReply} disabled={aiLoading}
                  className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors text-xs flex items-center gap-1.5">
                  {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {aiLoading ? 'Generating...' : 'AI Reply'}
                </button>
              </div>
              <div className="flex gap-2 items-end">
                <Textarea value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKey}
                  placeholder={`Message ${selected.name}...`}
                  className="flex-1 resize-none text-sm min-h-[40px] max-h-32" rows={2} />
                <Button onClick={sendMessage} disabled={!message.trim()} size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 glass rounded-xl flex items-center justify-center text-muted-foreground">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}