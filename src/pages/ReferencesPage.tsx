import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
// Replace these placeholder images with the company's own project photos.
// Real project photos make this section far more credible and authentic.

type Category =
  | 'Ipari villanyszerelés'
  | 'Vezérlőszekrények és automatizálás'
  | 'Lakossági villanyszerelés'
  | 'Biztonsági felülvizsgálatok';

interface GalleryItem {
  id: string;
  title: string;
  category: Category;
  desc: string;
  image: string;
  span: 'tall' | 'wide' | 'normal';
}

const GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Ipari vezérlőszekrény gyártás',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'Tervezéstől a bekötésig – teljes körű vezérlőszekrény gyártás és dokumentáció.',
    image: '/images/eventvolt-vezerloszekreny-01.jpeg',
    span: 'tall',
  },
  {
    id: 'g3',
    title: 'PLC vezérlés programozása',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'PLC programozás és ipari kommunikáció hálózatok kiépítése.',
    image:
      '/images/WhatsApp%20Image%202026-08-05%20at%2020.27.46.jpeg',
    span: 'tall',
  },
  {
    id: 'g4',
    title: 'Lakossági villanyszerelés',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'Új építésű családi ház teljes villanyszerelése és átadása.',
    image:
      '/images/WhatsApp%20Image%202026-08-05%20at%2020.27.47%20(1).jpeg',
    span: 'normal',
  },
  {
    id: 'g5',
    title: 'Ipari csarnok kábelezés',
    category: 'Ipari villanyszerelés',
    desc: 'Erőáramú kábelezés és elosztás ipari termelési csarnokban.',
    image:
      '/images/WhatsApp%20Image%202026-08-05%20at%2020.31.44%20(1).jpeg',
    span: 'normal',
  },
  {
    id: 'g6',
    title: 'VBF felülvizsgálat',
    category: 'Ipari villanyszerelés',
    desc: 'Villamos biztonsági felülvizsgálat és dokumentált jegyzőkönyv kiállítása.',
    image:
      '/images/WhatsApp%20Image%202026-08-05%20at%2020.31.51.jpeg',
    span: 'wide',
  },
  {
    id: 'g7',
    title: 'Villamos kivitelezés',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'Szakmai munka a gyakorlatban.',
    image:
      '/images/WhatsApp%20Image%202026-08-05%20at%2020.27.45.jpeg',
    span: 'normal',
  },
  {
    id: 'g8',
    title: 'Villamos kivitelezés',
    category: 'Ipari villanyszerelés',
    desc: 'Szakmai munka a gyakorlatban.',
    image:
      '/images/WhatsApp%20Image%202026-08-05%20at%2020.27.43.jpeg',
    span: 'normal',
  },
  {
    id: 'g9',
    title: 'Villamos kivitelezés',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'Szakmai munka a gyakorlatban.',
    image:
      '/images/WhatsApp%20Image%202026-08-05%20at%2020.27.44%20(3).jpeg',
    span: 'normal',
  },
  {
    id: 'g10',
    title: 'Villamos kivitelezés',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'Szakmai munka a gyakorlatban.',
    image:
      '/images/WhatsApp%20Image%202026-08-05%20at%2020.27.45%20(1).jpeg',
    span: 'normal',
  },
  {
    id: 'g11',
    title: 'Vezérlőszekrény HMI kijelzővel',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'Vezérlőszekrény HMI kijelzővel és kezelőfelülettel.',
    image:
      '/images/eventvolt-vezerloszekreny-hmi-kijelzovel-01.jpeg',
    span: 'normal',
  },
  {
    id: 'g12',
    title: 'Ipari HMI kezelőfelület',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'Ipari HMI kezelőfelület tervezése és bekötése.',
    image:
      '/images/eventvolt-ipari-hmi-kezelofelulet-01.jpeg',
    span: 'normal',
  },
  {
    id: 'g13',
    title: 'Vezérlőpult HMI-vel és kapcsolókkal',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'Vezérlőpult kezelőpanellel, HMI kijelzővel és kapcsolókkal.',
    image:
      '/images/eventvolt-vezerlopult-hmi-kapcsolokkal-01.jpeg',
    span: 'normal',
  },
  {
    id: 'g14',
    title: 'Vezérlőszekrény ajtajának kapcsolóegységei',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'Vezérlőszekrény ajtajának belső kapcsolóegységei.',
    image:
      '/images/eventvolt-vezerloszekreny-ajto-kapcsoloegyseg-01.jpeg',
    span: 'normal',
  },
  {
    id: 'g15',
    title: 'Frekvenciaváltós vezérlőszekrények',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'Több frekvenciaváltóval felszerelt vezérlőszekrény.',
    image:
      '/images/eventvolt-frekvenciavaltos-vezerloszekrenyek-01.jpeg',
    span: 'normal',
  },
  {
    id: 'g16',
    title: 'Vezérlőszekrény 24V-os modulokkal',
    category: 'Vezérlőszekrények és automatizálás',
    desc: 'Vezérlőszekrény belső vezetékezése és 24 V-os moduljai.',
    image:
      '/images/eventvolt-vezerloszekreny-24v-modulok-01.jpeg',
    span: 'normal',
  },
];

