import type { StoreProduct } from './storeApi';

const phoneNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');

export function getWhatsAppOrderUrl(product: StoreProduct) {
  if (!phoneNumber) return null;

  const message = [
    'Hello MK Fashion, I would like to order:',
    `Product: ${product.name}`,
    `Price: INR ${Number(product.price).toLocaleString('en-IN')}`,
    `Product link: ${typeof window === 'undefined' ? '' : window.location.href}`,
  ].join('\n');

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
