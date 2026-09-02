'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Package, ShoppingBag, IndianRupee, AlertTriangle } from 'lucide-react';
import { ApiOrder, ApiProduct, getAdminOrders, getAdminProducts } from '@/lib/adminApi';

export default function AdminDashboard() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { Promise.all([getAdminProducts(), getAdminOrders()]).then(([items, sales]) => { setProducts(items); setOrders(sales); }).finally(() => setLoading(false)); }, []);
  const revenue = orders.reduce((total, order) => total + Number(order.grandTotal), 0);
  const lowStock = products.filter((product) => (product.inventoryItem?.availableQty || 0) <= 5);
  const pending = orders.filter((order) => order.status === 'PENDING').length;

  return <div className="max-w-6xl mx-auto space-y-6"><div className="flex items-end justify-between"><div><p className="text-purple-300 text-xs uppercase font-bold tracking-[0.2em]">Live store data</p><h1 className="text-3xl font-bold text-white mt-1">Dashboard</h1></div><Link href="/admin/products/new" className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white">Add product</Link></div>{loading ? <div className="p-10 text-slate-400">Loading dashboard...</div> : <><div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><Stat label="Products" value={products.length} icon={<Package size={17} />} /><Stat label="Orders" value={orders.length} icon={<ShoppingBag size={17} />} /><Stat label="Sales" value={`₹${revenue.toLocaleString('en-IN')}`} icon={<IndianRupee size={17} />} /><Stat label="Low stock" value={lowStock.length} icon={<AlertTriangle size={17} />} /></div><div className="grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex justify-between"><h2 className="font-bold text-white">Recent orders</h2><Link href="/admin/orders" className="text-xs text-purple-300">View all</Link></div><div className="mt-4 space-y-3">{orders.slice(0, 5).map((order) => <div key={order.id} className="flex items-center justify-between border-b border-white/5 pb-3"><div><p className="text-sm font-semibold text-white">{order.orderNumber}</p><p className="text-xs text-slate-500">{order.customer.name} · {order.items.length} item(s)</p></div><div className="text-right"><p className="text-sm font-semibold text-emerald-300">₹{Number(order.grandTotal).toLocaleString('en-IN')}</p><p className="text-[10px] font-bold text-amber-300">{order.status}</p></div></div>)}{orders.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No real orders yet.</p>}</div></section><section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex justify-between"><h2 className="font-bold text-white">Low stock</h2><Link href="/admin/products" className="text-xs text-purple-300">Manage products</Link></div><div className="mt-4 space-y-3">{lowStock.map((product) => <div key={product.id} className="flex items-center justify-between border-b border-white/5 pb-3"><p className="text-sm font-medium text-white">{product.name}</p><p className="text-xs font-bold text-amber-300">{product.inventoryItem?.availableQty || 0} left</p></div>)}{lowStock.length === 0 && <p className="py-8 text-center text-sm text-slate-500">All products have healthy stock.</p>}</div></section></div><p className="text-xs text-slate-600">{pending} pending order(s)</p></>}</div>;
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) { return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex items-center justify-between text-purple-300">{icon}<span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Live</span></div><p className="mt-4 text-2xl font-bold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>; }
