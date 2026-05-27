import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Settings2, ChevronDown } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import AICommandLayer from '@/components/dashboard/AICommandLayer';
import PerformanceLayer from '@/components/dashboard/PerformanceLayer';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import WidgetBar from '@/components/dashboard/WidgetBar';

const SECTION_LABELS = {
  ai:          { label: 'AI Command Center', sub: 'Live intelligence & recommended actions' },
  performance: { label: 'Performance',        sub: 'Pipeline, activity & growth metrics' },
  widgets:     { label: 'Widgets',             sub: 'Modular intelligence tiles' },
  activity:    { label: 'Activity Feed',       sub: 'Real-time GTM activity stream' },
};

function SectionHeader({ id, collapsed, onToggle }) {
  const { label, sub } = SECTION_LABELS[id];
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-[11px] text-slate-300 leading-tight">{sub}</p>
      </div>
      <button
        onClick={() => onToggle(id)}
        className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [collapsed, setCollapsed] = useState({});
  const [hiddenWidgets, setHiddenWidgets] = useState([]);

  const toggleSection = (id) => setCollapsed(c => ({ ...c, [id]: !c[id] }));

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const toggleWidget = (id) => {
    setHiddenWidgets(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        title="GTM Command Center"
        subtitle="AI-native execution intelligence · Live"
      />

      <div className="p-5 space-y-7 max-w-[1600px]">

        {/* ── 1. AI COMMAND LAYER ── */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SectionHeader id="ai" collapsed={collapsed.ai} onToggle={toggleSection} />
          {!collapsed.ai && <AICommandLayer isRefreshing={isRefreshing} />}
        </motion.section>

        {/* ── 2. PERFORMANCE LAYER ── */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <SectionHeader id="performance" collapsed={collapsed.performance} onToggle={toggleSection} />
          {!collapsed.performance && (
            <PerformanceLayer
              hiddenWidgets={hiddenWidgets}
              onToggleWidget={toggleWidget}
              isCustomizing={false}
            />
          )}
        </motion.section>

        {/* ── 3. WIDGET BAR ── */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <SectionHeader id="widgets" collapsed={collapsed.widgets} onToggle={toggleSection} />
          {!collapsed.widgets && <WidgetBar />}
        </motion.section>

        {/* ── 4. ACTIVITY FEED ── */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <SectionHeader id="activity" collapsed={collapsed.activity} onToggle={toggleSection} />
          {!collapsed.activity && <ActivityFeed />}
        </motion.section>

      </div>
    </div>
  );
}