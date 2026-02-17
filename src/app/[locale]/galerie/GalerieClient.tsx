// src/app/[locale]/galerie/GalerieClient.tsx
'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Images,
  ArrowLeft,
  ChevronRight as ArrowIcon,
  Grid3X3,
  Phone,
} from 'lucide-react';

/* ═══════════════════════ TYPES ═══════════════════════ */

type GalleryImage = {
  id: string;
  url: string;
  filename: string | null;
  category: string;
  caption: string | null;
  captionRu: string | null;
  width: number;
  height: number;
};

type Props = {
  locale: string;
  images: GalleryImage[];
};

/* ═══════════════════════ CONFIG ═══════════════════════ */

const CATEGORIES = [
  { value: 'bathroom', de: 'Badezimmer', ru: 'Ванная', icon: '🛁' },
  { value: 'drywall', de: 'Trockenbau', ru: 'Гипсокартон', icon: '🧱' },
  { value: 'facade', de: 'Fassade', ru: 'Фасад', icon: '🏠' },
  { value: 'terrace', de: 'Terrasse', ru: 'Терраса', icon: '🌿' },
  { value: 'flooring', de: 'Bodenbeläge', ru: 'Полы', icon: '🔲' },
  { value: 'interior', de: 'Innenausbau', ru: 'Интерьер', icon: '🏗️' },
  { value: 'garden', de: 'Garten', ru: 'Сад', icon: '🌳' },
  { value: 'masonry', de: 'Massivbau', ru: 'Кладка', icon: '⬛' },
];

const t = {
  de: {
    title: 'Unsere Projekte',
    subtitle: 'Qualität, die man sieht',
    description: 'Einblicke in unsere abgeschlossenen Bau- und Renovierungsprojekte in Halle (Saale) und Umgebung.',
    all: 'Alle',
    photos: (n: number) => `${n} ${n === 1 ? 'Foto' : 'Fotos'}`,
    close: 'Schließen',
    noImages: 'Noch keine Bilder vorhanden.',
    back: 'Startseite',
    ctaTitle: 'Gefallen Ihnen unsere Arbeiten?',
    ctaSubtitle: 'Lassen Sie sich kostenlos beraten — wir freuen uns auf Ihr Projekt.',
    ctaButton: 'Kostenlose Beratung',
    of: 'von',
  },
  ru: {
    title: 'Наши проекты',
    subtitle: 'Качество, которое видно',
    description: 'Фотографии наших завершённых строительных и ремонтных проектов в Галле (Заале) и окрестностях.',
    all: 'Все',
    photos: (n: number) => `${n} фото`,
    close: 'Закрыть',
    noImages: 'Изображений пока нет.',
    back: 'Главная',
    ctaTitle: 'Нравятся наши работы?',
    ctaSubtitle: 'Получите бесплатную консультацию — мы ждём ваш проект.',
    ctaButton: 'Бесплатная консультация',
    of: 'из',
  },
};

/* ═══════════════════════ LIGHTBOX ═══════════════════════ */

function Lightbox({
  images,
  currentIndex,
  onClose,
  onChange,
  locale,
}: {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onChange: (i: number) => void;
  locale: string;
}) {
  const isRu = locale === 'ru';
  const tx = isRu ? t.ru : t.de;
  const img = images[currentIndex];
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onChange((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onChange((currentIndex + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [currentIndex, images.length, onClose, onChange]);

  // Touch swipe
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 0) onChange((currentIndex - 1 + images.length) % images.length);
        else onChange((currentIndex + 1) % images.length);
      }
    },
    [currentIndex, images.length, onChange]
  );

  if (!img) return null;
  const catLabel = CATEGORIES.find((c) => c.value === img.category);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-anthracite-950/96 backdrop-blur-md" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-sm font-medium tabular-nums">
            {currentIndex + 1} {tx.of} {images.length}
          </span>
          {catLabel && (
            <span className="hidden sm:inline-flex px-2.5 py-1 bg-brand-orange/20 text-brand-orange text-xs font-semibold rounded-full border border-brand-orange/30">
              {isRu ? catLabel.ru : catLabel.de}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:rotate-90"
          aria-label={tx.close}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onChange((currentIndex - 1 + images.length) % images.length);
        }}
        className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/[0.08] hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/[0.06]"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onChange((currentIndex + 1) % images.length);
        }}
        className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/[0.08] hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/[0.06]"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={img.id}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={img.url}
            alt={isRu ? (img.captionRu || img.caption || '') : (img.caption || '')}
            width={img.width || 1200}
            height={img.height || 900}
            className="max-w-[92vw] max-h-[80vh] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl shadow-black/40"
            sizes="92vw"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom caption */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 text-center max-w-md px-4"
      >
        {catLabel && (
          <span className="sm:hidden inline-flex px-2.5 py-1 bg-brand-orange/20 text-brand-orange text-xs font-semibold rounded-full border border-brand-orange/30 mb-2">
            {isRu ? catLabel.ru : catLabel.de}
          </span>
        )}
        {(img.caption || img.captionRu) && (
          <p className="text-white/50 text-sm leading-relaxed">
            {isRu ? (img.captionRu || img.caption) : img.caption}
          </p>
        )}
      </motion.div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/[0.06] z-20">
        <motion.div
          className="h-full bg-brand-orange/60"
          initial={false}
          animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════ GALLERY CARD ═══════════════════════ */

