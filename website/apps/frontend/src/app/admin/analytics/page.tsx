'use client';
import { mockStats, mockProducts } from '@/lib/mockData';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const CAT_DATA = [
  { cat: 'Sarees', revenue: 145000, orders: 56 },
  { cat: 'Lehengas', revenue: 238000, orders: 19 },
  { cat: 'Kurtas', revenue: 89000, orders: 42 },
  { cat: 'Accessories', revenue: 48000, orders: 112 },
];

const PIE_COLORS = ['#7c3aed','#c084fc','#f59e0b','#10b981'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-0.5">Sales, traffic, and performance insights</p>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-5">Revenue Trend (Last 30 Days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={mockStats.revenueChart}>
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: '#1a0a2e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, color: '#f9fafb', fontSize: 12 }}
              formatter={(value) => [`₹${Number(value ?? 0).toLocaleString()}`, 'Revenue'] as [string, string]} />
            <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} fill="url(#analyticsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Volume */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-5">Daily Orders (Last 14 Days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockStats.ordersChart} barSize={20}>
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1a0a2e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, color: '#f9fafb', fontSize: 12 }} />
              <Bar dataKey="orders" fill="#c084fc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance Pie */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-5">Revenue by Category</h2>
          <div className="flex gap-6 items-center">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={CAT_DATA} dataKey="revenue" nameKey="cat" cx="50%" cy="50%" outerRadius={70} innerRadius={45} paddingAngle={3}>
                  {CAT_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a0a2e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, color: '#f9fafb', fontSize: 12 }}
                  formatter={(value) => [`₹${Number(value ?? 0).toLocaleString()}`, 'Revenue'] as [string, string]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {CAT_DATA.map((c, i) => (
                <div key={c.cat} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-slate-300 flex-1">{c.cat}</span>
                  <span className="text-white font-semibold">₹{(c.revenue / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-5">Top Selling Products</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-xs">
              <th className="text-left pb-3 font-semibold">Product</th>
              <th className="text-left pb-3 font-semibold">Category</th>
              <th className="text-left pb-3 font-semibold">Units Sold</th>
              <th className="text-left pb-3 font-semibold">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {[...mockProducts].sort((a, b) => b.sold - a.sold).map((p, i) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 text-xs font-mono w-4">#{i+1}</span>
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover bg-white/5" />
                    <span className="text-white font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 text-slate-400 capitalize">{p.category}</td>
                <td className="py-3 text-slate-300">{p.sold}</td>
                <td className="py-3 text-emerald-400 font-semibold">₹{(p.sold * p.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
