import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
}

const SERVICES: Service[] = [
  {
    id: 'erosaramu',
    number: '01',
    title: 'Erősáramú villamos szerelések',
    description:
      'Ipari és kereskedelmi erősáramú villamos rendszerek tervezése, telepítése és karbantartása.',
    image: '/images/eventvolt-vezerloszekreny-01.jpeg',
  },
  {
    id: 'vezerloszekreny',
    number: '02',
    title: 'Vezérlőszekrény gyártás',
    description:
      'Frekvenciaváltó és lágyindító vezérlőszekrények egyedi tervezése és gyártása.',
    image: '/images/eventvolt-vezerloszekreny-gyartas-01.jpg',
  },
  {
    id: 'hajtasok',
    number: '03',
    title: 'Hajtások kiépítése',
    description:
      'Különböző ipari hajtásrendszerek telepítése, beüzemelése és optimalizálása.',
    image: '/images/eventvolt-hajtasok-kiepitese-01.jpg',
  },
  {
    id: 'plc',
    number: '04',
    title: 'PLC vezérlések',
    description:
      'Programozható logikai vezérlők tervezése, programozása és telepítése ipari környezetbe.',
    image: '/images/eventvolt-plc-vezerlesek-01.jpg',
  },
  {
    id: 'taveleres',
    number: '05',
    title: 'Ipari távelérés',
    description:
      'Távoli megfigyelő és irányítórendszerek kiépítése, biztonságos ipari hálózati megoldások.',
    image: '/images/eventvolt-ipari-taveleres-01.jpg',
  },
  {
    id: 'lakossagi',
    number: '06',
    title: 'Lakossági villanyszerelés',
    description:
      'Otthoni villamos munkák elvégzése, szolgáltatói regisztrációval, precízen és megbízhatóan.',
    image:
      'https://images.pexels.com/photos/3615735/pexels-photo-3615735.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200',
  },
  {
    id: 'vbf',
    number: '07',
    title: 'Villamos Biztonsági Felülvizsgálat (VBF)',
    description:
      'Felülvizsgálat, biztonsági ellenőrzés és hivatalos jegyzőkönyvek készítése – gyorsan, szakszerűen.',
    image: '/images/eventvolt-villamos-biztonsagi-felulvizsgalat-01.jpg',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = SERVICES[activeIndex];

  return (
    <section id="szolgaltatasok" className="relative">
      {/* Diagonal separator */}
      <div
        className="absolute top-0 left-0 w-full h-20 md:h-28 bg-white z-10"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 100%)' }}
      />
      <div className="bg-offwhite pt-32 md:pt-40 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className="mb-16 md:mb-20"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-amber" />
              <span className="text-sm font-medium text-amber tracking-widest uppercase font-body">
                Szolgáltatásaink
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight max-w-2xl">
              Komplex ipari rendszerektől az otthoni szerelésig
            </h2>
          </motion.div>

          {/* Desktop: split showcase */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_1.2fr] gap-12 xl:gap-20 items-start">
            {/* Left: numbered list */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease }}
              className="space-y-1"
            >
              {SERVICES.map((service, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={service.id}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => setActiveIndex(i)}
                    className={`w-full text-left group transition-all duration-300 py-4 px-4 rounded-sm relative ${
                      isActive ? 'bg-white/80' : 'hover:bg-white/40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Accent line */}
                      <div className="relative flex-shrink-0 mt-1">
                        <span
                          className={`block w-[3px] h-8 rounded-full transition-all duration-300 ${
                            isActive ? 'bg-amber scale-y-100' : 'bg-charcoal/10 scale-y-50'
                          }`}
                          style={{ transformOrigin: 'top' }}
                        />
                      </div>
                      <div className="flex items-baseline gap-4 flex-1">
                        <span
                          className={`font-heading text-sm font-semibold tabular-nums transition-colors duration-300 ${
                            isActive ? 'text-amber' : 'text-charcoal/25'
                          }`}
                        >
                          {service.number}
                        </span>
                        <span
                          className={`font-heading text-lg font-semibold transition-colors duration-300 leading-snug ${
                            isActive ? 'text-charcoal' : 'text-charcoal/35'
                          }`}
                        >
                          {service.title}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </motion.div>

            {/* Right: showcase image + description */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease }}
              className="sticky top-28"
            >
              <div className="relative">
                {/* Orange accent behind image */}
                <div
                  className="absolute -top-3 -right-3 w-full h-full"
                  style={{
                    backgroundColor: '#E8930C',
                    clipPath: 'polygon(4% 0, 100% 0, 100% 96%, 0% 100%)',
                  }}
                />
                <div
                  className="relative overflow-hidden bg-charcoal"
                  style={{
                    clipPath: 'polygon(4% 0, 100% 0, 100% 96%, 0% 100%)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={active.id}
                      src={active.image}
                      alt={active.title}
                      loading="lazy"
                      className="w-full h-[420px] xl:h-[480px] object-cover"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, ease }}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />

                  {/* Text overlay */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.id + '-text'}
                      className="absolute bottom-0 left-0 right-0 p-6 xl:p-8"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-amber font-heading font-bold text-2xl">
                          {active.number}
                        </span>
                        <span className="w-6 h-[2px] bg-amber" />
                      </div>
                      <h3 className="font-heading text-xl xl:text-2xl font-bold text-white mb-2">
                        {active.title}
                      </h3>
                      <p className="text-white/80 font-body text-sm xl:text-base leading-relaxed max-w-md">
                        {active.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile: stacked blocks */}
          <div className="lg:hidden space-y-8">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, ease, delay: i * 0.05 }}
                className="relative"
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    clipPath: 'polygon(3% 0, 100% 0, 100% 95%, 0% 100%)',
                  }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-56 sm:h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-amber font-heading font-bold text-lg">
                        {service.number}
                      </span>
                      <span className="w-5 h-[2px] bg-amber" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white mb-1">
                      {service.title}
                    </h3>
                    <p className="text-white/75 font-body text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="mt-16 md:mt-20 flex flex-col gap-5"
          >
            <Link
              to="/szolgaltatasok"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-amber hover:bg-amber-hover text-white font-heading font-semibold rounded transition-colors duration-200 w-fit"
            >
              Szolgáltatásaink részletesen
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/kapcsolat"
              className="group inline-flex items-center gap-2 text-amber hover:text-amber-hover font-heading font-semibold text-base transition-colors duration-200"
            >
              Nem találja, amit keres? Kérjen ingyenes árajánlatot
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
