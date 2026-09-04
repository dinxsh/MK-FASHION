'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { ApiOrder, getAdminOrder, updateOrderStatus } from '@/lib/adminApi';

const STATUSES: ApiOrder['status'][] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminOrder(id)
      .then(setOrder)
      .catch((error) => toast.error(error instanceof Error ? error.message : 'Unable to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  const changeStatus = async (status: ApiOrder['status']) => {
    if (!order) return;
    try {
      setOrder(await updateOrderStatus(order.id, status));
      toast.success('Order status updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update order');
    }
  };

  if (loading) return <div className="py-32 text-center text-slate-400">Loading order...</div>;
  if (!order) return <div className="py-32 text-center"><p className="text-slate-400">Order not found.</p><button onClick={() => router.push('/admin/orders')} className="mt-4 text-purple-400 hover:underline">Back to orders</button></div>;

  return <div className="max-w-3xl mx-auto space-y-6">
    <div className="flex items-center gap-4"><button onClick={() => router.push('/admin/orders')} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"><ArrowLeft size={18} /></button><div><h1 className="text-2xl font-bold text-white">Order {order.orderNumber}</h1><p className="text-slate-400 text-sm">{new Date(order.createdAt).toLocaleString('en-IN')} · {order.customer.name}</p></div><span className="ml-auto rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200">{order.status}</span></div>
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-purple-300">Order Items</h2><div className="space-y-3">{order.items.map((item) => <div key={item.id} className="flex items-center gap-4">{item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-xl object-cover" /> : <span className="h-12 w-12 rounded-xl bg-white/5" />}<div className="flex-1"><p className="text-sm font-medium text-white">{item.name}</p><p className="text-xs text-slate-500">Qty: {item.quantity}</p></div><p className="font-semibold text-white">₹{(Number(item.unitPrice) * item.quantity).toLocaleString('en-IN')}</p></div>)}</div><div className="mt-4 flex justify-between border-t border-white/10 pt-4"><span className="text-sm text-slate-400">Order Total</span><span className="text-lg font-bold text-white">₹{Number(order.grandTotal).toLocaleString('en-IN')}</span></div></div>
    <div className="grid gap-6 sm:grid-cols-2"><div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-purple-300">Customer</h2><p className="font-medium text-white">{order.customer.name}</p><p className="text-sm text-slate-400">{order.customer.email}</p><p className="text-sm text-slate-400">{order.customer.phone ?? 'Phone not provided'}</p></div><div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="text-sm font-semibold uppercase tracking-widest text-purple-300">Update Status</h2><select value={order.status} onChange={(event) => void changeStatus(event.target.value as ApiOrder['status'])} className="w-full rounded-xl border border-white/10 bg-[#150722] px-4 py-2.5 text-sm text-white">{STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></div></div>
  </div>;
}
