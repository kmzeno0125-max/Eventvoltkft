import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie, Check, X } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const STORAGE_KEY = 'eventvolt-cookie-consent';
const CONSENT_DAYS = 180;

type ConsentValue = 'accepted' | 'rejected';
interface ConsentRecord {
  value: ConsentValue;
  timestamp: number;
}

function getConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (!parsed.value || !parsed.timestamp) return null;
    const ageMs = Date.now() - parsed.timestamp;
    if (ageMs > CONSENT_DAYS * 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

function setConsent(value: ConsentValue) {
  const record: ConsentRecord = { value, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

let scriptsLoaded = false;

function loadTrackingScripts() {
  if (scriptsLoaded) return;
  scriptsLoaded = true;

  window.dataLayer = window.dataLayer || [];

  // Google Tag Manager
  (function (w: Window & typeof globalThis, d: Document, s: string, l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode?.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-MZGXQXG8');

  // Google Analytics (via gtag)
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-78TQ0DQX9F';
  document.head.appendChild(gaScript);

  window.dataLayer.push({ 'js': new Date() });
  window.dataLayer.push({ 'config': 'G-78TQ0DQX9F' });

  // Meta Pixel
  (function (f: Window & typeof globalThis, b: Document, e: string, v: string, n: string | undefined, t: HTMLScriptElement | undefined, s: HTMLElement | undefined) {
    if ((f as unknown as { fbq?: unknown }).fbq) return;
    const fbq = function (...args: unknown[]) {
      (fbq as unknown as { callMethod?: unknown; apply?: unknown }).callMethod
        ? (fbq as unknown as { callMethod: (...a: unknown[]) => void }).callMethod(...args)
        : ((fbq as unknown as { queue: unknown[] }).queue ??= []).push(args);
    } as unknown as { (...args: unknown[]): void; queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: unknown };
    (f as unknown as { fbq: typeof fbq }).fbq = fbq;
    (f as unknown as { _fbq?: unknown })._fbq = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s?.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  if (typeof window.fbq === 'function') {
    window.fbq('init', '2283044695813726');
    window.fbq('track', 'PageView');
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
    if (consent.value === 'accepted') {
      loadTrackingScripts();
    }
  }, []);

  const handleAccept = useCallback(() => {
    setConsent('accepted');
    loadTrackingScripts();
    setVisible(false);
    setForceOpen(false);
  }, []);

  const handleReject = useCallback(() => {
    setConsent('rejected');
    setVisible(false);
    setForceOpen(false);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setForceOpen(true);
    setVisible(true);
  }, []);

  useEffect(() => {
    window.openCookieSettings = handleOpenSettings;
    return () => {
      delete window.openCookieSettings;
    };
  }, [handleOpenSettings]);

  const showPopup = visible || forceOpen;

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease }}
          className="fixed bottom-4 left-4 right-4 md:right-auto md:bottom-6 md:left-6 z-[90] w-auto md:w-[440px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-title"
        >
          <div className="bg-white border border-charcoal/10 rounded-lg shadow-2xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-amber/10 rounded-md">
                  <Cookie size={18} className="text-amber" />
                </div>
                <div className="flex-1">
                  <h2 id="cookie-title" className="font-heading text-base font-bold text-charcoal leading-tight">
                    Süti beállítások
                  </h2>
                </div>
                <button
                  onClick={handleReject}
                  aria-label="Bezárás"
                  className="text-charcoal/30 hover:text-charcoal/60 transition-colors duration-200 -mt-1 -mr-1 p-1"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-sm text-charcoal/60 font-body leading-relaxed mb-4">
                A weboldal működéséhez szükséges sütiket, valamint az Ön hozzájárulása esetén statisztikai és marketingcélú technológiákat használunk.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleAccept}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber hover:bg-amber-hover text-white font-heading font-semibold text-sm rounded transition-colors duration-200"
                >
                  <Check size={15} />
                  Összes elfogadása
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border border-charcoal/20 hover:border-charcoal/40 text-charcoal font-heading font-semibold text-sm rounded transition-colors duration-200"
                >
                  Csak a szükségesek
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
