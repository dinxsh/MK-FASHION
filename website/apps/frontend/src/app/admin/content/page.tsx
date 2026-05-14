'use client';
import { useEffect, useState } from 'react';
import { Upload, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/api';
import type { SettingsPayload } from '@/lib/types/admin';

export default function ContentPage() {
  const [settings, setSettings] = useState<SettingsPayload | null>(null);

  useEffect(() => {
    apiFetch<SettingsPayload>('/settings').then(setSettings).catch(() => toast.error('Failed to load content settings'));
  }, []);

  if (!settings) {
    return <div className="text-slate-500">Loading content settings...</div>;
  }

  const content = settings.content;

  const save = async () => {
    try {
      const updated = await apiFetch<SettingsPayload>('/settings', {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      });
      setSettings(updated);
      toast.success('Content updated');
    } catch {
      toast.error('Save failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Management</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage banners, announcements and featured content</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-widest">Announcement Bar</h2>
          <button onClick={() => setSettings({ ...settings, content: { ...content, showAnnouncement: !content.showAnnouncement } })}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${content.showAnnouncement ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
            {content.showAnnouncement ? <Eye size={12} /> : <EyeOff size={12} />}
            {content.showAnnouncement ? 'Visible' : 'Hidden'}
          </button>
        </div>
        <textarea value={content.announcement} onChange={(e) => setSettings({ ...settings, content: { ...content, announcement: e.target.value } })} rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none" />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-purple-300 uppercase tracking-widest">Homepage Hero Banner</h2>
        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
          <Upload size={24} className="mx-auto text-slate-500 mb-2" />
          <p className="text-slate-400 text-sm">Hero image continues to use the current static asset</p>
        </div>
        <input value={content.headline} onChange={(e) => setSettings({ ...settings, content: { ...content, headline: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" />
        <input value={content.subheadline} onChange={(e) => setSettings({ ...settings, content: { ...content, subheadline: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" />
        <input value={content.ctaText} onChange={(e) => setSettings({ ...settings, content: { ...content, ctaText: e.target.value } })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" />
        <button onClick={save} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Save size={14} /> Publish Changes
        </button>
      </div>
    </div>
  );
}
