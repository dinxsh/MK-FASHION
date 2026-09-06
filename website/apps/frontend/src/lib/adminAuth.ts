'use client';

import { getApiBaseUrl } from './apiBaseUrl';

const STORAGE_KEY = 'mk_admin_access_token';

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  lastLoginAt: string | null;
};

type LoginResponse = {
  accessToken: string;
  user: AdminUser;
};

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredToken());
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const response = await fetch(`${getApiBaseUrl()}/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json().catch(() => null)) as
    | LoginResponse
    | { message?: string }
    | null;

  if (!response.ok || !data || !('accessToken' in data)) {
    throw new Error(
      (data && 'message' in data && data.message) || 'Unable to sign in',
    );
  }

  localStorage.setItem(STORAGE_KEY, data.accessToken);
  return data.user;
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const token = getStoredToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/admin/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem(STORAGE_KEY);
      }
      return null;
    }

    return (await response.json()) as AdminUser;
  } catch {
    // A temporary API outage must not crash the page or erase the session.
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}