function GalleryCard({
  img,
  index,
  onClick,
  locale,
}: {
  img: GalleryImage;
  index: number;
  onClick: () => void;
  locale: string;
}) {
  const isRu = locale === 'ru';
  const catLabel = CATEGORIES.find((c) => c.value === img.category);

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onClick={onClick}
      className="group relative w-full break-inside-avoid rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 focus-visible:ring-offset-2"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl bg-anthracite-100">
        <Image
          src={img.url}
          alt={isRu ? (img.captionRu || img.caption || img.category) : (img.caption || img.category)}
          width={img.width || 600}
          height={img.height || 400}
          className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-anthracite-950/70 via-anthracite-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />

        {/* Category badge on hover */}
        {catLabel && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-anthracite-950/60 backdrop-blur-md text-white text-[11px] font-semibold rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs">{catLabel.icon}</span>
              {isRu ? catLabel.ru : catLabel.de}
            </span>
          </div>
        )}

        {/* Zoom icon */}
        <div className="absolute top-3 right-3 z-10">
          <div className="p-2 bg-anthracite-950/50 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
            <ZoomIn className="w-4 h-4 text-white/90" />
          </div>
        </div>

        {/* Bottom caption on hover */}
        {(img.caption || img.captionRu) && (
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
            <p className="text-white/90 text-xs font-medium leading-snug line-clamp-2">
              {isRu ? (img.captionRu || img.caption) : img.caption}
            </p>
          </div>
        )}
      </div>
    </motion.button>
  );
}

/* ═══════════════════════ MASONRY GRID ═══════════════════════ */

