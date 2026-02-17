'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, ChevronLeft, ChevronRight, ZoomIn, Images, ArrowLeft } from 'lucide-react';

type GalleryImage = {
  id: string;
  url: string;
  filename: string | null;
  category: string;
  caption: string | null;
  captionRu: string | null;
  width: number;
  height: number;
};

type Props = {
  locale: string;
  images: GalleryImage[];
};

const CATEGORIES = [
  { value: 'bathroom', de: 'Badezimmer', ru: 'Ванная' },
  { value: 'drywall', de: 'Trockenbau', ru: 'Гипсокартон' },
  { value: 'facade', de: 'Fassade', ru: 'Фасад' },
  { value: 'terrace', de: 'Terrasse', ru: 'Терраса' },
  { value: 'flooring', de: 'Bodenbeläge', ru: 'Полы' },
  { value: 'interior', de: 'Innenausbau', ru: 'Интерьер' },
  { value: 'garden', de: 'Garten', ru: 'Сад' },
  { value: 'masonry', de: 'Massivbau', ru: 'Кладка' },
];

const t = {
  de: {
    title: 'Unsere Projekte',
    subtitle: 'Einblicke in unsere abgeschlossenen Arbeiten',
    all: 'Alle',
    photos: (n: number) => `${n} ${n === 1 ? 'Foto' : 'Fotos'}`,
    close: 'Schließen',
    noImages: 'Noch keine Bilder vorhanden.',
    back: 'Zurück zur Startseite',
    cta: 'Kostenlose Beratung anfragen',
  },
  ru: {
    title: 'Наши проекты',
    subtitle: 'Фотографии завершённых работ',
    all: 'Все',
    photos: (n: number) => `${n} фото`,
    close: 'Закрыть',
    noImages: 'Изображений пока нет.',
    back: 'На главную',
    cta: 'Получить бесплатную консультацию',
  },
};

/* ═══════ LIGHTBOX ═══════ */
function Lightbox({
  images, currentIndex, onClose, onChange, locale,
}: {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onChange: (i: number) => void;
  locale: string;
}) {
  const img = images[currentIndex];
  if (!img) return null;
  const isRu = locale === 'ru';
  const catLabel = CATEGORIES.find((c) => c.value === img.category);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-anthracite-950/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-5 text-white/50 text-sm font-medium tabular-nums">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onChange((currentIndex - 1 + images.length) % images.length); }}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onChange((currentIndex + 1) % images.length); }}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={img.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          src={img.url}
          alt={isRu ? (img.captionRu || img.caption || '') : (img.caption || '')}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>

      {/* Caption */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        {catLabel && (
          <span className="inline-block px-3 py-1 bg-brand-orange/80 text-white text-xs font-semibold rounded-full mb-2">
            {isRu ? catLabel.ru : catLabel.de}
          </span>
        )}
        {(img.caption || img.captionRu) && (
          <p className="text-white/60 text-sm">
            {isRu ? (img.captionRu || img.caption) : img.caption}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════ MASONRY GRID ═══════ */
function MasonryGrid({ images, onImageClick, locale }: {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
  locale: string;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const isRu = locale === 'ru';

  return (
    <div
      ref={ref}
      className={`columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4 transition-opacity duration-700 ${
        inView ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {images.map((img, i) => {
        const catLabel = CATEGORIES.find((c) => c.value === img.category);
        return (
          <motion.button
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
            onClick={() => onImageClick(i)}
            className="group relative w-full break-inside-avoid rounded-2xl overflow-hidden border border-anthracite-100 shadow-sm hover:shadow-lg focus:outline-none transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
          >
            <img
              src={img.url}
              alt={isRu ? (img.captionRu || img.caption || '') : (img.caption || img.category)}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-anthracite-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              {catLabel && (
                <span className="inline-block self-start px-2.5 py-1 bg-brand-orange text-white text-xs font-semibold rounded-full mb-1">
                  {isRu ? catLabel.ru : catLabel.de}
                </span>
              )}
              {(img.caption || img.captionRu) && (
                <p className="text-white/80 text-xs">
                  {isRu ? (img.captionRu || img.caption) : img.caption}
                </p>
              )}
              <ZoomIn className="absolute top-3 right-3 w-5 h-5 text-white/60" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ═══════ MAIN COMPONENT ═══════ */
export default function GalerieClient({ locale, images }: Props) {
  const isRu = locale === 'ru';
  const tx = isRu ? t.ru : t.de;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ index: number } | null>(null);

  const filteredImages = activeCategory
    ? images.filter((i) => i.category === activeCategory)
    : images;

  // Count per category (only existing ones)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    images.forEach((img) => {
      counts[img.category] = (counts[img.category] || 0) + 1;
    });
    return counts;
  }, [images]);

  const activeCategories = CATEGORIES.filter((c) => categoryCounts[c.value]);

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-anthracite-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Back link */}
          <a
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-sm text-anthracite-500 hover:text-brand-orange transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {tx.back}
          </a>

          <div className="inline-flex items-center gap-2 rounded-full border border-anthracite-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-anthracite-600 shadow-sm mb-5">
            <Images className="h-4 w-4 text-brand-orange" />
            {tx.photos(images.length)}
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-anthracite-900">
            {tx.title}
          </h1>
          <p className="mt-3 text-anthracite-500 text-lg max-w-xl mx-auto">
            {tx.subtitle}
          </p>
          <div className="mt-4 mx-auto w-16 h-1 bg-brand-orange rounded-full" />
        </div>
      </section>

      {/* Category filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              !activeCategory
                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                : 'border border-anthracite-200 bg-white text-anthracite-600 hover:border-anthracite-300'
            }`}
          >
            {tx.all}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              !activeCategory ? 'bg-white/25' : 'bg-anthracite-100 text-anthracite-500'
            }`}>
              {images.length}
            </span>
          </button>

          {activeCategories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(isActive ? null : cat.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                    : 'border border-anthracite-200 bg-white text-anthracite-600 hover:border-anthracite-300'
                }`}
              >
                {isRu ? cat.ru : cat.de}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/25' : 'bg-anthracite-100 text-anthracite-500'
                }`}>
                  {categoryCounts[cat.value]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredImages.length > 0 ? (
          <MasonryGrid
            key={activeCategory ?? 'all'}
            images={filteredImages}
            onImageClick={(i) => setLightbox({ index: i })}
            locale={locale}
          />
        ) : (
          <div className="text-center py-20">
            <Images className="w-12 h-12 mx-auto mb-3 text-anthracite-200" />
            <p className="text-anthracite-400 font-medium">{tx.noImages}</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-16 bg-anthracite-50/50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl text-anthracite-900 mb-4">
            {isRu ? 'Нравятся наши работы?' : 'Gefallen Ihnen unsere Arbeiten?'}
          </h2>
          <a
            href={`/${locale}#contact`}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold transition-colors shadow-lg shadow-brand-orange/20"
          >
            {tx.cta}
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={filteredImages}
            currentIndex={lightbox.index}
            onClose={() => setLightbox(null)}
            onChange={(i) => setLightbox({ index: i })}
            locale={locale}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
