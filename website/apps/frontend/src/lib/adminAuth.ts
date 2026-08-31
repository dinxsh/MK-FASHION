'use client';

const STORAGE_KEY = 'mk_admin_access_token';
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

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
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
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

  const response = await fetch(`${API_BASE_URL}/admin/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return (await response.json()) as AdminUser;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}
