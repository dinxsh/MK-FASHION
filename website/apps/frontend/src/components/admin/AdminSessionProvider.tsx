'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Viewer';
  avatar: string;
  status: 'Active' | 'Invited';
};

type AdminSessionContextValue = {
  session: AdminSession | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  const refreshSession = async () => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const current = await apiFetch<AdminSession>('/auth/me');
      setSession(current);
    } catch (error) {
      setSession(null);
      if (error instanceof ApiError && error.status === 401) {
        router.replace('/admin/login');
        return;
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      setSession(null);
      router.replace('/admin/login');
    }
  };

  useEffect(() => {
    refreshSession().catch(() => {
      setIsLoading(false);
    });
  }, [pathname]);

  const value = useMemo(
    () => ({ session, isLoading, refreshSession, signOut }),
    [session, isLoading],
  );

  return (
    <AdminSessionContext.Provider value={value}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);
  if (!context) {
    throw new Error('useAdminSession must be used inside AdminSessionProvider');
  }
  return context;
}
