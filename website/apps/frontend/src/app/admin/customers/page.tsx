'use client';
import { useEffect, useState } from 'react';
import { ApiCustomer, getAdminCustomers, updateCustomerStatus } from '@/lib/adminApi';
import type { Customer } from '@/lib/types/admin';
import { Search, Ban, UserCheck, Download, X, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked'>('All');
  const [selected, setSelected] = useState<Customer | null>(null);

  useEffect(() => {
    getAdminCustomers()
      .then((items) => setCustomers(items.map(toCustomer)))
      .catch((error) => toast.error(error instanceof Error ? error.message : 'Unable to load customers'));
  }, []);

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleBlock = async (id: string) => {
    const c = customers.find(c => c.id === id);
    if (!c) return;
    try {
      const updated = toCustomer(await updateCustomerStatus(id, c.status === 'Active' ? 'BLOCKED' : 'ACTIVE'));
      setCustomers((items) => items.map((customer) => customer.id === id ? updated : customer));
      setSelected((customer) => customer?.id === id ? updated : customer);
      toast.success(`${c.name} ${c.status === 'Active' ? 'blocked' : 'unblocked'}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update customer');
    }
  };

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const activeCount = customers.filter(c => c.status === 'Active').length;

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-500 text-sm mt-0.5">{customers.length} total · {activeCount} active</p>
        </div>
        <button onClick={() => toast.success('Export coming soon!')} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-white/10 w-fit">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'Active', value: activeCount },
          { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}k` },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
        </div>
        <div className="flex gap-1.5">
          {(['All', 'Active', 'Blocked'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${statusFilter === s ? 'bg-purple-600 text-white' : 'bg-white/[0.04] text-slate-500 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5">
        {/* Table */}
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
              {filtered.map(c => (
                <tr key={c.id} onClick={() => setSelected(c)}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer ${selected?.id === c.id ? 'bg-purple-600/5 border-l-2 border-l-purple-500' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                        {c.avatar}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{c.name}</div>
                        <div className="text-slate-600 text-[10px]">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-xs hidden md:table-cell">{c.phone}</td>
                  <td className="py-3 px-3">
                    <span className="bg-white/5 text-slate-300 text-xs font-semibold px-2 py-0.5 rounded-md">{c.totalOrders}</span>
                  </td>
                  <td className="py-3 px-3 text-white text-sm font-bold hidden sm:table-cell">₹{c.totalSpent.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-500 text-xs hidden lg:table-cell">{c.joined}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${c.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>{c.status}</span>
                  </td>
                  <td className="py-3 pr-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => toggleBlock(c.id)} title={c.status === 'Active' ? 'Block' : 'Unblock'}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                        {c.status === 'Active' ? <Ban size={13} /> : <UserCheck size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-16 text-center text-slate-600 text-sm">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Profile Drawer */}
        {selected && (
          <div className="w-72 shrink-0 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <span className="text-xs font-semibold text-white">Customer Profile</span>
              <button onClick={() => setSelected(null)} className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors">
                <X size={12} />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-5">
              {/* Avatar */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-xl font-black mx-auto mb-3 shadow-lg shadow-purple-500/20">
                  {selected.avatar}
                </div>
                <div className="text-white font-bold">{selected.name}</div>
                <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md ${selected.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                  {selected.status}
                </span>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                {[
                  { icon: <Mail size={12} />, value: selected.email },
                  { icon: <Phone size={12} />, value: selected.phone },
                  { icon: <MapPin size={12} />, value: 'India' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-white/[0.03] rounded-xl px-3 py-2.5">
                    <span className="text-slate-500">{row.icon}</span>
                    <span className="text-slate-300 text-xs truncate">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                  <div className="text-white font-bold text-lg">{selected.totalOrders}</div>
                  <div className="text-slate-500 text-[10px]">Orders</div>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                  <div className="text-purple-300 font-bold text-sm">₹{(selected.totalSpent / 1000).toFixed(1)}k</div>
                  <div className="text-slate-500 text-[10px]">Total Spent</div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Member Since</span>
                  <span className="text-slate-300">{selected.joined}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Avg. Order Value</span>
                  <span className="text-slate-300">₹{selected.totalOrders > 0 ? (selected.totalSpent / selected.totalOrders).toLocaleString(undefined, {maximumFractionDigits:0}) : 0}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button onClick={() => toggleBlock(selected.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${selected.status === 'Active' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                  {selected.status === 'Active' ? '🚫 Block Customer' : '✅ Unblock Customer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function toCustomer(customer: ApiCustomer): Customer {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? 'Not provided',
    totalOrders: customer.totalOrders,
    totalSpent: customer.totalSpent,
    joined: new Date(customer.createdAt).toLocaleDateString(),
    status: customer.status === 'BLOCKED' ? 'Blocked' : 'Active',
    avatar: customer.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    city: customer.city ?? undefined,
    lastOrder: customer.lastOrderAt ?? undefined,
  };
}
