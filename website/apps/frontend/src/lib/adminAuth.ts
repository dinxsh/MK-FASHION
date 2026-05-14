'use client';

import { apiFetch } from './api';

export async function login(email: string, password: string) {
  return apiFetch<{ user: { id: string; email: string; name: string; role: 'Admin' | 'Manager' | 'Viewer' } }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );
}

export async function logout() {
  return apiFetch('/auth/logout', { method: 'POST' });
}

export async function getCurrentSession() {
  return apiFetch<{ id: string; email: string; name: string; role: 'Admin' | 'Manager' | 'Viewer' }>(
    '/auth/me',
  );
}
