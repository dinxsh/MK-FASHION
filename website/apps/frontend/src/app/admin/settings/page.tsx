'use client';
import WhatsAppSettings from '@/components/admin/WhatsAppSettings';
import { useState } from 'react';
import { Save, Bell, Shield, Palette, Globe, CreditCard, Truck, ChevronRight, LogOut, User, UserPlus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { StaffMember } from '@/lib/types/admin';

const TABS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'team', label: 'Team', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

const MOCK_STAFF: StaffMember[] = [
  { id: 's1', name: 'Admin User', email: 'admin@mkfashion.in', role: 'Admin', avatar: 'AU', lastLogin: '2026-04-17 01:00 AM', status: 'Active' },
  { id: 's2', name: 'Priya Manager', email: 'priya.mgr@mkfashion.in', role: 'Manager', avatar: 'PM', lastLogin: '2026-04-16 05:00 PM', status: 'Active' },
  { id: 's3', name: 'Rahul View', email: 'rahul@mkfashion.in', role: 'Viewer', avatar: 'RV', lastLogin: '2026-04-14 10:30 AM', status: 'Invited' },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('general');
  const [storeName, setStoreName] = useState('MK Fashion');
  const [storeEmail, setStoreEmail] = useState('contact@mkfashion.in');
  const [storePhone, setStorePhone] = useState('+91 98765 43210');
  const [storeAddress, setStoreAddress] = useState('Mumbai, Maharashtra, India');
  const [currency, setCurrency] = useState('INR');
  const [gst, setGst] = useState('18');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [freeShipThreshold, setFreeShipThreshold] = useState('2000');
  const [stdDeliveryDays, setStdDeliveryDays] = useState('5-7');
  const [methods, setMethods] = useState({ upi: true, cards: true, cod: true, wallets: false, emi: false });
  const [notif, setNotif] = useState({ newOrder: true, lowStock: true, dailySummary: false, newReview: true, newCustomer: false });
  const [accentColor, setAccentColor] = useState('#7c3aed');
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<StaffMember['role']>('Viewer');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const save = (msg = 'Settings saved!') => toast.success(msg);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configure your MK Fashion store</p>
      </div>

      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${tab === t.id ? 'bg-purple-600 text-white' : 'bg-white/[0.04] text-slate-400 hover:text-white'}`}>
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'general' && <WhatsAppSettings />}
      {/* General */}
      {tab === 'general' && (
        <Section title="Store Information" desc="Your store's public-facing details">
          <Field label="Store Name"><TextInput value={storeName} onChange={setStoreName} /></Field>
          <Field label="Contact Email"><TextInput value={storeEmail} onChange={setStoreEmail} type="email" /></Field>
          <Field label="Phone Number"><TextInput value={storePhone} onChange={setStorePhone} /></Field>
          <Field label="Business Address"><TextInput value={storeAddress} onChange={setStoreAddress} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Currency">
              <select value={currency} onChange={e => setCurrency(e.target.value)} className={selectCls}>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </Field>
            <Field label="GST (%)"><TextInput value={gst} onChange={setGst} type="number" /></Field>
            <Field label="Timezone">
              <select value={timezone} onChange={e => setTimezone(e.target.value)} className={selectCls}>
                <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                <option value="UTC">UTC</option>
              </select>
            </Field>
          </div>
          <SaveBtn onClick={() => save()} />
        </Section>
      )}

      {/* Payment */}
      {tab === 'payment' && (
        <Section title="Payment Methods" desc="Configure accepted payment options">
          <div className="space-y-3">
            {([
              { key: 'upi', label: 'UPI Payments', desc: 'GPay, PhonePe, Paytm etc.' },
              { key: 'cards', label: 'Credit / Debit Cards', desc: 'Visa, Mastercard, Rupay' },
              { key: 'cod', label: 'Cash on Delivery', desc: 'Available for pin codes within 600km' },
              { key: 'wallets', label: 'Mobile Wallets', desc: 'Paytm Wallet, Amazon Pay etc.' },
              { key: 'emi', label: 'EMI', desc: 'No-cost EMI via supported cards' },
            ] as const).map(({ key, label, desc }) => (
              <ToggleRow key={key} label={label} desc={desc} value={methods[key]} onChange={v => setMethods(m => ({ ...m, [key]: v }))} />
            ))}
          </div>
          <SaveBtn onClick={() => save('Payment settings saved!')} />
        </Section>
      )}

      {/* Shipping */}
      {tab === 'shipping' && (
        <Section title="Shipping Configuration" desc="Manage delivery rules and pricing">
          <Field label="Free Shipping Threshold (₹)">
            <TextInput value={freeShipThreshold} onChange={setFreeShipThreshold} type="number" />
            <p className="text-slate-600 text-xs mt-1">Orders above this amount qualify for free shipping</p>
          </Field>
          <Field label="Standard Delivery Estimate">
            <select value={stdDeliveryDays} onChange={e => setStdDeliveryDays(e.target.value)} className={selectCls}>
              <option value="3-5">3–5 business days</option>
              <option value="5-7">5–7 business days</option>
              <option value="7-10">7–10 business days</option>
            </select>
          </Field>
          <div className="p-4 bg-blue-500/5 border border-blue-500/15 rounded-xl">
            <p className="text-blue-300 text-xs font-semibold mb-1">Shipping Partners</p>
            <p className="text-slate-500 text-xs">Integrate with DTDC, BlueDart, Delhivery, or custom partner via webhook. API integration available in the Pro plan.</p>
          </div>
          <SaveBtn onClick={() => save('Shipping settings saved!')} />
        </Section>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <Section title="Email Notifications" desc="Choose which events trigger email alerts">
          <div className="space-y-3">
            {([
              { key: 'newOrder', label: 'New Order', desc: 'Alert when a new order is placed' },
              { key: 'lowStock', label: 'Low Stock Alert', desc: 'When stock drops below 5 units' },
              { key: 'dailySummary', label: 'Daily Summary', desc: 'Receive daily performance digest at 9 AM' },
              { key: 'newReview', label: 'New Review', desc: 'When a customer submits a product review' },
              { key: 'newCustomer', label: 'New Customer', desc: 'When a new account is registered' },
            ] as const).map(({ key, label, desc }) => (
              <ToggleRow key={key} label={label} desc={desc} value={notif[key]} onChange={v => setNotif(n => ({ ...n, [key]: v }))} />
            ))}
          </div>
          <SaveBtn onClick={() => save('Notification preferences saved!')} />
        </Section>
      )}

      {/* Team */}
      {tab === 'team' && (
        <Section title="Team Members" desc="Manage who can access the admin portal">
          <div className="space-y-2">
            {staff.map(m => (
              <div key={m.id} className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold">{m.name}</div>
                  <div className="text-slate-500 text-xs">{m.email}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${m.role === 'Admin' ? 'bg-purple-500/20 text-purple-300' : m.role === 'Manager' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-500/20 text-slate-400'}`}>{m.role}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${m.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>{m.status}</span>
                  {m.role !== 'Admin' && (
                    <button onClick={() => { setStaff(s => s.filter(x => x.id !== m.id)); toast.success('Member removed'); }}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl space-y-3">
            <div className="text-sm font-semibold text-white flex items-center gap-2"><UserPlus size={15} className="text-purple-400" /> Invite Member</div>
            <div className="flex gap-2">
              <input value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} placeholder="colleague@example.com" type="email"
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50" />
              <select value={newMemberRole} onChange={e => setNewMemberRole(e.target.value as StaffMember['role'])} className={`${selectCls} w-32`}>
                <option value="Manager">Manager</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button onClick={() => {
                if (!newMemberEmail) return;
                const initials = newMemberEmail.substring(0, 2).toUpperCase();
                setStaff(s => [...s, { id: Date.now().toString(), name: newMemberEmail.split('@')[0], email: newMemberEmail, role: newMemberRole, avatar: initials, lastLogin: 'Never', status: 'Invited' }]);
                setNewMemberEmail('');
                toast.success('Invite sent!');
              }} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                Invite
              </button>
            </div>
          </div>
        </Section>
      )}

      {/* Security */}
      {tab === 'security' && (
        <div className="space-y-4">
          <Section title="Change Admin Password" desc="Update your access credentials">
            <Field label="Current Password"><TextInput value={currentPw} onChange={setCurrentPw} type="password" placeholder="••••••••" /></Field>
            <Field label="New Password"><TextInput value={newPw} onChange={setNewPw} type="password" placeholder="••••••••" /></Field>
            <Field label="Confirm New Password"><TextInput value={confirmPw} onChange={setConfirmPw} type="password" placeholder="••••••••" /></Field>
            <button onClick={() => {
              if (!newPw || newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
              if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
              toast.success('Password updated successfully!');
              setCurrentPw(''); setNewPw(''); setConfirmPw('');
            }} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              <Shield size={14} /> Update Password
            </button>
          </Section>

          <Section title="Danger Zone" desc="Irreversible admin actions">
            <div className="space-y-3">
              <DangerRow label="Clear All Sessions" desc="Force-logout all active admin sessions" action="Clear Sessions" onClick={() => toast.error('All sessions cleared')} />
              <DangerRow label="Export All Data" desc="Download a full backup of your store data" action="Export Data" onClick={() => toast.success('Export queued!')} />
              <DangerRow label="Reset Demo Data" desc="⚠️ Clear all orders, customers, and products" action="Reset Store" onClick={() => toast.error('Action disabled in demo mode')} danger />
            </div>
          </Section>
        </div>
      )}

      {/* Appearance */}
      {tab === 'appearance' && (
        <Section title="Store Appearance" desc="Customize colors and branding settings">
          <Field label="Admin Accent Color">
            <div className="flex items-center gap-3">
              <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)}
                className="w-12 h-10 rounded-lg cursor-pointer border border-white/10 bg-transparent" />
              <TextInput value={accentColor} onChange={setAccentColor} />
            </div>
            <p className="text-slate-600 text-xs mt-1">Current accent color used throughout the admin portal</p>
          </Field>
          <Field label="Brand Logo URL">
            <TextInput value="/logo.png" onChange={() => {}} placeholder="/images/logo.png" />
            <p className="text-slate-600 text-xs mt-1">Used in emails and invoices</p>
          </Field>
          <div className="p-4 bg-purple-500/5 border border-purple-500/15 rounded-xl">
            <p className="text-purple-300 text-xs font-semibold mb-1">Live Preview</p>
            <div className="flex gap-2 mt-2">
              <div className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-lg" style={{ backgroundColor: accentColor }}>
                Primary Button
              </div>
              <div className="px-4 py-2 rounded-xl text-xs font-bold border" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                Outline Button
              </div>
            </div>
          </div>
          <SaveBtn onClick={() => save('Appearance settings saved!')} />
        </Section>
      )}
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

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
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, type = 'text', placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors" />
  );
}

const selectCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors";

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
      <div>
        <div className="text-white text-sm font-medium">{label}</div>
        <div className="text-slate-500 text-xs">{desc}</div>
      </div>
      <button onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-purple-600' : 'bg-white/10'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function SaveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors mt-2">
      <Save size={14} /> Save Changes
    </button>
  );
}

function DangerRow({ label, desc, action, onClick, danger = false }: { label: string; desc: string; action: string; onClick: () => void; danger?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0`}>
      <div>
        <div className={`text-sm font-semibold ${danger ? 'text-red-400' : 'text-white'}`}>{label}</div>
        <div className="text-slate-500 text-xs">{desc}</div>
      </div>
      <button onClick={onClick} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${danger ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
        {action}
      </button>
    </div>
  );
}
