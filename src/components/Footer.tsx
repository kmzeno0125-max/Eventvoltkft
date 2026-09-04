import { Zap, Facebook, Instagram } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
const NAV_LINKS = [
  { label: 'Főoldal', href: '/' },
  { label: 'Szolgáltatások', href: '/szolgaltatasok' },
  { label: 'Rólunk', href: '/rolunk' },
  { label: 'Referenciák', href: '/referenciak' },
  { label: 'Kapcsolat', href: '/kapcsolat' },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href === '/referenciak' || href === '/szolgaltatasok' || href === '/rolunk' || href === '/kapcsolat') {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (href === '/') {
      if (location.pathname !== '/') {
        navigate('/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {/* Left: logo + tagline */}
          <div>
            <div className="flex items-center mb-4">
              <Link to="/" aria-label="EventVolt főoldal">
                <img
                  src="/images/image.png"
                  alt="EventVolt logó"
                  className="w-[190px] sm:w-[220px] h-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-white/50 font-body text-sm leading-relaxed max-w-xs">
              Teljes körű villamos szakszolgáltatás &ndash; tervezéstől a megvalósításig.
            </p>
            {/* Lightning accent */}
            <div className="mt-6 flex items-center gap-2">
              <Zap size={16} className="text-amber" />
              <span className="text-xs font-heading font-semibold text-amber tracking-wider uppercase">
                EventVolt Kft
              </span>
            </div>
          </div>

          {/* Center: nav links */}
          <div className="md:text-center">
            <h4 className="text-xs font-heading font-bold text-white/30 tracking-widest uppercase mb-5">
              Navigáció
            </h4>
            <ul className="space-y-3 md:flex md:flex-col md:items-center">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-white/60 hover:text-amber font-body text-sm transition-colors duration-200 cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: contact */}
          <div className="md:text-right">
            <h4 className="text-xs font-heading font-bold text-white/30 tracking-widest uppercase mb-5">
              Elérhetőségek
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+36303067031"
                className="block text-white/60 hover:text-amber font-body text-sm transition-colors duration-200"
              >
                +36 30 306 7031
              </a>
              <a
                href="mailto:eventvoltkft@gmail.com"
                className="block text-white/60 hover:text-amber font-body text-sm transition-colors duration-200 break-all"
              >
                eventvoltkft@gmail.com
              </a>
              <p className="text-white/60 font-body text-sm">
                Alkotmány u. 30, Bicsérd, 7671
              </p>
              <div className="flex items-center gap-3 md:justify-end pt-2">
                <a
                  href="https://www.facebook.com/eventvoltkft?locale=hu_HU"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook oldal megnyitása új lapon"
                  className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:border-amber hover:text-amber rounded-sm transition-colors duration-200"
                >
                  <Facebook size={16} />
                </a>
                <span
                  aria-label="Instagram – hamarosan"
                  title="Instagram – hamarosan"
                  className="w-9 h-9 flex items-center justify-center border border-white/10 text-white/25 rounded-sm cursor-default"
                >
                  <Instagram size={16} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 font-body text-xs">
            &copy; 2025 EventVolt Kft. Minden jog fenntartva.
          </p>
          <button
            onClick={() => window.openCookieSettings?.()}
            className="text-white/30 hover:text-amber font-body text-xs transition-colors duration-200 cursor-pointer"
          >
            Süti beállítások
          </button>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-[2px] bg-amber/40" />
            <Zap size={12} className="text-amber/50" />
            <span className="w-4 h-[2px] bg-amber/40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
