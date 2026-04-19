'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { MapPin, Star } from 'lucide-react';

type TestimonialItem = {
  name: string;
  location: string;
  service: string;
  scope: string;
  text: string;
};

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const items = t.raw('items') as TestimonialItem[];

  return (
    <section
      id="reviews"
      ref={ref}
      className="relative overflow-hidden bg-[#1b1c1f] py-20 sm:py-28"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-orange/[0.16] to-transparent" />
      <div className="absolute -left-16 top-24 h-56 w-56 rounded-full bg-brand-orange/[0.12] blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-white/[0.08] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[0.8fr_1.2fr] xl:items-start xl:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="xl:pr-2 2xl:pr-6"
          >
            <span className="inline-flex items-center rounded-full border border-white/[0.14] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              {t('eyebrow')}
            </span>
            <h2 className="mt-5 max-w-xl font-heading text-3xl text-white sm:text-4xl md:text-5xl">
              {t('sectionTitle')}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/[0.74] sm:text-lg">
              {t('intro')}
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-white/[0.12] bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-white">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/[0.52]">
                    {t('highlightKicker')}
                  </p>
                  <p className="mt-1 font-heading text-2xl text-white">
                    {t('highlightTitle')}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/[0.76] sm:text-base">
                {t('highlightText')}
              </p>
            </div>
          </motion.div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {items.map((item, index) => (
              <motion.article
                key={item.name + item.service}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 + index * 0.08 }}
                className={`min-w-0 rounded-[1.75rem] border border-white/[0.12] bg-[#2b2d31] p-6 shadow-xl shadow-black/[0.22] ${
                  index === items.length - 1 ? 'md:col-span-2 2xl:col-span-1' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-brand-orange">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="max-w-[8.5rem] rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1 text-right text-[10px] font-medium uppercase leading-4 tracking-[0.16em] text-white/[0.7] sm:text-[11px]">
                    {item.service}
                  </span>
                </div>

                <p className="mt-5 text-sm leading-7 text-[#edf0f2] sm:text-[15px]">
                  “{item.text}”
                </p>

                <div className="mt-6 border-t border-white/[0.1] pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-white/[0.68]">
                        <MapPin size={14} />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <span className="max-w-[9rem] text-right text-xs leading-5 text-white/[0.52]">
                      {item.scope}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
