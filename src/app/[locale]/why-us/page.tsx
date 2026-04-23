import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  Award,
  Banknote,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import { getSiteUrl } from '@/lib/site';

type Params = Promise<{ locale: string }>;

type WhyUsPageCard = {
  title: string;
  text: string;
};

type WhyUsPageStep = {
  title: string;
  text: string;
};

const reasonIcons = [Award, Clock, Sparkles, Banknote, Users];
const proofIcons = [ShieldCheck, MessageSquareMore, Home];

const metaTitles: Record<string, string> = {
  de: 'Warum Onebbau | Vorteile, Ablauf und Arbeitsweise',
  ru: 'Почему Onebbau | Преимущества, подход и организация работ',
};

const metaDescriptions: Record<string, string> = {
  de: 'Warum Kunden Onebbau wählen: klare Kommunikation, saubere Ausführung, realistische Preise und verlässliche Abläufe bei Bau- und Renovierungsarbeiten in Halle (Saale).',
  ru: 'Почему клиенты выбирают Onebbau: понятная коммуникация, аккуратное исполнение, реалистичная цена и надёжная организация строительных и ремонтных работ в Halle (Saale).',
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === 'ru' ? 'ru' : 'de';
  const title = metaTitles[lang];
  const description = metaDescriptions[lang];
  const image = '/uploads/onebbau_logo_banner_desktop_1800x2100.webp';

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/why-us`,
      languages: {
        de: '/de/why-us',
        ru: '/ru/why-us',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'ru_RU',
      url: `/${lang}/why-us`,
      siteName: 'Onebbau',
      images: [
        {
          url: image,
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
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function WhyUsPage({ params }: { params: Params }) {
  const { locale } = await params;
  const lang = locale === 'ru' ? 'ru' : 'de';
  const t = await getTranslations({ locale, namespace: 'whyUsPage' });
  const whyUs = await getTranslations({ locale, namespace: 'whyUs' });
  const faq = await getTranslations({ locale, namespace: 'faq' });
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${lang}/why-us`;
  const reasons = whyUs.raw('items') as WhyUsPageCard[];
  const proofs = t.raw('proofs') as WhyUsPageCard[];
  const workflow = t.raw('workflow') as WhyUsPageStep[];
  const audiences = t.raw('audiences') as WhyUsPageCard[];
  const heroHighlights = t.raw('hero.highlights') as string[];
  const faqItems = faq.raw('items') as Array<{ question: string; answer: string }>;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitles[lang],
      description: metaDescriptions[lang],
      url: pageUrl,
      inLanguage: lang,
      isPartOf: {
        '@type': 'WebSite',
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
      description: metaDescriptions[lang],
      knowsAbout: [
        'Badsanierung',
        'Trockenbau',
        'Malerarbeiten',
        'Fassadenarbeiten',
        'Terrassenbau',
        'Renovierungsarbeiten',
      ],
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-24 sm:pt-28">
        <section className="relative overflow-hidden bg-[#17181c] pb-16 pt-12 text-white sm:pb-20 sm:pt-16">
          <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-brand-orange/[0.16] via-brand-orange/[0.05] to-transparent" />
          <div className="absolute -left-24 top-14 h-72 w-72 rounded-full bg-brand-orange/[0.12] blur-3xl" />
          <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-sm text-white/60 sm:mb-10"
            >
              <Link href={`/${lang}`} className="transition-colors hover:text-white">
                {lang === 'de' ? 'Startseite' : 'Главная'}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white/85">{t('hero.title')}</span>
            </nav>

            <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] xl:items-start xl:gap-12">
              <div className="min-w-0 xl:max-w-[40rem]">
                <span className="inline-flex rounded-full border border-white/[0.14] bg-white/[0.05] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
                  {t('hero.eyebrow')}
                </span>
                <h1 className="mt-5 max-w-[11ch] font-heading text-[clamp(2.8rem,8vw,5rem)] leading-[0.95] tracking-[-0.02em] text-white">
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
                  <Link
                    href={`/${lang}/contact`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
                  >
                    {t('hero.primaryCta')}
                    <ArrowRight size={16} />
                  </Link>
                  <a
                    href="#reviews"
                    className="inline-flex items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
                  >
                    {t('hero.secondaryCta')}
                  </a>
                </div>
              </div>

              <div className="relative min-w-0">
                <div className="relative overflow-hidden rounded-[2.2rem] border border-white/[0.12] bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                  <div className="relative aspect-[4/5] sm:aspect-[16/10] xl:aspect-[6/7]">
                    <Image
                      src="/uploads/onebbau_logo_banner_mobile_1440x1800.webp"
                      alt={t('hero.imageAlt')}
                      fill
                      priority
                      sizes="100vw"
                      className="object-cover sm:hidden"
                    />
                    <Image
                      src="/uploads/onebbau_logo_banner_desktop_1800x2100.webp"
                      alt={t('hero.imageAlt')}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 44vw"
                      className="hidden object-cover sm:block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111214]/72 via-[#111214]/28 to-[#111214]/18 sm:from-[#111214]/95 sm:via-[#111214]/36" />
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#111214]/64 to-transparent" />

                    <div className="absolute left-4 top-4 rounded-full border border-white/[0.14] bg-[#111214]/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-orange backdrop-blur-sm sm:left-6 sm:top-6 sm:text-[11px]">
                      {t('hero.imageTag')}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 hidden p-4 sm:block sm:p-6">
                      <div className="max-w-[34rem] rounded-[1.6rem] border border-white/[0.12] bg-[#111214]/72 p-4 backdrop-blur-md sm:p-5">
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

                <div className="mt-4 sm:hidden">
                  <div className="rounded-[1.6rem] border border-white/[0.12] bg-[#202227] p-5 shadow-2xl shadow-black/[0.24]">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/[0.55]">
                      {t('hero.imageTitle')}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/[0.8]">
                      {t('hero.imageText')}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.6rem] border border-white/[0.12] bg-[#202227] p-5 shadow-2xl shadow-black/[0.24]">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                      {t('hero.cardTitle')}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/[0.78]">
                      {t('hero.cardText')}
                    </p>
                  </div>
                  <div className="rounded-[1.6rem] border border-white/[0.12] bg-white/[0.06] p-5 shadow-2xl shadow-black/[0.18]">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                      {t('hero.metricTitle')}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/[0.72]">
                      {t('hero.metricText')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
              <div>
                <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">
                  {t('proofTitle')}
                </h2>
                <p className="mt-4 text-base leading-8 text-anthracite-600 sm:text-lg">
                  {t('proofIntro')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {proofs.map((item, index) => {
                  const Icon = proofIcons[index] || ShieldCheck;

                  return (
                    <article
                      key={item.title}
                      className="rounded-[1.75rem] border border-anthracite-200 bg-anthracite-50 p-6 shadow-lg shadow-black/[0.03]"
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

        <section className="bg-anthracite-50/65 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">
                {t('reasonsTitle')}
              </h2>
              <p className="mt-4 text-base leading-8 text-anthracite-600 sm:text-lg">
                {t('reasonsIntro')}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
              {reasons.map((item, index) => {
                const Icon = reasonIcons[index] || Award;

                return (
                  <article
                    key={item.title}
                    className={`rounded-[1.75rem] border border-anthracite-200 bg-white p-6 shadow-lg shadow-black/[0.03] ${
                      index === reasons.length - 1 ? 'sm:col-span-2 xl:col-span-1' : ''
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
        </section>

        <section className="bg-anthracite-950 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
              <div>
                <h2 className="font-heading text-3xl sm:text-4xl">
                  {t('workflowTitle')}
                </h2>
                <p className="mt-4 text-base leading-8 text-white/[0.74] sm:text-lg">
                  {t('workflowIntro')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {workflow.map((item, index) => (
                  <article
                    key={item.title}
                    className={`rounded-[1.75rem] border border-white/[0.12] bg-white/[0.05] p-6 shadow-xl shadow-black/[0.14] ${
                      index === workflow.length - 1 ? 'sm:col-span-2' : ''
                    }`}
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
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.94fr] lg:gap-16">
              <div>
                <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">
                  {t('audienceTitle')}
                </h2>
                <p className="mt-4 text-base leading-8 text-anthracite-600 sm:text-lg">
                  {t('audienceIntro')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {audiences.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.75rem] border border-anthracite-200 bg-anthracite-50 p-6 shadow-lg shadow-black/[0.03]"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="mt-1 flex-shrink-0 text-brand-orange" />
                      <div>
                        <h3 className="font-heading text-2xl text-anthracite-900">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-anthracite-600 sm:text-base">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
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
