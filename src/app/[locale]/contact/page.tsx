import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import { COMPANY_MAP_URL, COMPANY_POSTAL_CITY, COMPANY_STREET_ADDRESS } from '@/lib/contact';
import { getSiteUrl } from '@/lib/site';

type Params = Promise<{ locale: string }>;

type ContactPageCard = {
  title: string;
  text: string;
};

const channelIcons = [PhoneCall, Mail, MessageCircle];

const metaTitles: Record<string, string> = {
  de: 'Kontakt zu Onebbau | Anfrage für Bau- und Renovierungsarbeiten',
  ru: 'Контакт с Onebbau | Запрос на строительные и ремонтные работы',
};

const metaDescriptions: Record<string, string> = {
  de: 'Kontaktieren Sie Onebbau für Bau-, Renovierungs- und Außenarbeiten in Halle (Saale) und Umgebung. Telefon, E-Mail, WhatsApp und unverbindliche Projektanfrage.',
  ru: 'Свяжитесь с Onebbau по строительным, ремонтным и наружным работам в Halle (Saale) и окрестностях. Телефон, e-mail, WhatsApp и форма запроса проекта.',
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === 'ru' ? 'ru' : 'de';
  const title = metaTitles[lang];
  const description = metaDescriptions[lang];
  const image = '/uploads/onebbau_contact_banner_desktop_1800x2100.webp';

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/contact`,
      languages: {
        de: '/de/contact',
        ru: '/ru/contact',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'ru_RU',
      url: `/${lang}/contact`,
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

export default async function ContactPage({ params }: { params: Params }) {
  const { locale } = await params;
  const lang = locale === 'ru' ? 'ru' : 'de';
  const t = await getTranslations({ locale, namespace: 'contactPage' });
  const faq = await getTranslations({ locale, namespace: 'faq' });
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${lang}/contact`;
  const phone = process.env.NEXT_PUBLIC_PHONE || '+49 1520 458 6659';
  const secondaryPhone = '+49 177 33077538';
  const email = process.env.NEXT_PUBLIC_EMAIL || 'service@onebbau.de';
  const phoneToTel = (value: string) => value.replace(/\s+/g, '');
  const phoneToWhatsApp = (value: string) => value.replace(/\D/g, '');
  const channels = t.raw('channels') as ContactPageCard[];
  const responseItems = t.raw('response') as ContactPageCard[];
  const checklist = t.raw('checklist') as string[];
  const heroHighlights = t.raw('hero.highlights') as string[];
  const faqItems = faq.raw('items') as Array<{ question: string; answer: string }>;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
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
      email,
      telephone: phone,
      description: metaDescriptions[lang],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          telephone: phone,
          email,
          availableLanguage: lang === 'de' ? ['de', 'ru'] : ['ru', 'de'],
          areaServed: 'DE',
        },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: COMPANY_STREET_ADDRESS,
        postalCode: '06130',
        addressLocality: 'Halle (Saale)',
        addressRegion: 'Sachsen-Anhalt',
        addressCountry: 'DE',
      },
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

            <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)] xl:items-start xl:gap-12">
              <div className="min-w-0 xl:max-w-[40rem]">
                <span className="inline-flex rounded-full border border-white/[0.14] bg-white/[0.05] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
                  {t('hero.eyebrow')}
                </span>
                <h1 className="mt-5 max-w-[11ch] font-heading text-[clamp(2.8rem,8vw,4.9rem)] leading-[0.95] tracking-[-0.02em] text-white">
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
                    href={`tel:${phoneToTel(phone)}`}
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
                      src="/uploads/onebbau_contact_banner_mobile_1440x1800.webp"
                      alt={t('hero.imageAlt')}
                      fill
                      priority
                      sizes="100vw"
                      className="object-cover sm:hidden"
                    />
                    <Image
                      src="/uploads/onebbau_contact_banner_desktop_1800x2100.webp"
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
                  <a
                    href={`tel:${phoneToTel(phone)}`}
                    className="rounded-[1.6rem] border border-white/[0.12] bg-[#202227] p-5 shadow-2xl shadow-black/[0.24] transition-colors hover:border-brand-orange/30"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                      {t('hero.phoneLabel')}
                    </p>
                    <p className="mt-3 text-base font-semibold text-white">
                      {phone}
                    </p>
                    <p className="mt-1 text-sm text-white/[0.62]">{secondaryPhone}</p>
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="rounded-[1.6rem] border border-white/[0.12] bg-white/[0.06] p-5 shadow-2xl shadow-black/[0.18] transition-colors hover:border-brand-orange/30"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                      {t('hero.emailLabel')}
                    </p>
                    <p className="mt-3 break-all text-base font-semibold text-white">
                      {email}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">
                {t('channelsTitle')}
              </h2>
              <p className="mt-4 text-base leading-8 text-anthracite-600 sm:text-lg">
                {t('channelsIntro')}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {channels.map((item, index) => {
                const Icon = channelIcons[index] || PhoneCall;
                const href =
                  index === 0
                    ? `tel:${phoneToTel(phone)}`
                    : index === 1
                      ? `mailto:${email}`
                      : `https://wa.me/${phoneToWhatsApp(phone)}`;
                const label = index === 0 ? phone : index === 1 ? email : 'WhatsApp';

                return (
                  <a
                    key={item.title}
                    href={href}
                    target={index === 2 ? '_blank' : undefined}
                    rel={index === 2 ? 'noreferrer' : undefined}
                    className="rounded-[1.75rem] border border-anthracite-200 bg-anthracite-50 p-6 shadow-lg shadow-black/[0.03] transition-colors hover:border-brand-orange/30 hover:bg-white"
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
                    <p className="mt-4 text-sm font-semibold text-anthracite-900">
                      {label}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-anthracite-50/65 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
              <div>
                <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">
                  {t('responseTitle')}
                </h2>
                <p className="mt-4 text-base leading-8 text-anthracite-600 sm:text-lg">
                  {t('responseIntro')}
                </p>
                <a
                  href={COMPANY_MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 block rounded-[1.75rem] border border-anthracite-200 bg-white p-6 shadow-lg shadow-black/[0.03] transition-colors hover:border-brand-orange/30"
                >
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-1 flex-shrink-0 text-brand-orange" />
                    <div>
                      <p className="font-heading text-2xl text-anthracite-900">
                        {t('regionTitle')}
                      </p>
                      <p className="mt-3 font-medium text-anthracite-900">
                        {COMPANY_STREET_ADDRESS}
                      </p>
                      <p className="mt-1 text-sm text-anthracite-600 sm:text-base">
                        {COMPANY_POSTAL_CITY}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-anthracite-600 sm:text-base">
                        {t('regionText')}
                      </p>
                    </div>
                  </div>
                </a>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {responseItems.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.75rem] border border-anthracite-200 bg-white p-6 shadow-lg shadow-black/[0.03]"
                  >
                    <h3 className="font-heading text-2xl text-anthracite-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-anthracite-600 sm:text-base">
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
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <h2 className="font-heading text-3xl text-anthracite-900 sm:text-4xl">
                  {t('checklistTitle')}
                </h2>
                <p className="mt-4 text-base leading-8 text-anthracite-600 sm:text-lg">
                  {t('checklistIntro')}
                </p>
              </div>

              <div className="rounded-[2rem] border border-anthracite-200 bg-anthracite-50 p-6 shadow-xl shadow-black/[0.04] sm:p-8">
                <ul className="grid grid-cols-1 gap-4">
                  {checklist.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex items-start gap-3 rounded-2xl border border-anthracite-200 bg-white px-4 py-4 text-sm leading-7 text-anthracite-700 sm:text-base"
                    >
                      <CheckCircle2 size={18} className="mt-1 flex-shrink-0 text-brand-orange" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Contact />
        <Testimonials />
        <Faq />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
