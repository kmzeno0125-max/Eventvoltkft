import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2, AlertCircle, Facebook, Instagram, ArrowRight, ArrowLeft } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  planned_timing: string;
  customer_type: string;
}

const SERVICES = [
  'Erősáramú villamos szerelések',
  'Vezérlőszekrény-gyártás',
  'Hajtások kiépítése',
  'PLC-vezérlések',
  'Ipari távelérés',
  'Lakossági villanyszerelés',
  'Villamos Biztonsági Felülvizsgálat (VBF)',
];

const TIMING_OPTIONS = [
  'Minél hamarabb',
  '1–3 hónapon belül',
  '3–6 hónapon belül',
  'Még csak tájékozódom',
];

const CUSTOMER_TYPES = [
  'Cég képviseletében',
  'Egyéni vállalkozóként',
  'Magánszemélyként',
];

const INITIAL: FormState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  planned_timing: '',
  customer_type: '',
};

const STEP_PARAM = 'urlap_lepes';
const STEP_VALUE = 'kapcsolati_adatok';

function UnderlineInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  textarea = false,
  required = false,
  compact = false,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  compact?: boolean;
}) {
  const baseClass = compact
    ? 'w-full bg-transparent border-0 border-b border-charcoal/15 focus:border-amber outline-none py-2 text-charcoal font-body text-sm placeholder-charcoal/30 transition-colors duration-200'
    : 'w-full bg-transparent border-0 border-b border-charcoal/15 focus:border-amber outline-none py-3 text-charcoal font-body text-base placeholder-charcoal/30 transition-colors duration-200';

  return (
    <div>
      <label className="block text-xs font-heading font-semibold text-charcoal/40 tracking-wider uppercase mb-0.5">
        {label}
        {required && <span className="text-amber ml-0.5">*</span>}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={compact ? 2 : 3}
          required={required}
          placeholder="Írja le, milyen munkára van szüksége..."
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={label}
          className={baseClass}
        />
      )}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [step, setStep] = useState<1 | 2>(1);
  const [step1Error, setStep1Error] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [qualified, setQualified] = useState(false);
  const [conversionFired, setConversionFired] = useState(false);

  const serviceRef = useRef<HTMLSelectElement>(null);
  const timingRef = useRef<HTMLDivElement>(null);
  const customerTypeRef = useRef<HTMLDivElement>(null);

  // On mount: check URL param — but never grant step 2 from URL alone
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get(STEP_PARAM) === STEP_VALUE) {
      // Direct access without qualifying — remove param, stay on step 1
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  // Browser back button: restore step 1 and remove param
  useEffect(() => {
    function handlePopState() {
      setStep(1);
      setQualified(false);
      setConversionFired(false);
      const params = new URLSearchParams(window.location.search);
      if (params.get(STEP_PARAM) === STEP_VALUE) {
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState(null, '', newUrl);
      }
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleStep1Next() {
    if (!form.service) {
      setStep1Error('Kérjük, válasszon szolgáltatást.');
      serviceRef.current?.focus();
      return;
    }
    if (!form.planned_timing) {
      setStep1Error('Kérjük, válassza ki a tervezett időzítést.');
      timingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!form.customer_type) {
      setStep1Error('Kérjük, válassza ki, milyen minőségben érdeklődik.');
      customerTypeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStep1Error('');

    // Update URL without page reload
    const params = new URLSearchParams(window.location.search);
    params.set(STEP_PARAM, STEP_VALUE);
    window.history.pushState({ step: 2 }, '', `${window.location.pathname}?${params.toString()}${window.location.hash}`);

    setStep(2);
    setQualified(true);

    // Fire conversion events exactly once
    if (!conversionFired) {
      setConversionFired(true);
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'QualifiedFormProgress');
      }
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'qualified_form_progress' });
      }
    }
  }

  function handleBack() {
    setStep(1);
    const params = new URLSearchParams(window.location.search);
    params.delete(STEP_PARAM);
    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}${window.location.hash}`
      : `${window.location.pathname}${window.location.hash}`;
    window.history.pushState({ step: 1 }, '', newUrl);
  }

  async function handleSubmit() {
    if (!form.name || !form.company || !form.email || !form.phone || !form.service) {
      setStatus('error');
      setErrorMsg('Kérjük, töltse ki az összes kötelező mezőt.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus('error');
      setErrorMsg('Kérjük, érvényes e-mail címet adjon meg.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Hiba történt a küldés során.');
      }

      // Fire Lead conversion only on actual success
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead');
      }
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'lead_submitted' });
      }

      setStatus('success');
      setForm(INITIAL);
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Váratlan hiba történt.');
    }
  }

  const isDisabled = status === 'loading';

  return (
    <section id="kapcsolat" className="py-16 md:py-20 bg-offwhite">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="mb-10 md:mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-amber" />
            <span className="text-sm font-medium text-amber tracking-widest uppercase font-body">
              Kapcsolat
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight max-w-xl">
            Kérjen ingyenes árajánlatot
          </h2>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-heading font-bold transition-colors duration-200 ${
                step === 1 ? 'bg-amber text-white' : 'bg-amber/20 text-amber'
              }`}
            >
              1
            </span>
            <span
              className={`text-sm font-heading font-semibold transition-colors duration-200 ${
                step === 1 ? 'text-charcoal' : 'text-charcoal/35'
              }`}
            >
              Igényfelmérés
            </span>
          </div>
          <span className="flex-1 h-[2px] bg-charcoal/10 mx-2 max-w-[60px]" />
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-heading font-bold transition-colors duration-200 ${
                step === 2 ? 'bg-amber text-white' : 'bg-amber/20 text-amber'
              }`}
            >
              2
            </span>
            <span
              className={`text-sm font-heading font-semibold transition-colors duration-200 ${
                step === 2 ? 'text-charcoal' : 'text-charcoal/35'
              }`}
            >
              Kapcsolati adatok
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-12">
          {/* Left: form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease }}
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease }}
                  className="space-y-5"
                >
                  {/* Q1: Service */}
                  <div>
                    <label className="block text-xs font-heading font-semibold text-charcoal/40 tracking-wider uppercase mb-1">
                      Melyik szolgáltatás iránt érdeklődik?<span className="text-amber ml-0.5">*</span>
                    </label>
                    <select
                      ref={serviceRef}
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-charcoal/15 focus:border-amber outline-none py-2.5 text-charcoal font-body text-sm transition-colors duration-200"
                    >
                      <option value="" disabled>Válasszon szolgáltatást...</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Q2: Timing */}
                  <div ref={timingRef}>
                    <label className="block text-xs font-heading font-semibold text-charcoal/40 tracking-wider uppercase mb-2">
                      Mikorra tervezi a munkát?<span className="text-amber ml-0.5">*</span>
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {TIMING_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, planned_timing: opt }))}
                          className={`text-left px-3 py-2 text-sm font-body border transition-all duration-200 rounded-sm ${
                            form.planned_timing === opt
                              ? 'border-amber bg-amber/10 text-charcoal'
                              : 'border-charcoal/15 text-charcoal/60 hover:border-charcoal/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q3: Customer type */}
                  <div ref={customerTypeRef}>
                    <label className="block text-xs font-heading font-semibold text-charcoal/40 tracking-wider uppercase mb-2">
                      Milyen minőségben érdeklődik?<span className="text-amber ml-0.5">*</span>
                    </label>
                    <div className="grid sm:grid-cols-3 gap-2">
                      {CUSTOMER_TYPES.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, customer_type: opt }))}
                          className={`text-left px-3 py-2 text-sm font-body border transition-all duration-200 rounded-sm ${
                            form.customer_type === opt
                              ? 'border-amber bg-amber/10 text-charcoal'
                              : 'border-charcoal/15 text-charcoal/60 hover:border-charcoal/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 1 error */}
                  {step1Error && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-red-600 font-body font-medium"
                    >
                      <AlertCircle size={16} />
                      {step1Error}
                    </motion.p>
                  )}

                  {/* CTA */}
                  <button
                    onClick={handleStep1Next}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-amber hover:bg-amber-hover text-white font-heading font-bold text-sm rounded transition-colors duration-200"
                  >
                    Tovább a kapcsolati adatokhoz
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25, ease }}
                  className="space-y-3"
                >
                  {/* Selected service summary */}
                  <div className="mb-2 px-3 py-2 bg-amber/10 border border-amber/20 rounded-sm">
                    <span className="text-xs font-heading font-semibold text-charcoal/40 tracking-wider uppercase">
                      Érdeklődés tárgya:{' '}
                    </span>
                    <span className="text-sm font-body font-medium text-charcoal">{form.service}</span>
                  </div>

                  <UnderlineInput label="Név" name="name" value={form.name} onChange={handleChange} required compact />
                  <UnderlineInput label="Cégnév" name="company" value={form.company} onChange={handleChange} required compact />
                  <UnderlineInput label="E-mail" name="email" value={form.email} onChange={handleChange} type="email" required compact />
                  <UnderlineInput label="Telefonszám" name="phone" value={form.phone} onChange={handleChange} type="tel" required compact />
                  <UnderlineInput label="Üzenet" name="message" value={form.message} onChange={handleChange} textarea compact />

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={handleBack}
                      disabled={isDisabled}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-charcoal/20 hover:border-charcoal/40 text-charcoal font-heading font-semibold text-sm rounded transition-colors duration-200 disabled:opacity-50"
                    >
                      <ArrowLeft size={16} />
                      Vissza
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isDisabled}
                      className="group inline-flex items-center gap-2 px-6 py-2.5 bg-amber hover:bg-amber-hover disabled:bg-charcoal/20 disabled:cursor-not-allowed text-white font-heading font-bold text-sm rounded transition-colors duration-200"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Küldés...
                        </>
                      ) : status === 'success' ? (
                        <>
                          <CheckCircle2 size={16} />
                          Elküldve!
                        </>
                      ) : (
                        <>
                          Ingyenes árajánlat kérése
                          <Send size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>

                  {status === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-amber font-body font-medium"
                    >
                      Köszönjük! Hamarosan felvesszük Önnel a kapcsolatot.
                    </motion.p>
                  )}

                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-red-600 font-body font-medium"
                    >
                      <AlertCircle size={16} />
                      {errorMsg}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: contact info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-heading text-xl font-bold text-charcoal mb-4">
                Elérhetőségek
              </h3>

              <div className="space-y-4">
                <a
                  href="tel:+36303067031"
                  className="group flex items-start gap-4 hover:translate-x-1 transition-transform duration-200"
                >
                  <div className="w-10 h-10 flex items-center justify-center border border-amber/30 group-hover:border-amber transition-colors duration-200 rounded-sm">
                    <Phone size={18} className="text-amber" />
                  </div>
                  <div>
                    <span className="block text-xs font-heading font-semibold text-charcoal/40 tracking-wider uppercase">
                      Telefon
                    </span>
                    <span className="text-lg font-heading font-semibold text-charcoal group-hover:text-amber transition-colors duration-200">
                      +36 30 306 7031
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:eventvoltkft@gmail.com"
                  className="group flex items-start gap-4 hover:translate-x-1 transition-transform duration-200"
                >
                  <div className="w-10 h-10 flex items-center justify-center border border-amber/30 group-hover:border-amber transition-colors duration-200 rounded-sm">
                    <Mail size={18} className="text-amber" />
                  </div>
                  <div>
                    <span className="block text-xs font-heading font-semibold text-charcoal/40 tracking-wider uppercase">
                      E-mail
                    </span>
                    <span className="text-lg font-heading font-semibold text-charcoal group-hover:text-amber transition-colors duration-200 break-all">
                      eventvoltkft@gmail.com
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center border border-amber/30 rounded-sm">
                    <MapPin size={18} className="text-amber" />
                  </div>
                  <div>
                    <span className="block text-xs font-heading font-semibold text-charcoal/40 tracking-wider uppercase">
                      Cím
                    </span>
                    <span className="text-lg font-heading font-semibold text-charcoal">
                      Alkotmány u. 30, Bicsérd, 7671
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <span className="block text-xs font-heading font-semibold text-charcoal/40 tracking-wider uppercase">
                    Közösségi média
                  </span>
                  <a
                    href="https://www.facebook.com/eventvoltkft?locale=hu_HU"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook oldal megnyitása új lapon"
                    className="w-10 h-10 flex items-center justify-center border border-charcoal/20 hover:border-amber hover:bg-amber text-charcoal hover:text-white rounded-sm transition-all duration-200"
                  >
                    <Facebook size={18} />
                  </a>
                  <span
                    aria-label="Instagram – hamarosan"
                    title="Instagram – hamarosan"
                    className="w-10 h-10 flex items-center justify-center border border-charcoal/15 text-charcoal/30 rounded-sm cursor-default"
                  >
                    <Instagram size={18} />
                  </span>
                </div>
              </div>
            </div>

            {/* Map */}
            <a
              href="https://maps.app.goo.gl/KzKGjCM914Gf7P6H9"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-2xl overflow-hidden shadow-md hover:opacity-95 transition-opacity duration-300"
              aria-label="Útvonaltervezés a Google Térképen"
            >
              <img
                src="/images/terkep-bicserd.png"
                alt="EventVolt Kft. helyszíne"
                className="w-full h-auto block"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
