import Link from 'next/link';
import StoreCatalog from '@/components/StoreCatalog';

export default function HomePage() {
  return <div>
    <section className="relative flex h-[75vh] items-center justify-center overflow-hidden bg-stone-900 text-center text-white"><img src="/images/hero_banner_1773723337466.png" alt="MK Fashion" className="absolute inset-0 h-full w-full object-cover opacity-55" /><div className="relative px-6"><p className="text-sm font-bold tracking-[0.28em] text-brand-gold">THE ROYAL EDIT</p><h1 className="mt-5 font-serif text-5xl md:text-7xl">Elegance in Tradition</h1><p className="mx-auto mt-5 max-w-xl text-lg text-white/85">Discover thoughtfully chosen ethnic wear for every celebration.</p><Link href="/sarees" className="mt-9 inline-block bg-white px-8 py-3 text-sm font-bold tracking-wider text-gray-900">SHOP COLLECTION</Link></div></section>
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-8 py-16">{[{ name: 'Sarees', href: '/sarees', image: '/images/emerald_dress_1773723403267.png' }, { name: 'Lehengas', href: '/lehengas', image: '/images/burgundy_dress_1773723369596.png' }, { name: 'Kurtas', href: '/kurtas', image: '/images/blue_dress_1773723443478.png' }].map((category) => <Link key={category.href} href={category.href} className="group"><div className="aspect-[3/4] overflow-hidden bg-stone-100"><img src={category.image} alt={category.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div><h2 className="mt-4 font-serif text-2xl text-gray-900">{category.name}</h2><p className="mt-1 text-sm text-gray-500">Explore the collection</p></Link>)}</section>
    <div className="bg-brand-cream/30"><StoreCatalog title="New arrivals" /></div>
  </div>;
}
