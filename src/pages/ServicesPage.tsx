import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ease = [0.22, 1, 0.36, 1] as const;
const AMBER = '#E8930C';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
interface ServiceDetail {
  id: string;
  number: string;
  title: string;
  intro: string;
  includes: string[];
  audience: string;
  image: string;
}

const SERVICES: ServiceDetail[] = [
  {
    id: 'erosaramu',
    number: '01',
    title: 'Erősáramú villamos szerelések',
    intro:
      'Ipari és kereskedelmi erősáramú villamos rendszerek kialakítása, fejlesztése és karbantartása a biztonságos, üzembiztos működés érdekében.',
    includes: [
      'villamos hálózatok kiépítése és korszerűsítése',
      'elosztók és betáplálási rendszerek kialakítása',
      'ipari kábelezés',
      'karbantartás és hibaelhárítás',
      'meglévő rendszerek felmérése',
    ],
    audience: 'Ipari üzemeknek, műhelyeknek, kereskedelmi létesítményeknek és kivitelezőknek.',
    image: '/images/eventvolt-vezerloszekreny-01.jpeg',
  },
  {
    id: 'vezerloszekreny',
    number: '02',
    title: 'Vezérlőszekrény-gyártás',
    intro:
      'Egyedi vezérlőszekrények tervezése és gyártása az adott géphez, technológiához és működési igényhez igazítva.',
    includes: [
      'igényfelmérés és műszaki tervezés',
      'frekvenciaváltós vezérlések',
      'lágyindítós megoldások',
      'alkatrészek beépítése és bekötése',
      'tesztelés és beüzemelés',
    ],
    audience: 'Gépgyártóknak, ipari vállalkozásoknak, üzemeltetőknek és rendszerintegrátoroknak.',
    image: '/images/eventvolt-vezerloszekreny-gyartas-01.jpg',
  },
  {
    id: 'hajtasok',
    number: '03',
    title: 'Hajtások kiépítése',
    intro:
      'Ipari motorok és hajtásrendszerek szakszerű telepítése, beállítása és optimalizálása.',
    includes: [
      'frekvenciaváltók telepítése',
      'lágyindítók beépítése',
      'motorvezérlések kialakítása',
      'paraméterezés és beüzemelés',
      'működésoptimalizálás és hibakeresés',
    ],
    audience: 'Gyártóüzemeknek, gépüzemeltetőknek és automatizált rendszereket használó vállalkozásoknak.',
    image: '/images/eventvolt-hajtasok-kiepitese-01.jpg',
  },
  {
    id: 'plc',
    number: '04',
    title: 'PLC-vezérlések',
    intro:
      'Programozható logikai vezérlők tervezése, programozása és rendszerbe integrálása az automatizált működés érdekében.',
    includes: [
      'vezérlési folyamat megtervezése',
      'PLC-programozás',
      'érzékelők és beavatkozók integrálása',
      'tesztelés és beüzemelés',
      'meglévő vezérlések módosítása és hibakeresése',
    ],
    audience: 'Gépgyártóknak, termelőüzemeknek és automatizálni kívánt folyamatokkal rendelkező cégeknek.',
    image: '/images/eventvolt-plc-vezerlesek-01.jpg',
  },
  {
    id: 'taveleres',
    number: '05',
    title: 'Ipari távelérés',
    intro:
      'Biztonságos távoli megfigyelési és hozzáférési megoldások ipari berendezésekhez és vezérlőrendszerekhez.',
    includes: [
      'távoli állapotfelügyelet',
      'biztonságos hálózati kapcsolat',
      'távoli diagnosztika',
      'működési adatok elérése',
      'gyorsabb hibafeltárást támogató megoldások',
    ],
    audience: 'Több telephelyet vagy folyamatosan működő ipari rendszereket üzemeltető vállalkozásoknak.',
    image: '/images/eventvolt-ipari-taveleres-01.jpg',
  },
  {
    id: 'lakossagi',
    number: '06',
    title: 'Lakossági villanyszerelés',
    intro:
      'Teljes körű otthoni villamos munkák új építés, felújítás vagy hibaelhárítás esetén.',
    includes: [
      'új villamos hálózat kiépítése',
      'meglévő hálózat korszerűsítése',
      'elosztószekrények kialakítása és cseréje',
      'kapcsolók, aljzatok és világítás telepítése',
      'hibakeresés és javítás',
      'szolgáltatói regisztrációhoz kapcsolódó munkák',
    ],
    audience: 'Magánszemélyeknek, ingatlantulajdonosoknak, társasházaknak és lakossági kivitelezőknek.',
    image:
      'https://images.pexels.com/photos/3615735/pexels-photo-3615735.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
  },
  {
    id: 'vbf',
    number: '07',
    title: 'Villamos Biztonsági Felülvizsgálat (VBF)',
    intro:
      'Villamos berendezések és hálózatok biztonsági állapotának szakszerű ellenőrzése, mérése és dokumentálása.',
    includes: [
      'helyszíni állapotfelmérés',
      'szükséges villamos mérések',
      'hibák és hiányosságok feltárása',
      'hivatalos jegyzőkönyv elkészítése',
      'javítási javaslatok összefoglalása',
    ],
    audience:
      'Lakóingatlanok, üzlethelyiségek, irodák, ipari létesítmények és ingatlantulajdonosok számára.',
    image: '/images/eventvolt-villamos-biztonsagi-felulvizsgalat-01.jpg',
  },
];

