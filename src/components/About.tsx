'use client';

import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

const ABOUT_BANNER_SRC = '/uploads/onebbau_about_banner.webp';

export default function About() {
  const t = useTranslations('about');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateXRaw = useTransform(pointerY, [-0.5, 0.5], [7, -7]);
  const rotateYRaw = useTransform(pointerX, [-0.5, 0.5], [-9, 9]);
  const rotateX = useSpring(rotateXRaw, { stiffness: 170, damping: 20, mass: 0.6 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 170, damping: 20, mass: 0.6 });

  const shineX = useTransform(pointerX, [-0.5, 0.5], ['-28%', '28%']);
  const shineY = useTransform(pointerY, [-0.5, 0.5], ['-18%', '18%']);

  const handlePointerMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(x);
    pointerY.set(y);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

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
            <motion.div
              className="group relative overflow-hidden rounded-2xl shadow-2xl shadow-anthracite-900/10 touch-manipulation"
              onMouseMove={handlePointerMove}
              onMouseLeave={resetPointer}
              style={{
                rotateX,
                rotateY,
                transformPerspective: 1200,
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 1.03 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src={ABOUT_BANNER_SRC}
                alt="Onebbau Banner"
                className="h-72 w-full object-cover will-change-transform sm:h-80 lg:h-96"
                whileHover={{ scale: 1.09, filter: 'saturate(1.08) brightness(1.03)' }}
                whileTap={{ scale: 1.09, filter: 'saturate(1.08) brightness(1.03)' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Dynamic premium shine */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(300px 160px at calc(50% + var(--sx)) calc(50% + var(--sy)), rgba(255,255,255,0.24), transparent 62%)',
                  '--sx': shineX,
                  '--sy': shineY,
                } as CSSProperties}
              />

              <motion.div
                className="pointer-events-none absolute -inset-y-20 -left-2 w-1/2 bg-white/22 blur-2xl"
                style={{ x: shineX }}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-anthracite-950/25 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-white/20 ring-inset" />
              {/* Orange accent corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-orange/20 rounded-bl-3xl" />
            </motion.div>
            {/* Floating decoration */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-brand-orange/20 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
