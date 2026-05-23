import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const weeklyData = [
  { day: 'Mon', sent: 48, replies: 11, meetings: 3 },
  { day: 'Tue', sent: 62, replies: 18, meetings: 5 },
  { day: 'Wed', sent: 55, replies: 14, meetings: 4 },
  { day: 'Thu', sent: 71, replies: 22, meetings: 7 },
  { day: 'Fri', sent: 44, replies: 9, meetings: 2 },
  { day: 'Sat', sent: 12, replies: 3, meetings: 1 },
  { day: 'Sun', sent: 8, replies: 2, meetings: 0 },
];

const channelData = [
  { name: 'Email', replyRate: 18.4, meetingRate: 5.2 },
  { name: 'LinkedIn', replyRate: 24.1, meetingRate: 8.7 },
  { name: 'WhatsApp', replyRate: 31.6, meetingRate: 7.1 },
  { name: 'SMS', replyRate: 14.2, meetingRate: 3.8 },
];

export default function SequenceAnalyticsTab({ sequences }) {
  const totalEnrolled = sequences.reduce((s, seq) => s + seq.enrolled, 0);
  const totalReplied = sequences.reduce((s, seq) => s + seq.replied, 0);
  const totalMeetings = sequences.reduce((s, seq) => s + seq.meetings, 0);
  const totalOpens = sequences.reduce((s, seq) => s + seq.opens, 0);
  const overallReplyRate = totalEnrolled > 0 ? ((totalReplied / totalEnrolled) * 100).toFixed(1) : 0;
  const openRate = totalEnrolled > 0 ? ((totalOpens / totalEnrolled) * 100).toFixed(1) : 0;

  return (
    <div className="p-5 space-y-5">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sent', value: totalEnrolled.toLocaleString(), sub: 'All sequences', color: 'text-slate-700' },
          { label: 'Open Rate', value: `${openRate}%`, sub: `${totalOpens} opens`, color: 'text-cyan-600' },
          { label: 'Reply Rate', value: `${overallReplyRate}%`, sub: `${totalReplied} replies`, color: 'text-emerald-600' },
          { label: 'Meetings', value: totalMeetings, sub: 'Booked total', color: 'text-amber-500' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-[11px] text-slate-500 mb-1">{k.label}</p>
            <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Weekly Activity */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-700 mb-3">Weekly Activity</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData} barSize={10} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="sent" fill="#e2e8f0" radius={[3, 3, 0, 0]} name="Sent" />
              <Bar dataKey="replies" fill="#34d399" radius={[3, 3, 0, 0]} name="Replies" />
              <Bar dataKey="meetings" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Meetings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Performance */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-bold text-slate-700 mb-3">Channel Performance</p>
          <div className="space-y-2.5">
            {channelData.map(ch => (
              <div key={ch.name} className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500 w-16 flex-shrink-0">{ch.name}</span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                      <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${(ch.replyRate / 40) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-medium w-10 text-right">{ch.replyRate}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                      <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${(ch.meetingRate / 40) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-amber-500 font-medium w-10 text-right">{ch.meetingRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-100">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[10px] text-slate-400">Reply rate</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[10px] text-slate-400">Meeting rate</span></div>
          </div>
        </div>
      </div>

      {/* Per-sequence breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-700">Sequence Breakdown</p>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Sequence', 'Status', 'Enrolled', 'Opens', 'Replies', 'Meetings', 'Reply Rate'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sequences.map(seq => {
              const rr = seq.enrolled > 0 ? ((seq.replied / seq.enrolled) * 100).toFixed(1) : '0.0';
              return (
                <tr key={seq.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-medium text-slate-700 truncate max-w-[160px]">{seq.name}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      seq.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                      seq.status === 'paused' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}>{seq.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{seq.enrolled}</td>
                  <td className="px-4 py-2.5 text-cyan-600">{seq.opens}</td>
                  <td className="px-4 py-2.5 text-slate-600">{seq.replied}</td>
                  <td className="px-4 py-2.5 text-amber-500 font-medium">{seq.meetings}</td>
                  <td className="px-4 py-2.5">
                    <span className={`font-bold ${parseFloat(rr) >= 20 ? 'text-emerald-600' : parseFloat(rr) >= 10 ? 'text-amber-500' : 'text-slate-400'}`}>{rr}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}