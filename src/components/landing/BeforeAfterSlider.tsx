'use client';

import { useId, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import { ArrowLeftRight, MoveHorizontal } from 'lucide-react';

type Props = {
  beforeImage: string;
  afterImage: string;
  locale: string;
};

export default function BeforeAfterSlider({ beforeImage, afterImage, locale }: Props) {
  const [position, setPosition] = useState(50);
  const descriptionId = useId();
  const ru = locale === 'ru';
  const before = ru ? 'До' : 'Vorher';
  const after = ru ? 'После' : 'Nachher';

  function updatePosition(event: PointerEvent<HTMLInputElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0) return;
    setPosition(Math.round(Math.min(100, Math.max(0, (event.clientX - bounds.left) / bounds.width * 100))));
  }

  function startDragging(event: PointerEvent<HTMLInputElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    // Pointer handling makes the entire picture draggable. Native range input
    // retains keyboard/screen-reader support; pan-y permits mobile scrolling.
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event);
  }

  function stopDragging(event: PointerEvent<HTMLInputElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="mt-10 grid items-center gap-8 rounded-3xl border border-anthracite-200 bg-white p-4 shadow-xl shadow-anthracite-900/[0.04] sm:p-8 lg:grid-cols-2 lg:gap-12">
      <div className="max-w-lg lg:py-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-anthracite-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-anthracite-700">
          <ArrowLeftRight size={15} aria-hidden="true" />
          {ru ? 'До и после' : 'Vorher & Nachher'}
        </span>
        <h3 className="mt-5 font-heading text-2xl leading-tight text-anthracite-900 sm:text-3xl">
          {ru ? 'Одна комната — заметная перемена' : 'Ein Raum — ein sichtbarer Unterschied'}
        </h3>
        <p className="mt-4 leading-7 text-anthracite-600">
          {ru
            ? 'От открытого основания после демонтажа до светлого ламината с плинтусами. Сравните два этапа ремонта этой квартиры в Halle (Saale).'
            : 'Vom freigelegten Untergrund nach dem Rückbau zum hellen Laminat mit Sockelleisten. Vergleichen Sie zwei Etappen der Renovierung dieser Wohnung in Halle (Saale).'}
        </p>
        <p id={descriptionId} className="mt-5 flex items-start gap-3 text-sm leading-6 text-anthracite-600">
          <MoveHorizontal size={22} className="mt-0.5 shrink-0 text-brand-orange-dark" aria-hidden="true" />
          {ru
            ? 'Двигайте разделитель мышью или пальцем. С клавиатуры: Tab, затем стрелки ← →. Снимки сделаны с немного разных ракурсов.'
            : 'Ziehen Sie den Regler mit Maus oder Finger. Per Tastatur: Tab, dann die Pfeiltasten ← →. Die Aufnahmen haben leicht unterschiedliche Blickwinkel.'}
        </p>
      </div>
      <div className="group relative mx-auto aspect-[3/4] w-full max-w-md select-none overflow-hidden rounded-2xl bg-anthracite-100 focus-within:outline focus-within:outline-4 focus-within:outline-offset-4 focus-within:outline-brand-orange-dark">
        <Image
          src={afterImage}
          alt={ru ? 'Комната после ремонта со светлым ламинатом и плинтусами' : 'Zimmer nach der Renovierung mit hellem Laminat und Sockelleisten'}
          fill
          sizes="(max-width: 639px) calc(100vw - 4rem), (max-width: 1023px) 448px, 42vw"
          className="pointer-events-none object-contain"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src={beforeImage}
            alt={ru ? 'Та же комната после демонтажа старого пола, до укладки ламината' : 'Dasselbe Zimmer nach dem Rückbau des alten Bodens, vor der Laminatverlegung'}
            fill
            sizes="(max-width: 639px) calc(100vw - 4rem), (max-width: 1023px) 448px, 42vw"
            className="object-contain"
            draggable={false}
          />
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-anthracite-950/85 px-4 py-2 text-xs font-semibold text-white shadow-sm" aria-hidden="true">{before}</span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-anthracite-900 shadow-sm" aria-hidden="true">{after}</span>
        <div className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_10px_rgba(0,0,0,0.4)]" style={{ left: `${position}%` }} aria-hidden="true" />
        <div className="pointer-events-none absolute top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-brand-orange-dark text-white shadow-xl transition-transform group-hover:scale-110 motion-reduce:transition-none" style={{ left: `clamp(1.5rem, ${position}%, calc(100% - 1.5rem))` }} aria-hidden="true">
          <ArrowLeftRight size={23} />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          aria-label={ru ? 'Сравнение комнаты до и после ремонта' : 'Zimmer vor und nach der Renovierung vergleichen'}
          aria-describedby={descriptionId}
          aria-valuetext={`${before}: ${position}%, ${after}: ${100 - position}%`}
          onChange={(event) => setPosition(Number(event.target.value))}
          onPointerDown={startDragging}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) updatePosition(event);
          }}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          className="absolute inset-0 z-20 m-0 h-full w-full cursor-ew-resize touch-pan-y opacity-0"
        />
      </div>
    </div>
  );
}
