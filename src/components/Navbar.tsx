import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Főoldal', href: '/' },
  { label: 'Szolgáltatások', href: '/szolgaltatasok' },
  { label: 'Rólunk', href: '/rolunk' },
  { label: 'Referenciák', href: '/referenciak' },
  { label: 'Kapcsolat', href: '/kapcsolat' },
];

export default function Navbar({ visible }: { visible: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (!visible) return null;

  function handleNavClick(e: React.MouseEvent, href: string) {
    e.preventDefault();

    if (href === '/referenciak') {
      navigate('/referenciak');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (href === '/szolgaltatasok') {
      navigate('/szolgaltatasok');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (href === '/rolunk') {
      navigate('/rolunk');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (href === '/kapcsolat') {
      navigate('/kapcsolat');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (href === '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-[0_1px_12px_rgba(0,0,0,0.06)]'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-24 md:h-28">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center shrink-0"
          >
            <img
              src="/images/image.png"
              alt="EventVolt logó"
              className="w-[175px] sm:w-[205px] md:w-[240px] h-auto object-contain"
            />
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-[17px] font-heading font-semibold transition-colors duration-200 relative group ${
                  ((location.pathname === '/referenciak' && link.href === '/referenciak') ||
                   (location.pathname === '/szolgaltatasok' && link.href === '/szolgaltatasok') ||
                   (location.pathname === '/rolunk' && link.href === '/rolunk') ||
                   (location.pathname === '/kapcsolat' && link.href === '/kapcsolat'))
                    ? 'text-amber'
                    : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-amber group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            {/* Desktop: unified phone + CTA card */}
            <div className="hidden md:flex items-center rounded-full overflow-hidden shadow-lg bg-gradient-to-r from-white via-amber-50 to-amber hover:shadow-xl transition-shadow duration-300">
              <a
                href="tel:+36303067031"
                className="flex items-center gap-2 px-5 py-2.5 text-charcoal font-heading font-semibold hover:bg-white/40 transition-colors duration-200"
                aria-label="Hívjon minket"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">+36 30 306 7031</span>
              </a>
              <a
                href="/kapcsolat"
                onClick={(e) => handleNavClick(e, '/kapcsolat')}
                className="px-6 py-2.5 bg-amber text-white text-base font-heading font-semibold hover:bg-amber-hover transition-colors duration-200"
              >
                Ingyenes árajánlat
              </a>
            </div>
            {/* Mobile: CTA only (phone is floating button) */}
            <a
              href="/kapcsolat"
              onClick={(e) => handleNavClick(e, '/kapcsolat')}
              className="md:hidden inline-flex items-center px-5 py-2.5 bg-amber hover:bg-amber-hover text-white text-base font-heading font-semibold rounded transition-colors duration-200"
            >
              Ingyenes árajánlat
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-charcoal"
              aria-label="Menü"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-24 z-40 bg-white/98 backdrop-blur-sm lg:hidden"
          >
            <div className="flex flex-col items-start px-6 pt-8 gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={(e) => {
                    setMenuOpen(false);
                    handleNavClick(e, link.href);
                  }}
                  className="text-[18px] font-heading font-semibold text-charcoal hover:text-amber transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="/kapcsolat"
                onClick={(e) => {
                  setMenuOpen(false);
                  handleNavClick(e, '/kapcsolat');
                }}
                className="mt-4 inline-flex items-center px-6 py-3 bg-amber hover:bg-amber-hover text-white font-heading font-semibold rounded transition-colors"
              >
                Ingyenes árajánlat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating phone button (mobile only) */}
      <a
        href="tel:+36303067031"
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-amber hover:bg-amber-hover flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-slow"
        aria-label="Hívja az EventVoltot"
      >
        <Phone className="w-6 h-6 text-white" fill="white" />
      </a>
    </>
  );
}
