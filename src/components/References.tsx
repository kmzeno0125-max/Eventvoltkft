import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  References gallery — masonry layout                               */
/* ------------------------------------------------------------------ */
// Replace these placeholder images with the company's own project photos.
// Real project photos make this section far more credible and authentic.

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  span: 'tall' | 'wide' | 'normal';
}

const GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Ipari vezérlőszekrény gyártás',
    image:
      'https://images.pexels.com/photos/28950842/pexels-photo-28950842.jpeg?auto=compress&cs=tinysrgb&h=900&w=700',
    span: 'tall',
  },
  {
    id: 'g2',
    title: 'Frekvenciaváltós hajtás beüzemelése',
    image:
      'https://images.pexels.com/photos/33706880/pexels-photo-33706880.jpeg?auto=compress&cs=tinysrgb&h=700&w=1100',
    span: 'wide',
  },
  {
    id: 'g3',
    title: 'PLC vezérlés programozása',
    image:
      'https://images.pexels.com/photos/34054464/pexels-photo-34054464.jpeg?auto=compress&cs=tinysrgb&h=900&w=700',
    span: 'tall',
  },
  {
    id: 'g4',
    title: 'Lakossági villanyszerelés',
    image:
      'https://images.pexels.com/photos/32497160/pexels-photo-32497160.jpeg?auto=compress&cs=tinysrgb&h=700&w=1000',
    span: 'normal',
  },
  {
    id: 'g5',
    title: 'Ipari csarnok kábelezés',
    image:
      'https://images.pexels.com/photos/28265032/pexels-photo-28265032.jpeg?auto=compress&cs=tinysrgb&h=700&w=1000',
    span: 'normal',
  },
  {
    id: 'g6',
    title: 'VBF felülvizsgálat',
    image:
      'https://images.pexels.com/photos/14319099/pexels-photo-14319099.jpeg?auto=compress&cs=tinysrgb&h=700&w=1100',
    span: 'wide',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function GalleryTile({ item, index }: { item: GalleryItem; index: number }) {
  const heightClass =
    item.span === 'tall'
      ? 'h-80 sm:h-96 lg:h-[28rem]'
      : item.span === 'wide'
        ? 'h-56 sm:h-64 lg:h-72'
        : 'h-64 sm:h-72 lg:h-80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease, delay: (index % 3) * 0.12 }}
      className={`relative overflow-hidden rounded-sm group cursor-pointer ${heightClass}`}
      style={{
        clipPath: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)',
      }}
    >
      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      {/* Bottom slide-up label */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="w-6 h-[2px] bg-amber" />
          <span className="text-xs font-heading font-bold text-amber tracking-wider">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3 className="font-heading text-lg md:text-xl font-bold text-white leading-snug">
          {item.title}
        </h3>
      </div>

      {/* Orange diagonal accent on hover */}
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

export default function References() {
  return (
    <section id="referenciak" className="py-20 md:py-28 bg-white">
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
              Referenciák
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight">
            Néhány munkánk
          </h2>
        </motion.div>

        {/* Masonry grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
          {GALLERY.map((item, i) => (
            <GalleryTile key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Note */}
      </div>
    </section>
  );
}
