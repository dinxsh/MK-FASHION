'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { getStoreProduct, StoreProduct } from '@/lib/storeApi';
import { useWhatsAppNumber } from '@/components/WhatsAppLink';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const phoneNumber = useWhatsAppNumber();
  const [loading, setLoading] = useState(true);

  useEffect(() => { getStoreProduct(slug).then(setProduct).catch(() => setProduct(null)).finally(() => setLoading(false)); }, [slug]);
  if (loading) return <div className="py-24 text-center text-gray-500">Loading product...</div>;
  if (!product) return <div className="py-24 text-center"><p className="font-serif text-3xl text-gray-900">Product not found</p><Link href="/" className="mt-5 inline-block text-brand-burgundy underline">Back to shop</Link></div>;

  const whatsappUrl = getWhatsAppOrderUrl(product, phoneNumber);
  const inStock = (product.inventoryItem?.availableQty || 0) > 0;

  return <main className="mx-auto grid max-w-6xl gap-10 px-8 py-16 md:grid-cols-2"><div className="aspect-[3/4] overflow-hidden bg-stone-100"><img src={product.images[0]?.url || '/images/hero_banner_1773723337466.png'} alt={product.name} className="h-full w-full object-cover" /></div><div className="flex flex-col justify-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-burgundy">{product.category?.name || 'MK Fashion'}</p><h1 className="mt-3 font-serif text-4xl text-gray-900">{product.name}</h1><p className="mt-5 text-2xl font-semibold text-gray-800">₹{Number(product.price).toLocaleString('en-IN')}</p><p className="mt-6 leading-relaxed text-gray-600">{product.description || 'A beautiful piece, selected by MK Fashion.'}</p><p className="mt-6 text-sm text-gray-500">{inStock ? `${product.inventoryItem?.availableQty} available` : 'Currently out of stock'}</p>{inStock && whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-[#1fbd59]"><MessageCircle size={19} /> Order on WhatsApp</a> : !inStock ? <p className="mt-8 text-sm font-semibold text-red-600">This product is currently unavailable.</p> : <p className="mt-8 text-sm text-gray-500">WhatsApp ordering is being configured.</p>}<Link href="/" className="mt-5 inline-block text-sm font-bold tracking-wide text-brand-burgundy underline">Continue shopping</Link></div></main>;
}
