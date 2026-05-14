"use client";
import { useEffect, useState } from 'react';
import AutoCarousel from '@/components/AutoCarousel';
import { API_BASE_URL } from '@/lib/api';
import type { Product } from '@/lib/types/admin';

export default function LehengasPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [sort, setSort] = useState("default");
  const [filterType, setFilterType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/storefront/products`)
      .then((response) => response.json())
      .then((items: Product[]) => setProducts(items.filter((item) => item.category === 'lehengas')))
      .catch(() => setProducts([]));
  }, []);

  const getStyle = (product: Product) => {
    const haystack = `${product.name} ${product.shortDesc ?? ''}`.toLowerCase();
    if (haystack.includes('bridal') || product.price >= 50000) return 'Bridal';
    if (haystack.includes('reception') || haystack.includes('evening')) return 'Reception';
    return 'Festive';
  };

  let displayedProducts = [...products];

  if (filterType !== "All") {
     displayedProducts = displayedProducts.filter((p) => getStyle(p) === filterType);
  }

  if (sort === "price-low") {
     displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
     displayedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="w-full">
      {/* Category Hero */}
      <section className="relative h-[60vh] w-full bg-slate-100 flex items-center justify-center overflow-hidden">
         <img src="/images/burgundy_dress_1773723369596.png" className="absolute inset-0 w-full h-full object-cover object-top" alt="Lehengas Collection" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
         <div className="relative z-20 text-center text-white px-4 mt-20">
             <h1 className="font-serif text-5xl md:text-7xl mb-4 font-medium shadow-sm">Bridal Lehengas</h1>
             <p className="max-w-lg mx-auto text-lg opacity-90 drop-shadow-md tracking-wide">Exquisite craftsmanship for your most memorable moments.</p>
         </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
         <div className="mb-12 flex justify-between items-center text-sm font-medium border-b border-gray-200 pb-4 relative z-20">
             <span className="opacity-70">{displayedProducts.length} Products</span>
             <div className="flex gap-6">
                 <div className="relative">
                   <button 
                     onClick={() => { setShowSortDropdown(!showSortDropdown); setShowFilters(false); }} 
                     className="tracking-widest flex items-center gap-2 hover:text-brand-gold transition-colors"
                   >
                     SORT {sort !== 'default' ? '*' : ''} <span className="text-xs">▼</span>
                   </button>
                   {showSortDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-lg z-30 py-2">
                         {[{val: 'default', label: 'Default'}, {val:'price-low', label: 'Price: Low to High'}, {val:'price-high', label: 'Price: High to Low'}].map(s => (
                            <div 
                              key={s.val} 
                              onClick={() => { setSort(s.val); setShowSortDropdown(false); }} 
                              className={`px-4 py-2 hover:bg-slate-50 cursor-pointer ${sort===s.val ? 'text-brand-burgundy font-bold' : 'text-gray-700'}`}
                            >
                              {s.label}
                            </div>
                         ))}
                      </div>
                   )}
                 </div>
                 <div className="relative">
                   <button 
                     onClick={() => { setShowFilters(!showFilters); setShowSortDropdown(false); }} 
                     className="tracking-widest flex items-center gap-2 hover:text-brand-gold transition-colors"
                   >
                     FILTERS {filterType !== 'All' ? '(1)' : ''} <span className="text-xs">+</span>
                   </button>
                   {showFilters && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-lg z-30 py-2">
                         {["All", "Bridal", "Reception", "Festive"].map(f => (
                            <div 
                              key={f} 
                              onClick={() => { setFilterType(f); setShowFilters(false); }} 
                              className={`px-4 py-2 hover:bg-slate-50 cursor-pointer ${filterType===f ? 'text-brand-burgundy font-bold' : 'text-gray-700'}`}
                            >
                              {f}
                            </div>
                         ))}
                      </div>
                   )}
                 </div>
             </div>
         </div>
         {displayedProducts.length === 0 ? (
           <div className="text-center py-20 text-gray-500">No lehengas found matching your filters.</div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
               {displayedProducts.map((item, idx) => {
                 const slug = item.slug ?? item.name.toLowerCase().replace(/\s+/g, '-');
                 return (
                 <a href={`/product/${slug}`} key={idx} className="group cursor-pointer block">
                   <div className="aspect-[4/5] bg-slate-200 w-full mb-6 overflow-hidden relative">
                        <AutoCarousel 
                          images={[item.image, "/images/blue_dress_1773723443478.png", "/images/burgundy_dress_1773723369596.png"]}
                          imgClassName="transition-transform duration-1000 group-hover:scale-110"
                        />
                      <div className="absolute top-4 left-4 inline-block bg-white/90 backdrop-blur-sm px-4 py-1 text-xs font-bold tracking-widest text-brand-burgundy shadow-sm">
                         MADE TO ORDER
                      </div>
                   </div>
                   <div className="flex justify-between items-start">
                      <div>
                         <h4 className="font-serif text-2xl leading-tight mb-1 group-hover:text-brand-burgundy transition-colors">{item.name}</h4>
                         <div className="flex items-center gap-1 mb-2">
                           <div className="flex text-brand-gold text-sm">★★★★★</div>
                           <span className="text-xs text-gray-400">({((idx * 17) % 80) + 12})</span>
                         </div>
                         <p className="text-gray-500 text-sm tracking-wide">{getStyle(item)} Collection</p>
                      </div>
                      <p className="font-semibold text-lg text-brand-burgundy">₹{item.price.toLocaleString('en-IN')}</p>
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
