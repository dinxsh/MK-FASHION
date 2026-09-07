'use client';

import { useEffect, useState } from 'react';
import { sanityClient } from '@/lib/sanity';

export async function loadWhatsAppNumber(): Promise<string> {
  if (!sanityClient) return '';
  const number = await sanityClient.fetch<string | null>(
    '*[_type == "storeSettings" && !(_id in path("drafts.**"))][0].whatsappNumber',
    {}, { cache: 'no-store' },
  );
  return (number || '').replace(/\D/g, '');
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
