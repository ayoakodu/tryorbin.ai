import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, RefreshCw, ChevronDown } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import WorkflowOrchestration from '@/components/dashboard/WorkflowOrchestration';
import NextBestActions from '@/components/dashboard/NextBestActions';
import AICommandLayer from '@/components/dashboard/AICommandLayer';
import PerformanceLayer from '@/components/dashboard/PerformanceLayer';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import WidgetBar from '@/components/dashboard/WidgetBar';
import { cn } from '@/lib/utils';

function SectionLabel({ label, sub, right }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
        {sub && <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">{sub}</p>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('just now');
  const [collapsed, setCollapsed] = useState({ performance: false, widgets: false });

  // Simulated live "last updated" ticker
  useEffect(() => {
    const intervals = ['just now', '1m ago', '2m ago', '3m ago'];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % intervals.length;
      setLastUpdated(intervals[idx]);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdated('just now');
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        title="GTM Command Center"
        subtitle={
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            AI operational · {lastUpdated}
          </span>
        }
      />

      <div className="p-3 sm:p-5 space-y-4 sm:space-y-6 max-w-[1600px]">

        {/* ── LAYER 0: WORKFLOW STATUS BAR ── */}
        {/* Always visible — heartbeat of live operations */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
        >
          <SectionLabel
            label="Live Operations"
            sub="Active sequences · AI status · Signals · Risk"
            right={
              <button
                onClick={handleRefresh}
                className={cn('flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors', isRefreshing && 'animate-spin')}
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            }
          />
          <WorkflowOrchestration />
        </motion.section>

        {/* ── LAYER 1: NEXT BEST ACTIONS ── */}
        {/* The operational engine — what the team should do RIGHT NOW */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
        >
          <NextBestActions />
        </motion.section>

        {/* ── LAYER 2: AI INTELLIGENCE ── */}
        {/* The brain — risk detection, opportunities, channel insights */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <AICommandLayer isRefreshing={isRefreshing} />
        </motion.section>

        {/* ── LAYER 3: PERFORMANCE (supporting, not dominant) ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
        >
          <SectionLabel
            label="Performance"
            sub="Supporting metrics · Pipeline · Activity"
            right={
              <button
                onClick={() => setCollapsed(c => ({ ...c, performance: !c.performance }))}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', collapsed.performance && 'rotate-180')} />
                {collapsed.performance ? 'Show' : 'Hide'}
              </button>
            }
          />
          {!collapsed.performance && <PerformanceLayer hiddenWidgets={[]} onToggleWidget={() => {}} isCustomizing={false} />}
        </motion.section>

        {/* ── LAYER 4: MODULAR WIDGETS ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionLabel
            label="Intelligence Tiles"
            sub="Revenue forecast · Team · Deliverability · Hot accounts"
            right={
              <button
                onClick={() => setCollapsed(c => ({ ...c, widgets: !c.widgets }))}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', collapsed.widgets && 'rotate-180')} />
                {collapsed.widgets ? 'Show' : 'Hide'}
              </button>
            }
          />
          {!collapsed.widgets && <WidgetBar />}
        </motion.section>

        {/* ── LAYER 5: GTM EXECUTION STREAM ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.23 }}
        >
          <ActivityFeed />
        </motion.section>

      </div>
    </div>
  );
}