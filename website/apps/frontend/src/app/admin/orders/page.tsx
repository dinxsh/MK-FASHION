'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/types/admin';
import { Search, Eye, Printer, Download, Truck, CheckCircle, XCircle, RefreshCcw, Clock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const STATUS_BADGE: Record<OrderStatus, string> = {
  Pending: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  Processing: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  Shipped: 'bg-purple-500/15 text-purple-400 border border-purple-500/25',
  Delivered: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  Cancelled: 'bg-red-500/15 text-red-400 border border-red-500/25',
  Refunded: 'bg-slate-500/15 text-slate-400 border border-slate-500/25',
};

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  Pending: <Clock size={11} />,
  Processing: <RefreshCcw size={11} />,
  Shipped: <Truck size={11} />,
  Delivered: <CheckCircle size={11} />,
  Cancelled: <XCircle size={11} />,
  Refunded: <RefreshCcw size={11} />,
};

const TABS: Array<OrderStatus | 'All'> = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<OrderStatus | 'All'>('All');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    apiFetch<Order[]>('/orders').then(setOrders).catch(() => toast.error('Failed to load orders'));
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'All' || o.status === tab;
    return matchSearch && matchTab;
  });

  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((o) => o.id));

  const bulkUpdateStatus = async (status: OrderStatus) => {
    try {
      await Promise.all(selected.map((id) => apiFetch(`/orders/${id.replace('#', '')}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })));
      setOrders((items) => items.map((item) => selected.includes(item.id) ? { ...item, status } : item));
      setSelected([]);
      toast.success(`Orders marked as ${status}`);
    } catch {
      toast.error('Bulk update failed');
    }
  };

  const countForTab = (value: OrderStatus | 'All') => value === 'All' ? orders.length : orders.filter((o) => o.status === value).length;
  const totalRevenue = filtered.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-500 text-sm mt-0.5">{filtered.length} orders · Rs {totalRevenue.toLocaleString()} total</p>
        </div>
        <button onClick={() => toast.success('CSV export can be added next')} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-white/10 w-fit">
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'] as OrderStatus[]).map((status) => (
          <button key={status} onClick={() => setTab(status)}
            className={`bg-white/[0.03] border rounded-xl p-3 text-center transition-all hover:bg-white/[0.05] ${tab === status ? 'border-purple-500/40' : 'border-white/[0.06]'}`}>
            <div className="text-lg font-bold text-white">{countForTab(status)}</div>
            <div className="text-slate-500 text-[10px] font-medium">{status}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Order ID, customer, or email..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {TABS.map((value) => (
            <button key={value} onClick={() => setTab(value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === value ? 'bg-purple-600 text-white' : 'bg-white/[0.04] text-slate-500 hover:text-white'}`}>
              {value}
            </button>
          ))}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-3 bg-purple-600/10 border border-purple-500/20 rounded-xl px-4 py-2.5 flex-wrap">
          <span className="text-purple-300 text-sm font-semibold">{selected.length} selected</span>
          <div className="w-px h-4 bg-white/10" />
          <button onClick={() => bulkUpdateStatus('Shipped')} className="text-purple-400 hover:underline text-xs font-medium">Mark Shipped</button>
          <button onClick={() => bulkUpdateStatus('Delivered')} className="text-emerald-400 hover:underline text-xs font-medium">Mark Delivered</button>
          <button onClick={() => bulkUpdateStatus('Cancelled')} className="text-red-400 hover:underline text-xs font-medium">Cancel</button>
        </div>
      )}

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-slate-500 text-[10px] uppercase tracking-wider">
              <th className="pl-4 pr-2 py-3 w-8">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-purple-500 w-4 h-4 cursor-pointer" />
              </th>
              <th className="py-3 text-left font-semibold">Order</th>
              <th className="py-3 text-left font-semibold">Customer</th>
              <th className="py-3 text-left font-semibold hidden md:table-cell">Date</th>
              <th className="py-3 text-left font-semibold hidden sm:table-cell">Items</th>
              <th className="py-3 text-left font-semibold">Total</th>
              <th className="py-3 text-left font-semibold hidden lg:table-cell">Payment</th>
              <th className="py-3 text-left font-semibold">Status</th>
              <th className="py-3 pr-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${selected.includes(o.id) ? 'bg-purple-600/5' : ''}`}>
                <td className="pl-4 pr-2 py-3">
                  <input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} className="accent-purple-500 w-4 h-4 cursor-pointer" />
                </td>
                <td className="py-3 px-2"><span className="text-purple-400 font-mono text-xs font-bold">{o.id}</span></td>
                <td className="py-3 px-2"><div className="text-white text-xs font-semibold">{o.customer}</div><div className="text-slate-600 text-[10px]">{o.email}</div></td>
                <td className="py-3 px-2 text-slate-400 text-xs hidden md:table-cell">{o.date}</td>
                <td className="py-3 px-2 text-slate-400 text-xs hidden sm:table-cell">{o.items} item{o.items > 1 ? 's' : ''}</td>
                <td className="py-3 px-2 text-white text-sm font-bold">Rs {o.total.toLocaleString()}</td>
                <td className="py-3 px-2 hidden lg:table-cell"><span className="text-slate-400 text-[10px]">{o.paymentStatus}</span></td>
                <td className="py-3 px-2">
                  <span className={`flex items-center gap-1 w-fit text-[10px] font-semibold px-2 py-0.5 rounded-md ${STATUS_BADGE[o.status]}`}>{STATUS_ICONS[o.status]} {o.status}</span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/admin/orders/${o.id.replace('#', '')}`} className="p-1.5 rounded-lg text-slate-600 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"><Eye size={13} /></Link>
                    <button className="p-1.5 rounded-lg text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" onClick={() => toast.success('Invoice view can be added next')}>
                      <Printer size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
