'use client';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Bell, ChevronRight, LogOut, Settings, User, Menu } from 'lucide-react';
import { logout } from '@/lib/adminAuth';
import { useState, useRef, useEffect } from 'react';

const crumbMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/analytics': 'Analytics',
  '/admin/promotions': 'Promotions',
  '/admin/content': 'Content',
  '/admin/reviews': 'Reviews',
  '/admin/settings': 'Settings',
  '/admin/categories': 'Categories',
};

const mockNotifications = [
  { id: '1', title: 'New Order #4021', desc: 'Anjali Mehta placed an order for ₹22,300', time: '2m ago', unread: true, color: 'bg-purple-500' },
  { id: '2', title: 'Low Stock Alert', desc: 'Emerald Bridal Lehenga — only 3 left', time: '18m ago', unread: true, color: 'bg-amber-500' },
  { id: '3', title: 'New Review', desc: 'Priya Sharma left a 4★ review', time: '1h ago', unread: false, color: 'bg-blue-500' },
  { id: '4', title: 'Order Delivered', desc: '#4018 marked as delivered successfully', time: '3h ago', unread: false, color: 'bg-emerald-500' },
];

export default function AdminTopbar({ menuOpen, onMenuToggle }: { menuOpen: boolean; onMenuToggle: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: crumbMap[`/${segments.slice(0, i + 1).join('/')}`] || (seg.charAt(0).toUpperCase() + seg.slice(1)),
    href: `/${segments.slice(0, i + 1).join('/')}`,
  }));

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState(mockNotifications);
  const notifsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifs.filter(n => n.unread).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, unread: false })));

  return (
    <header className="h-14 bg-[#0a0118]/90 border-b border-white/[0.05] backdrop-blur-sm flex items-center justify-between gap-2 px-3 sm:px-5 shrink-0 relative z-30">
      <button id="admin-menu-toggle" type="button" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="admin-sidebar" onClick={onMenuToggle} className="md:hidden shrink-0 flex items-center justify-center w-11 h-11 rounded-xl text-white hover:bg-white/10"><Menu size={22} /></button>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-slate-500 overflow-hidden">
        {crumbs.map((c, i) => (
          <span key={c.href} className={`${i < crumbs.length - 1 ? 'hidden sm:flex' : 'flex min-w-0'} items-center gap-1.5 [&>span]:truncate`}>
            {i > 0 && <ChevronRight size={12} className="text-slate-700" />}
            <span className={i === crumbs.length - 1 ? 'text-white font-semibold' : 'hover:text-slate-300 cursor-pointer transition-colors'}
              onClick={() => i < crumbs.length - 1 && router.push(c.href)}>
              {c.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/15 rounded-full px-2.5 py-1">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-[10px] font-semibold">LIVE</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifsRef}>
          <button onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            className="relative w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.05] transition-colors">
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-purple-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="fixed left-3 right-3 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-10 sm:w-80 bg-[#0f0520] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                <span className="text-white font-semibold text-sm">Notifications</span>
                <button onClick={markAllRead} className="text-purple-400 text-[10px] hover:text-purple-300 font-semibold">Mark all read</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs.map(n => (
                  <div key={n.id} onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                    className={`flex gap-3 px-4 py-3 border-b border-white/[0.04] cursor-pointer transition-colors hover:bg-white/[0.03] ${n.unread ? 'bg-purple-600/5' : ''}`}>
                    <div className={`w-2 h-2 ${n.color} rounded-full shrink-0 mt-1.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-semibold">{n.title}</div>
                      <div className="text-slate-500 text-[10px] leading-relaxed">{n.desc}</div>
                      <div className="text-slate-600 text-[10px] mt-0.5">{n.time}</div>
                    </div>
                    {n.unread && <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center">
                <span className="text-purple-400 text-xs font-semibold hover:underline cursor-pointer">View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/[0.05] transition-colors">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-purple-500/20">
              A
            </div>
            <div className="hidden md:block text-left">
              <div className="text-white text-xs font-semibold leading-tight">Admin</div>
              <div className="text-slate-600 text-[9px]">Super Admin</div>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-10 w-52 bg-[#0f0520] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/[0.07]">
                <div className="text-white font-semibold text-sm">Admin User</div>
                <div className="text-slate-500 text-xs">admin@mkfashion.in</div>
              </div>
              <div className="py-1">
                <button onClick={() => { router.push('/admin/settings'); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors text-xs font-medium">
                  <Settings size={13} /> Settings
                </button>
                <button onClick={() => { logout(); router.push('/admin/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium">
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
