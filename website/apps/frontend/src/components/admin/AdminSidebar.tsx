'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Users, Package, BarChart3,
  Tag, Image, Star, Settings, LogOut, ChevronLeft, ChevronRight,
  ListOrdered, Layers, Store, ExternalLink, X
} from 'lucide-react';
import { logout } from '@/lib/adminAuth';
import { useEffect, useState, useRef } from 'react';
import { getAdminProducts, getAdminOrders, getAdminReviews } from '@/lib/adminApi';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    ]
  },
  {
    label: 'Catalog',
    items: [
      { href: '/admin/products', icon: Package, label: 'Products', badge: null },
      { href: '/admin/categories', icon: Layers, label: 'Categories', badge: null },
    ]
  },
  {
    label: 'Sales',
    items: [
      { href: '/admin/orders', icon: ListOrdered, label: 'Orders', badge: null },
      { href: '/admin/customers', icon: Users, label: 'Customers', badge: null },
      { href: '/admin/promotions', icon: Tag, label: 'Promotions', badge: null },
    ]
  },
  {
    label: 'Insights',
    items: [
      { href: '/admin/analytics', icon: BarChart3, label: 'Analytics', badge: null },
      { href: '/admin/reviews', icon: Star, label: 'Reviews', badge: null },
    ]
  },
  {
    label: 'Admin',
    items: [
      { href: '/admin/content', icon: Image, label: 'Content', badge: null },
      { href: '/admin/settings', icon: Settings, label: 'Settings', badge: null },
    ]
  },
];

export default function AdminSidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const sidebarRef = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!mobileOpen) return;
    const panel = sidebarRef.current;
    const previous = document.activeElement as HTMLElement | null;
    panel?.querySelector<HTMLButtonElement>('button')?.focus();
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab') return;
      const items = Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button') || []).filter(item => item.getClientRects().length > 0);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handler);
    return () => { document.removeEventListener('keydown', handler); previous?.focus(); };
  }, [mobileOpen]);
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const reset = () => { if (media.matches) setCollapsed(false); else closeRef.current(); };
    reset();
    media.addEventListener('change', reset);
    return () => media.removeEventListener('change', reset);
  }, []);
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    let active = true;
    let pending = false;
    const updateCount = async () => {
      if (pending) return;
      pending = true;
      const results = await Promise.allSettled([getAdminProducts(), getAdminOrders(), getAdminReviews()]);
      if (active) {
        const paths = ['/admin/products', '/admin/orders', '/admin/reviews'];
        setCounts(Object.fromEntries(results.map((result, index) => [paths[index], result.status === 'fulfilled' ? result.value.length : null])));
      }
      pending = false;
    };
    updateCount();
    window.addEventListener('admin-products-changed', updateCount);
    window.addEventListener('admin-reviews-changed', updateCount);
    window.addEventListener('focus', updateCount);
    const timer = window.setInterval(updateCount, 15000);
    return () => {
      active = false;
      window.removeEventListener('admin-products-changed', updateCount);
      window.removeEventListener('admin-reviews-changed', updateCount);
      window.removeEventListener('focus', updateCount);
      window.clearInterval(timer);
    };
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <>
    {mobileOpen && <div onClick={onClose} className="fixed inset-0 z-40 bg-black/60 md:hidden" aria-hidden="true" />}
    <aside
      id="admin-sidebar" ref={sidebarRef} aria-label="Admin navigation"
      className={`${mobileOpen ? 'flex' : 'hidden'} md:flex fixed md:relative inset-y-0 left-0 z-50 w-[min(18rem,85vw)] ${collapsed ? 'md:w-[72px]' : 'md:w-60'} transition-all duration-300 bg-[#0a0118] flex-col h-dvh shrink-0 border-r border-white/[0.06]`}
    >
      <button type="button" onClick={onClose} aria-label="Close navigation" className="md:hidden self-end w-11 h-11 flex items-center justify-center text-white"><X size={22} /></button>
      {/* Logo */}
      <div className={`p-4 border-b border-white/[0.06] flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shrink-0 text-white font-black text-sm shadow-lg shadow-purple-500/20">
          MK
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-sm leading-tight tracking-wide">MK FASHION</div>
            <div className="text-purple-400/80 text-[9px] font-semibold tracking-[0.2em] uppercase">Admin Portal</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav onClick={(event) => { if ((event.target as HTMLElement).closest('a')) onClose(); }} className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <div className="px-3 pb-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em]">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label, badge: defaultBadge }) => {
                const badge = counts[href]?.toString() ?? defaultBadge;
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative
                      ${active
                        ? 'bg-gradient-to-r from-purple-600/25 to-purple-600/10 text-purple-300'
                        : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-purple-400 rounded-r-full" />
                    )}
                    <Icon size={16} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="text-[13px] font-medium flex-1">{label}</span>
                        {badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-slate-400'}`}>
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && (
                      <span className="absolute left-full ml-3 bg-[#1a0a2e] text-white text-xs px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10 transition-opacity">
                        {label}
                        {badge && <span className="ml-1.5 text-purple-400">({badge})</span>}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-white/[0.06] space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/[0.04] hover:text-slate-200 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <Store size={15} className="shrink-0" />
          {!collapsed && <><span className="text-[13px] font-medium flex-1">View Store</span><ExternalLink size={12} className="text-slate-600" /></>}
        </a>
        <Link
          href="/"
          onClick={() => logout()}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={15} className="shrink-0" />
          {!collapsed && <span className="text-[13px] font-medium">Sign Out</span>}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden md:flex absolute -right-3 top-[72px] w-6 h-6 bg-[#1a0a2e] border border-white/10 rounded-full items-center justify-center text-slate-400 shadow-lg hover:bg-purple-600 hover:text-white transition-all z-20"
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </aside>
    </>
  );
}
