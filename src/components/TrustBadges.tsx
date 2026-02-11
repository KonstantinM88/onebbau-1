'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Award, ThumbsUp } from 'lucide-react';

const badges = [
  { key: 'reliability', Icon: Shield },
  { key: 'quality', Icon: Award },
  { key: 'satisfaction', Icon: ThumbsUp },
] as const;

export default function TrustBadges() {
  const t = useTranslations('trust');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="relative -mt-16 z-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {badges.map(({ key, Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 border border-anthracite-100/50 text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-orange/10 text-brand-orange mb-4 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <Icon size={26} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-lg sm:text-xl text-anthracite-800 mb-2">
                {t(`${key}.title`)}
              </h3>
              <p className="text-sm sm:text-base text-anthracite-500 leading-relaxed">
                {t(`${key}.text`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
