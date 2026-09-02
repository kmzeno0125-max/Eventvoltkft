import { useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2, AlertCircle, Facebook, Instagram } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
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

const INITIAL: FormState = { name: '', company: '', email: '', phone: '', service: '', message: '' };

function UnderlineInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  textarea = false,
  required = false,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const baseClass =
    'w-full bg-transparent border-0 border-b border-charcoal/15 focus:border-amber outline-none py-3 text-charcoal font-body text-base placeholder-charcoal/30 transition-colors duration-200';

  return (
    <div>
      <label className="block text-xs font-heading font-semibold text-charcoal/40 tracking-wider uppercase mb-1">
        {label}
        {required && <span className="text-amber ml-0.5">*</span>}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={3}
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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <section id="kapcsolat" className="py-20 md:py-28 bg-offwhite">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="mb-14 md:mb-16"
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

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16">
          {/* Left: form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="space-y-6">
              <UnderlineInput label="Név" name="name" value={form.name} onChange={handleChange} required />
              <UnderlineInput
                label="Cégnév"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
              />
              <UnderlineInput
                label="E-mail"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
              />
              <UnderlineInput
                label="Telefonszám"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                required
              />

              <div>
                <label className="block text-xs font-heading font-semibold text-charcoal/40 tracking-wider uppercase mb-1">
                  Melyik szolgáltatás iránt érdeklődik?<span className="text-amber ml-0.5">*</span>
                </label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-0 border-b border-charcoal/15 focus:border-amber outline-none py-3 text-charcoal font-body text-base transition-colors duration-200"
                >
                  <option value="" disabled>Válasszon szolgáltatást...</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <UnderlineInput
                label="Üzenet"
                name="message"
                value={form.message}
                onChange={handleChange}
                textarea
              />

              <button
                onClick={handleSubmit}
                disabled={isDisabled}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-amber hover:bg-amber-hover disabled:bg-charcoal/20 disabled:cursor-not-allowed text-white font-heading font-bold text-base rounded transition-colors duration-200 mt-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Küldés...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 size={18} />
                    Elküldve!
                  </>
                ) : (
                  <>
                    Ingyenes árajánlat kérése
                    <Send
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

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
            </div>
          </motion.div>

          {/* Right: contact info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-heading text-xl font-bold text-charcoal mb-6">
                Elérhetőségek
              </h3>

              <div className="space-y-6">
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
