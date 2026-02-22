import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustBadges from '@/components/TrustBadges';
import About from '@/components/About';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

type Params = Promise<{locale: string}>;

function getBaseUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return 'https://onebbau.de';
  return siteUrl.replace(/\/+$/, '');
}

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'metadata'});

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        de: '/de',
        ru: '/ru',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale === 'de' ? 'de_DE' : 'ru_RU',
      type: 'website',
      url: `/${locale}`,
      siteName: 'Onebbau',
      images: [
        {
          url: '/images/hero-main.webp',
          width: 1200,
          height: 630,
          alt: 'Onebbau',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/hero-main.webp'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Home({params}: {params: Params}) {
  const {locale} = await params;
  const baseUrl = getBaseUrl();
  const phone = process.env.NEXT_PUBLIC_PHONE || '+49 1520 458 6659';
  const email = process.env.NEXT_PUBLIC_EMAIL || 'service@onebbau.de';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'Onebbau',
    url: `${baseUrl}/${locale}`,
    telephone: phone,
    email,
    areaServed: 'Halle (Saale) und Umgebung',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Halle (Saale)',
      addressRegion: 'Sachsen-Anhalt',
      addressCountry: 'DE',
    },
    image: `${baseUrl}/images/hero-main.webp`,
  };

  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <About />
        <Services />
        <WhyUs />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
    </>
  );
}
