'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronRight, LogOut, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAdminSession } from './AdminSessionProvider';

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
  { id: '1', title: 'New Order #4021', desc: 'Anjali Mehta placed an order for Rs 22,300', time: '2m ago', unread: true, color: 'bg-purple-500' },
  { id: '2', title: 'Low Stock Alert', desc: 'Emerald Bridal Lehenga only has 3 left', time: '18m ago', unread: true, color: 'bg-amber-500' },
  { id: '3', title: 'New Review', desc: 'Priya Sharma left a 4-star review', time: '1h ago', unread: false, color: 'bg-blue-500' },
];

export default function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, signOut } = useAdminSession();
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
  const unreadCount = notifs.filter((n) => n.unread).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-14 bg-[#0a0118]/90 border-b border-white/[0.05] backdrop-blur-sm flex items-center justify-between px-5 shrink-0">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} className="text-slate-700" />}
            <span
              className={i === crumbs.length - 1 ? 'text-white font-semibold' : 'hover:text-slate-300 cursor-pointer transition-colors'}
              onClick={() => i < crumbs.length - 1 && router.push(c.href)}
            >
              {c.label}
            </span>
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/15 rounded-full px-2.5 py-1">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-[10px] font-semibold">LIVE</span>
        </div>

        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => {
              setShowNotifs(!showNotifs);
              setShowProfile(false);
            }}
            className="relative w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-purple-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-[#0f0520] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                <span className="text-white font-semibold text-sm">Notifications</span>
                <button
                  onClick={() => setNotifs((items) => items.map((item) => ({ ...item, unread: false })))}
                  className="text-purple-400 text-[10px] hover:text-purple-300 font-semibold"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setNotifs((items) => items.map((item) => item.id === n.id ? { ...item, unread: false } : item))}
                    className={`flex gap-3 px-4 py-3 border-b border-white/[0.04] cursor-pointer transition-colors hover:bg-white/[0.03] ${n.unread ? 'bg-purple-600/5' : ''}`}
                  >
                    <div className={`w-2 h-2 ${n.color} rounded-full shrink-0 mt-1.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-semibold">{n.title}</div>
                      <div className="text-slate-500 text-[10px] leading-relaxed">{n.desc}</div>
                      <div className="text-slate-600 text-[10px] mt-0.5">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifs(false);
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/[0.05] transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-purple-500/20">
              {session?.avatar || 'A'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-white text-xs font-semibold leading-tight">{session?.name || 'Admin'}</div>
              <div className="text-slate-600 text-[9px]">{session?.role || 'Admin'}</div>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-10 w-52 bg-[#0f0520] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/[0.07]">
                <div className="text-white font-semibold text-sm">{session?.name || 'Admin User'}</div>
                <div className="text-slate-500 text-xs">{session?.email || 'admin@mkfashion.in'}</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    router.push('/admin/settings');
                    setShowProfile(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors text-xs font-medium"
                >
                  <Settings size={13} /> Settings
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium"
                >
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
