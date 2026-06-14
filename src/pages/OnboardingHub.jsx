import { useState } from 'react';
import { CheckCircle2, Rocket, Clock, Zap, Mail, Shield, Users, List, Send, Globe, Sparkles, UserPlus, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TopBar from '@/components/layout/TopBar';

const MAX_BONUS_CREDITS = 500;

const STEPS = [
  {
    id: 'connect-mailbox',
    icon: Mail,
    title: 'Connect Mailbox',
    description: 'Sync your email to enable outreach tracking.',
    time: '2 min',
    credits: 50,
    cta: 'Connect',
    done: true,
  },
  {
    id: 'configure-deliverability',
    icon: Shield,
    title: 'Configure Deliverability',
    description: 'Set up SPF, DKIM & DMARC to protect sender reputation.',
    time: '5 min',
    credits: 100,
    cta: 'Configure',
    done: false,
  },
  {
    id: 'import-contacts',
    icon: Users,
    title: 'Import Contacts',
    description: 'Upload your existing leads and prospect data.',
    time: '3 min',
    credits: 50,
    cta: 'Import',
    done: false,
  },
  {
    id: 'create-list',
    icon: List,
    title: 'Create First List',
    description: 'Segment contacts into targeted lists for outreach.',
    time: '1 min',
    credits: 25,
    cta: 'Create List',
    done: false,
  },
  {
    id: 'create-sequence',
    icon: Send,
    title: 'Create First Sequence',
    description: 'Build a multi-step automated outreach sequence.',
    time: '10 min',
    credits: 75,
    cta: 'Create',
    done: false,
  },
  {
    id: 'connect-integrations',
    icon: Globe,
    title: 'Connect Integrations',
    description: 'Link your CRM, LinkedIn & tools to Orbin AI.',
    time: '5 min',
    credits: 120,
    cta: 'Connect',
    done: false,
  },
  {
    id: 'configure-ai',
    icon: Sparkles,
    title: 'Configure AI Copilot',
    description: 'Tune AI to match your brand voice and style.',
    time: '3 min',
    credits: 30,
    cta: 'Configure',
    done: false,
  },
  {
    id: 'invite-team',
    icon: UserPlus,
    title: 'Invite Teammates',
    description: 'Bring your team into Orbin AI to collaborate.',
    time: '2 min',
    credits: 0,
    cta: 'Invite',
    done: false,
  },
  {
    id: 'launch-workflow',
    icon: Play,
    title: 'Launch First Workflow',
    description: 'Activate your first AI-powered outbound campaign.',
    time: '3 min',
    credits: 50,
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
      <TopBar title="Onboarding Hub" subtitle="Finish setting up your workspace" />

      <div className="flex-1 overflow-y-auto p-5">

        {/* Header Card */}
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Rocket className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800 leading-tight">
                  Complete setup to earn {MAX_BONUS_CREDITS} bonus credits
                </h2>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Finish onboarding to unlock your workspace.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0 ml-6">
              {/* Credits earned */}
              {totalCreditsEarned > 0 && (
                <div className="flex items-center gap-1 text-[11px]">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-amber-600 font-semibold">{totalCreditsEarned}</span>
                  <span className="text-slate-400">/ {MAX_BONUS_CREDITS} credits</span>
                </div>
              )}
              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="w-28 bg-slate-100 rounded-full h-1">
                  <div
                    className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={cn(
                  'bg-white border rounded-lg p-3 flex flex-col gap-2 transition-all',
                  step.done
                    ? 'border-emerald-100 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                )}
              >
                {/* Top row: icon + title + description */}
                <div className="flex items-start gap-2.5">
                  <div className={cn(
                    'w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5',
                    step.done ? 'bg-emerald-100' : 'bg-slate-100'
                  )}>
                    <Icon className={cn('w-3 h-3', step.done ? 'text-emerald-600' : 'text-slate-500')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className={cn(
                        'text-xs font-semibold leading-tight',
                        step.done ? 'text-slate-400 line-through' : 'text-slate-800'
                      )}>
                        {step.title}
                      </h3>
                      {step.done && <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                    </div>
                    <p className={cn(
                      'text-[10px] leading-tight mt-0.5',
                      step.done ? 'text-slate-400' : 'text-slate-500'
                    )}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Meta: time + credits */}
                <div className="flex items-center gap-2 text-[10px]">
                  <div className="flex items-center gap-0.5 text-slate-400">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{step.time}</span>
                  </div>
                  {step.credits > 0 && (
                    <div className={cn(
                      'flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-medium',
                      step.done ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    )}>
                      <Zap className="w-2.5 h-2.5" />
                      <span>+{step.credits} credits</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                {step.done ? (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-7 text-[10px] font-medium border-slate-300 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50"
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