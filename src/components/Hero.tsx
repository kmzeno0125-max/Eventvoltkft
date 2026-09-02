import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

const HERO_IMAGE = '/images/eventvolt-hero-villanyszereles-01.jpg';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <section
      id="fooldal"
      className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20 md:pt-0"
    >
      {/* Diagonal accent background */}
      <div
        className="absolute top-0 right-0 w-[55%] h-full hidden lg:block"
        style={{
          clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)',
          backgroundColor: '#F5F5F3',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">
          {/* Text side */}
          <div className="order-2 lg:order-1 pb-12 lg:pb-0">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="w-8 h-[2px] bg-amber" />
              <span className="text-sm font-medium text-charcoal/60 tracking-wide uppercase font-body">
                EventVolt Kft
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.25 }}
              className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-charcoal leading-[1.1] tracking-tight"
            >
              Ipari automatizálástól{' '}
              <span className="relative">
                a lakossági
                <span
                  className="absolute -bottom-1 left-0 w-full h-[3px] rounded"
                  style={{ backgroundColor: '#E8930C' }}
                />
              </span>{' '}
              villanyszerelésig
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.4 }}
              className="mt-6 text-lg md:text-xl text-charcoal/60 font-body max-w-lg leading-relaxed"
            >
              Teljes körű villamos szakszolgáltatás &ndash; tervezéstől a megvalósításig.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.55 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="#kapcsolat"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-amber hover:bg-amber-hover text-white font-heading font-semibold rounded transition-colors duration-200"
              >
                Ingyenes árajánlat
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
              <a
                href="#szolgaltatasok"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-charcoal/15 hover:border-amber text-charcoal font-heading font-semibold rounded transition-colors duration-200"
              >
                Szolgáltatásaink
              </a>
            </motion.div>
          </div>

          {/* Image side */}
          <motion.div
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
                  backgroundColor: '#E8930C',
                  clipPath: 'polygon(8% 0, 100% 0, 100% 92%, 0% 100%)',
                }}
              />
              <div
                className="relative overflow-hidden rounded-sm"
                style={{
                  clipPath: 'polygon(8% 0, 100% 0, 100% 92%, 0% 100%)',
                }}
              >
                <img
                  src={HERO_IMAGE}
                  alt="Ipari vezérlőszekrény kábelezés"
                  className="w-full h-[50vh] lg:h-[70vh] object-cover"
                />
                <div className="absolute inset-0 bg-charcoal/10" />
              </div>
            </div>

            {/* Stats badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.7 }}
              className="absolute -bottom-4 -left-2 md:left-4 md:-bottom-6 bg-white shadow-xl rounded-sm px-5 py-4 flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center"
                style={{ backgroundColor: '#E8930C' }}
              >
                <span className="text-white font-heading font-bold text-lg">15+</span>
              </div>
              <div>
                <p className="font-heading font-semibold text-charcoal text-sm">Év tapasztalat</p>
                <p className="text-xs text-charcoal/50 font-body">Ipari & lakossági projektek</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-charcoal/40 font-body tracking-wider uppercase">
          Görgess
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-charcoal/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
