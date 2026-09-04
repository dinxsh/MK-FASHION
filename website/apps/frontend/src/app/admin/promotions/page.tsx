'use client';
import { useEffect, useState } from 'react';
import { ApiCoupon, createCoupon, deleteCoupon as deleteCouponRequest, getAdminCoupons, updateCoupon } from '@/lib/adminApi';
import type { Coupon } from '@/lib/types/admin';
import { Plus, Copy, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PromotionsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percent' as 'percent' | 'fixed', value: '', minOrder: '', maxUses: '', expiry: '' });

  useEffect(() => {
    getAdminCoupons()
      .then((items) => setCoupons(items.map(toCoupon)))
      .catch((error) => toast.error(error instanceof Error ? error.message : 'Unable to load coupons'));
  }, []);

  const addCoupon = async () => {
    if (!form.code || !form.value) { toast.error('Code and value are required'); return; }
    try {
      const coupon = await createCoupon({
        code: form.code,
        type: form.type === 'percent' ? 'PERCENT' : 'FIXED',
        value: Number(form.value),
        minOrder: Number(form.minOrder || 0),
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiresAt: form.expiry || undefined,
        isActive: true,
      });
      setCoupons((items) => [toCoupon(coupon), ...items]);
      setForm({ code: '', type: 'percent', value: '', minOrder: '', maxUses: '', expiry: '' });
      setShowForm(false);
      toast.success('Coupon created');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create coupon');
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await deleteCouponRequest(id);
      setCoupons((items) => items.filter((coupon) => coupon.id !== id));
      toast.success('Coupon deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete coupon');
    }
  };
  const toggleActive = async (id: string) => {
    const coupon = coupons.find((item) => item.id === id);
    if (!coupon) return;
    try {
      const updated = await updateCoupon(id, { isActive: !coupon.active });
      setCoupons((items) => items.map((item) => item.id === id ? toCoupon(updated) : item));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update coupon');
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

      {/* Create Form */}
      {showForm && (
        <div className="bg-white/5 border border-purple-500/30 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-widest">Create Coupon</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Code</label>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="WELCOME20"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono uppercase" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'percent' | 'fixed' }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500">
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Value</label>
              <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === 'percent' ? '20' : '500'}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Min Order (₹)</label>
              <input type="number" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="100"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Expiry Date</label>
              <input type="date" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addCoupon} className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">Create Coupon</button>
            <button onClick={() => setShowForm(false)} className="bg-white/5 hover:bg-white/10 text-slate-300 px-5 py-2 rounded-xl text-sm font-semibold transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Coupon List */}
      <div className="space-y-3">
        {coupons.map(c => {
          const isExpired = c.expiry && new Date(c.expiry) < new Date();
          const usedUp = c.uses >= c.maxUses;
          return (
            <div key={c.id} className={`bg-white/5 border rounded-2xl p-4 flex items-center gap-4 transition-colors ${!c.active || isExpired || usedUp ? 'border-white/5 opacity-60' : 'border-white/10'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono font-bold text-purple-300 text-base">{c.code}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.active && !isExpired && !usedUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {!c.active ? 'Inactive' : isExpired ? 'Expired' : usedUp ? 'Used up' : 'Active'}
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full font-medium">
                    {c.type === 'percent' ? `${c.value}% off` : `₹${c.value} off`}
                  </span>
                </div>
                <div className="text-slate-400 text-xs mt-1">
                  Min order: ₹{c.minOrder} · Uses: {c.uses}/{c.maxUses} · Expires: {c.expiry || 'Never'}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => copyCoupon(c.code)} className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"><Copy size={14} /></button>
                <button onClick={() => toggleActive(c.id)} className={`p-1.5 rounded-lg transition-colors ${c.active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:text-emerald-400'}`}><Check size={14} /></button>
                <button onClick={() => deleteCoupon(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function toCoupon(coupon: ApiCoupon): Coupon {
  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type === 'PERCENT' ? 'percent' : 'fixed',
    value: Number(coupon.value),
    minOrder: Number(coupon.minOrder),
    uses: coupon.uses,
    maxUses: coupon.maxUses ?? Infinity,
    expiry: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 10) : '',
    active: coupon.isActive,
    description: coupon.description ?? undefined,
  };
}
