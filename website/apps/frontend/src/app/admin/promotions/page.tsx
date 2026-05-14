'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Coupon } from '@/lib/types/admin';
import { Plus, Copy, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PromotionsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percent' as 'percent' | 'fixed', value: '', minOrder: '', maxUses: '', expiry: '' });

  useEffect(() => {
    apiFetch<Coupon[]>('/coupons').then(setCoupons).catch(() => toast.error('Failed to load coupons'));
  }, []);

  const addCoupon = async () => {
    if (!form.code || !form.value) {
      toast.error('Code and value are required');
      return;
    }
    try {
      const created = await apiFetch<Coupon>('/coupons', {
        method: 'POST',
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          type: form.type,
          value: Number(form.value),
          minOrder: Number(form.minOrder || 0),
          maxUses: Number(form.maxUses || 100),
          expiry: form.expiry,
        }),
      });
      setCoupons((items) => [created, ...items]);
      setForm({ code: '', type: 'percent', value: '', minOrder: '', maxUses: '', expiry: '' });
      setShowForm(false);
      toast.success('Coupon created');
    } catch {
      toast.error('Creation failed');
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await apiFetch(`/coupons/${id}`, { method: 'DELETE' });
      setCoupons((items) => items.filter((item) => item.id !== id));
      toast.success('Coupon deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const toggleActive = async (id: string) => {
    const coupon = coupons.find((entry) => entry.id === id);
    if (!coupon) return;
    try {
      const updated = await apiFetch<Coupon>(`/coupons/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !coupon.active }),
      });
      setCoupons((items) => items.map((item) => item.id === id ? updated : item));
    } catch {
      toast.error('Update failed');
    }
  };

  const copyCoupon = (code: string) => { navigator.clipboard.writeText(code); toast.success(`Copied: ${code}`); };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Promotions</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage coupons and discount codes</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus size={16} /> New Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-widest">Create Coupon</h2>
          <div className="grid grid-cols-2 gap-4">
            <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="WELCOME20" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono uppercase" />
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'percent' | 'fixed' }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            <input type="number" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="20" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
            <input type="number" value={form.minOrder} onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
            <input type="number" value={form.maxUses} onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))} placeholder="100" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
            <input type="date" value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" />
          </div>
          <div className="flex gap-3">
            <button onClick={addCoupon} className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">Create Coupon</button>
            <button onClick={() => setShowForm(false)} className="bg-white/5 hover:bg-white/10 text-slate-300 px-5 py-2 rounded-xl text-sm font-semibold transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono font-bold text-purple-300 text-base">{coupon.code}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${coupon.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>{coupon.active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="text-slate-400 text-xs mt-1">Min order: Rs {coupon.minOrder} · Uses: {coupon.uses}/{coupon.maxUses} · Expires: {coupon.expiry || 'Never'}</div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => copyCoupon(coupon.code)} className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"><Copy size={14} /></button>
              <button onClick={() => toggleActive(coupon.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"><Check size={14} /></button>
              <button onClick={() => deleteCoupon(coupon.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
