'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ApiOrder, getAdminOrders, updateOrderStatus } from '@/lib/adminApi';

const statuses: ApiOrder['status'][] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAdminOrders().then(setOrders).catch((error) => toast.error(error instanceof Error ? error.message : 'Could not load orders')).finally(() => setLoading(false)); }, []);
  const changeStatus = async (order: ApiOrder, status: ApiOrder['status']) => {
    try { const updated = await updateOrderStatus(order.id, status); setOrders((items) => items.map((item) => item.id === order.id ? updated : item)); toast.success('Order status updated'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Could not update order'); }
  };
  return <div className="max-w-6xl mx-auto space-y-6"><div><p className="text-purple-300 text-xs uppercase font-bold tracking-[0.2em]">Live store data</p><h1 className="text-3xl font-bold text-white mt-1">Orders</h1></div><div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">{loading ? <div className="p-12 text-center text-slate-400">Loading orders...</div> : orders.length === 0 ? <div className="p-12 text-center text-slate-500">No real orders have been placed yet.</div> : <div className="divide-y divide-white/5">{orders.map((order) => <div key={order.id} className="grid gap-3 p-5 md:grid-cols-[1.2fr_1fr_0.7fr_0.8fr]"><div><p className="font-mono text-sm font-bold text-purple-300">{order.orderNumber}</p><p className="mt-1 text-xs text-slate-500">{new Date(order.createdAt).toLocaleString('en-IN')}</p></div><div><p className="text-sm font-semibold text-white">{order.customer.name}</p><p className="text-xs text-slate-500">{order.customer.email} · {order.items.length} item(s)</p></div><p className="font-bold text-emerald-300">₹{Number(order.grandTotal).toLocaleString('en-IN')}</p><select value={order.status} onChange={(event) => void changeStatus(order, event.target.value as ApiOrder['status'])} className="rounded-lg border border-white/10 bg-[#150722] px-2 py-2 text-xs font-bold text-white">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>)}</div>}</div></div>;
}
