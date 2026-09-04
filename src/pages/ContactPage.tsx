import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Kapcsolat – EventVolt Kft | Ingyenes árajánlat';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Vegye fel a kapcsolatot az EventVolt Kft-vel. Ingyenes árajánlat 24 órán belül – ipari automatizálás, lakossági villanyszerelés, vezérlőszekrény gyártás.',
      );
    }
    return () => {
      document.title = 'EventVolt Kft – Ipari és lakossági villanyszerelés | Bicsérd';
    };
  }, []);

  return (
    <>
      <Navbar visible={true} />
      <main>
        <section className="pt-28 md:pt-36 pb-4 bg-offwhite">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-amber" />
              <span className="text-sm font-medium text-amber tracking-widest uppercase font-body">
                Kapcsolat
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight max-w-xl">
              Kérjen ingyenes árajánlatot
            </h1>
          </div>
        </section>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
