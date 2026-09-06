import type { StoreProduct } from './storeApi';


export function getWhatsAppOrderUrl(product: StoreProduct, phoneNumber: string) {
  if (!phoneNumber) return null;

  const message = [
    'Hello MK Fashion, I would like to order:',
    `Product: ${product.name}`,
    `Price: INR ${Number(product.price).toLocaleString('en-IN')}`,
    `Product link: ${typeof window === 'undefined' ? '' : window.location.href}`,
  ].join('\n');

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
