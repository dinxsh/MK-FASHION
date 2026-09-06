import Link from 'next/link';
import StoreCatalog from '@/components/StoreCatalog';
import { getHomepageContent } from '@/lib/sanity';

export default async function HomePage() {
  const homepage = await getHomepageContent();
  return <div>
    <section className="relative flex h-[75vh] items-center justify-center overflow-hidden bg-stone-900 text-center text-white"><img src={homepage.heroImageUrl} alt={homepage.headline} className="absolute inset-0 h-full w-full object-cover opacity-55" /><div className="relative px-6"><p className="text-sm font-bold tracking-[0.28em] text-brand-gold">{homepage.eyebrow}</p><h1 className="mt-5 font-serif text-5xl md:text-7xl">{homepage.headline}</h1><p className="mx-auto mt-5 max-w-xl text-lg text-white/85">{homepage.description}</p><Link href={homepage.ctaHref} className="mt-9 inline-block bg-white px-8 py-3 text-sm font-bold tracking-wider text-gray-900">{homepage.ctaLabel}</Link></div></section>
    <div className="bg-brand-cream/30"><StoreCatalog title="New arrivals" showCategories /></div>
  </div>;
}
