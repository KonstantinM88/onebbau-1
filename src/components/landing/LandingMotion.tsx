// src/components/landing/LandingMotion.tsx
// Моушн-графика посадочных страниц.
// Принципы: только transform / opacity / stroke-dashoffset (GPU-композитинг,
// никакого layout-триггера), triggerOnce, prefers-reduced-motion уважается
// автоматически через useReducedMotion(). "Вау" без потери производительности.
'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';

/* ------------------------------------------------------------------ */
/* Reveal — базовый scroll-reveal                                      */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Counter — счётчик, «отматывающийся» как рулетка                     */
/* ------------------------------------------------------------------ */

export function Counter({
  value,
  suffix,
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString('de-DE')}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* BlueprintHero — фирменный элемент: технический чертёж, который      */
/* рисует сам себя при загрузке (stroke-dashoffset, чистый SVG).       */
/* ------------------------------------------------------------------ */

const draw: import('framer-motion').Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: 0.15 * i, duration: 1.1, ease: 'easeInOut' as const },
      opacity: { delay: 0.15 * i, duration: 0.25 },
    },
  }),
};

export function BlueprintHero({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 560 420"
      fill="none"
      aria-hidden="true"
      className={className}
      initial={reduced ? 'visible' : 'hidden'}
      animate="visible"
    >
      {/* сетка чертежа */}
      <motion.path
        variants={draw}
        custom={0}
        d="M40 380 H520 M40 40 V380"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      {/* контур дома */}
      <motion.path
        variants={draw}
        custom={1}
        d="M120 380 V220 L280 110 L440 220 V380 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* дверь и окно */}
      <motion.path
        variants={draw}
        custom={2}
        d="M250 380 V290 H310 V380 M150 260 H210 V320 H150 Z M350 260 H410 V320 H350 Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* размерные линии — вернакуляр стройки */}
      <motion.path
        variants={draw}
        custom={3}
        d="M120 400 H440 M120 394 V406 M440 394 V406 M462 220 V380 M456 220 H468 M456 380 H468"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
      {/* крыша — штриховая осевая */}
      <motion.path
        variants={draw}
        custom={4}
        d="M280 110 V70"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeDasharray="6 6"
      />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/* ProcessRail — вертикальная линия процесса, «прорисовывается»        */
/* по мере скролла (scaleY через spring — только transform).           */
/* ------------------------------------------------------------------ */

export function ProcessRail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.75', 'end 0.6'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-anthracite-200" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="absolute left-[15px] top-2 bottom-2 w-px origin-top bg-brand-orange"
        style={{ scaleY: reduced ? 1 : scaleY }}
      />
      <div className="space-y-10">{children}</div>
    </div>
  );
}

export function ProcessStep({
  index,
  title,
  text,
}: {
  index: number;
  title: string;
  text: string;
}) {
  return (
    <Reveal delay={index * 0.06} className="relative pl-12">
      <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-orange bg-white text-sm font-bold text-brand-orange">
        {index + 1}
      </span>
      <h3 className="font-heading text-xl text-anthracite-900">{title}</h3>
      <p className="mt-1.5 text-anthracite-600 leading-relaxed">{text}</p>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* HoverCard — карточка преимущества с микровзаимодействием            */
/* ------------------------------------------------------------------ */

export function HoverCard({
  children,
  index = 0,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { y: -6 }}
      className="group rounded-[1.5rem] border border-anthracite-200/80 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-black/[0.06]"
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* ParallaxImage — лёгкий параллакс изображения (translateY)           */
/* ------------------------------------------------------------------ */

export function ParallaxImage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      <motion.div style={{ y: reduced ? 0 : y }} className="h-[112%] w-full -mt-[6%]">
        {children}
      </motion.div>
    </div>
  );
}
