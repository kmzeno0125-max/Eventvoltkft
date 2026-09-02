import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'Az egész folyamat gördülékenyen zajlott a felméréstől egészen az átadásig. Pontosan érkeztek, precízen dolgoztak, és minden kérdésünkre érthető választ kaptunk.',
    name: 'Kovács Péter',
    project: 'Lakossági villanyszerelés',
  },
  {
    quote:
      'Az új vezérlőszekrény kialakításával sokkal átláthatóbbá és megbízhatóbbá vált a rendszerünk. A kivitelezés gyorsan, a termeléshez igazodva történt.',
    name: 'Szabó Gábor',
    project: 'Vezérlőszekrény-gyártás',
  },
  {
    quote:
      'Olyan automatizálási megoldást kaptunk, amely a mindennapi működésünket is egyszerűbbé tette. Külön értékeltük a pontos kommunikációt és a szakmai hozzáállást.',
    name: 'Nagy Tamás',
    project: 'Ipari automatizálás',
  },
  {
    quote:
      'A felülvizsgálat gyorsan és alaposan megtörtént, a szükséges dokumentációt pedig rövid időn belül megkaptuk. Korrekt és megbízható munkát végeztek.',
    name: 'Varga Zoltán',
    project: 'Villamos Biztonsági Felülvizsgálat',
  },
  {
    quote:
      'A hibát gyorsan megtalálták, majd úgy javították ki, hogy közben részletesen elmagyarázták a probléma okát is. A munkaterületet tisztán adták át.',
    name: 'Tóth András',
    project: 'Villamos hibaelhárítás',
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const active = TESTIMONIALS[activeIndex];

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  function goTo(index: number) {
    setActiveIndex((index + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(distance) > 45) goTo(activeIndex + (distance < 0 ? 1 : -1));
    touchStartX.current = null;
  }

  return (
    <section id="velemenyek" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
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
              Ügyfélvélemények
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight">
            Akik már minket választottak
          </h2>
          <p className="mt-5 text-base md:text-lg text-charcoal/60 font-body leading-relaxed max-w-2xl">
            Megbízható kivitelezés, pontos kommunikáció és hosszú távon működő villamos megoldások.
          </p>
        </motion.div>

        <div
          className="relative min-h-[29rem] md:min-h-[25rem] border-t border-charcoal/10 pt-10 md:pt-14"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute left-0 top-10 md:top-14 text-7xl md:text-9xl font-heading font-bold text-amber leading-none select-none">
            “
          </div>
          <div className="absolute right-0 top-0 hidden md:block w-24 h-24 border-r-2 border-t-2 border-amber/60" />

          <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 h-full pl-8 md:pl-16">
            <div className="relative flex flex-col justify-between min-h-[22rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -28 }}
                  transition={{ duration: 0.45, ease }}
                  className="max-w-4xl"
                >
                  <blockquote className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-[2.65rem] font-semibold text-charcoal leading-[1.2] max-w-4xl">
                    „{active.quote}”
                  </blockquote>
                  <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
                    <span className="font-heading text-base font-bold text-charcoal">
                      {active.name}
                    </span>
                    <span className="hidden sm:block w-8 h-[2px] bg-amber" />
                    <span className="font-body text-sm text-charcoal/50">{active.project}</span>
                  </div>
                  <p className="mt-5 text-xs font-body text-charcoal/35">
                    Fejlesztési minta – publikálás előtt valódi ügyfélvéleményre cserélendő.
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex items-center gap-2">
                  {TESTIMONIALS.map((testimonial, index) => (
                    <button
                      key={testimonial.project}
                      onClick={() => goTo(index)}
                      aria-label={`${index + 1}. vélemény megjelenítése`}
                      className={`h-1 transition-all duration-300 ${
                        index === activeIndex ? 'w-12 bg-amber' : 'w-6 bg-charcoal/15 hover:bg-amber/50'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-heading text-sm font-bold text-charcoal/50 tracking-wider">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex items-end gap-2 lg:pb-1">
              <button
                onClick={() => goTo(activeIndex - 1)}
                aria-label="Előző vélemény"
                className="w-12 h-12 flex items-center justify-center border border-charcoal/20 hover:border-amber hover:text-amber text-charcoal transition-colors duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => goTo(activeIndex + 1)}
                aria-label="Következő vélemény"
                className="w-12 h-12 flex items-center justify-center bg-amber hover:bg-amber-hover text-white transition-colors duration-200"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
