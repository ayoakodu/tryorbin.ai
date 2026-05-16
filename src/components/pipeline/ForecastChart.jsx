import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const stageColors = {
  prospecting: '#60a5fa',
  qualification: '#a78bfa',
  proposal: '#fbbf24',
  negotiation: '#fb923c',
  closed_won: '#4ade80',
};

const stageLabels = {
  prospecting: 'Prosp.',
  qualification: 'Qual.',
  proposal: 'Proposal',
  negotiation: 'Negot.',
  closed_won: 'Won',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border/60 rounded-xl p-3 shadow-xl text-xs space-y-1">
      <p className="font-bold text-foreground">{d.fullLabel}</p>
      <p className="text-muted-foreground">Pipeline: <span className="text-foreground font-semibold">${d.total.toLocaleString()}</span></p>
      <p className="text-muted-foreground">Weighted: <span className="text-primary font-semibold">${d.weighted.toLocaleString()}</span></p>
      <p className="text-muted-foreground">Deals: <span className="text-foreground font-semibold">{d.count}</span></p>
    </div>
  );
};

export default function ForecastChart({ deals }) {
  const stageOrder = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won'];

  const data = stageOrder.map(stageId => {
    const stageDeals = deals[stageId] || [];
    const total = stageDeals.reduce((s, d) => s + d.value, 0);
    const weighted = stageDeals.reduce((s, d) => s + Math.round(d.value * d.probability / 100), 0);
    return {
      stage: stageLabels[stageId],
      fullLabel: stageId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      total,
      weighted,
      count: stageDeals.length,
    };
  });

  const totalPipeline = data.reduce((s, d) => s + d.total, 0);
  const totalWeighted = data.reduce((s, d) => s + d.weighted, 0);

  return (
    <div className="glass rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-foreground">Revenue Forecast</h3>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Weighted Pipeline</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total Pipeline</p>
          <p className="text-xl font-black text-foreground">${(totalPipeline / 1000).toFixed(0)}K</p>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Weighted Forecast</p>
          <p className="text-xl font-black text-primary">${(totalWeighted / 1000).toFixed(0)}K</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis dataKey="stage" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="weighted" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={stageColors[['prospecting','qualification','proposal','negotiation','closed_won'][i]]} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="space-y-2">
        {data.filter(d => d.total > 0).map((d, i) => {
          const stageId = ['prospecting','qualification','proposal','negotiation','closed_won'][
            ['Prosp.','Qual.','Proposal','Negot.','Won'].indexOf(d.stage)
          ];
          return (
            <div key={d.stage} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: stageColors[stageId] }} />
              <span className="text-muted-foreground flex-1">{d.fullLabel}</span>
              <span className="font-mono text-muted-foreground">${(d.total / 1000).toFixed(0)}K</span>
              <span className="font-mono text-primary font-semibold">${(d.weighted / 1000).toFixed(0)}K</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}