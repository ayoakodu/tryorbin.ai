import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, changeType = 'positive', icon: Icon, iconColor, suffix = '' }) {
  return (
    <div className="glass rounded-xl p-5 hover:border-border transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconColor || 'bg-primary/10')}>
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-2">{value}{suffix}</p>
      {change !== undefined && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', 
          changeType === 'positive' ? 'text-primary' : 'text-destructive')}>
          {changeType === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{change}% vs last month</span>
        </div>
      )}
    </div>
  );
}