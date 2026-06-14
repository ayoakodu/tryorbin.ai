import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Users, MessageSquare, Bell, Activity, Share2, Plus,
  Send, Sparkles, CheckCircle2, Clock, AlertCircle,
  BarChart3, Target, TrendingUp, Mail, Loader2, X,
  AtSign, Hash, Paperclip, ThumbsUp
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const teamMembers = [
  { id: 1, name: 'Kofi Acheampong', role: 'AE', avatar: 'KA', color: 'bg-primary/20 text-primary', status: 'online' },
  { id: 2, name: 'Fatima Bah', role: 'SDR', avatar: 'FB', color: 'bg-cyan-500/20 text-cyan-400', status: 'online' },
  { id: 3, name: 'James Osei', role: 'RevOps', avatar: 'JO', color: 'bg-violet-500/20 text-violet-400', status: 'away' },
  { id: 4, name: 'Ngozi Williams', role: 'CSM', avatar: 'NW', color: 'bg-amber-500/20 text-amber-400', status: 'offline' },
];

const initialComments = [
  {
    id: 1, author: 'Kofi Acheampong', avatar: 'KA', color: 'bg-primary/20 text-primary',
    text: 'The Q2 Fintech campaign is performing above benchmark. Recommend increasing budget for LinkedIn touchpoints.',
    time: '2h ago', channel: 'campaigns', likes: 3, replies: 1
  },
  {
    id: 2, author: 'Fatima Bah', avatar: 'FB', color: 'bg-cyan-500/20 text-cyan-400',
    text: '@James — can you pull the conversion data for the Paystack deal? Need it before the pipeline review at 3pm.',
    time: '4h ago', channel: 'pipeline', likes: 1, replies: 0
  },
  {
    id: 3, author: 'James Osei', avatar: 'JO', color: 'bg-violet-500/20 text-violet-400',
    text: 'WhatsApp reply rate is 2.3x email this week. Suggest A/B testing the SMB Decision Maker sequence with a WhatsApp-first approach.',
    time: '6h ago', channel: 'sequences', likes: 5, replies: 2
  },
  {
    id: 4, author: 'Ngozi Williams', avatar: 'NW', color: 'bg-amber-500/20 text-amber-400',
    text: 'Reminder: 3 deals in Negotiation are past their expected close date. @Kofi please review and update forecast.',
    time: '1d ago', channel: 'pipeline', likes: 2, replies: 1
  },
];

const notifications = [
  { id: 1, type: 'mention', icon: AtSign, color: 'text-primary', text: 'Fatima mentioned you in Pipeline discussion', time: '10m ago', read: false },
  { id: 2, type: 'deal', icon: TrendingUp, color: 'text-cyan-400', text: 'Deal "Paystack Integration" moved to Negotiation — $85K', time: '1h ago', read: false },
  { id: 3, type: 'campaign', icon: Target, color: 'text-violet-400', text: 'Q2 Fintech Campaign hit 35% open rate milestone', time: '2h ago', read: true },
  { id: 4, type: 'task', icon: CheckCircle2, color: 'text-primary', text: 'James completed LinkedIn follow-up task for Kweku Mensah', time: '3h ago', read: true },
  { id: 5, type: 'alert', icon: AlertCircle, color: 'text-amber-400', text: 'AI Alert: 3 deals show stale signals — last contact >14 days', time: '5h ago', read: true },
  { id: 6, type: 'sequence', icon: Mail, color: 'text-blue-400', text: 'Inbound Lead Nurture sequence hit 100 enrolled contacts', time: '1d ago', read: true },
];

const sharedDashboardData = [
  { label: 'Team Pipeline', value: '$2.4M', change: '+18%', icon: TrendingUp, color: 'text-primary' },
  { label: 'Meetings Booked', value: '47', change: '+12%', icon: Target, color: 'text-cyan-400' },
  { label: 'Team Reply Rate', value: '14.2%', change: '+3%', icon: BarChart3, color: 'text-violet-400' },
  { label: 'Active Sequences', value: '3', change: 'stable', icon: Activity, color: 'text-amber-400' },
];

const channels = [
  { id: 'all', label: 'All' },
  { id: 'pipeline', label: '# pipeline' },
  { id: 'campaigns', label: '# campaigns' },
  { id: 'sequences', label: '# sequences' },
  { id: 'general', label: '# general' },
];

