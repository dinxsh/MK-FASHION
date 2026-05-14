"use client";
import { useEffect, useState } from 'react';
import AutoCarousel from '@/components/AutoCarousel';
import { API_BASE_URL } from '@/lib/api';
import type { Product } from '@/lib/types/admin';

export default function SareesPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [sort, setSort] = useState("default");
  const [filterType, setFilterType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/storefront/products`)
      .then((response) => response.json())
      .then((items: Product[]) => setProducts(items.filter((item) => item.category === 'sarees')))
      .catch(() => setProducts([]));
  }, []);

  const getType = (product: Product) => {
    const haystack = `${product.name} ${product.shortDesc ?? ''}`.toLowerCase();
    if (haystack.includes('silk') || haystack.includes('kanjeevaram') || haystack.includes('kanjivaram')) return 'Silk';
    if (haystack.includes('georgette')) return 'Georgette';
    if (haystack.includes('organza')) return 'Organza';
    if (haystack.includes('velvet')) return 'Velvet';
    return 'Embroidered';
  };

  let displayedProducts = [...products];

  if (filterType !== "All") {
     displayedProducts = displayedProducts.filter((p) => getType(p) === filterType);
  }

  if (sort === "price-low") {
     displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
     displayedProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
     displayedProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="w-full">
      {/* Category Hero */}
      <section className="relative h-[60vh] w-full bg-slate-100 flex items-center justify-center overflow-hidden">
         <img src="/images/hero_banner_1773723337466.png" className="absolute inset-0 w-full h-full object-cover object-center" alt="Sarees Collection" />
         <div className="absolute inset-0 bg-black/50 z-10"></div>
         <div className="relative z-20 text-center text-white px-4">
             <h1 className="font-serif text-5xl md:text-7xl mb-4 font-medium shadow-sm">Timeless Sarees</h1>
             <p className="max-w-lg mx-auto text-lg opacity-90 drop-shadow-md tracking-wide">Drape yourself in the elegance of six yards of pure grace.</p>
         </div>
      </section>

      {/* Product Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
         <div className="mb-12 flex justify-between items-center text-sm font-medium relative">
             <span className="opacity-70">{displayedProducts.length} Products</span>
             <div className="flex gap-4">
                 <div className="relative">
                     <button 
                       onClick={() => {setShowSortDropdown(!showSortDropdown); setShowFilters(false)}} 
                       className="tracking-wide hover:text-brand-burgundy transition-colors uppercase"
                     >
                       SORT {sort !== 'default' ? '(ACTIVE)' : ''} ▼
                     </button>
                     {showSortDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-lg z-30 py-2">
                           {[{val: 'default', label: 'Recommended'}, {val:'price-low', label: 'Price: Low to High'}, {val:'price-high', label: 'Price: High to Low'}, {val:'name', label: 'Name: A-Z'}].map(s => (
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
                       onClick={() => {setShowFilters(!showFilters); setShowSortDropdown(false)}} 
                       className="tracking-wide hover:text-brand-burgundy transition-colors uppercase"
                     >
                       FILTER {filterType !== 'All' ? '(1)' : ''} +
                     </button>
                     {showFilters && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-lg z-30 py-2">
                           {["All", "Silk", "Georgette", "Organza", "Velvet", "Embroidered"].map(f => (
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
           <div className="text-center py-20 text-gray-500">No sarees found matching your filters.</div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
               {displayedProducts.map((item, idx) => {
                 const slug = item.slug ?? item.name.toLowerCase().replace(/\s+/g, '-');
                 return (
                 <a href={`/product/${slug}`} key={idx} className="group cursor-pointer block">
                   <div className="aspect-[3/4] bg-slate-200 w-full mb-5 overflow-hidden relative">
                        <AutoCarousel 
                          images={[item.image, "/images/burgundy_dress_1773723369596.png", "/images/emerald_dress_1773723403267.png"]}
                          imgClassName="transition-transform duration-700 group-hover:scale-105"
                        />
                   </div>
                   <div className="text-center">
                      <h4 className="font-serif text-xl leading-snug mb-1 group-hover:text-brand-burgundy transition-colors">{item.name}</h4>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <div className="flex text-brand-gold text-sm">★★★★★</div>
                        <span className="text-xs text-gray-400">({((idx * 17) % 80) + 12})</span>
                      </div>
                      <p className="font-semibold text-gray-700">₹{item.price.toLocaleString('en-IN')}</p>
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
