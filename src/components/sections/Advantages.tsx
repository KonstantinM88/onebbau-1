'use client';

import { useTranslations } from 'next-intl';
import { Award, Clock, Sparkles, Banknote, UserCheck } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';
import SectionLabel from '@/components/ui/SectionLabel';

export default function Advantages() {
  const t = useTranslations('advantages');

  const items = [
    { icon: Award, title: t('experience'), desc: t('experienceDesc') },
    { icon: Clock, title: t('reliability'), desc: t('reliabilityDesc') },
    { icon: Sparkles, title: t('clean'), desc: t('cleanDesc') },
    { icon: Banknote, title: t('price'), desc: t('priceDesc') },
    { icon: UserCheck, title: t('personal'), desc: t('personalDesc') },
  ];

  return (
    <section id="advantages" className="section-padding bg-anthracite-50/50">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <AnimateOnScroll key={i} variant="scaleIn" delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-7 card-shadow hover:card-shadow-hover transition-all duration-300 group hover:-translate-y-1 h-full">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-heading text-anthracite-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-anthracite-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
