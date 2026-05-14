"use client";
import { useEffect, useState } from 'react';
import AutoCarousel from '@/components/AutoCarousel';
import { API_BASE_URL } from '@/lib/api';
import type { Product } from '@/lib/types/admin';

export default function KurtasPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [filter, setFilter] = useState("View All");

  useEffect(() => {
    fetch(`${API_BASE_URL}/storefront/products`)
      .then((response) => response.json())
      .then((items: Product[]) => setProducts(items.filter((item) => item.category === 'kurtas')))
      .catch(() => setProducts([]));
  }, []);

  const getKurtaType = (product: Product) => {
    const haystack = `${product.name} ${product.shortDesc ?? ''}`.toLowerCase();
    if (haystack.includes('anarkali')) return 'Anarkalis';
    if (haystack.includes('sharara')) return 'Sharara Sets';
    return 'Straight Cut';
  };

  const filteredProducts = filter === "View All" 
    ? products 
    : products.filter((product) => getKurtaType(product) === filter);

  return (
    <div className="w-full">
      {/* Category Header */}
      <section className="bg-brand-cream/30 pt-32 pb-16 px-8 text-center border-b border-brand-burgundy/10">
         <h1 className="font-serif text-5xl md:text-6xl mb-6 text-gray-900">Festive Kurtas</h1>
         <p className="max-w-2xl mx-auto text-lg text-gray-600">Discover our collection of deeply rooted yet modern silhouettes. From regal Anarkalis to elegant straight cut Kurtas designed for everyday celebrations.</p>
         <div className="mt-12 flex flex-wrap justify-center gap-4">
            {["Anarkalis", "Straight Cut", "Sharara Sets", "View All"].map(cat => (
               <span 
                 key={cat}
                 onClick={() => setFilter(cat)}
                 className={`px-6 py-2 border border-brand-burgundy/30 rounded-full text-sm font-medium cursor-pointer transition-colors ${filter === cat ? 'bg-brand-burgundy text-white' : 'text-brand-burgundy hover:bg-brand-burgundy hover:text-white'}`}
               >
                 {cat}
               </span>
            ))}
         </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
         <div className="mb-6 text-sm text-gray-500 font-medium">{filteredProducts.length} Products</div>
         {filteredProducts.length === 0 ? (
           <div className="text-center py-20 text-gray-500">No products found in this category.</div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
               {filteredProducts.map((item, idx) => {
                 const slug = item.slug ?? item.name.toLowerCase().replace(/\s+/g, '-');
                 return (
                 <a href={`/product/${slug}`} key={idx} className="group cursor-pointer flex flex-col items-center text-center block">
                   <div className="aspect-[3/4] bg-slate-100 w-full mb-6 overflow-hidden relative rounded-sm shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                        <AutoCarousel 
                          images={[item.image, "/images/hero_banner_1773723337466.png", "/images/emerald_dress_1773723403267.png"]}
                          imgClassName="transition-transform duration-700 group-hover:scale-105"
                        />

                   </div>
                   <h4 className="font-serif text-xl mb-1 text-gray-900 group-hover:text-brand-gold transition-colors">{item.name}</h4>
                   <div className="flex items-center justify-center gap-1 mb-2">
                     <div className="flex text-brand-gold text-xs">★★★★★</div>
                     <span className="text-xs text-gray-400">({((idx * 17) % 80) + 12})</span>
                   </div>
                   <p className="font-medium text-gray-500">₹{item.price.toLocaleString('en-IN')}</p>
                   <div className="flex gap-2 mt-4">
                      <div className="w-3 h-3 rounded-full bg-brand-burgundy ring-1 ring-offset-2 ring-brand-burgundy cursor-pointer"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-800 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-800 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"></div>
                   </div>
                 </a>
               );
               })}
           </div>
         )}
      </section>
    </div>
  );
}
