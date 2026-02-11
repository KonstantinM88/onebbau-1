'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function About() {
  const t = useTranslations('about');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="about" ref={ref} className="py-20 sm:py-28 bg-anthracite-50/50">
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
          <div className="mt-4 mx-auto w-16 h-1 bg-brand-orange rounded-full" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <p className="text-base sm:text-lg text-anthracite-600 leading-relaxed mb-5">
              {t('text1')}
            </p>
            <p className="text-base sm:text-lg text-anthracite-600 leading-relaxed">
              {t('text2')}
            </p>
            {/* Decorative accent */}
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                <span className="text-brand-orange font-heading text-xl">10+</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-anthracite-800">Jahre Erfahrung</p>
                <p className="text-xs text-anthracite-500">im Bau- und Handwerksbereich</p>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-anthracite-900/10">
              <img
                src="/images/about.webp"
                alt="Onebbau Team"
                className="w-full h-72 sm:h-80 lg:h-96 object-cover"
              />
              {/* Orange accent corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-orange/20 rounded-bl-3xl" />
            </div>
            {/* Floating decoration */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-brand-orange/20 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
