"use client";
import React, { useEffect, useState } from 'react';
import AutoCarousel from '@/components/AutoCarousel';
import { API_BASE_URL } from '@/lib/api';
import type { Product } from '@/lib/types/admin';

export default function AccessoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [categoryFilter, setCategoryFilter] = useState("All Accessories");
  const [priceFilter, setPriceFilter] = useState("All");

  useEffect(() => {
    fetch(`${API_BASE_URL}/storefront/products`)
      .then((response) => response.json())
      .then((items: Product[]) => setProducts(items.filter((item) => item.category === 'accessories')))
      .catch(() => setProducts([]));
  }, []);

  const getAccessoryType = (product: Product) => {
    const haystack = `${product.name} ${product.shortDesc ?? ''}`.toLowerCase();
    if (haystack.includes('earring')) return 'Earrings';
    if (haystack.includes('potli') || haystack.includes('bag')) return 'Potlis & Bags';
    if (haystack.includes('tikka')) return 'Hair Accessories';
    return 'Jewelry Sets';
  };

  const filteredProducts = products.filter((p) => {
     let catMatch = categoryFilter === "All Accessories" || getAccessoryType(p) === categoryFilter;
     let priceMatch = true;
     if (priceFilter === "Under ₹5,000") priceMatch = p.price < 5000;
     else if (priceFilter === "₹5,000 - ₹10,000") priceMatch = p.price >= 5000 && p.price <= 10000;
     else if (priceFilter === "Over ₹10,000") priceMatch = p.price > 10000;
     return catMatch && priceMatch;
  });

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[50vh] w-full flex items-center justify-center bg-brand-burgundy text-white">
         <div className="absolute inset-0 opacity-20 bg-[url('/images/hero_banner_1773723337466.png')] bg-cover bg-center mix-blend-overlay"></div>
         <div className="relative z-10 text-center px-4">
             <p className="text-sm tracking-[0.4em] font-medium mb-4 text-brand-gold">FINISHING TOUCHES</p>
             <h1 className="font-serif text-5xl md:text-6xl font-medium">Accessories & Jewelry</h1>
         </div>
      </section>

      {/* Accessories Grid Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             {/* Sidebar filters */}
             <div className="md:col-span-1 border-r border-gray-200 pr-8 hidden md:block">
                 <h3 className="font-bold tracking-widest text-sm mb-6 border-b border-gray-200 pb-2">CATEGORIES</h3>
                 <ul className="space-y-4 text-sm font-medium text-gray-600">
                     {["All Accessories", "Jewelry Sets", "Earrings", "Potlis & Bags", "Hair Accessories"].map(cat => (
                        <li 
                          key={cat} 
                          onClick={() => setCategoryFilter(cat)}
                          className={`cursor-pointer flex justify-between transition-colors ${categoryFilter === cat ? 'text-brand-burgundy font-bold' : 'hover:text-brand-burgundy'}`}
                        >
                          <span>{cat}</span>
                        </li>
                     ))}
                 </ul>
                 
                 <h3 className="font-bold tracking-widest text-sm mt-12 mb-6 border-b border-gray-200 pb-2">PRICE</h3>
                 <ul className="space-y-4 text-sm font-medium text-gray-600">
                     {["All", "Under ₹5,000", "₹5,000 - ₹10,000", "Over ₹10,000"].map(priceRange => (
                       <li 
                         key={priceRange}
                         onClick={() => setPriceFilter(priceRange)}
                         className={`cursor-pointer transition-colors ${priceFilter === priceRange ? 'text-brand-burgundy font-bold' : 'hover:text-brand-burgundy'}`}
                       >
                         {priceRange}
                       </li>
                     ))}
                 </ul>
                 
                 <div className="mt-8">
                    <button 
                      onClick={() => { setCategoryFilter("All Accessories"); setPriceFilter("All"); }}
                      className="text-xs text-brand-burgundy underline tracking-wider"
                    >
                      CLEAR ALL FILTERS
                    </button>
                 </div>
             </div>

             {/* Products */}
             <div className="md:col-span-3">
                 <div className="mb-6 text-sm text-gray-500 font-medium border-b border-gray-100 pb-4">{filteredProducts.length} Products</div>
                 {filteredProducts.length === 0 ? (
                   <div className="py-20 text-center text-gray-500">No accessories match the selected filters.</div>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                       {filteredProducts.map((item, idx) => {
                         const slug = item.slug ?? item.name.toLowerCase().replace(/\s+/g, '-');
                         return (
                         <a href={`/product/${slug}`} key={idx} className="group cursor-pointer block">
                           <div className="aspect-square bg-slate-50 border border-brand-burgundy/5 w-full mb-4 overflow-hidden relative flex items-center justify-center p-4">
                              <AutoCarousel 
                                images={[item.image, "/images/emerald_dress_1773723403267.png", "/images/blue_dress_1773723443478.png"]}
                                imgClassName="rounded shadow-sm transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-400 hover:text-brand-burgundy transition-colors">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                              </div>
                           </div>
                           <div>
                              <p className="text-xs tracking-widest text-brand-gold mb-1">{getAccessoryType(item)}</p>
                              <h4 className="font-serif text-lg text-gray-900 group-hover:text-brand-burgundy transition-colors line-clamp-1 mb-1">{item.name}</h4>
                              <div className="flex items-center gap-1 mb-1">
                                <div className="flex text-brand-gold text-xs">★★★★★</div>
                                <span className="text-xs text-gray-400">({((idx * 17) % 80) + 12})</span>
                              </div>
                              <p className="font-semibold text-gray-700 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                           </div>
                         </a>
                       );
                       })}
                   </div>
                 )}
             </div>
         </div>
      </section>
    </div>
  );
}
