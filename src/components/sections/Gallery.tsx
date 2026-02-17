'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';
import SectionLabel from '@/components/ui/SectionLabel';

const galleryImages = [
  { src: '/images/bathroom.webp', category: 'bathroom' },
  { src: '/images/drywall.webp', category: 'drywall' },
  { src: '/images/facade.webp', category: 'facade' },
  { src: '/images/terrace.webp', category: 'terrace' },
  { src: '/images/flooring.webp', category: 'flooring' },
  { src: '/images/room.webp', category: 'interior' },
];

export default function Gallery() {
  const t = useTranslations('gallery');
  const locale = useLocale();

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="container-custom">
        <AnimateOnScroll className="text-center mb-14">
          <SectionLabel text={t('sectionLabel')} />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-anthracite-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-anthracite-500 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </AnimateOnScroll>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {galleryImages.map((img, i) => (
            <AnimateOnScroll key={i} variant="scaleIn" delay={i * 0.1}>
              <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer">
                <Image
                  src={img.src}
                  alt={t(`categories.${img.category}`)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-anthracite-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 bg-brand-orange text-white text-sm font-medium rounded-full">
                    {t(`categories.${img.category}`)}
                  </span>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll variant="fadeUp" delay={0.3}>
          <div className="text-center mt-10">
            <p className="text-anthracite-500 max-w-xl mx-auto mb-6">
              {t('description')}
            </p>
            <a
              href={`/${locale}/galerie`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold transition-colors shadow-lg shadow-brand-orange/20"
            >
              {t('viewAll')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
