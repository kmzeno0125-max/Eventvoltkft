import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import About from '@/components/About';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'Rólunk – EventVolt Kft | Szakértelem, amire építeni lehet';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Ismerje meg az EventVolt Kft-t – teljes körű villamos szakszolgáltatás Bicsérden, ipari automatizálástól a lakossági villanyszerelésig.',
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
        <About />
      </main>
      <Footer />
    </>
  );
}
