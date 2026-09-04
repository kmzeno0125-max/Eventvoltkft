import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import CinematicIntro from '@/components/CinematicIntro';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import CTASection from '@/components/CTASection';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ReferencesPage from '@/pages/ReferencesPage';
import ServicesPage from '@/pages/ServicesPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import ScrollToTop from '@/components/ScrollToTop';
import CookieConsent from '@/components/CookieConsent';

const INTRO_KEY = 'eventvolt-intro-played';

function HomePage({ introComplete }: { introComplete: boolean }) {
  useEffect(() => {
    if (!introComplete) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [introComplete]);

  return (
    <>
      <Navbar visible={introComplete} />
      <main>
        <Hero visible={introComplete} />
        {introComplete && <Services />}
        {introComplete && <About />}
        {introComplete && <Testimonials />}
        {introComplete && <CTASection />}
        {introComplete && <Contact />}
      </main>
      {introComplete && <Footer />}
    </>
  );
}

function AppContent() {
  const location = useLocation();

  const [shouldPlayIntro] = useState(() => {
    if (sessionStorage.getItem(INTRO_KEY)) return false;
    if (location.pathname !== '/') {
      sessionStorage.setItem(INTRO_KEY, 'true');
      return false;
    }
    return true;
  });

  const [introComplete, setIntroComplete] = useState(!shouldPlayIntro);

  const handleIntroComplete = () => {
    sessionStorage.setItem(INTRO_KEY, 'true');
    setIntroComplete(true);
  };

  return (
    <>
      {shouldPlayIntro && !introComplete && (
        <CinematicIntro onComplete={handleIntroComplete} />
      )}
      <ScrollToTop />
      <CookieConsent />
      <Routes>
        <Route path="/" element={<HomePage introComplete={introComplete} />} />
        <Route path="/referenciak" element={<ReferencesPage />} />
        <Route path="/szolgaltatasok" element={<ServicesPage />} />
        <Route path="/rolunk" element={<AboutPage />} />
        <Route path="/kapcsolat" element={<ContactPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
