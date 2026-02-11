'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Hammer,
  Home,
  Thermometer,
  Layers,
  Paintbrush,
  SquareStack,
  Cable,
  DoorOpen,
  Fence,
  Armchair,
  Grid3X3,
  Construction,
  Leaf,
  Scissors,
} from 'lucide-react';

const constructionIcons = [
  Hammer, Home, Thermometer, Layers, Paintbrush, SquareStack,
  Cable, DoorOpen, Fence, Armchair, Grid3X3, Construction,
];

const gardenIcons = [Leaf, Scissors];

export default function Services() {
  const t = useTranslations('services');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const constructionItems = t.raw('construction.items') as string[];
  const gardenItems = t.raw('garden.items') as string[];

  return (
    <section id="services" ref={ref} className="py-20 sm:py-28 bg-white">
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

        {/* Construction & Renovation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
              <Hammer size={18} className="text-brand-orange" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl text-anthracite-800">
              {t('construction.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {constructionItems.map((item: string, i: number) => {
              const Icon = constructionIcons[i] || Hammer;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.04 }}
                  className="flex items-center gap-3 p-4 sm:p-5 rounded-xl border border-anthracite-100 hover:border-brand-orange/30 hover:bg-brand-orange/[0.02] transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-orange/8 flex items-center justify-center group-hover:bg-brand-orange/15 transition-colors">
                    <Icon size={18} className="text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm sm:text-base text-anthracite-700 font-medium">
                    {item}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Garden & Outdoor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
              <Leaf size={18} className="text-brand-orange" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl text-anthracite-800">
              {t('garden.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {gardenItems.map((item: string, i: number) => {
              const Icon = gardenIcons[i] || Leaf;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                  className="flex items-center gap-3 p-4 sm:p-5 rounded-xl border border-anthracite-100 hover:border-brand-orange/30 hover:bg-brand-orange/[0.02] transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-orange/8 flex items-center justify-center group-hover:bg-brand-orange/15 transition-colors">
                    <Icon size={18} className="text-brand-orange" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm sm:text-base text-anthracite-700 font-medium">
                    {item}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
