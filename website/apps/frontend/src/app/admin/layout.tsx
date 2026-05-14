'use client';
import '../globals.css';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { AdminSessionProvider, useAdminSession } from '@/components/admin/AdminSessionProvider';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSessionProvider>
      <AdminChrome>{children}</AdminChrome>
    </AdminSessionProvider>
  );
}

function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading } = useAdminSession();
  const isLoginPage = pathname === '/admin/login';

  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#050108] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="font-sans bg-[#050108] text-white flex h-screen overflow-hidden">
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
    </div>
  );
}
