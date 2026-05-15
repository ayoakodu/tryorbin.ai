import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Play, Pause, Mail, Linkedin, MessageCircle, 
  Phone, MoreHorizontal, ChevronRight, Sparkles, 
  Users, TrendingUp, Eye, MousePointer, Reply, Zap
} from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const channelIcons = {
  email: Mail,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  sms: MessageCircle,
  'multi-channel': Zap,
};

const channelColors = {
  email: 'text-blue-400',
  linkedin: 'text-blue-500',
  whatsapp: 'text-primary',
  sms: 'text-violet-400',
  'multi-channel': 'text-amber-400',
};

const sequences = [
  {
    id: 1, name: 'Fintech CTO Outbound', channel: 'multi-channel', status: 'active',
    steps: 6, enrolled: 142, replied: 31, meetings: 8,
    tags: ['fintech', 'cto', 'series-b'],
    steps_detail: [
      { type: 'email', day: 0, subject: 'Quick question about your payment stack' },
      { type: 'linkedin', day: 2, subject: 'Connection + note' },
      { type: 'email', day: 5, subject: 'Following up — case study inside' },
      { type: 'email', day: 10, subject: 'Last touchpoint from me' },
    ]
  },
  {
    id: 2, name: 'SMB Decision Maker Nigeria', channel: 'whatsapp', status: 'active',
    steps: 4, enrolled: 89, replied: 22, meetings: 5,
    tags: ['nigeria', 'smb']
  },
  {
    id: 3, name: 'Inbound Lead Nurture', channel: 'email', status: 'active',
    steps: 8, enrolled: 234, replied: 67, meetings: 19,
    tags: ['inbound', 'nurture']
  },
  {
    id: 4, name: 'Re-engagement Cold Leads', channel: 'email', status: 'paused',
    steps: 3, enrolled: 47, replied: 8, meetings: 2,
    tags: ['cold', 're-engagement']
  },
  {
    id: 5, name: 'Event Follow-up Sequence', channel: 'multi-channel', status: 'draft',
    steps: 5, enrolled: 0, replied: 0, meetings: 0,
    tags: ['event', 'follow-up']
  },
];

const statusBadge = {
  active: 'bg-primary/20 text-primary border-primary/30',
  paused: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  draft: 'bg-secondary text-muted-foreground border-border',
};

function SequenceRow({ seq, isSelected, onSelect }) {
  const Icon = channelIcons[seq.channel] || Mail;
  const replyRate = seq.enrolled > 0 ? ((seq.replied / seq.enrolled) * 100).toFixed(1) : 0;
  const meetingRate = seq.enrolled > 0 ? ((seq.meetings / seq.enrolled) * 100).toFixed(1) : 0;

  return (
    <motion.div onClick={() => onSelect(seq)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={`flex items-center gap-4 px-5 py-4 border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
      <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${channelColors[seq.channel]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-foreground truncate">{seq.name}</p>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge[seq.status]}`}>
            {seq.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {seq.tags.map(t => <span key={t} className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{t}</span>)}
        </div>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm">
        <div className="text-center">
          <p className="font-bold text-foreground">{seq.enrolled}</p>
          <p className="text-[10px] text-muted-foreground">Enrolled</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-primary">{replyRate}%</p>
          <p className="text-[10px] text-muted-foreground">Reply</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-cyan-400">{meetingRate}%</p>
          <p className="text-[10px] text-muted-foreground">Meeting</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className={`p-1.5 rounded-md transition-colors ${seq.status === 'active' ? 'hover:bg-amber-500/10 text-amber-400' : 'hover:bg-primary/10 text-primary'}`}>
          {seq.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Outreach() {
  const [selectedSeq, setSelectedSeq] = useState(sequences[0]);
  const [tab, setTab] = useState('sequences');

  const totalEnrolled = sequences.reduce((s, seq) => s + seq.enrolled, 0);
  const totalReplied = sequences.reduce((s, seq) => s + seq.replied, 0);
  const totalMeetings = sequences.reduce((s, seq) => s + seq.meetings, 0);

  return (
    <div className="min-h-screen">
      <TopBar title="Outreach" subtitle="Multichannel sequences and engagement" />
      
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Sequences', value: sequences.filter(s => s.status === 'active').length, icon: Zap, color: 'text-primary' },
            { label: 'Total Enrolled', value: totalEnrolled, icon: Users, color: 'text-cyan-400' },
            { label: 'Overall Reply Rate', value: `${((totalReplied/totalEnrolled)*100).toFixed(1)}%`, icon: Reply, color: 'text-violet-400' },
            { label: 'Meetings Booked', value: totalMeetings, icon: TrendingUp, color: 'text-amber-400' },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          {/* Sequences List */}
          <div className="lg:col-span-3 glass rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <h3 className="font-bold text-foreground">Sequences</h3>
              <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                <Plus className="w-3.5 h-3.5" /> New Sequence
              </Button>
            </div>
            <div>
              {sequences.map(seq => (
                <SequenceRow key={seq.id} seq={seq} isSelected={selectedSeq?.id === seq.id} onSelect={setSelectedSeq} />
              ))}
            </div>
          </div>

          {/* Sequence Detail */}
          <div className="lg:col-span-2 glass rounded-xl p-5">
            {selectedSeq ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-sm">{selectedSeq.name}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge[selectedSeq.status]}`}>
                      {selectedSeq.status}
                    </span>
                  </div>
                </div>

                {/* Performance */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { label: 'Enrolled', value: selectedSeq.enrolled, color: 'text-foreground' },
                    { label: 'Replied', value: selectedSeq.replied, color: 'text-primary' },
                    { label: 'Meetings', value: selectedSeq.meetings, color: 'text-cyan-400' },
                  ].map(m => (
                    <div key={m.label} className="text-center p-2.5 rounded-lg bg-secondary/50">
                      <p className={`text-lg font-black ${m.color}`}>{m.value}</p>
                      <p className="text-[10px] text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Steps */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sequence Steps</p>
                  <div className="space-y-2">
                    {(selectedSeq.steps_detail || [
                      { type: 'email', day: 0, subject: 'Initial outreach' },
                      { type: 'email', day: 3, subject: 'Follow-up #1' },
                      { type: 'email', day: 7, subject: 'Final follow-up' },
                    ]).map((step, i) => {
                      const Icon = channelIcons[step.type] || Mail;
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full bg-secondary flex items-center justify-center`}>
                              <Icon className={`w-3 h-3 ${channelColors[step.type]}`} />
                            </div>
                            {i < 3 && <div className="w-0.5 h-4 bg-border/50 mt-0.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{step.subject}</p>
                            <p className="text-[10px] text-muted-foreground">Day {step.day}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Suggestion */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">AI Suggestion</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Adding a LinkedIn touchpoint on Day 4 could increase reply rate by ~18% based on similar sequences.</p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                Select a sequence to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}