function MasonryGrid({
  images,
  onImageClick,
  locale,
}: {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
  locale: string;
}) {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 [&>*]:mb-3 sm:[&>*]:mb-4">
      <AnimatePresence mode="popLayout">
        {images.map((img, i) => (
          <GalleryCard
            key={img.id}
            img={img}
            index={i}
            onClick={() => onImageClick(i)}
            locale={locale}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════ CATEGORY PILL ═══════════════════════ */

function CategoryPill({
  label,
  count,
  isActive,
  onClick,
  icon,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  icon?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
        isActive
          ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/25 scale-[1.03]'
          : 'bg-white text-anthracite-600 shadow-sm border border-anthracite-100 hover:border-brand-orange/30 hover:text-brand-orange hover:shadow-md'
      }`}
    >
      {icon && <span className="text-xs -ml-0.5">{icon}</span>}
      {label}
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors duration-300 ${
          isActive
            ? 'bg-white/25 text-white'
            : 'bg-anthracite-50 text-anthracite-400'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */

export default function GalerieClient({ locale, images }: Props) {
  const isRu = locale === 'ru';
  const tx = isRu ? t.ru : t.de;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ index: number } | null>(null);

  const filteredImages = useMemo(
    () => (activeCategory ? images.filter((i) => i.category === activeCategory) : images),
    [activeCategory, images]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    images.forEach((img) => {
      counts[img.category] = (counts[img.category] || 0) + 1;
    });
    return counts;
  }, [images]);

  const activeCategories = CATEGORIES.filter((c) => categoryCounts[c.value]);

  const openLightbox = useCallback((i: number) => setLightbox({ index: i }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <main className="min-h-screen bg-white">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden bg-anthracite-950 pt-20">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Orange accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 text-center">
          {/* Back link */}
          <a
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-brand-orange transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            {tx.back}
          </a>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-sm px-4 py-2 text-xs font-semibold tracking-wider text-white/60 uppercase">
              <Grid3X3 className="h-3.5 w-3.5 text-brand-orange" />
              {tx.photos(images.length)}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-4"
          >
            {tx.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-brand-orange font-medium text-lg sm:text-xl tracking-wide mb-3"
          >
            {tx.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/40 text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
          >
            {tx.description}
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 mx-auto w-20 h-1 bg-brand-orange rounded-full origin-center"
          />
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 sm:h-12">
            <path d="M0 48h1440V24C1240 4 960 0 720 0S200 4 0 24v24z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════ CATEGORY FILTER ═══════ */}
      <section className="relative z-10 -mt-1 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
            <CategoryPill
              label={tx.all}
              count={images.length}
              isActive={!activeCategory}
              onClick={() => setActiveCategory(null)}
              icon="✦"
            />
            {activeCategories.map((cat) => (
              <CategoryPill
                key={cat.value}
                label={isRu ? cat.ru : cat.de}
                count={categoryCounts[cat.value]}
                isActive={activeCategory === cat.value}
                onClick={() => setActiveCategory(activeCategory === cat.value ? null : cat.value)}
                icon={cat.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ DIVIDER ═══════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-anthracite-200/60 to-transparent" />
      </div>

      {/* ═══════ GALLERY GRID ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {filteredImages.length > 0 ? (
          <>
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-anthracite-400 text-sm">
                {tx.photos(filteredImages.length)}
                {activeCategory && (
                  <span className="text-anthracite-300">
                    {' · '}
                    {isRu
                      ? CATEGORIES.find((c) => c.value === activeCategory)?.ru
                      : CATEGORIES.find((c) => c.value === activeCategory)?.de}
                  </span>
                )}
              </p>
            </div>

            <MasonryGrid
              key={activeCategory ?? 'all'}
              images={filteredImages}
              onImageClick={openLightbox}
              locale={locale}
            />
          </>
        ) : (
          <div className="text-center py-24 sm:py-32">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-anthracite-50 flex items-center justify-center">
              <Images className="w-8 h-8 text-anthracite-200" />
            </div>
            <p className="text-anthracite-400 font-medium text-lg">{tx.noImages}</p>
          </div>
        )}
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-anthracite-950" />
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Orange glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(232, 97, 26, 0.12) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
          {/* Decorative line */}
          <div className="mx-auto mb-6 h-px w-16 bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent" />

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white leading-tight mb-3">
            {tx.ctaTitle}
          </h2>

          <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
            {tx.ctaSubtitle}
          </p>

          <a
            href={`/${locale}#contact`}
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold text-base transition-all duration-300 shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Phone className="w-4 h-4" />
            {tx.ctaButton}
            <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>

          {/* Bottom decorative */}
          <div className="mt-14 mx-auto h-px w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </section>

      {/* ═══════ LIGHTBOX ═══════ */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={filteredImages}
            currentIndex={lightbox.index}
            onClose={closeLightbox}
            onChange={(i) => setLightbox({ index: i })}
            locale={locale}
          />
        )}
      </AnimatePresence>

      {/* ═══════ UTILITY STYLES ═══════ */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}


//------пробую улучшить галерею
// 'use client';

// import { useState, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { X, ChevronLeft, ChevronRight, ZoomIn, Images, ArrowLeft } from 'lucide-react';

// type GalleryImage = {
//   id: string;
//   url: string;
//   filename: string | null;
//   category: string;
//   caption: string | null;
//   captionRu: string | null;
//   width: number;
//   height: number;
// };

// type Props = {
//   locale: string;
//   images: GalleryImage[];
// };

// const CATEGORIES = [
//   { value: 'bathroom', de: 'Badezimmer', ru: 'Ванная' },
//   { value: 'drywall', de: 'Trockenbau', ru: 'Гипсокартон' },
//   { value: 'facade', de: 'Fassade', ru: 'Фасад' },
//   { value: 'terrace', de: 'Terrasse', ru: 'Терраса' },
//   { value: 'flooring', de: 'Bodenbeläge', ru: 'Полы' },
//   { value: 'interior', de: 'Innenausbau', ru: 'Интерьер' },
//   { value: 'garden', de: 'Garten', ru: 'Сад' },
//   { value: 'masonry', de: 'Massivbau', ru: 'Кладка' },
// ];

// const t = {
//   de: {
//     title: 'Unsere Projekte',
//     subtitle: 'Einblicke in unsere abgeschlossenen Arbeiten',
//     all: 'Alle',
//     photos: (n: number) => `${n} ${n === 1 ? 'Foto' : 'Fotos'}`,
//     close: 'Schließen',
//     noImages: 'Noch keine Bilder vorhanden.',
//     back: 'Zurück zur Startseite',
//     cta: 'Kostenlose Beratung anfragen',
//   },
//   ru: {
//     title: 'Наши проекты',
//     subtitle: 'Фотографии завершённых работ',
//     all: 'Все',
//     photos: (n: number) => `${n} фото`,
//     close: 'Закрыть',
//     noImages: 'Изображений пока нет.',
//     back: 'На главную',
//     cta: 'Получить бесплатную консультацию',
//   },
// };

// /* ═══════ LIGHTBOX ═══════ */
// function Lightbox({
//   images, currentIndex, onClose, onChange, locale,
// }: {
//   images: GalleryImage[];
//   currentIndex: number;
//   onClose: () => void;
//   onChange: (i: number) => void;
//   locale: string;
// }) {
//   const img = images[currentIndex];
//   if (!img) return null;
//   const isRu = locale === 'ru';
//   const catLabel = CATEGORIES.find((c) => c.value === img.category);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[100] flex items-center justify-center bg-anthracite-950/95 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       {/* Close */}
//       <button
//         onClick={onClose}
//         className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
//       >
//         <X className="w-5 h-5" />
//       </button>

//       {/* Counter */}
//       <div className="absolute top-5 left-5 text-white/50 text-sm font-medium tabular-nums">
//         {currentIndex + 1} / {images.length}
//       </div>

//       {/* Prev */}
//       <button
//         onClick={(e) => { e.stopPropagation(); onChange((currentIndex - 1 + images.length) % images.length); }}
//         className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
//       >
//         <ChevronLeft className="w-6 h-6" />
//       </button>

//       {/* Next */}
//       <button
//         onClick={(e) => { e.stopPropagation(); onChange((currentIndex + 1) % images.length); }}
//         className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
//       >
//         <ChevronRight className="w-6 h-6" />
//       </button>

//       {/* Image */}
//       <AnimatePresence mode="wait">
//         <motion.img
//           key={img.id}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.95 }}
//           transition={{ duration: 0.25 }}
//           src={img.url}
//           alt={isRu ? (img.captionRu || img.caption || '') : (img.caption || '')}
//           className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
//           onClick={(e) => e.stopPropagation()}
//         />
//       </AnimatePresence>

//       {/* Caption */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
//         {catLabel && (
//           <span className="inline-block px-3 py-1 bg-brand-orange/80 text-white text-xs font-semibold rounded-full mb-2">
//             {isRu ? catLabel.ru : catLabel.de}
//           </span>
//         )}
//         {(img.caption || img.captionRu) && (
//           <p className="text-white/60 text-sm">
//             {isRu ? (img.captionRu || img.caption) : img.caption}
//           </p>
//         )}
//       </div>
//     </motion.div>
//   );
// }

// /* ═══════ MASONRY GRID ═══════ */
// function MasonryGrid({ images, onImageClick, locale }: {
//   images: GalleryImage[];
//   onImageClick: (index: number) => void;
//   locale: string;
// }) {
//   const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
//   const isRu = locale === 'ru';

//   return (
//     <div
//       ref={ref}
//       className={`columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4 transition-opacity duration-700 ${
//         inView ? 'opacity-100' : 'opacity-0'
//       }`}
//     >
//       {images.map((img, i) => {
//         const catLabel = CATEGORIES.find((c) => c.value === img.category);
//         return (
//           <motion.button
//             key={img.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={inView ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
//             onClick={() => onImageClick(i)}
//             className="group relative w-full break-inside-avoid rounded-2xl overflow-hidden border border-anthracite-100 shadow-sm hover:shadow-lg focus:outline-none transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
//           >
//             <img
//               src={img.url}
//               alt={isRu ? (img.captionRu || img.caption || '') : (img.caption || img.category)}
//               className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
//               loading="lazy"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-anthracite-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
//               {catLabel && (
//                 <span className="inline-block self-start px-2.5 py-1 bg-brand-orange text-white text-xs font-semibold rounded-full mb-1">
//                   {isRu ? catLabel.ru : catLabel.de}
//                 </span>
//               )}
//               {(img.caption || img.captionRu) && (
//                 <p className="text-white/80 text-xs">
//                   {isRu ? (img.captionRu || img.caption) : img.caption}
//                 </p>
//               )}
//               <ZoomIn className="absolute top-3 right-3 w-5 h-5 text-white/60" />
//             </div>
//           </motion.button>
//         );
//       })}
//     </div>
//   );
// }

// /* ═══════ MAIN COMPONENT ═══════ */
// export default function GalerieClient({ locale, images }: Props) {
//   const isRu = locale === 'ru';
//   const tx = isRu ? t.ru : t.de;
//   const [activeCategory, setActiveCategory] = useState<string | null>(null);
//   const [lightbox, setLightbox] = useState<{ index: number } | null>(null);

//   const filteredImages = activeCategory
//     ? images.filter((i) => i.category === activeCategory)
//     : images;

//   // Count per category (only existing ones)
//   const categoryCounts = useMemo(() => {
//     const counts: Record<string, number> = {};
//     images.forEach((img) => {
//       counts[img.category] = (counts[img.category] || 0) + 1;
//     });
//     return counts;
//   }, [images]);

//   const activeCategories = CATEGORIES.filter((c) => categoryCounts[c.value]);

//   return (
//     <main className="min-h-screen bg-white pt-20">
//       {/* Hero */}
//       <section className="relative py-16 sm:py-24 bg-gradient-to-b from-anthracite-50/50 to-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           {/* Back link */}
//           <a
//             href={`/${locale}`}
//             className="inline-flex items-center gap-1.5 text-sm text-anthracite-500 hover:text-brand-orange transition-colors mb-6"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             {tx.back}
//           </a>

//           <div className="inline-flex items-center gap-2 rounded-full border border-anthracite-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-anthracite-600 shadow-sm mb-5">
//             <Images className="h-4 w-4 text-brand-orange" />
//             {tx.photos(images.length)}
//           </div>

//           <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-anthracite-900">
//             {tx.title}
//           </h1>
//           <p className="mt-3 text-anthracite-500 text-lg max-w-xl mx-auto">
//             {tx.subtitle}
//           </p>
//           <div className="mt-4 mx-auto w-16 h-1 bg-brand-orange rounded-full" />
//         </div>
//       </section>

//       {/* Category filter */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex flex-wrap justify-center gap-2">
//           <button
//             onClick={() => setActiveCategory(null)}
//             className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
//               !activeCategory
//                 ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
//                 : 'border border-anthracite-200 bg-white text-anthracite-600 hover:border-anthracite-300'
//             }`}
//           >
//             {tx.all}
//             <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
//               !activeCategory ? 'bg-white/25' : 'bg-anthracite-100 text-anthracite-500'
//             }`}>
//               {images.length}
//             </span>
//           </button>

//           {activeCategories.map((cat) => {
//             const isActive = activeCategory === cat.value;
//             return (
//               <button
//                 key={cat.value}
//                 onClick={() => setActiveCategory(isActive ? null : cat.value)}
//                 className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
//                   isActive
//                     ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
//                     : 'border border-anthracite-200 bg-white text-anthracite-600 hover:border-anthracite-300'
//                 }`}
//               >
//                 {isRu ? cat.ru : cat.de}
//                 <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
//                   isActive ? 'bg-white/25' : 'bg-anthracite-100 text-anthracite-500'
//                 }`}>
//                   {categoryCounts[cat.value]}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </section>

//       {/* Gallery Grid */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
//         {filteredImages.length > 0 ? (
//           <MasonryGrid
//             key={activeCategory ?? 'all'}
//             images={filteredImages}
//             onImageClick={(i) => setLightbox({ index: i })}
//             locale={locale}
//           />
//         ) : (
//           <div className="text-center py-20">
//             <Images className="w-12 h-12 mx-auto mb-3 text-anthracite-200" />
//             <p className="text-anthracite-400 font-medium">{tx.noImages}</p>
//           </div>
//         )}
//       </section>

//       {/* CTA */}
//       <section className="py-16 bg-anthracite-50/50">
//         <div className="max-w-2xl mx-auto px-4 text-center">
//           <h2 className="font-heading text-2xl sm:text-3xl text-anthracite-900 mb-4">
//             {isRu ? 'Нравятся наши работы?' : 'Gefallen Ihnen unsere Arbeiten?'}
//           </h2>
//           <a
//             href={`/${locale}#contact`}
//             className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold transition-colors shadow-lg shadow-brand-orange/20"
//           >
//             {tx.cta}
//             <ChevronRight className="w-5 h-5" />
//           </a>
//         </div>
//       </section>

//       {/* Lightbox */}
//       <AnimatePresence>
//         {lightbox && (
//           <Lightbox
//             images={filteredImages}
//             currentIndex={lightbox.index}
//             onClose={() => setLightbox(null)}
//             onChange={(i) => setLightbox({ index: i })}
//             locale={locale}
//           />
//         )}
//       </AnimatePresence>
//     </main>
//   );
// }
