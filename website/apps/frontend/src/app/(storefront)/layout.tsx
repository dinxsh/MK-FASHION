import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../globals.css';
import WhatsAppLink from '@/components/WhatsAppLink';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'MK Fashion | Premium Traditional Women\'s Fashion',
  description: 'Shop luxury ethnic wear, sarees, lehengas, and anarkali suits online at MK Fashion.',
  keywords: "mk fashion, traditional clothing, ethnic fashion, saree, lehenga, anarkali, premium fashion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <header className="glass sticky top-0 z-50 px-8 py-4 flex justify-between items-center transition-all">
           <a href="/" className="font-serif text-3xl font-bold tracking-tighter text-brand-burgundy block min-w-[120px]">MK FASHION</a>
           <nav className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
             <a href="/sarees" className="hover:text-brand-burgundy transition-colors">SAREES</a>
             <a href="/lehengas" className="hover:text-brand-burgundy transition-colors">LEHENGAS</a>
             <a href="/kurtas" className="hover:text-brand-burgundy transition-colors">KURTAS</a>
             <a href="/accessories" className="hover:text-brand-burgundy transition-colors">ACCESSORIES</a>
           </nav>
           <div className="flex gap-4 min-w-[120px]">
           </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-brand-burgundy text-brand-cream py-16 px-8 mt-24">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="font-serif text-2xl mb-4 font-semibold">MK FASHION</h3>
                <p className="text-sm opacity-80 leading-relaxed">Curated traditional wear bringing cultural authenticity and artisan traceability to the modern woman.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 tracking-widest text-sm text-brand-gold">SHOP</h4>
                <ul className="space-y-4 text-sm opacity-80">
                  <li><a href="/lehengas" className="hover:text-brand-gold transition-colors block">Bridal Lehengas</a></li>
                  <li><a href="/sarees" className="hover:text-brand-gold transition-colors block">Silk Sarees</a></li>
                  <li><a href="/kurtas" className="hover:text-brand-gold transition-colors block">Kurta Sets</a></li>
                  <li><a href="/accessories" className="hover:text-brand-gold transition-colors block">Accessories</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 tracking-widest text-sm text-brand-gold">CUSTOMER CARE</h4>
                <ul className="space-y-4 text-sm opacity-80">
                  <li><a href="/contact" className="hover:text-brand-gold transition-colors block">Contact Stylist</a></li>
                  <li><WhatsAppLink target="_blank" className="hover:text-brand-gold transition-colors block" rel="noreferrer">WhatsApp Support</WhatsAppLink></li>
                  <li><a href="/returns" className="hover:text-brand-gold transition-colors block">Returns & Exchanges</a></li>
                  <li><a href="/shipping" className="hover:text-brand-gold transition-colors block">Shipping Policy</a></li>
                </ul>
              </div>
           </div>
        </footer>
        <WhatsAppLink message="Hello MK Fashion"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 flex justify-center items-center rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-50 animate-bounce"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </WhatsAppLink>
      </body>
    </html>
  );
}