const HERO_IMAGE = '/images/eventvolt-szolgaltatasok-menupont-hero.jpg';

/* ------------------------------------------------------------------ */
/*  SEO                                                                */
/* ------------------------------------------------------------------ */
function useSEO(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
    return () => {
      document.title = 'EventVolt Kft – Ipari és lakossági villanyszerelés | Bicsérd';
      if (meta)
        meta.setAttribute(
          'content',
          'EventVolt Kft – Teljes körű villamos szakszolgáltatás Bicsérden: ipari automatizálás, erősáramú szerelés, PLC vezérlés, vezérlőszekrény gyártás, lakossági villanyszerelés és VBF felülvizsgálat. Ingyenes árajánlat 24 órán belül.',
        );
    };
  }, [title, description]);
}

/* ------------------------------------------------------------------ */
/*  Hook: navigate to homepage then scroll to #kapcsolat              */
/* ------------------------------------------------------------------ */
function useGoToContact() {
  const navigate = useNavigate();
  return useCallback(() => {
    navigate('/');
    setTimeout(() => {
      const el = document.querySelector('#kapcsolat');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  }, [navigate]);
}

/* ------------------------------------------------------------------ */
/*  Scroll progress bar                                                */
/* ------------------------------------------------------------------ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
      style={{ scaleX, backgroundColor: AMBER }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
function Hero() {
  const goToContact = useGoToContact();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 xl:gap-24 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="w-8 h-[2px] bg-amber" />
              <span className="text-sm font-medium text-amber tracking-widest uppercase font-body">
                Szolgáltatásaink
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-charcoal leading-[1.08] tracking-tight"
            >
              Komplex villamos{' '}
              <span className="relative">
                megoldások
                <span
                  className="absolute -bottom-1 left-0 w-full h-[3px] rounded"
                  style={{ backgroundColor: AMBER }}
                />
              </span>{' '}
              egy kézben
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.35 }}
              className="mt-6 text-lg text-charcoal/60 font-body leading-relaxed max-w-xl"
            >
              Az ipari automatizálástól és vezérlőszekrény-gyártástól egészen a lakossági
              villanyszerelésig teljes körű, megbízható megoldásokat biztosítunk.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.5 }}
              className="mt-9"
            >
              <button
                onClick={goToContact}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-amber hover:bg-amber-hover text-white font-heading font-semibold rounded transition-colors duration-200"
              >
                Ingyenes árajánlat
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>
            </motion.div>
          </motion.div>

          {/* Image side */}
          <motion.div
            ref={parallaxRef}
            initial={{ opacity: 0, x: 60, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, ease, delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative">
              {/* Orange accent frame */}
              <div
                className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-full h-full rounded-sm"
                style={{
                  backgroundColor: AMBER,
                  clipPath: 'polygon(8% 0, 100% 0, 100% 92%, 0% 100%)',
                }}
              />
              <div
                className="relative overflow-hidden rounded-sm"
                style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 92%, 0% 100%)' }}
              >
                <motion.img
                  src={HERO_IMAGE}
                  alt="Ipari vezérlőszekrény"
                  loading="lazy"
                  className="w-full h-[45vh] lg:h-[65vh] object-cover scale-110"
              style={{ y: imageY }}
                />
                <div className="absolute inset-0 bg-charcoal/10" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Service selector (sticky sidebar / mobile scroll)                 */
/* ------------------------------------------------------------------ */
function ServiceSelector({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {/* Desktop sticky sidebar */}
      <div className="hidden lg:block sticky top-28 self-start">
        <div className="space-y-1">
          {SERVICES.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`w-full text-left group transition-all duration-300 py-3 px-4 rounded-sm relative ${
                  isActive ? 'bg-white/80' : 'hover:bg-white/40'
                }`}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className={`block w-[3px] h-7 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-amber scale-y-100' : 'bg-charcoal/10 scale-y-50'
                    }`}
                    style={{ transformOrigin: 'top' }}
                  />
                  <span
                    className={`font-heading text-sm font-semibold tabular-nums transition-colors duration-300 ${
                      isActive ? 'text-amber' : 'text-charcoal/25'
                    }`}
                  >
                    {s.number}
                  </span>
                  <span
                    className={`font-heading text-base font-semibold transition-colors duration-300 leading-snug ${
                      isActive ? 'text-charcoal' : 'text-charcoal/35'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile horizontal scroll */}
      <div className="lg:hidden -mx-5 px-5 overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {SERVICES.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`flex items-baseline gap-2 whitespace-nowrap py-2.5 px-4 rounded-sm border transition-all duration-200 ${
                  isActive
                    ? 'border-amber bg-amber/5'
                    : 'border-charcoal/10 text-charcoal/40'
                }`}
              >
                <span
                  className={`font-heading text-xs font-bold tabular-nums ${
                    isActive ? 'text-amber' : 'text-charcoal/25'
                  }`}
                >
                  {s.number}
                </span>
                <span
                  className={`font-heading text-sm font-semibold ${
                    isActive ? 'text-charcoal' : 'text-charcoal/40'
                  }`}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Single service block                                               */
/* ------------------------------------------------------------------ */
function ServiceBlock({
  service,
  index,
  goToContact,
}: {
  service: ServiceDetail;
  index: number;
  goToContact: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const reversed = index % 2 === 1;

  return (
    <section
      ref={ref}
      id={service.id}
      className="scroll-mt-28 py-14 md:py-20"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-center`}>
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease }}
            className={reversed ? 'lg:order-2' : 'lg:order-1'}
          >
            {/* Big number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease }}
              className="flex items-baseline gap-4 mb-4"
            >
              <span className="font-heading text-6xl md:text-7xl xl:text-8xl font-bold text-amber/15 tabular-nums leading-none">
                {service.number}
              </span>
              <span className="w-12 h-[2px] bg-amber" />
            </motion.div>

            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal leading-tight mb-4">
              {service.title}
            </h3>

            <p className="text-charcoal/60 font-body text-base lg:text-lg leading-relaxed mb-8 max-w-lg">
              {service.intro}
            </p>

            {/* Mit tartalmazhat? */}
            <div className="mb-6">
              <h4 className="text-xs font-heading font-bold text-amber tracking-widest uppercase mb-3">
                Mit tartalmazhat?
              </h4>
              <ul className="space-y-2">
                {service.includes.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease, delay: 0.1 + i * 0.05 }}
                    className="flex items-start gap-3 text-charcoal/70 font-body text-sm lg:text-base"
                  >
                    <span
                      className="mt-2.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: AMBER }}
                    />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Kinek ajánlott? */}
            <div className="mb-8">
              <h4 className="text-xs font-heading font-bold text-amber tracking-widest uppercase mb-2">
                Kinek ajánlott?
              </h4>
              <p className="text-charcoal/60 font-body text-sm lg:text-base leading-relaxed max-w-lg">
                {service.audience}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={goToContact}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-amber hover:bg-amber-hover text-white font-heading font-semibold text-sm rounded transition-colors duration-200"
            >
              Ajánlatot kérek erre a szolgáltatásra
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </motion.div>

          {/* Image */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: reversed ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease }}
            className={reversed ? 'lg:order-1' : 'lg:order-2'}
          >
            <div className="relative">
              {/* Orange accent */}
              <div
                className={`absolute ${
                  reversed
                    ? '-top-3 -left-3 md:-top-5 md:-left-5'
                    : '-top-3 -right-3 md:-top-5 md:-right-5'
                } w-full h-full rounded-sm`}
                style={{
                  backgroundColor: AMBER,
                  clipPath: reversed
                    ? 'polygon(0 4%, 100% 0, 96% 100%, 0 96%)'
                    : 'polygon(4% 0, 100% 0, 100% 96%, 0 100%)',
                }}
              />
              <div
                className="relative overflow-hidden rounded-sm bg-charcoal"
                style={{
                  clipPath: reversed
                    ? 'polygon(0 4%, 100% 0, 96% 100%, 0 96%)'
                    : 'polygon(4% 0, 100% 0, 100% 96%, 0 100%)',
                }}
              >
                <motion.img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-[40vh] lg:h-[55vh] object-cover scale-110 transition-transform duration-700 ease-out hover:scale-[1.15]"
                  style={{ y: imageY }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
                {/* Number overlay */}
                <div className="absolute top-5 right-5">
                  <span className="font-heading text-5xl md:text-6xl font-bold text-white/15 tabular-nums">
                    {service.number}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Closing CTA                                                        */
/* ------------------------------------------------------------------ */
function ClosingCTA() {
  const goToContact = useGoToContact();

  return (
    <section className="relative overflow-hidden bg-charcoal">
      <div
        className="absolute top-0 left-0 w-full h-3"
        style={{ backgroundColor: AMBER, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 30%)' }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute right-0 top-0 h-full w-1/2 opacity-10"
          viewBox="0 0 400 500"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M180 0 L80 220 L160 220 L100 500"
            stroke={AMBER}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease }}
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto"
        >
          Nem biztos benne, melyik megoldásra van szüksége?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="mt-6 text-lg text-white/50 font-body max-w-2xl mx-auto leading-relaxed"
        >
          Mondja el a feladatot, és segítünk megtalálni a megfelelő villamos megoldást.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
          className="mt-10"
        >
          <button
            onClick={goToContact}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-amber hover:bg-amber-hover text-white font-heading font-bold text-lg rounded transition-colors duration-200"
          >
            Ingyenes árajánlat kérése
            <ArrowRight
              size={20}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-3"
        style={{ backgroundColor: AMBER, clipPath: 'polygon(0 70%, 100% 0, 100% 100%, 0 100%)' }}
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function ServicesPage() {
  useSEO(
    'Szolgáltatások – EventVolt Kft | Ipari és lakossági villanyszerelés',
    'EventVolt Kft szolgáltatások: erősáramú villamos szerelések, vezérlőszekrény-gyártás, hajtások kiépítése, PLC-vezérlések, ipari távelérés, lakossági villanyszerelés és villamos biztonsági felülvizsgálat (VBF).',
  );

  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const goToContact = useGoToContact();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );

    SERVICES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) {
        sectionRefs.current[s.id] = el;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleSelect = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <ScrollProgress />
      <Navbar visible={true} />
      <main>
        <Hero />

        {/* Selector + detailed blocks */}
        <div className="bg-offwhite py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 xl:gap-16">
              <ServiceSelector activeId={activeId} onSelect={handleSelect} />

              <div className="mt-10 lg:mt-0">
                {SERVICES.map((service, i) => (
                  <ServiceBlock
                    key={service.id}
                    service={service}
                    index={i}
                    goToContact={goToContact}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
