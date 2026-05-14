import AutoCarousel from '@/components/AutoCarousel';
import { serverApiFetch } from '@/lib/api';

export default async function HomePage() {
  const home = await serverApiFetch<{ content: { headline: string; subheadline: string; ctaText: string }; featuredProducts: Array<{ name: string; slug: string; price: number; image: string }> }>('/storefront/home');
  const products = home.featuredProducts;

  return (
    <div className="w-full">
      <section className="relative h-[85vh] w-full bg-slate-100 flex items-center justify-center overflow-hidden">
        <img src="/images/hero_banner_1773723337466.png" className="absolute inset-0 w-full h-full object-cover object-center" alt="Hero Banner" />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 text-center text-white px-4">
          <p className="text-sm tracking-[0.3em] font-semibold mb-4 text-brand-gold">THE ROYAL EDIT</p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 font-medium shadow-sm">{home.content.headline}</h1>
          <p className="max-w-lg mx-auto mb-10 text-lg opacity-90 drop-shadow-md">{home.content.subheadline}</p>
          <a href="/lehengas" className="inline-block bg-white text-gray-900 px-10 py-4 text-sm font-bold tracking-widest hover:bg-brand-gold hover:text-white transition-all duration-300">
            {home.content.ctaText}
          </a>
        </div>
      </section>

      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl mb-3 text-gray-900">Curated Categories</h2>
          <div className="w-16 h-1 bg-brand-burgundy mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'BRIDAL LEHENGAS', subtitle: 'Exquisite craftsmanship', img: '/images/burgundy_dress_1773723369596.png', link: '/lehengas' },
            { title: 'SILK SAREES', subtitle: 'Timeless heirlooms', img: '/images/emerald_dress_1773723403267.png', link: '/sarees' },
            { title: 'FESTIVE KURTAS', subtitle: 'Celebratory grace', img: '/images/blue_dress_1773723443478.png', link: '/kurtas' }
          ].map((cat, i) => (
            <a href={cat.link} key={i} className="group cursor-pointer block">
              <div className="aspect-[3/4] bg-slate-200 w-full mb-6 overflow-hidden relative">
                <img src={cat.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={cat.title} />
              </div>
              <h3 className="font-serif text-xl mb-1 text-gray-900 group-hover:text-brand-burgundy transition-colors">{cat.title}</h3>
              <p className="text-gray-500 text-sm">{cat.subtitle}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-brand-cream/30 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl mb-3 text-gray-900">New Arrivals</h2>
              <div className="w-16 h-1 bg-brand-burgundy"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((item, idx) => (
              <a href={`/product/${item.slug}`} key={idx} className="group cursor-pointer block">
                <div className="aspect-[2/3] bg-slate-200 w-full mb-4 overflow-hidden relative">
                  <AutoCarousel images={[item.image, '/images/burgundy_dress_1773723369596.png', '/images/blue_dress_1773723443478.png']} imgClassName="transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-brand-burgundy font-medium tracking-wide mb-1">MK FASHION EXCLUSIVE</p>
                    <h4 className="font-serif text-lg leading-tight mb-1 truncate break-words w-48">{item.name}</h4>
                  </div>
                  <p className="font-semibold text-sm">Rs {item.price.toLocaleString('en-IN')}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
