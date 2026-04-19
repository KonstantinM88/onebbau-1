import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Hammer,
  Home,
  MapPin,
  MessageSquareMore,
  ShieldCheck,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import { getSiteUrl } from '@/lib/site';

type Params = Promise<{ locale: string }>;

type AboutPageSectionItem = {
  title: string;
  text: string;
};

type AboutPageStat = {
  value: string;
  label: string;
};

type AboutPageProcess = {
  title: string;
  text: string;
};

type AboutPageAudience = {
  title: string;
  text: string;
};

const valueIcons = [ShieldCheck, ClipboardCheck, MessageSquareMore];
const audienceIcons = [Home, Hammer, CheckCircle2];

const metaTitles: Record<string, string> = {
  de: 'Über Onebbau | Bauunternehmen in Halle (Saale)',
  ru: 'О компании Onebbau | Строительные работы в Halle (Saale)',
};

const metaDescriptions: Record<string, string> = {
  de: 'Lernen Sie Onebbau kennen: Bau-, Renovierungs- und Handwerksarbeiten in Halle (Saale), klare Abläufe, persönliche Beratung und saubere Ausführung.',
  ru: 'Узнайте больше о Onebbau: строительные и ремонтные работы в Halle (Saale), понятный процесс, личная консультация и аккуратное исполнение.',
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === 'ru' ? 'ru' : 'de';
  const title = metaTitles[lang];
  const description = metaDescriptions[lang];
  const aboutImage = '/uploads/onebbau_about_banner.webp';

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/about`,
      languages: {
        de: '/de/about',
        ru: '/ru/about',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'ru_RU',
      url: `/${lang}/about`,
      siteName: 'Onebbau',
      images: [
        {
          url: aboutImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [aboutImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  const lang = locale === 'ru' ? 'ru' : 'de';
  const t = await getTranslations({ locale, namespace: 'aboutPage' });
  const faq = await getTranslations({ locale, namespace: 'faq' });
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${lang}/about`;
  const phone = process.env.NEXT_PUBLIC_PHONE || '+49 1520 458 6659';
  const email = process.env.NEXT_PUBLIC_EMAIL || 'service@onebbau.de';
  const values = t.raw('values') as AboutPageSectionItem[];
  const processSteps = t.raw('process') as AboutPageProcess[];
  const audiences = t.raw('audiences') as AboutPageAudience[];
  const stats = t.raw('stats') as AboutPageStat[];
  const faqItems = faq.raw('items') as Array<{ question: string; answer: string }>;
  const heroHighlights = t.raw('hero.highlights') as string[];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: metaTitles[lang],
      description: metaDescriptions[lang],
      url: pageUrl,
      inLanguage: lang,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Onebbau',
        url: siteUrl,
      },
      about: {
        '@type': 'HomeAndConstructionBusiness',
        name: 'Onebbau',
        url: siteUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: lang === 'de' ? 'Startseite' : 'Главная',
          item: `${siteUrl}/${lang}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('hero.title'),
          item: pageUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      name: 'Onebbau',
      url: siteUrl,
      email,
      telephone: phone,
      image: `${siteUrl}/uploads/onebbau_about_banner.webp`,
      areaServed: [
        'Halle (Saale)',
        'Merseburg',
        'Kabelsketal',
        'Landsberg',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Halle (Saale)',
        addressRegion: 'Sachsen-Anhalt',
        addressCountry: 'DE',
      },
      description: metaDescriptions[lang],
      knowsAbout: [
        'Badsanierung',
        'Trockenbau',
        'Malerarbeiten',
        'Fassadenarbeiten',
        'Terrassenbau',
        'Fenster- und Türenmontage',
      ],
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-24 sm:pt-28">
        <section className="relative overflow-hidden bg-[#17181c] pb-16 pt-12 text-white sm:pb-20 sm:pt-16">
          <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-brand-orange/[0.18] via-brand-orange/[0.05] to-transparent" />
          <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand-orange/[0.14] blur-3xl" />
          <div className="absolute right-0 top-12 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-sm text-white/60 sm:mb-10"
            >
              <Link href={`/${lang}`} className="hover:text-white transition-colors">
                {lang === 'de' ? 'Startseite' : 'Главная'}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white/85">{t('hero.title')}</span>
            </nav>

            <div className="grid min-w-0 grid-cols-1 gap-10 lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.96fr)] xl:items-start">
              <div className="min-w-0 xl:max-w-[40rem] xl:pr-4">
                <span className="inline-flex rounded-full border border-white/[0.14] bg-white/[0.05] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
                  {t('hero.eyebrow')}
                </span>
                <h1 className="mt-5 max-w-[12ch] font-heading text-[clamp(2.8rem,9vw,5.4rem)] leading-[0.94] tracking-[-0.02em] text-white">
                  {t('hero.title')}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/[0.76] sm:text-lg">
                  {t('hero.lead')}
                </p>

                <ul className="mt-8 grid grid-cols-1 gap-3">
                  {heroHighlights.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex items-start gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-4 py-3.5 text-sm leading-6 text-white/[0.84] backdrop-blur-sm sm:px-5"
                    >
                      <CheckCircle2 size={18} className="mt-1 flex-shrink-0 text-brand-orange" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
                  >
                    {t('hero.primaryCta')}
                    <ArrowRight size={16} />
                  </a>
                  <a
                    href={`/${lang}/galerie`}
                    className="inline-flex items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
                  >
                    {t('hero.secondaryCta')}
                  </a>
                </div>
              </div>

              <div className="relative min-w-0">
                <div className="absolute -left-6 top-10 hidden h-40 w-40 rounded-full border border-white/[0.08] 2xl:block" />
                <div className="absolute -right-10 bottom-6 hidden h-48 w-48 rounded-full border border-brand-orange/[0.18] 2xl:block" />

                <div className="relative overflow-hidden rounded-[2.2rem] border border-white/[0.12] bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                  <div className="relative aspect-[4/5] sm:aspect-[16/11] xl:aspect-[6/7]">
                    <Image
                      src="/uploads/onebbau_about_banner.webp"
                      alt={t('hero.imageAlt')}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 42vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/94 via-[#111214]/34 to-[#111214]/14" />
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#111214]/60 to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full border border-white/[0.14] bg-[#111214]/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-orange backdrop-blur-sm sm:left-6 sm:top-6 sm:text-[11px]">
                      {t('hero.imageTag')}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                      <div className="max-w-xl rounded-[1.6rem] border border-white/[0.12] bg-[#111214]/72 p-4 backdrop-blur-md sm:p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/[0.55]">
                          {t('hero.imageTitle')}
                        </p>
                        <p className="mt-3 max-w-lg text-sm leading-7 text-white/[0.82] sm:text-base">
                          {t('hero.imageText')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-[1.6rem] border border-white/[0.12] bg-[#202227] p-5 shadow-2xl shadow-black/[0.24]">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                      {t('hero.floatingCardTitle')}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/[0.78]">
                      {t('hero.floatingCardText')}
                    </p>
                  </div>
                  <div className="rounded-[1.6rem] border border-white/[0.12] bg-white/[0.06] p-5 shadow-2xl shadow-black/[0.18]">
                    <p className="font-heading text-4xl text-white">
                      {t('hero.metricValue')}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/[0.7]">
                      {t('hero.metricLabel')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 lg:mt-12 lg:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.75rem] border border-white/[0.12] bg-white/[0.05] p-5 shadow-xl shadow-black/[0.16]"
                >
                  <p className="font-heading text-3xl text-white sm:text-4xl">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-white/[0.68]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
              <div>
                <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">
                  {t('story.title')}
                </h2>
                <div className="mt-6 space-y-5 text-base leading-8 text-anthracite-600">
                  <p>{t('story.paragraph1')}</p>
                  <p>{t('story.paragraph2')}</p>
                  <p>{t('story.paragraph3')}</p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-anthracite-200 bg-anthracite-50 p-6 shadow-xl shadow-black/[0.04]">
                <h3 className="font-heading text-2xl text-anthracite-900">
                  {t('serviceArea.title')}
                </h3>
                <p className="mt-3 text-sm leading-7 text-anthracite-600 sm:text-base">
                  {t('serviceArea.text')}
                </p>
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(t.raw('serviceArea.locations') as string[]).map((location) => (
                    <li
                      key={location}
                      className="flex items-center gap-2 rounded-xl border border-anthracite-200 bg-white px-4 py-3 text-sm font-medium text-anthracite-700"
                    >
                      <MapPin size={16} className="text-brand-orange" />
                      {location}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-anthracite-50/65 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">
                {t('valuesTitle')}
              </h2>
              <p className="mt-4 text-base leading-8 text-anthracite-600 sm:text-lg">
                {t('valuesIntro')}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {values.map((item, index) => {
                const Icon = valueIcons[index] || ShieldCheck;

                return (
                  <article
                    key={item.title}
                    className="rounded-[1.75rem] border border-anthracite-200 bg-white p-6 shadow-lg shadow-black/[0.03]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 font-heading text-2xl text-anthracite-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-anthracite-600 sm:text-base">
                      {item.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.88fr_1.12fr]">
              <div>
                <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">
                  {t('audiencesTitle')}
                </h2>
                <p className="mt-4 text-base leading-8 text-anthracite-600 sm:text-lg">
                  {t('audiencesIntro')}
                </p>
                <div className="mt-8 rounded-[1.75rem] border border-anthracite-200 bg-anthracite-50 p-6">
                  <h3 className="font-heading text-2xl text-anthracite-900">
                    {t('audiencesHighlight.title')}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-anthracite-600 sm:text-base">
                    {t('audiencesHighlight.text')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {audiences.map((item, index) => {
                  const Icon = audienceIcons[index] || Home;

                  return (
                    <article
                      key={item.title}
                      className={`rounded-[1.75rem] border border-anthracite-200 bg-white p-6 shadow-lg shadow-black/[0.03] ${
                        index === audiences.length - 1 ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                        <Icon size={22} />
                      </div>
                      <h3 className="mt-5 font-heading text-2xl text-anthracite-900">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-anthracite-600 sm:text-base">
                        {item.text}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-anthracite-950 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="font-heading text-3xl sm:text-4xl">
                {t('processTitle')}
              </h2>
              <p className="mt-4 text-base leading-8 text-white/[0.74] sm:text-lg">
                {t('processIntro')}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-4">
              {processSteps.map((item, index) => (
                <article
                  key={item.title}
                  className="rounded-[1.75rem] border border-white/[0.12] bg-white/[0.05] p-6 shadow-xl shadow-black/[0.14]"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 font-heading text-2xl text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/[0.72] sm:text-base">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Testimonials />
        <Faq />
        <Contact />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
