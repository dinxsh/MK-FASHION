'use client';
import { Inter } from 'next/font/google';
import '../globals.css';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { Toaster } from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentAdmin, isAuthenticated } from '@/lib/adminAuth';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    let isMounted = true;

    if (isLoginPage) {
      setIsReady(true);
      return () => {
        isMounted = false;
      };
    }

    if (!isAuthenticated()) {
      router.push('/admin/login');
      return () => {
        isMounted = false;
      };
    }

    getCurrentAdmin().then((admin) => {
      if (!isMounted) return;

      if (!admin) {
        router.push('/admin/login');
        return;
      }

      setIsReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, [pathname, router, isLoginPage]);

  if (!isReady && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#050108] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-[#050108] text-white flex h-screen overflow-hidden">
        {!isLoginPage && <AdminSidebar />}
        <div className="flex flex-col flex-1 overflow-hidden">
          {!isLoginPage && <AdminTopbar />}
          <main className={`flex-1 overflow-y-auto ${isLoginPage ? '' : 'p-6 md:p-8'}`}>
            {children}
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a0a2e', color: '#f9fafb', border: '1px solid rgba(124,58,237,0.3)' },
            success: { iconTheme: { primary: '#10b981', secondary: '#050108' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#050108' } },
          }}
        />
      </body>
    </html>
  );
}
