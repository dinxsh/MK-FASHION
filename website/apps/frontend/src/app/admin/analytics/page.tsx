'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Product, StatData } from '@/lib/types/admin';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const PIE_COLORS = ['#7c3aed', '#c084fc', '#f59e0b', '#10b981', '#ef4444', '#6b7280'];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch<StatData>('/dashboard/summary'),
      apiFetch<Product[]>('/products'),
    ]).then(([summary, productData]) => {
      setStats(summary);
      setProducts(productData);
    }).catch(() => undefined);
  }, []);

  if (!stats) {
    return <div className="text-slate-500">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-0.5">Sales, traffic, and performance insights</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-5">Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={stats.revenueChart}>
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs ${(Number(v || 0) / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: '#1a0a2e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, color: '#f9fafb', fontSize: 12 }} formatter={(v) => [`Rs ${Number(v || 0).toLocaleString()}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} fill="url(#analyticsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-5">Daily Orders</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.ordersChart} barSize={20}>
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#1a0a2e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, color: '#f9fafb', fontSize: 12 }} />
              <Bar dataKey="orders" fill="#c084fc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-5">Order Status Mix</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.orderStatusChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={45} paddingAngle={3}>
                {stats.orderStatusChart.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a0a2e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, color: '#f9fafb', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

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
            {[...products].sort((a, b) => b.sold - a.sold).map((product, index) => (
              <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 text-xs font-mono w-4">#{index + 1}</span>
                    <img src={product.image} alt={product.name} className="w-8 h-8 rounded-lg object-cover bg-white/5" />
                    <span className="text-white font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="py-3 text-slate-400 capitalize">{product.category}</td>
                <td className="py-3 text-slate-300">{product.sold}</td>
                <td className="py-3 text-emerald-400 font-semibold">Rs {(product.sold * product.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
