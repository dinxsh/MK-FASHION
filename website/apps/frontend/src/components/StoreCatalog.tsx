'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoreProducts, matchesCategory, StoreProduct } from '@/lib/storeApi';

export default function StoreCatalog({ title, category }: { title: string; category?: string }) {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoreProducts().then((items) => setProducts(category ? items.filter((item) => matchesCategory(item, category)) : items)).finally(() => setLoading(false));
  }, [category]);

  return (
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-10"><div><p className="text-brand-burgundy text-xs tracking-[0.2em] font-bold uppercase">MK Fashion</p><h2 className="font-serif text-4xl mt-2 text-gray-900">{title}</h2></div><span className="text-sm text-gray-500">{products.length} products</span></div>
      {loading ? <div className="py-16 text-center text-gray-500">Loading products...</div> : products.length === 0 ? <div className="py-16 text-center text-gray-500">No products available yet.</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {products.map((product) => <Link href={`/product/${product.slug}`} key={product.id} className="group block"><div className="aspect-[3/4] overflow-hidden bg-stone-100"><img src={product.images[0]?.url || '/images/hero_banner_1773723337466.png'} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div><div className="pt-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-burgundy">{product.category?.name || 'MK Fashion'}</p><h3 className="font-serif text-xl leading-tight mt-1 text-gray-900">{product.name}</h3><p className="mt-2 font-semibold text-gray-700">₹{Number(product.price).toLocaleString('en-IN')}</p></div></Link>)}
        </div>
      )}
    </section>
  );
}
