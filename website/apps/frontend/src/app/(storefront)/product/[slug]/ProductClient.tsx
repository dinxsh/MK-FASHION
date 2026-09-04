"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function ProductClient({ product }: { product: any }) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'about'>('desc');
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  const allReviewImages = product.reviews?.items?.flatMap((r: any) => r.images || []) || [];

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
       {/* Breadcrumbs Navigation */}
       <div className="max-w-7xl mx-auto px-8 py-6 text-sm text-gray-500 font-medium tracking-wide">
         <Link href="/" className="hover:text-brand-burgundy transition-colors">Home</Link> <span className="mx-2">/</span> 
         <Link href={`/${product.category}` || "/lehengas"} className="hover:text-brand-burgundy transition-colors capitalize">{product.category || 'Shop'}</Link> <span className="mx-2">/</span>
         <span className="text-gray-900 capitalize">{product.name}</span>
       </div>

       <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 item-start">
          
          {/* Left Column: Interactive Image Carousel Array */}
          <div className="sticky top-24">
            <div className="w-full aspect-[3/4] bg-gray-200 relative overflow-hidden shadow-sm mb-6">
               <img src={product.images[activeImage]} className="w-full h-full object-cover transition-opacity duration-700 hover:scale-105" alt={product.name} />
            </div>
            {/* Carousel Interactive Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
               {product.images.map((img: string, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 md:w-28 flex-shrink-0 aspect-[3/4] cursor-pointer bg-gray-100 border-2 transition-colors ${activeImage === idx ? 'border-brand-burgundy' : 'border-transparent hover:border-brand-burgundy/40'}`}
                  >
                     <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx+1}`} />
                  </div>
               ))}
            </div>
          </div>

          {/* Right Column: High Converting Buy Box Details */}
          <div className="pt-4 lg:pl-4">
             <p className="text-brand-burgundy text-xs font-bold tracking-[0.2em] mb-4 uppercase">MK Fashion Premium Edit</p>
             <h1 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-4 leading-tight">{product.name}</h1>
             
             {/* Dynamic Rating & Review Aggregator */}
             <div className="flex items-center gap-2 mb-6">
                <div className="flex text-brand-gold text-lg">
                   {Array(Math.floor(product.reviews.rating)).fill('★').join('')}
                   <span className="text-gray-300">{Array(5 - Math.floor(product.reviews.rating)).fill('★').join('')}</span>
                </div>
                <span className="text-sm text-gray-600 font-medium">({product.reviews.count} Customer Reviews)</span>
             </div>

             <p className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 border-b border-gray-200 pb-8">₹{product.price.toLocaleString('en-IN')}</p>

             <p className="text-gray-600 leading-relaxed mb-10 text-lg">{product.shortDesc}</p>

             {/* Primary Conversion Actions */}
             <div className="space-y-4 mb-14">
               <button 
                 onClick={() => {
                   const message = `Hi MK Fashion team, I would like to purchase the following item:\n\n*${product.name}*\n*Price*: ₹${product.price.toLocaleString('en-IN')}\n*Link*: ${window.location.href}\n\nPlease let me know the next steps for payment and delivery.`;
                   window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
                 }}
                 className="w-full bg-brand-burgundy text-white py-5 font-bold tracking-[0.2em] text-sm hover:bg-brand-gold transition-colors shadow-xl"
               >
                 BUY IT NOW
               </button>
             </div>

             {/* Dynamic Contact & Customer Support Mini-block */}
             <div className="bg-brand-cream/40 p-8 rounded-sm border border-brand-gold/20 mb-14 shadow-sm">
               <h4 className="font-serif font-bold text-gray-900 text-lg mb-2">Styling & Contact Assistance</h4>
               <p className="text-sm text-gray-600 mb-6 leading-relaxed">Our in-house premium stylists at MK Fashion are available to privately assist with precise sizing, styling pairings, and custom tailoring requests.</p>
               <div className="flex flex-wrap gap-6">
                 <Link href="/contact" className="text-xs font-bold tracking-widest text-brand-burgundy flex items-center gap-2 hover:underline">
                    ✉ EMAIL SUPPORT
                 </Link>
                 <a href="https://wa.me/919876543210" className="text-xs font-bold tracking-widest text-emerald-600 flex items-center gap-2 hover:underline">
                    ✆ WHATSAPP US
                 </a>
               </div>
             </div>

             {/* Contextual Accordion / Tabs for Detail & About */}
             <div className="border-t border-gray-200 pt-10">
               <div className="flex gap-10 border-b border-gray-200 mb-8">
                 <button 
                   className={`pb-4 font-semibold tracking-widest text-sm transition-colors relative ${activeTab === 'desc' ? 'text-brand-burgundy' : 'text-gray-400 hover:text-gray-700'}`}
                   onClick={() => setActiveTab('desc')}
                 >
                   DESCRIPTION & CARE
                   {activeTab === 'desc' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-burgundy"></div>}
                 </button>
                 <button 
                   className={`pb-4 font-semibold tracking-widest text-sm transition-colors relative ${activeTab === 'about' ? 'text-brand-burgundy' : 'text-gray-400 hover:text-gray-700'}`}
                   onClick={() => setActiveTab('about')}
                 >
                   THE ARTISAN STORY
                   {activeTab === 'about' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-burgundy"></div>}
                 </button>
               </div>
               
               <div className="text-sm text-gray-700 leading-relaxed max-w-xl">
                  {activeTab === 'desc' ? (
                     <ul className="space-y-4 list-disc pl-5">
                       {product.details.map((item: string, idx: number) => <li key={idx} className="pl-2">{item}</li>)}
                     </ul>
                  ) : (
                     <p className="text-base">{product.about}</p>
                  )}
               </div>
             </div>
          </div>
       </div>

       {/* Massive Highlighted Social Proof Testimonial Block */}
       <section className="bg-brand-burgundy text-white py-28 mt-32 text-center px-4 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/images/hero_banner_1773723337466.png')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="max-w-4xl mx-auto relative z-10">
             <div className="text-brand-gold text-6xl font-serif mb-6 leading-none">"</div>
             <p className="font-serif text-3xl md:text-5xl leading-tight mb-10 px-4 md:px-0 font-light">
               Wearing an MK Fashion piece instantly makes you feel like absolute royalty. The breathtaking attention to detail and fabric quality is unparalleled in the market today. Highly recommended for any bride to be.
             </p>
             <p className="font-bold tracking-[0.3em] text-sm text-brand-gold">— FEATURED IN VOGUE INDIA</p>
          </div>
       </section>

       {/* Detailed Review Section per User specifications */}
       {product.reviews.items && (
         <section className="max-w-6xl mx-auto px-8 mt-32">
            <div className="flex flex-col gap-6 w-full max-w-4xl">
               <div className="mb-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-900">Ratings and reviews</h3>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                     <div className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1 rounded-sm text-lg md:text-xl font-bold">
                        <span>{product.reviews.rating}</span>
                        <span className="text-sm">★</span>
                     </div>
                     <span className="text-emerald-600 font-medium text-base">Very Good</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6">based on {product.reviews.count.toLocaleString()} ratings by <span className="inline-flex items-center gap-1 text-gray-500"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Verified Buyers</span></p>

                  {allReviewImages.length > 0 && (
                     <div className="grid grid-cols-4 grid-rows-2 gap-2 h-64 md:h-80 mb-8 overflow-hidden rounded-sm">
                        <div 
                           onClick={() => setLightboxImage(0)}
                           className="col-span-2 row-span-2 relative cursor-pointer group bg-slate-100 w-full h-full"
                        >
                           <img src={allReviewImages[0]} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="Customer Review 1" />
                        </div>
                        {allReviewImages.slice(1, 5).map((img: string, i: number) => (
                           <div 
                              key={i+1} 
                              onClick={() => setLightboxImage(i+1)}
                              className="col-span-1 row-span-1 relative cursor-pointer group bg-slate-100 w-full h-full"
                           >
                              <img src={img} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt={`Customer Review ${i+2}`} />
                              {i === 3 && allReviewImages.length > 5 && (
                                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                    +{allReviewImages.length - 5}
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  )}

                  <div className="mb-2 pb-6">
                     <p className="text-gray-700 font-medium mb-3">Features customers loved</p>
                     <div className="flex flex-wrap gap-2">
                        {["Light weight", "Quality of material", "Value for Money", "Comfort", "Opacity"].map(f => (
                           <span key={f} className="px-4 py-2 bg-slate-50 text-gray-700 text-sm rounded border border-gray-100">{f}</span>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="flex flex-col">
                  {product.reviews.items.map((review: any, idx: number) => (
                    <div key={idx} className="bg-white border-t border-gray-100 py-6">
                       <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                             <div className={`flex items-center gap-1 text-white px-1.5 py-0.5 rounded-[3px] text-xs font-bold ${review.rating >= 4 ? 'bg-emerald-600' : 'bg-yellow-500'}`}>
                                {review.rating} ★
                             </div>
                             <span className="font-semibold text-gray-800 text-sm">{review.rating >= 4 ? "Worth the money" : "Good quality"}</span>
                          </div>
                       </div>
                       <p className="text-gray-800 text-sm leading-relaxed mb-4">{review.comment}</p>
                       
                       {review.images && review.images.length > 0 && (
                         <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 mb-3">
                            {review.images.map((img: string, i: number) => {
                              const globalIndex = allReviewImages.indexOf(img);
                              return (
                              <div key={i} onClick={() => setLightboxImage(globalIndex !== -1 ? globalIndex : 0)} className="flex-shrink-0 w-20 h-20 snap-center cursor-pointer rounded-sm overflow-hidden border border-gray-200 bg-gray-50 group">
                                 <img src={img} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" alt="Customer review photo" />
                              </div>
                            )})}
                         </div>
                       )}

                       <div className="flex justify-between items-center text-xs text-gray-400 mt-2 font-medium">
                          <div className="flex items-center gap-2">
                             <span className="text-gray-600 font-semibold">{review.name}</span>
                             <span>{review.date}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </section>
       )}

       {lightboxImage !== null && (
         <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4">
            <button 
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/30 p-2 rounded-full transition-colors"
              onClick={() => setLightboxImage(null)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="relative w-full max-w-4xl flex items-center justify-center">
               {lightboxImage > 0 && (
                  <button 
                    className="absolute left-2 lg:-left-20 text-white bg-white/10 hover:bg-white/30 p-3 rounded-full transition-colors z-10"
                    onClick={(e) => { e.stopPropagation(); setLightboxImage(lightboxImage - 1); }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
               )}
               <img src={allReviewImages[lightboxImage]} className="max-h-[85vh] max-w-full object-contain shadow-2xl rounded" alt="Full review photo" />
               {lightboxImage < allReviewImages.length - 1 && (
                  <button 
                    className="absolute right-2 lg:-right-20 text-white bg-white/10 hover:bg-white/30 p-3 rounded-full transition-colors z-10"
                    onClick={(e) => { e.stopPropagation(); setLightboxImage(lightboxImage + 1); }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                  </button>
               )}
            </div>
            <p className="text-white mt-6 font-medium tracking-widest text-sm opacity-80">{lightboxImage + 1} of {allReviewImages.length}</p>
         </div>
       )}

    </div>
  );
}
