import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="cta" ref={ref} className="relative overflow-hidden bg-charcoal">
      {/* Large diagonal lightning graphic */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute right-0 top-0 h-full w-1/2 opacity-10"
          viewBox="0 0 400 500"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M180 0 L80 220 L160 220 L100 500"
            stroke="#E8930C"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M240 0 L340 220 L260 220 L320 500"
            stroke="#E8930C"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Diagonal top accent */}
      <div
        className="absolute top-0 left-0 w-full h-3"
        style={{
          backgroundColor: '#E8930C',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 30%)',
        }}
      />

      {/* Animated impulse line */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-amber"
        initial={{ width: '0%', opacity: 0 }}
        animate={inView ? { width: '100%', opacity: [0, 1, 1, 0.4] } : {}}
        transition={{ duration: 1.8, ease }}
        style={{ boxShadow: '0 0 12px rgba(232,147,12,0.6)' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 py-20 md:py-32 text-center">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="w-8 h-[2px] bg-amber" />
          <span className="text-sm font-medium text-amber tracking-widest uppercase font-body">
            Kapcsolat
          </span>
          <span className="w-8 h-[2px] bg-amber" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto"
        >
          Villamos munkára van szüksége?{' '}
          <span className="text-amber">Kérjen ingyenes árajánlatot.</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
          className="mt-6 text-lg md:text-xl text-white/50 font-body max-w-2xl mx-auto leading-relaxed"
        >
          Válaszolunk 24 órán belül. Ipari és lakossági feladatokat egyaránt vállalunk.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <a
            href="#kapcsolat"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-amber hover:bg-amber-hover text-white font-heading font-bold text-lg rounded transition-colors duration-200"
          >
            Ingyenes árajánlat
            <ArrowRight
              size={20}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>

          <a
            href="tel:+36303067031"
            className="group inline-flex items-center gap-2.5 text-white/70 hover:text-amber font-heading font-semibold text-lg transition-colors duration-200"
          >
            <Phone size={18} className="text-amber" />
            +36 30 306 7031
          </a>
        </motion.div>
      </div>

      {/* Bottom diagonal accent */}
      <div
        className="absolute bottom-0 left-0 w-full h-3"
        style={{
          backgroundColor: '#E8930C',
          clipPath: 'polygon(0 70%, 100% 0, 100% 100%, 0 100%)',
        }}
      />
    </section>
  );
}
