'use client';

import { useEffect, useState } from 'react';

export async function loadWhatsAppNumber(): Promise<string> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';
  const response = await fetch(`${base}/store/whatsapp`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Could not load WhatsApp settings');
  const data = await response.json();
  return data.number ?? (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');
}

export function useWhatsAppNumber() {
  const [number, setNumber] = useState('');
  useEffect(() => {
    let active = true;
    const refresh = () => { loadWhatsAppNumber().then(value => { if (active) setNumber(value); }).catch(() => {}); };
    refresh();
    const timer = window.setInterval(refresh, 15000);
    window.addEventListener('focus', refresh);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  return number;
}

export default function WhatsAppLink({ children, message, ...props }: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { message?: string }) {
  const number = useWhatsAppNumber();
  if (!number) return null;
  return <a {...props} href={`https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`} target="_blank" rel="noopener noreferrer">{children}</a>;
}
