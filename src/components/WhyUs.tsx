'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Clock, Sparkles, Banknote, Users } from 'lucide-react';

const icons = [Award, Clock, Sparkles, Banknote, Users];

export default function WhyUs() {
  const t = useTranslations('whyUs');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const items = t.raw('items') as Array<{ title: string; text: string }>;

  return (
    <section id="why-us" ref={ref} className="py-20 sm:py-28 bg-anthracite-50/50">
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item, i) => {
            const Icon = icons[i] || Award;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className={`bg-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/[0.03] hover:shadow-xl hover:shadow-black/[0.08] transition-all duration-300 border border-anthracite-100/50 group ${
                  i >= 3 ? 'sm:col-span-1 lg:col-span-1' : ''
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-5 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                  <Icon size={26} className="text-brand-orange group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-lg sm:text-xl text-anthracite-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-anthracite-500 leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
