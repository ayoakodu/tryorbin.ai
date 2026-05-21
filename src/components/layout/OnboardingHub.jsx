import { CheckCircle2, Circle, Rocket } from 'lucide-react';

const steps = [
  { label: 'Connect mailbox', done: true },
  { label: 'Add team members', done: true },
  { label: 'Import contacts', done: false },
  { label: 'Launch first campaign', done: false },
  { label: 'Configure deliverability', done: false },
];

const completed = steps.filter(s => s.done).length;
const total = steps.length;
const pct = Math.round((completed / total) * 100);

export default function OnboardingHub() {
  return (
    <div className="mt-2 mx-1 p-3 rounded-lg bg-white border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <Rocket className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        <span className="text-xs font-semibold text-slate-700">Onboarding Hub</span>
        <span className="ml-auto text-[10px] font-semibold text-emerald-600">{pct}%</span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1 mb-2.5">
        <div
          className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-1">
        {steps.map(({ label, done }) => (
          <div key={label} className="flex items-center gap-1.5">
            {done
              ? <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              : <Circle className="w-3 h-3 text-slate-300 flex-shrink-0" />
            }
            <span className={`text-[10px] ${done ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}