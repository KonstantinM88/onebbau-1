'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, ZoomIn } from 'lucide-react';

const galleryImages = [
  'bathroom.webp',
  'drywall.webp',
  'facade.webp',
  'terrace.webp',
  'flooring.webp',
  'room.webp',
];

export default function Gallery() {
  const t = useTranslations('gallery');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = t.raw('images') as Array<{ alt: string; label: string }>;

  return (
    <>
      <section id="gallery" ref={ref} className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-anthracite-900">
              {t('sectionTitle')}
            </h2>
            <p className="mt-4 text-anthracite-500 text-base sm:text-lg max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
            <div className="mt-4 mx-auto w-16 h-1 bg-brand-orange rounded-full" />
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] bg-anthracite-100"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={`/images/${galleryImages[i]}`}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-anthracite-950/70 via-anthracite-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-white font-medium text-sm sm:text-base">
                      {img.label}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ZoomIn size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-anthracite-950/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={`/images/${galleryImages[lightboxIndex]}`}
              alt={images[lightboxIndex]?.alt || ''}
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
