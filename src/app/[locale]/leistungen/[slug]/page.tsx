// src/app/[locale]/leistungen/[slug]/page.tsx
// SEO/GEO/AIO-посадочные страницы услуг.
// SEO: уникальные title/description/H1, canonical, hreflang (de/ru/x-default),
//      внутренняя перелинковка, семантическая разметка.
// GEO/AIO: прямой ответ в первом абзаце, цены-ориентиры, зона обслуживания,
//      FAQPage / Service / LocalBusiness / BreadcrumbList в JSON-LD —
//      именно это цитируют ChatGPT, Perplexity и Google AI Overviews.

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, MapPin, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import {
  landings,
  getLanding,
  getLandingContent,
  getLandingImage,
  getLandingImageAspect,
  getLandingImageAlt,
} from '@/lib/landings';
import { getSiteUrl } from '@/lib/site';
import { COMPANY_STREET_ADDRESS } from '@/lib/contact';
import {
  Reveal,
  Counter,
  BlueprintHero,
  ProcessRail,
  ProcessStep,
  HoverCard,
} from '@/components/landing/LandingMotion';

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  return landings.flatMap((l) =>
    (['de', 'ru'] as const).map((locale) => ({ locale, slug: l.slug }))
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const landing = getLanding(slug);
  if (!landing) return {};
  const c = getLandingContent(landing, locale);
  const landingImage = getLandingImage(landing, locale);
  const landingImageAlt = getLandingImageAlt(landing, locale);
  const baseUrl = getSiteUrl();
  const path = `/leistungen/${slug}`;

  return {
    metadataBase: new URL(baseUrl),
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: landing.keywords.join(', '),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        de: `/de${path}`,
        ru: `/ru${path}`,
        'x-default': `/de${path}`,
      },
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      type: 'website',
      locale: locale === 'ru' ? 'ru_RU' : 'de_DE',
      url: `/${locale}${path}`,
      siteName: 'Onebbau',
      images: [{ url: landingImage, alt: landingImageAlt }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LandingPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const landing = getLanding(slug);
  if (!landing) notFound();
  const c = getLandingContent(landing, locale);
  const landingImage = getLandingImage(landing, locale);
  const landingImageAspect = getLandingImageAspect(landing, locale);
  const landingImageAlt = getLandingImageAlt(landing, locale);
  const baseUrl = getSiteUrl();
  const phone = process.env.NEXT_PUBLIC_PHONE || '+49 1520 458 6659';
  const email = process.env.NEXT_PUBLIC_EMAIL || 'service@onebbau.de';
  const pageUrl = `${baseUrl}/${locale}/leistungen/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HomeAndConstructionBusiness',
        '@id': `${baseUrl}/#business`,
        name: 'Onebbau',
        url: baseUrl,
        telephone: phone,
        email,
        priceRange: '€€',
        image: `${baseUrl}${landingImage}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: COMPANY_STREET_ADDRESS,
          postalCode: '06130',
          addressLocality: 'Halle (Saale)',
          addressRegion: 'Sachsen-Anhalt',
          addressCountry: 'DE',
        },
        geo: { '@type': 'GeoCoordinates', latitude: 51.4825, longitude: 11.9705 },
        areaServed: [
          { '@type': 'City', name: 'Halle (Saale)' },
          { '@type': 'AdministrativeArea', name: 'Saalekreis' },
          { '@type': 'City', name: 'Merseburg' },
          { '@type': 'City', name: 'Landsberg' },
        ],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '18:00',
          },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: c.h1,
        serviceType: landing.serviceType,
        description: c.directAnswer,
        provider: { '@id': `${baseUrl}/#business` },
        areaServed: { '@type': 'City', name: 'Halle (Saale)' },
        url: pageUrl,
        offers: {
          '@type': 'Offer',
          description: c.priceRange,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: c.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'ru' ? 'Главная' : 'Startseite',
            item: `${baseUrl}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: locale === 'ru' ? 'Услуги' : 'Leistungen',
            item: `${baseUrl}/${locale}/services`,
          },
          { '@type': 'ListItem', position: 3, name: c.h1, item: pageUrl },
        ],
      },
    ],
  };

  const related = landing.related
    .map((s) => getLanding(s))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main>
        {/* ═══════ HERO с blueprint-анимацией ═══════ */}
        <section className="relative isolate overflow-hidden bg-anthracite-950 pt-32 pb-20 sm:pt-40 sm:pb-28">
          <BlueprintHero className="pointer-events-none absolute -right-16 top-1/2 hidden w-[520px] -translate-y-1/2 text-brand-orange/70 lg:block" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(232,97,26,0.12),transparent_55%)]" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <Reveal>
                <span className="inline-flex items-center rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-orange">
                  <MapPin size={13} className="mr-1.5" /> Halle (Saale) · {c.eyebrow}
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-6 font-heading text-4xl leading-tight text-white sm:text-5xl md:text-[3.4rem]">
                  {c.h1}
                </h1>
              </Reveal>
              {/* Прямой ответ — первый текст на странице, его цитируют AI-системы */}
              <Reveal delay={0.16}>
                <p className="mt-6 text-lg leading-relaxed text-anthracite-100">
                  {c.directAnswer}
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 font-semibold text-white transition-colors hover:bg-brand-orange-dark"
                  >
                    {c.ctaButton}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition-colors hover:border-white/60"
                  >
                    <Phone size={17} /> {phone}
                  </a>
                </div>
              </Reveal>
              {/* Счётчики-рулетки */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {c.stats.map((s, i) => (
                  <Reveal key={s.label} delay={0.3 + i * 0.08}>
                    <p className="font-heading text-3xl text-brand-orange sm:text-4xl">
                      <Counter value={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-1 text-sm text-anthracite-300">{s.label}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ INTRO + локализованное изображение ═══════ */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-4xl">
              <p className="text-lg leading-relaxed text-anthracite-700">{c.intro}</p>
              <p className="mt-6 flex items-start gap-2.5 text-anthracite-600">
                <MapPin size={20} className="mt-0.5 shrink-0 text-brand-orange" />
                <span>
                  <strong className="text-anthracite-900">{c.areaTitle}: </strong>
                  {c.areaText}
                </span>
              </p>
            </Reveal>
            <div
              className="relative mt-10 w-full overflow-hidden rounded-2xl bg-anthracite-100 shadow-xl shadow-black/[0.08] sm:mt-12 sm:rounded-[2rem]"
              style={{ aspectRatio: landingImageAspect }}
            >
              <Image
                src={landingImage}
                alt={landingImageAlt}
                fill
                sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), 1280px"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* ═══════ BENEFITS ═══════ */}
        <section className="bg-anthracite-50/60 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">
                {c.benefitsTitle}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c.benefits.map((b, i) => (
                <HoverCard key={b.title} index={i}>
                  <CheckCircle2 className="text-brand-orange" size={26} />
                  <h3 className="mt-4 font-heading text-xl text-anthracite-900">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-anthracite-600">{b.text}</p>
                </HoverCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ PROCESS с прорисовывающейся линией ═══════ */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
            <div>
              <Reveal>
                <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl lg:sticky lg:top-28">
                  {c.processTitle}
                </h2>
              </Reveal>
            </div>
            <ProcessRail>
              {c.steps.map((s, i) => (
                <ProcessStep key={s.title} index={i} title={s.title} text={s.text} />
              ))}
            </ProcessRail>
          </div>
        </section>

        {/* ═══════ PRICE — ключевой блок для GEO/AIO ═══════ */}
        <section className="bg-anthracite-950 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-heading text-3xl text-white sm:text-4xl">{c.priceTitle}</h2>
              <p className="mt-6 text-lg leading-relaxed text-anthracite-200">{c.priceText}</p>
              <p className="mt-8 inline-block rounded-full border border-brand-orange/40 bg-brand-orange/10 px-6 py-2.5 font-semibold text-brand-orange">
                {c.priceRange}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ═══════ FAQ (виден пользователю + FAQPage schema) ═══════ */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">{c.faqTitle}</h2>
            </Reveal>
            <div className="mt-10 space-y-4">
              {c.faq.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.04}>
                  <details className="group rounded-2xl border border-anthracite-200/80 bg-white p-6 open:shadow-lg open:shadow-black/[0.04]">
                    <summary className="cursor-pointer list-none font-semibold text-anthracite-900 marker:hidden">
                      {f.q}
                    </summary>
                    <p className="mt-3 leading-relaxed text-anthracite-600">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ RELATED — внутренняя перелинковка ═══════ */}
        {related.length > 0 && (
          <section className="pb-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <h2 className="font-heading text-2xl text-anthracite-900">
                  {locale === 'ru' ? 'Смежные услуги' : 'Passende Leistungen'}
                </h2>
              </Reveal>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {related.map((r, i) => {
                  const rc = getLandingContent(r!, locale);
                  return (
                    <HoverCard key={r!.slug} index={i}>
                      <Link href={`/${locale}/leistungen/${r!.slug}`} className="block">
                        <h3 className="font-heading text-lg text-anthracite-900">{rc.eyebrow}</h3>
                        <p className="mt-1.5 line-clamp-2 text-sm text-anthracite-600">
                          {rc.metaDescription}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange">
                          {locale === 'ru' ? 'Подробнее' : 'Mehr erfahren'} <ArrowRight size={15} />
                        </span>
                      </Link>
                    </HoverCard>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══════ CTA + форма ═══════ */}
        <section className="bg-anthracite-50/60 pt-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">{c.ctaTitle}</h2>
              <p className="mt-4 text-lg text-anthracite-600">{c.ctaText}</p>
            </Reveal>
          </div>
          <Contact />
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
