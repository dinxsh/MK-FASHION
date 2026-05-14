'use client';
import { useEffect, useState } from 'react';
import { Save, Bell, Shield, Palette, Globe, CreditCard, Truck, User, UserPlus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/api';
import type { SettingsPayload, StaffMember } from '@/lib/types/admin';

const TABS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'team', label: 'Team', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('general');
  const [settings, setSettings] = useState<SettingsPayload | null>(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<StaffMember['role']>('Viewer');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  useEffect(() => {
    apiFetch<SettingsPayload>('/settings').then(setSettings).catch(() => toast.error('Failed to load settings'));
  }, []);

  if (!settings) {
    return <div className="text-slate-500">Loading settings...</div>;
  }

  const saveSettings = async (message: string) => {
    try {
      const updated = await apiFetch<SettingsPayload>('/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings),
      });
      setSettings(updated);
      toast.success(message);
    } catch {
      toast.error('Save failed');
    }
  };

  const inviteMember = async () => {
    if (!newMemberName || !newMemberEmail) return;
    try {
      const created = await apiFetch<StaffMember>('/settings/team', {
        method: 'POST',
        body: JSON.stringify({
          name: newMemberName,
          email: newMemberEmail,
          role: newMemberRole,
          password: newMemberPassword || undefined,
        }),
      });
      setSettings({ ...settings, team: [...settings.team, created] });
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberPassword('');
      toast.success('Team member added');
    } catch {
      toast.error('Invite failed');
    }
  };

  const removeMember = async (id: string) => {
    try {
      await apiFetch(`/settings/team/${id}`, { method: 'DELETE' });
      setSettings({ ...settings, team: settings.team.filter((member) => member.id !== id) });
      toast.success('Member removed');
    } catch {
      toast.error('Remove failed');
    }
  };

  const changePassword = async () => {
    if (!newPw || newPw !== confirmPw) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      toast.success('Password updated');
    } catch {
      toast.error('Password update failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configure your MK Fashion store</p>
      </div>

      <div className="flex gap-1 flex-wrap">
        {TABS.map((entry) => {
          const Icon = entry.icon;
          return (
            <button key={entry.id} onClick={() => setTab(entry.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${tab === entry.id ? 'bg-purple-600 text-white' : 'bg-white/[0.04] text-slate-400 hover:text-white'}`}>
              <Icon size={13} /> {entry.label}
            </button>
          );
        })}
      </div>

      {tab === 'general' && (
        <Section title="Store Information" desc="Your store's public-facing details">
          <Field label="Store Name"><TextInput value={settings.general.storeName} onChange={(v) => setSettings({ ...settings, general: { ...settings.general, storeName: v } })} /></Field>
          <Field label="Contact Email"><TextInput value={settings.general.storeEmail} onChange={(v) => setSettings({ ...settings, general: { ...settings.general, storeEmail: v } })} type="email" /></Field>
          <Field label="Phone Number"><TextInput value={settings.general.storePhone} onChange={(v) => setSettings({ ...settings, general: { ...settings.general, storePhone: v } })} /></Field>
          <Field label="Business Address"><TextInput value={settings.general.storeAddress} onChange={(v) => setSettings({ ...settings, general: { ...settings.general, storeAddress: v } })} /></Field>
          <SaveBtn onClick={() => saveSettings('General settings saved')} />
        </Section>
      )}

      {tab === 'payment' && (
        <Section title="Payment Methods" desc="Configure accepted payment options">
          {Object.entries(settings.payment).map(([key, value]) => (
            <ToggleRow key={key} label={key.toUpperCase()} desc="Toggle payment method" value={Boolean(value)} onChange={(checked) => setSettings({ ...settings, payment: { ...settings.payment, [key]: checked } })} />
          ))}
          <SaveBtn onClick={() => saveSettings('Payment settings saved')} />
        </Section>
      )}

      {tab === 'shipping' && (
        <Section title="Shipping Configuration" desc="Manage delivery rules and pricing">
          <Field label="Free Shipping Threshold"><TextInput value={settings.shipping.freeShipThreshold} onChange={(v) => setSettings({ ...settings, shipping: { ...settings.shipping, freeShipThreshold: v } })} /></Field>
          <Field label="Standard Delivery Estimate"><TextInput value={settings.shipping.stdDeliveryDays} onChange={(v) => setSettings({ ...settings, shipping: { ...settings.shipping, stdDeliveryDays: v } })} /></Field>
          <SaveBtn onClick={() => saveSettings('Shipping settings saved')} />
        </Section>
      )}

      {tab === 'notifications' && (
        <Section title="Email Notifications" desc="Choose which events trigger email alerts">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <ToggleRow key={key} label={key} desc="Notification preference" value={Boolean(value)} onChange={(checked) => setSettings({ ...settings, notifications: { ...settings.notifications, [key]: checked } })} />
          ))}
          <SaveBtn onClick={() => saveSettings('Notification preferences saved')} />
        </Section>
      )}

      {tab === 'team' && (
        <Section title="Team Members" desc="Manage who can access the admin portal">
          <div className="space-y-2">
            {settings.team.map((member) => (
              <div key={member.id} className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white font-black text-sm shrink-0">{member.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold">{member.name}</div>
                  <div className="text-slate-500 text-xs">{member.email}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">{member.role}</span>
                  {member.role !== 'Admin' && <button onClick={() => removeMember(member.id)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={13} /></button>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl space-y-3">
            <div className="text-sm font-semibold text-white flex items-center gap-2"><UserPlus size={15} className="text-purple-400" /> Add Member</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <TextInput value={newMemberName} onChange={setNewMemberName} placeholder="Full name" />
              <TextInput value={newMemberEmail} onChange={setNewMemberEmail} placeholder="colleague@example.com" type="email" />
              <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value as StaffMember['role'])} className={selectCls}>
                <option value="Manager">Manager</option>
                <option value="Viewer">Viewer</option>
                <option value="Admin">Admin</option>
              </select>
              <TextInput value={newMemberPassword} onChange={setNewMemberPassword} placeholder="Optional password to activate immediately" type="password" />
            </div>
            <button onClick={inviteMember} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Save Member</button>
          </div>
        </Section>
      )}

      {tab === 'security' && (
        <Section title="Change Password" desc="Update your current admin password">
          <Field label="Current Password"><TextInput value={currentPw} onChange={setCurrentPw} type="password" /></Field>
          <Field label="New Password"><TextInput value={newPw} onChange={setNewPw} type="password" /></Field>
          <Field label="Confirm New Password"><TextInput value={confirmPw} onChange={setConfirmPw} type="password" /></Field>
          <button onClick={changePassword} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Shield size={14} /> Update Password
          </button>
        </Section>
      )}

      {tab === 'appearance' && (
        <Section title="Store Appearance" desc="Customize colors and branding settings">
          <Field label="Admin Accent Color"><TextInput value={settings.appearance.accentColor} onChange={(v) => setSettings({ ...settings, appearance: { ...settings.appearance, accentColor: v } })} /></Field>
          <Field label="Brand Logo URL"><TextInput value={settings.appearance.logoUrl} onChange={(v) => setSettings({ ...settings, appearance: { ...settings.appearance, logoUrl: v } })} /></Field>
          <SaveBtn onClick={() => saveSettings('Appearance settings saved')} />
        </Section>
      )}
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-4">
      <div className="pb-1 border-b border-white/[0.05]">
        <h2 className="font-semibold text-white">{title}</h2>
        <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><label className="text-xs font-medium text-slate-400">{label}</label>{children}</div>;
}

function TextInput({ value, onChange, type = 'text', placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors" />;
}

const selectCls = 'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors';

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
      <div><div className="text-white text-sm font-medium">{label}</div><div className="text-slate-500 text-xs">{desc}</div></div>
      <button onClick={() => onChange(!value)} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-purple-600' : 'bg-white/10'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function SaveBtn({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors mt-2"><Save size={14} /> Save Changes</button>;
}
