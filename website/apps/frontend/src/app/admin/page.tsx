'use client';
import { useEffect, useState } from 'react';
import type { Customer, Order, Product, StatData } from '@/lib/types/admin';
import { apiFetch } from '@/lib/api';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, ShoppingBag, Package, Users, AlertTriangle,
  ArrowUpRight, Clock, Eye
} from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b', Processing: '#3b82f6', Shipped: '#8b5cf6',
  Delivered: '#10b981', Cancelled: '#ef4444', Refunded: '#6b7280',
};

const STATUS_BADGE: Record<string, string> = {
  Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
  Processing: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  Shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
  Delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
  Cancelled: 'bg-red-500/20 text-red-400 border-red-500/20',
  Refunded: 'bg-slate-500/20 text-slate-400 border-slate-500/20',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch<StatData>('/dashboard/summary'),
      apiFetch<Order[]>('/orders'),
      apiFetch<Product[]>('/products'),
      apiFetch<Customer[]>('/customers'),
    ]).then(([summary, orderData, productData, customerData]) => {
      setStats(summary);
      setOrders(orderData);
      setProducts(productData);
      setCustomers(customerData);
    }).catch(() => undefined);
  }, []);

  if (!stats) {
    return <div className="text-slate-500">Loading dashboard...</div>;
  }

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const totalRevenue = stats.revenueChart.reduce((sum, day) => sum + day.revenue, 0);
  const pendingOrders = orders.filter((order) => order.status === 'Pending').length;
  const activeCustomers = customers.filter((customer) => customer.status === 'Active').length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Store Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Live data from the secured admin API</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/new" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-purple-900/20">
            + Add Product
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-white/10">
            View Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Revenue" value={`Rs ${stats.revenue.toLocaleString()}`} change="+live" positive icon={<TrendingUp size={16} />} color="purple" sub="paid orders" />
        <KpiCard title="Orders" value={String(stats.orders)} change={`${pendingOrders} pending`} positive={false} icon={<ShoppingBag size={16} />} color="blue" sub="all orders" />
        <KpiCard title="Products" value={String(stats.products)} change={`${products.filter((p) => p.status === 'Active').length} active`} positive icon={<Package size={16} />} color="emerald" sub="catalog" />
        <KpiCard title="Customers" value={stats.customers.toLocaleString()} change={`${activeCustomers} active`} positive icon={<Users size={16} />} color="amber" sub="registered" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-white text-sm">Revenue Trend</h2>
              <p className="text-slate-500 text-xs mt-0.5">Rs {(totalRevenue / 1000).toFixed(0)}k total</p>
            </div>
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2.5 py-1 rounded-full">
              <ArrowUpRight size={12} /> Live
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.revenueChart}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs ${(Number(v || 0) / 1000).toFixed(0)}k`} width={42} />
              <Tooltip contentStyle={{ background: '#1a0a2e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, color: '#f9fafb', fontSize: 11 }} formatter={(v) => [`Rs ${Number(v || 0).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
          <h2 className="font-semibold text-white text-sm mb-1">Order Status</h2>
          <p className="text-slate-500 text-xs mb-4">Current breakdown</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={stats.orderStatusChart} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={3}>
                {stats.orderStatusChart.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a0a2e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, color: '#f9fafb', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-white text-sm">Daily Orders</h2>
            <p className="text-slate-500 text-xs mt-0.5">Recent activity</p>
          </div>
          <Link href="/admin/analytics" className="text-purple-400 text-xs hover:underline flex items-center gap-1">Full Analytics <ArrowUpRight size={12} /></Link>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={stats.ordersChart} barSize={18}>
            <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: '#1a0a2e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 8, color: '#f9fafb', fontSize: 11 }} />
            <Bar dataKey="orders" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
            <h2 className="font-semibold text-white text-sm">Recent Orders</h2>
            <Link href="/admin/orders" className="text-purple-400 text-xs hover:underline flex items-center gap-1">View all <ArrowUpRight size={12} /></Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-600 text-[10px] uppercase tracking-wider border-b border-white/[0.05]">
                <th className="text-left px-5 py-2.5 font-semibold">Order</th>
                <th className="text-left px-3 py-2.5 font-semibold">Customer</th>
                <th className="text-left px-3 py-2.5 font-semibold hidden sm:table-cell">Total</th>
                <th className="text-left px-3 py-2.5 font-semibold">Status</th>
                <th className="text-right px-5 py-2.5 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-purple-400 font-mono text-xs font-semibold">{order.id}</td>
                  <td className="px-3 py-3">
                    <div className="text-slate-300 text-xs font-medium">{order.customer}</div>
                    <div className="text-slate-600 text-[10px]">{order.date}</div>
                  </td>
                  <td className="px-3 py-3 text-white text-xs font-semibold hidden sm:table-cell">Rs {order.total.toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${STATUS_BADGE[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/orders/${order.id.replace('#', '')}`} className="text-slate-600 hover:text-purple-400 transition-colors">
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-white text-sm">Top Products</h2>
              <Link href="/admin/products" className="text-purple-400 text-xs hover:underline">See all</Link>
            </div>
            <div className="space-y-2.5">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-2.5 group">
                  <span className="text-slate-700 text-[10px] font-mono w-4 shrink-0">#{index + 1}</span>
                  <img src={product.image} alt={product.name} className="w-8 h-8 rounded-lg object-cover shrink-0 bg-white/5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-300 text-xs font-medium truncate group-hover:text-white transition-colors">{product.name}</div>
                    <div className="text-slate-600 text-[10px]">{product.sold} sold</div>
                  </div>
                  <span className="text-emerald-400 text-[10px] font-bold shrink-0">Rs {(product.price / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>

          {lowStock.length > 0 && (
            <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={13} className="text-amber-400" />
                <h2 className="font-semibold text-amber-300 text-xs uppercase tracking-wide">Low Stock ({lowStock.length})</h2>
              </div>
              <div className="space-y-2">
                {lowStock.map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs truncate flex-1">{product.name}</span>
                    <span className="text-amber-400 text-[10px] font-bold ml-2 shrink-0 bg-amber-400/10 px-1.5 py-0.5 rounded">{product.stock} left</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, positive, icon, color, sub }: {
  title: string; value: string; change: string; positive: boolean; icon: React.ReactNode; color: string; sub: string;
}) {
  const palette: Record<string, { bg: string; text: string; border: string }> = {
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  };
  const c = palette[color];
  return (
    <div className={`bg-white/[0.03] border ${c.border} rounded-2xl p-4 hover:bg-white/[0.05] transition-colors`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 ${c.bg} ${c.text} rounded-xl flex items-center justify-center`}>{icon}</div>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
          {positive ? <ArrowUpRight size={10} /> : <Clock size={10} />} {change}
        </div>
      </div>
      <div className="text-xl font-bold text-white leading-tight">{value}</div>
      <div className="text-slate-500 text-[11px] mt-0.5">{title} · {sub}</div>
    </div>
  );
}
