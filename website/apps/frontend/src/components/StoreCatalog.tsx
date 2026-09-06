'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoreProducts, matchesCategory, StoreProduct } from '@/lib/storeApi';

export default function StoreCatalog({ title, category, showCategories = false }: { title: string; category?: string; showCategories?: boolean }) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    let pending = false;
    const refresh = async () => {
      if (pending) return;
      pending = true;
      try {
        const items = await getStoreProducts();
        if (active) {
          setProducts(category ? items.filter((item) => matchesCategory(item, category)) : items);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      } finally {
        pending = false;
        if (active) setLoading(false);
      }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15000);
    window.addEventListener('focus', refresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, [category]);

  const collections = ['Sarees', 'Lehengas', 'Kurtas', 'Accessories'].flatMap((name) => {
    const product = products.find((item) => matchesCategory(item, name) && item.images[0]?.url);
    return product ? [{ name, href: `/${name.toLowerCase()}`, image: product.images[0].url }] : [];
  });

  return (
    <>
    {showCategories && collections.length > 0 && <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-8 py-16">
      {collections.map((collection) => <Link key={collection.href} href={collection.href} className="group">
        <div className="aspect-[3/4] overflow-hidden bg-stone-100"><img src={collection.image} alt={collection.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
        <h2 className="mt-4 font-serif text-2xl text-gray-900">{collection.name}</h2><p className="mt-1 text-sm text-gray-500">Explore the collection</p>
      </Link>)}
    </section>}
    <section className="py-20 px-8 max-w-7xl mx-auto">
      {error && <p role="status" className="mb-4 text-sm text-red-700">Unable to refresh products. Retrying automatically.</p>}
      <div className="flex items-end justify-between gap-4 mb-10"><div><p className="text-brand-burgundy text-xs tracking-[0.2em] font-bold uppercase">MK Fashion</p><h2 className="font-serif text-4xl mt-2 text-gray-900">{title}</h2></div><span className="text-sm text-gray-500">{products.length} products</span></div>
      {loading ? <div className="py-16 text-center text-gray-500">Loading products...</div> : products.length === 0 ? <div className="py-16 text-center text-gray-500">No products available yet.</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {products.map((product) => <Link href={`/product/${product.slug}`} key={product.id} className="group block"><div className="aspect-[3/4] overflow-hidden bg-stone-100"><img src={product.images[0]?.url || '/images/hero_banner_1773723337466.png'} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div><div className="pt-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-burgundy">{product.category?.name || 'MK Fashion'}</p><h3 className="font-serif text-xl leading-tight mt-1 text-gray-900">{product.name}</h3><p className="mt-2 font-semibold text-gray-700">₹{Number(product.price).toLocaleString('en-IN')}</p></div></Link>)}
        </div>
      )}
    </section>
    </>
  );
}
