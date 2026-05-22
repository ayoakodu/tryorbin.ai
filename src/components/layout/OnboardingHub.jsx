import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const completedSteps = 2;
const totalSteps = 9;
const pct = Math.round((completedSteps / totalSteps) * 100);

export default function OnboardingHub() {
  return (
    <Link
      to="/onboarding-hub"
      className="mt-2 mx-1 p-2.5 rounded-lg bg-white border border-slate-200 flex flex-col gap-1.5 hover:bg-slate-50 hover:border-emerald-200 transition-colors group"
    >
      <div className="flex items-center gap-2">
        <Rocket className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        <span className="text-[11px] font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">Onboarding Hub</span>
        <span className="ml-auto text-[10px] font-semibold text-emerald-600">{pct}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1">
        <div
          className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}