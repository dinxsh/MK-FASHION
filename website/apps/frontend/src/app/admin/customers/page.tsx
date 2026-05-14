'use client';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Customer, Order } from '@/lib/types/admin';
import { Search, Ban, UserCheck, Trash2, Download, X, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked'>('All');
  const [selected, setSelected] = useState<Customer | null>(null);

  useEffect(() => {
    Promise.all([apiFetch<Customer[]>('/customers'), apiFetch<Order[]>('/orders')])
      .then(([customerData, orderData]) => {
        setCustomers(customerData);
        setOrders(orderData);
      })
      .catch(() => toast.error('Failed to load customers'));
  }, []);

  const filtered = customers.filter((customer) => {
    const matchSearch = customer.name.toLowerCase().includes(search.toLowerCase()) || customer.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || customer.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleBlock = async (id: string) => {
    const customer = customers.find((entry) => entry.id === id);
    if (!customer) return;
    const nextStatus = customer.status === 'Active' ? 'Blocked' : 'Active';
    try {
      const updated = await apiFetch<Customer>(`/customers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      setCustomers((items) => items.map((item) => item.id === id ? updated : item));
      if (selected?.id === id) setSelected(updated);
      toast.success(`${customer.name} ${nextStatus === 'Blocked' ? 'blocked' : 'unblocked'}`);
    } catch {
      toast.error('Status update failed');
    }
  };

  const remove = async (id: string) => {
    try {
      await apiFetch(`/customers/${id}`, { method: 'DELETE' });
      setCustomers((items) => items.filter((item) => item.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Customer removed');
    } catch {
      toast.error('Delete failed');
    }
  };

  const customerOrders = useMemo(
    () => selected ? orders.filter((order) => order.customer === selected.name) : [],
    [orders, selected],
  );

  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const activeCount = customers.filter((customer) => customer.status === 'Active').length;

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-500 text-sm mt-0.5">{customers.length} total · {activeCount} active</p>
        </div>
        <button onClick={() => toast.success('CSV export can be added next')} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-white/10 w-fit">
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'Active', value: activeCount },
          { label: 'Total Revenue', value: `Rs ${(totalRevenue / 1000).toFixed(0)}k` },
        ].map((item) => (
          <div key={item.label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-white">{item.value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
        <div className="flex gap-1.5">
          {(['All', 'Active', 'Blocked'] as const).map((status) => (
            <button key={status} onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${statusFilter === status ? 'bg-purple-600 text-white' : 'bg-white/[0.04] text-slate-500 hover:text-white'}`}>
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5">
        <div className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden min-w-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 text-left font-semibold">Customer</th>
                <th className="py-3 px-3 text-left font-semibold hidden md:table-cell">Phone</th>
                <th className="py-3 px-3 text-left font-semibold">Orders</th>
                <th className="py-3 px-3 text-left font-semibold hidden sm:table-cell">Spent</th>
                <th className="py-3 px-3 text-left font-semibold hidden lg:table-cell">Joined</th>
                <th className="py-3 px-3 text-left font-semibold">Status</th>
                <th className="py-3 pr-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} onClick={() => setSelected(customer)}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer ${selected?.id === customer.id ? 'bg-purple-600/5 border-l-2 border-l-purple-500' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-black shrink-0">{customer.avatar}</div>
                      <div>
                        <div className="text-white font-semibold text-sm">{customer.name}</div>
                        <div className="text-slate-600 text-[10px]">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-xs hidden md:table-cell">{customer.phone}</td>
                  <td className="py-3 px-3"><span className="bg-white/5 text-slate-300 text-xs font-semibold px-2 py-0.5 rounded-md">{customer.totalOrders}</span></td>
                  <td className="py-3 px-3 text-white text-sm font-bold hidden sm:table-cell">Rs {customer.totalSpent.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-500 text-xs hidden lg:table-cell">{customer.joined}</td>
                  <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${customer.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>{customer.status}</span></td>
                  <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => toggleBlock(customer.id)} className="p-1.5 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                        {customer.status === 'Active' ? <Ban size={13} /> : <UserCheck size={13} />}
                      </button>
                      <button onClick={() => remove(customer.id)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="w-72 shrink-0 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <span className="text-xs font-semibold text-white">Customer Profile</span>
              <button onClick={() => setSelected(null)} className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"><X size={12} /></button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-xl font-black mx-auto mb-3 shadow-lg shadow-purple-500/20">{selected.avatar}</div>
                <div className="text-white font-bold">{selected.name}</div>
              </div>

              <div className="space-y-2">
                {[{ icon: <Mail size={12} />, value: selected.email }, { icon: <Phone size={12} />, value: selected.phone }, { icon: <MapPin size={12} />, value: selected.city || 'India' }].map((row, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-white/[0.03] rounded-xl px-3 py-2.5">
                    <span className="text-slate-500">{row.icon}</span>
                    <span className="text-slate-300 text-xs truncate">{row.value}</span>
                  </div>
                ))}
              </div>

              {customerOrders.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Order History</div>
                  <div className="space-y-2">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="bg-white/[0.03] rounded-xl p-3 flex justify-between items-center">
                        <div>
                          <div className="text-purple-400 text-xs font-mono font-bold">{order.id}</div>
                          <div className="text-slate-500 text-[10px]">{order.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-xs font-bold">Rs {order.total.toLocaleString()}</div>
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
