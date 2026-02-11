'use client';

import { useTranslations } from 'next-intl';
import {
  Hammer, Warehouse, ThermometerSnowflake, LayoutGrid, Paintbrush,
  Layers, Cable, DoorOpen, Trees, Sofa, Grid3X3, Fence,
  Leaf, Scissors,
} from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';
import SectionLabel from '@/components/ui/SectionLabel';

export default function Services() {
  const t = useTranslations('services');

  const bauServices = [
    { icon: Hammer, key: 'massivbau' },
    { icon: Warehouse, key: 'garagen' },
    { icon: ThermometerSnowflake, key: 'fassade' },
    { icon: LayoutGrid, key: 'trockenbau' },
    { icon: Paintbrush, key: 'maler' },
    { icon: Layers, key: 'boden' },
    { icon: Cable, key: 'elektro' },
    { icon: DoorOpen, key: 'tueren' },
    { icon: Trees, key: 'terrassen' },
    { icon: Sofa, key: 'moebel' },
    { icon: Grid3X3, key: 'fliesen' },
    { icon: Fence, key: 'zaun' },
  ];

  const gartenServices = [
    { icon: Leaf, key: 'garten' },
    { icon: Scissors, key: 'baumschnitt' },
  ];

  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <AnimateOnScroll className="text-center mb-14">
          <SectionLabel text={t('sectionLabel')} />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-anthracite-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-anthracite-500 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </AnimateOnScroll>

        {/* Bau & Renovierung */}
        <AnimateOnScroll variant="fadeUp" delay={0.1}>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Hammer className="w-5 h-5 text-primary-500" />
              <h3 className="text-xl font-heading text-anthracite-900">
                {t('categoryBau')}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bauServices.map((service, i) => (
                <div
                  key={service.key}
                  className="flex items-center gap-4 p-5 bg-anthracite-50/60 rounded-xl border border-anthracite-100/60 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                    <service.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <span className="text-[15px] font-medium text-anthracite-700 group-hover:text-anthracite-900 transition-colors">
                    {t(service.key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        {/* Garten & Außenanlagen */}
        <AnimateOnScroll variant="fadeUp" delay={0.2}>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="w-5 h-5 text-primary-500" />
              <h3 className="text-xl font-heading text-anthracite-900">
                {t('categoryGarten')}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gartenServices.map((service) => (
                <div
                  key={service.key}
                  className="flex items-center gap-4 p-5 bg-anthracite-50/60 rounded-xl border border-anthracite-100/60 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                    <service.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <span className="text-[15px] font-medium text-anthracite-700 group-hover:text-anthracite-900 transition-colors">
                    {t(service.key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
