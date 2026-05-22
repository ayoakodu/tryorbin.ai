import { useState } from 'react';
import { CheckCircle2, Circle, Rocket, Clock, Zap, Mail, Shield, Users, List, Send, Globe, Sparkles, UserPlus, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TopBar from '@/components/layout/TopBar';

const STEPS = [
  {
    id: 'connect-mailbox',
    icon: Mail,
    title: 'Connect Mailbox',
    description: 'Sync your email account to enable outreach tracking and sending.',
    time: '2 mins',
    credits: 50,
    cta: 'Connect',
    done: true,
  },
  {
    id: 'configure-deliverability',
    icon: Shield,
    title: 'Configure Deliverability',
    description: 'Set up SPF, DKIM, and DMARC to protect your sender reputation.',
    time: '5 mins',
    credits: 100,
    cta: 'Configure',
    done: false,
  },
  {
    id: 'import-contacts',
    icon: Users,
    title: 'Import Contacts',
    description: 'Upload your existing leads and prospect data into RVNU.',
    time: '3 mins',
    credits: 75,
    cta: 'Import',
    done: false,
  },
  {
    id: 'create-list',
    icon: List,
    title: 'Create First List',
    description: 'Segment your contacts into targeted lists for precise outreach.',
    time: '1 min',
    credits: 25,
    cta: 'Create List',
    done: false,
  },
  {
    id: 'create-sequence',
    icon: Send,
    title: 'Create First Sequence',
    description: 'Build a multi-step automated outreach sequence for your prospects.',
    time: '10 mins',
    credits: 150,
    cta: 'Create',
    done: false,
  },
  {
    id: 'connect-integrations',
    icon: Globe,
    title: 'Connect Integrations',
    description: 'Link your CRM, LinkedIn, and other tools for unified GTM execution.',
    time: '5 mins',
    credits: 50,
    cta: 'Connect',
    done: false,
  },
  {
    id: 'configure-ai',
    icon: Sparkles,
    title: 'Configure AI Copilot',
    description: 'Tune AI preferences to match your brand voice and outreach style.',
    time: '3 mins',
    credits: 75,
    cta: 'Configure',
    done: false,
  },
  {
    id: 'invite-team',
    icon: UserPlus,
    title: 'Invite Teammates',
    description: 'Bring your team into RVNU to collaborate on GTM workflows.',
    time: '2 mins',
    credits: 0,
    cta: 'Invite',
    done: false,
  },
  {
    id: 'launch-workflow',
    icon: Play,
    title: 'Launch First Outbound Workflow',
    description: 'Activate your first end-to-end AI-powered outbound campaign.',
    time: '3 mins',
    credits: 200,
    cta: 'Launch',
    done: false,
  },
];

export default function OnboardingHub() {
  const [steps, setSteps] = useState(STEPS);

  const completedCount = steps.filter(s => s.done).length;
  const totalCount = steps.length;
  const pct = Math.round((completedCount / totalCount) * 100);
  const totalCreditsEarned = steps.filter(s => s.done).reduce((sum, s) => sum + s.credits, 0);

  const markDone = (id) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, done: true } : s));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <TopBar title="Onboarding Hub" subtitle="Complete your workspace setup" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Progress Header Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-800">Get your workspace ready</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete setup steps to prepare your workspace for AI-powered GTM execution.
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-6">
              <p className="text-2xl font-bold text-emerald-600">{pct}%</p>
              <p className="text-[11px] text-slate-500">{completedCount}/{totalCount} done</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {totalCreditsEarned > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-slate-600 font-medium">
                You've earned <span className="text-amber-600 font-semibold">{totalCreditsEarned} AI Credits</span> so far
              </span>
            </div>
          )}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={cn(
                  'bg-white border rounded-xl p-4 flex flex-col gap-3 transition-all',
                  step.done ? 'border-emerald-100 bg-emerald-50/40' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                )}
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    step.done ? 'bg-emerald-100' : 'bg-slate-100'
                  )}>
                    <Icon className={cn('w-4 h-4', step.done ? 'text-emerald-600' : 'text-slate-500')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={cn('text-sm font-semibold leading-tight', step.done ? 'text-slate-400 line-through' : 'text-slate-800')}>
                        {step.title}
                      </h3>
                      {step.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                    </div>
                    <p className={cn('text-xs mt-0.5 leading-relaxed', step.done ? 'text-slate-400' : 'text-slate-500')}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-[11px]">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{step.time}</span>
                  </div>
                  {step.credits > 0 && (
                    <div className={cn(
                      'flex items-center gap-1 px-1.5 py-0.5 rounded-full font-medium',
                      step.done ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    )}>
                      <Zap className="w-3 h-3" />
                      <span>+{step.credits} credits</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                {step.done ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium pt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs border-slate-300 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50"
                    onClick={() => markDone(step.id)}
                  >
                    {step.cta}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}