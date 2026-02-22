import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {DM_Serif_Display, Plus_Jakarta_Sans} from 'next/font/google';
import {locales} from '@/i18n/config';

type Params = Promise<{locale: string}>;

type Props = {
  children: React.ReactNode;
  params: Params;
};

const fontHeading = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-heading'
});

const fontBody = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body'
});

function getBaseUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return 'https://onebbau.de';
  return siteUrl.replace(/\/+$/, '');
}

export async function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'metadata'});
  const baseUrl = getBaseUrl();
  const heroImage = '/images/hero-main.webp';

  return {
    metadataBase: new URL(baseUrl),
    title: t('title'),
    description: t('description'),
    keywords:
      locale === 'de'
        ? 'Baufirma Halle, Handwerker Halle, Renovierung Halle, Trockenbau Halle, Bauunternehmen Sachsen-Anhalt'
        : 'строительная компания Halle, ремонт Halle, строительство Halle Saale',
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale === 'de' ? 'de_DE' : 'ru_RU',
      type: 'website',
      siteName: 'Onebbau',
      url: `/${locale}`,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: 'Onebbau'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [heroImage]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  const messages = await getMessages();

  return (
    <div
      lang={locale}
      className={`${fontHeading.variable} ${fontBody.variable} font-body bg-white text-anthracite-950`}
    >
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
