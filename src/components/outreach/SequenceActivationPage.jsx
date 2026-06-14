import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Plus, Play, Mail, MessageCircle, Linkedin,
  Calendar, Users, Zap, RefreshCw, ChevronDown, ChevronUp,
  AlertTriangle, X, BookOpen, Target, Bot, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CAPABILITIES = [
  {
    icon: Bot,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'AI Personalization',
    desc: 'Generate hyper-personalized messages using company research, intent signals, and prospect data.',
  },
  {
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    title: 'Multichannel Outreach',
    desc: 'Combine email, LinkedIn, WhatsApp, SMS, and calls into a single coordinated workflow.',
  },
  {
    icon: RefreshCw,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    title: 'Automated Follow-ups',
    desc: 'Set intelligent delays and conditions so follow-ups send automatically at the right time.',
  },
  {
    icon: Target,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
    title: 'Pipeline Generation',
    desc: 'Move prospects through the funnel with structured touch sequences tied to your pipeline stages.',
  },
  {
    icon: Calendar,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    title: 'Meeting Booking',
    desc: 'Trigger meeting invites and Calendly links automatically based on engagement signals.',
  },
];

const RESOURCES = [
  { label: 'Getting started guide', href: '#' },
  { label: 'Best practices for cold outreach', href: '#' },
  { label: 'Sample multichannel workflow', href: '#' },
  { label: 'Outreach tips & playbooks', href: '#' },
];

const WORKFLOW_STEPS = [
  { icon: Users, label: 'Add Prospects', color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { icon: Mail, label: 'Email Day 0', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Linkedin, label: 'LinkedIn Day 2', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: MessageCircle, label: 'WhatsApp Day 5', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Calendar, label: 'Book Meeting', color: 'text-amber-500', bg: 'bg-amber-50' },
];

export default function SequenceActivationPage({ onCreateAI, onCreate, alerts, onDismissAlert }) {
  const navigate = useNavigate();
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto">

      {/* Setup Alerts */}
      {alerts.length > 0 && (
        <div className="px-6 pt-4 space-y-1.5">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <p className="flex-1 text-[11px] text-amber-800 leading-snug">{alert.message}</p>
              <button
                onClick={() => navigate(alert.route)}
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2 flex-shrink-0 whitespace-nowrap"
              >
                {alert.action}
              </button>
              <button onClick={() => onDismissAlert(alert.id)} className="text-amber-400 hover:text-amber-600 flex-shrink-0 ml-1">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">

            {/* Left: Video / Illustration Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Gradient header bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400" />

              {/* Thumbnail area */}
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center py-10 px-6">
                {/* Mock workflow illustration */}
                <div className="flex items-center gap-1.5 mb-5">
                  {WORKFLOW_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className={`w-8 h-8 rounded-lg ${step.bg} flex items-center justify-center shadow-sm border border-white`}>
                          <Icon className={`w-3.5 h-3.5 ${step.color}`} />
                        </div>
                        {i < WORKFLOW_STEPS.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Play button */}
                <div className="w-12 h-12 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform mb-3">
                  <Play className="w-5 h-5 text-emerald-600 ml-0.5" fill="currentColor" />
                </div>
                <p className="text-[11px] font-medium text-slate-500">How Sequences Work</p>
                <p className="text-[10px] text-slate-400 mt-0.5">1:45 min overview</p>
              </div>

              {/* Card footer */}
              <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-slate-500">Guided tour available</span>
                </div>
                <span className="text-[10px] text-slate-400">Orbin AI Academy</span>
              </div>
            </motion.div>

            {/* Right: Copy + CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="text-[11px] font-semibold text-emerald-700">AI-Native Outreach</span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800 leading-tight mb-2">
                  Automate personalized outreach with AI
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Build multichannel outbound workflows using email, LinkedIn, WhatsApp, tasks, and AI-powered personalization. Convert more prospects into meetings — on autopilot.
                </p>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex -space-x-1.5">
                  {['#34d399','#22d3ee','#818cf8','#fb923c'].map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  Teams using sequences see <span className="font-semibold text-slate-700">3× more replies</span> within 30 days
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  onClick={onCreateAI}
                  className="gap-1.5 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white px-5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Create with AI
                </Button>
                <Button
                  onClick={onCreate}
                  variant="outline"
                  className="gap-1.5 text-xs h-9 px-5 border-slate-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create sequence
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">What you can do</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                  className="bg-white border border-slate-200 rounded-xl p-3 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div className={`w-7 h-7 rounded-lg ${cap.bg} flex items-center justify-center mb-2.5`}>
                    <Icon className={`w-3.5 h-3.5 ${cap.color}`} />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-700 mb-1 leading-tight">{cap.title}</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{cap.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setResourcesOpen(p => !p)}
            className="flex items-center gap-2 text-[11px] font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Sequence resources
            {resourcesOpen
              ? <ChevronUp className="w-3.5 h-3.5" />
              : <ChevronDown className="w-3.5 h-3.5" />
            }
          </button>

          {resourcesOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2"
            >
              {RESOURCES.map(r => (
                <a
                  key={r.label}
                  href={r.href}
                  className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                >
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                  <span className="text-[11px] text-slate-600 group-hover:text-slate-800">{r.label}</span>
                </a>
              ))}
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
}