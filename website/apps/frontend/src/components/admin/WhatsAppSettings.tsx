'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { loadWhatsAppNumber } from '@/components/WhatsAppLink';
import { saveWhatsAppNumber } from '@/lib/adminApi';

export default function WhatsAppSettings() {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const load = async () => {
    setLoading(true);
    try { setNumber(await loadWhatsAppNumber()); setError(false); }
    catch { setError(true); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = number.replace(/[\s()+-]/g, '');
    if (normalized && !/^[1-9]\d{7,14}$/.test(normalized)) {
      toast.error('Enter 8–15 digits including the country code.'); return;
    }
    setSaving(true);
    try { await saveWhatsAppNumber(normalized); setNumber(normalized); toast.success('WhatsApp number saved'); }
    catch (err) { toast.error(err instanceof Error ? err.message : 'Could not save WhatsApp number'); }
    finally { setSaving(false); }
  };
  return <form onSubmit={save} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
    <h2 className="text-white font-semibold">WhatsApp</h2>
    <label htmlFor="whatsapp-number" className="block text-sm text-slate-300">WhatsApp number</label>
    <input id="whatsapp-number" type="tel" value={number} onChange={e => setNumber(e.target.value)} disabled={loading || saving || error} placeholder="919876543210" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white" />
    <p className="text-xs text-slate-400">Include the country code. Used for product orders, the footer and the floating button. Leave blank to hide WhatsApp links.</p>
    {error && <p role="alert" className="text-red-300 text-sm">Could not load settings. <button type="button" onClick={() => void load()} className="underline">Retry</button></p>}
    <button disabled={loading || saving || error} className="rounded-xl bg-purple-600 px-4 py-2 text-white disabled:opacity-50">{saving ? 'Saving...' : loading ? 'Loading...' : 'Save WhatsApp number'}</button>
  </form>;
}