const CATEGORIES: { label: string; value: Category | 'all' }[] = [
  { label: 'Összes', value: 'all' },
  { label: 'Ipari villanyszerelés', value: 'Ipari villanyszerelés' },
  { label: 'Vezérlőszekrények és automatizálás', value: 'Vezérlőszekrények és automatizálás' },
  { label: 'Lakossági villanyszerelés', value: 'Lakossági villanyszerelés' },
  { label: 'Biztonsági felülvizsgálatok', value: 'Biztonsági felülvizsgálatok' },
];

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
/*  Gallery tile                                                       */
/* ------------------------------------------------------------------ */
function GalleryTile({
  item,
  index,
  onClick,
}: {
  item: GalleryItem;
  index: number;
  onClick: () => void;
}) {
  const heightClass =
    item.span === 'tall'
      ? 'h-80 sm:h-96 lg:h-[28rem]'
      : item.span === 'wide'
        ? 'h-56 sm:h-64 lg:h-72'
        : 'h-64 sm:h-72 lg:h-80';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease, delay: (index % 3) * 0.08 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-sm group cursor-pointer ${heightClass}`}
      style={{
        clipPath: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)',
      }}
    >
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="w-6 h-[2px] bg-amber" />
          <span className="text-xs font-heading font-bold text-amber tracking-wider">
            {item.category}
          </span>
        </div>
        <h3 className="font-heading text-lg md:text-xl font-bold text-white leading-snug">
          {item.title}
        </h3>
      </div>

      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          backgroundColor: '#E8930C',
          clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
        }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lightbox                                                           */
/* ------------------------------------------------------------------ */
function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 p-2 text-white/60 hover:text-amber transition-colors"
        aria-label="Bezárás"
      >
        <X size={28} />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-2 md:left-6 z-10 p-2 text-white/60 hover:text-amber transition-colors"
        aria-label="Előző kép"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Next */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-2 md:right-6 z-10 p-2 text-white/60 hover:text-amber transition-colors"
        aria-label="Következő kép"
      >
        <ChevronRight size={32} />
      </button>

      {/* Content */}
      <motion.div
        key={item.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease }}
        className="max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full max-h-[70vh] object-contain rounded-sm"
        />
        <div className="mt-5 text-center">
          <span className="text-xs font-heading font-bold text-amber tracking-wider uppercase">
            {item.category}
          </span>
          <h3 className="font-heading text-xl md:text-2xl font-bold text-white mt-1">
            {item.title}
          </h3>
          <p className="text-white/50 font-body text-sm mt-2 max-w-xl mx-auto">{item.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */
function ReferencesCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-charcoal">
      <div
        className="absolute top-0 left-0 w-full h-3"
        style={{
          backgroundColor: '#E8930C',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 30%)',
        }}
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
            stroke="#E8930C"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
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

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto"
        >
          Hasonló villamos megoldásra van szüksége?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
          className="mt-6 text-lg text-white/50 font-body max-w-2xl mx-auto leading-relaxed"
        >
          Vegye fel velünk a kapcsolatot, és kérjen személyre szabott, ingyenes árajánlatot.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
          className="mt-10"
        >
          <button
            onClick={() => {
              navigate('/kapcsolat');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-amber hover:bg-amber-hover text-white font-heading font-bold text-lg rounded transition-colors duration-200"
          >
            Ingyenes árajánlat
            <ArrowRight
              size={20}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </motion.div>
      </div>

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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function ReferencesPage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useSEO(
    'Referenciák – EventVolt Kft | Ipari és lakossági villanyszerelés',
    'Tekintse meg az EventVolt Kft ipari és lakossági villamos kivitelezéseit, vezérlőszekrény gyártásait, automatizálási megoldásait és biztonsági felülvizsgálatait.',
  );

  const filtered =
    activeCategory === 'all'
      ? GALLERY
      : GALLERY.filter((item) => item.category === activeCategory);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);
  const nextLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filtered.length));
  }, [filtered.length]);

  return (
    <>
      <Navbar visible={true} />
      <main>
        {/* Hero */}
        <section className="pt-28 md:pt-36 pb-12 md:pb-16 bg-white">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-amber" />
                <span className="text-sm font-medium text-amber tracking-widest uppercase font-body">
                  Referenciák
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-charcoal leading-tight max-w-3xl">
                Munkáink a gyakorlatban
              </h1>
              <p className="mt-6 text-base md:text-lg text-charcoal/60 font-body leading-relaxed max-w-2xl">
                Tekintse meg ipari és lakossági villamos kivitelezéseinket, automatizálási
                megoldásainkat és felülvizsgálati munkáinkat.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category filter + Gallery */}
        <section className="pb-20 md:pb-28 bg-white">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            {/* Category filter */}
            <div className="mb-10 md:mb-14">
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-5 py-2.5 text-sm font-heading font-semibold rounded-sm transition-all duration-200 ${
                      activeCategory === cat.value
                        ? 'bg-amber text-white'
                        : 'border border-charcoal/15 text-charcoal/60 hover:border-amber hover:text-charcoal'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Masonry grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <GalleryTile
                    key={item.id}
                    item={item}
                    index={i}
                    onClick={() => setLightboxIndex(i)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <p className="text-center text-charcoal/40 font-body py-20">
                Ebben a kategóriában egyelőre nincs megjelenítendő referencia.
              </p>
            )}


          </div>
        </section>

        {/* CTA */}
        <ReferencesCTA />
      </main>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={filtered}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevLightbox}
            onNext={nextLightbox}
          />
        )}
      </AnimatePresence>
    </>
  );
}
