'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, CircleHelp } from 'lucide-react';

type FaqItem = {
  question: string;
  answer: string;
};

export default function Faq() {
  const t = useTranslations('faq');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 });
  const items = t.raw('items') as FaqItem[];
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" ref={ref} className="bg-anthracite-50/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <span className="inline-flex items-center rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
              {t('eyebrow')}
            </span>
            <h2 className="mt-5 max-w-lg font-heading text-3xl text-anthracite-900 sm:text-4xl md:text-5xl">
              {t('sectionTitle')}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-anthracite-600 sm:text-lg">
              {t('intro')}
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-anthracite-200/80 bg-white p-6 shadow-xl shadow-black/[0.04]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange text-white">
                  <CircleHelp size={20} />
                </div>
                <div>
                  <p className="font-heading text-2xl text-anthracite-900">
                    {t('contactTitle')}
                  </p>
                  <p className="mt-1 text-sm text-anthracite-500">
                    {t('contactText')}
                  </p>
                </div>
              </div>
              <a
                href="#contact"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-anthracite-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-anthracite-800"
              >
                {t('contactCta')}
              </a>
            </div>
          </motion.div>

          <div className="space-y-4">
            {items.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.08 + index * 0.06 }}
                  className="overflow-hidden rounded-[1.6rem] border border-anthracite-200/80 bg-white shadow-lg shadow-black/[0.03]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
                  >
                    <span className="pr-4 font-heading text-xl leading-7 text-anthracite-900 sm:text-2xl">
                      {item.question}
                    </span>
                    <span
                      className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                        isOpen
                          ? 'border-brand-orange/30 bg-brand-orange text-white'
                          : 'border-anthracite-200 bg-anthracite-50 text-anthracite-500'
                      }`}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.26, ease: 'easeOut' }}
                      >
                        <div className="px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
                          <div className="mb-4 h-px bg-gradient-to-r from-brand-orange/30 via-anthracite-200 to-transparent" />
                          <p className="max-w-3xl text-sm leading-7 text-anthracite-600 sm:text-base">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
