import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ABOUT_IMAGE = '/images/eventvolt-rolunk-szakertelmunk-01.jpg';

const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                             */
/* ------------------------------------------------------------------ */
function useCounter(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return count;
}

/* ------------------------------------------------------------------ */
/*  Single stat item                                                  */
/* ------------------------------------------------------------------ */
function StatItem({
  value,
  suffix,
  label,
  started,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  started: boolean;
  index: number;
}) {
  const count = useCounter(value, 2000, started);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease, delay: index * 0.12 }}
      className="text-center"
    >
      <span className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-amber">
        {count}
        {suffix}
      </span>
      <p className="mt-2 text-sm sm:text-base text-charcoal/50 font-body">{label}</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats strip                                                       */
/* ------------------------------------------------------------------ */
// Replace values when the client provides real data
const STATS = [
  { value: 10, suffix: '+', label: 'Év tapasztalat' },
  { value: 200, suffix: '+', label: 'Befejezett projekt' },
  { value: 100, suffix: '%', label: 'Szakszerű kivitelezés' },
  { value: 24, suffix: ' ó', label: 'Válaszidő' },
];

function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      {/* Diagonal accent */}
      <div
        className="absolute inset-0 bg-offwhite"
        style={{ clipPath: 'polygon(0 6%, 100% 0, 100% 94%, 0 100%)' }}
      />
      <div className="absolute left-0 top-0 w-24 h-full bg-amber/5" />
      <div
        ref={ref}
        className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
      >
        {STATS.map((stat, i) => (
          <StatItem
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            started={inView}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Process timeline                                                  */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    title: 'Felmérés & konzultáció',
    desc: 'Helyszíni felmérést végzünk és közösen átbeszéljük az igényeket, hogy pontosan értsük a feladatot.',
  },
  {
    title: 'Tervezés & árajánlat',
    desc: 'Részletes műszaki tervet és transzparens árajánlatot készítünk, rejtett költségek nélkül.',
  },
  {
    title: 'Kivitelezés',
    desc: 'Tapasztalt szakembereink elvégzik a munkát – határidőre, biztonsági előírások szerint.',
  },
  {
    title: 'Átadás & felülvizsgálat',
    desc: 'A befejezett munkát tételesen átadjuk, dokumentáljuk, és elvégezzük a biztonsági felülvizsgálatot.',
  },
];

function ProcessTimeline() {
  return (
    <div className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="mb-14 md:mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-amber" />
            <span className="text-sm font-medium text-amber tracking-widest uppercase font-body">
              Folyamat
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight max-w-xl">
            Hogyan dolgozunk
          </h2>
        </motion.div>

        {/* Desktop timeline */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div className="absolute top-6 left-0 right-0 h-[2px] bg-charcoal/8" />
          <motion.div
            className="absolute top-6 left-0 h-[2px] bg-amber origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.4, ease }}
            style={{ width: '100%' }}
          />

          <div className="grid grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <TimelineNode key={i} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-charcoal/8" />
          <motion.div
            className="absolute left-[11px] top-0 w-[2px] bg-amber origin-top"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.4, ease }}
            style={{ height: '100%' }}
          />
          <div className="space-y-10">
            {STEPS.map((step, i) => (
              <MobileTimelineNode key={i} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Transition to references */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mt-20 md:mt-28 text-center"
        >
          <p className="text-charcoal/50 font-body text-lg mb-4">
            Az eredmény magáért beszél.
          </p>
          <a
            href="/referenciak"
            className="group inline-flex items-center gap-2 text-amber hover:text-amber-hover font-heading font-semibold text-lg transition-colors duration-200"
          >
            Tekintse meg referenciáinkat
            <ArrowRight
              size={20}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
        </motion.div>
      </div>
    </div>
  );
}

function TimelineNode({
  step,
  index,
}: {
  step: { title: string; desc: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease, delay: index * 0.15 }}
      className="relative pt-14"
    >
      {/* Node dot */}
      <div className="absolute top-0 left-0">
        <div
          className={`w-[13px] h-[13px] rounded-full border-[2.5px] border-amber transition-all duration-500 ${
            inView ? 'bg-amber shadow-[0_0_12px_rgba(232,147,12,0.5)]' : 'bg-white'
          }`}
        />
      </div>
      <span className="text-xs font-heading font-bold text-amber tracking-wider mb-2 block">
        0{index + 1}
      </span>
      <h3 className="font-heading text-lg font-bold text-charcoal mb-2 leading-snug">
        {step.title}
      </h3>
      <p className="text-sm text-charcoal/50 font-body leading-relaxed">{step.desc}</p>
    </motion.div>
  );
}

function MobileTimelineNode({
  step,
  index,
}: {
  step: { title: string; desc: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, ease, delay: index * 0.1 }}
      className="relative"
    >
      {/* Node dot */}
      <div className="absolute -left-8 top-1">
        <div
          className={`w-[11px] h-[11px] rounded-full border-2 border-amber transition-all duration-500 ${
            inView ? 'bg-amber shadow-[0_0_10px_rgba(232,147,12,0.5)]' : 'bg-white'
          }`}
        />
      </div>
      <span className="text-xs font-heading font-bold text-amber tracking-wider mb-1 block">
        0{index + 1}
      </span>
      <h3 className="font-heading text-base font-bold text-charcoal mb-1">{step.title}</h3>
      <p className="text-sm text-charcoal/50 font-body leading-relaxed">{step.desc}</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main About section                                                */
/* ------------------------------------------------------------------ */
export default function About() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section id="rolunk">
      {/* Two-column about block */}
      <div className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 xl:gap-24 items-center">
            {/* Left: parallax image */}
            <motion.div
              ref={parallaxRef}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative overflow-hidden rounded-sm" style={{
                clipPath: 'polygon(0 0, 96% 0, 100% 4%, 100% 100%, 4% 100%, 0 96%)',
              }}>
                <motion.img
                  src={ABOUT_IMAGE}
                  alt="Villanyszerelő munka közben"
                  loading="lazy"
                  className="w-full h-[50vh] lg:h-[65vh] object-cover scale-110"
                  style={{ y: imageY }}
                />
              </div>
              {/* Orange corner accent */}
              <div className="absolute -bottom-3 -left-3 w-20 h-20 md:w-28 md:h-28">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: '#E8930C',
                    clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
                  }}
                />
              </div>
            </motion.div>

            {/* Right: text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease }}
              className="order-1 lg:order-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-amber" />
                <span className="text-sm font-medium text-amber tracking-widest uppercase font-body">
                  Rólunk
                </span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight mb-6">
                Szakértelem, amire építeni lehet
              </h2>
              <p className="text-charcoal/60 font-body text-base lg:text-lg leading-relaxed mb-6 max-w-lg">
                Az EventVolt Kft teljes körű villamos szakszolgáltatást nyújt &ndash; az ipari
                automatizálástól a lakossági villanyszerelésig, a tervezéstől a megvalósításig.
              </p>
              <p className="text-charcoal/60 font-body text-base lg:text-lg leading-relaxed max-w-lg">
                Minden feladatot precizitással és szakértelemmel végzünk, legyen szó komplex ipari
                rendszerről vagy otthoni szerelésről.
              </p>
              {/* Subtle accent */}
              <div className="mt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-amber/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8930C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span className="font-heading text-sm font-semibold text-charcoal/70">
                  Megbízhatóság &middot; Precizitás &middot; Szakértelem
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <StatsStrip />

      {/* Process timeline */}
      <ProcessTimeline />
    </section>
  );
}