function CommentCard({ comment, onLike }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-secondary/40 hover:bg-secondary/60 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full ${comment.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
          {comment.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-foreground">{comment.author}</span>
            <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">#{comment.channel}</span>
            <span className="text-[10px] text-muted-foreground ml-auto">{comment.time}</span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed">{comment.text}</p>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={() => onLike(comment.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ThumbsUp className="w-3 h-3" /> {comment.likes}
            </button>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
              <MessageSquare className="w-3 h-3" /> {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Collaboration() {
  const [comments, setComments] = useState(initialComments);
  const [notifs, setNotifs] = useState(notifications);
  const [newComment, setNewComment] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  const filteredComments = selectedChannel === 'all'
    ? comments
    : comments.filter(c => c.channel === selectedChannel);

  const postComment = () => {
    if (!newComment.trim()) return;
    const channel = selectedChannel === 'all' ? 'general' : selectedChannel;
    setComments(prev => [{
      id: Date.now(),
      author: 'You',
      avatar: 'YO',
      color: 'bg-primary/20 text-primary',
      text: newComment,
      time: 'Just now',
      channel,
      likes: 0,
      replies: 0
    }, ...prev]);
    setNewComment('');
  };

  const likeComment = (id) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getAISummary = async () => {
    setAiLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({ prompt: `You are a GTM team intelligence assistant. Summarize this team activity and provide 2-3 strategic recommendations based on the following comments and context:

Team comments: ${comments.map(c => `${c.author} (${c.channel}): ${c.text}`).join('\n')}
Pipeline: $2.4M, Meetings: 47, Reply Rate: 14.2%

Provide a concise 3-sentence team summary and 2-3 bullet actionable recommendations for the GTM team.`});
    setAiSummary(result);
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <TopBar title="Team Workspace" subtitle="Collaborate, share insights, and stay aligned on GTM execution" />

      <div className="p-6 space-y-5">
        {/* Shared Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sharedDashboardData.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.change} this month</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main workspace */}
          <div className="lg:col-span-2 space-y-4">
            {/* AI Team Summary */}
            <div className="glass rounded-xl p-5 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg gradient-brand flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                  </div>
                  <h3 className="font-bold text-sm">AI Team Intelligence</h3>
                </div>
                <Button size="sm" onClick={getAISummary} disabled={aiLoading}
                  className="h-7 text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                  {aiLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                  {aiLoading ? 'Analyzing...' : 'Generate Summary'}
                </Button>
              </div>
              {aiSummary ? (
                <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">{aiSummary}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Click "Generate Summary" for an AI-powered digest of your team's GTM activity, performance trends, and strategic recommendations.</p>
              )}
            </div>

            {/* Comments / Feed */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border/30 overflow-x-auto">
                {channels.map(ch => (
                  <button key={ch.id} onClick={() => setSelectedChannel(ch.id)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                      selectedChannel === ch.id
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}>
                    {ch.label}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-3">
                {/* Compose */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    YO
                  </div>
                  <div className="flex-1">
                    <Textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder={`Post to #${selectedChannel === 'all' ? 'general' : selectedChannel}... use @name to mention teammates`}
                      className="text-sm resize-none bg-secondary/50 border-border/50"
                      rows={2}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) postComment(); }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <button className="hover:text-foreground transition-colors"><AtSign className="w-3.5 h-3.5" /></button>
                        <button className="hover:text-foreground transition-colors"><Hash className="w-3.5 h-3.5" /></button>
                        <button className="hover:text-foreground transition-colors"><Paperclip className="w-3.5 h-3.5" /></button>
                      </div>
                      <Button size="sm" onClick={postComment} disabled={!newComment.trim()}
                        className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1">
                        <Send className="w-3 h-3" /> Post
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredComments.map(comment => (
                      <CommentCard key={comment.id} comment={comment} onLike={likeComment} />
                    ))}
                  </AnimatePresence>
                  {filteredComments.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-6">No posts in this channel yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Team Online */}
            <div className="glass rounded-xl p-5">
              <h3 className="font-bold text-sm mb-4">Team</h3>
              <div className="space-y-3">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-xs font-bold`}>
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${
                        member.status === 'online' ? 'bg-primary' : member.status === 'away' ? 'bg-amber-400' : 'bg-border'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground">{member.role}</p>
                    </div>
                    <span className={`text-[10px] capitalize ${
                      member.status === 'online' ? 'text-primary' : member.status === 'away' ? 'text-amber-400' : 'text-muted-foreground'
                    }`}>{member.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-primary hover:text-primary/80">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {notifs.map(n => (
                  <div key={n.id} className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${!n.read ? 'bg-primary/5 border border-primary/10' : 'hover:bg-secondary/40'}`}>
                    <div className={`w-6 h-6 rounded-md bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <n.icon className={`w-3 h-3 ${n.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}