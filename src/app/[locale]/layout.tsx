import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {DM_Serif_Display, Plus_Jakarta_Sans} from 'next/font/google';
import {locales} from '@/i18n/config';
import '../globals.css';

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

export async function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Params}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'metadata'});

  return {
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
      type: 'website'
    }
  };
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  // getMessages возьмёт locale из request config (см. файл ниже)
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${fontHeading.variable} ${fontBody.variable} scroll-smooth`}>
      <body className="font-body antialiased bg-white text-anthracite-950">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}




// import type { Metadata } from 'next';
// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages, getTranslations } from 'next-intl/server';
// import { locales } from '@/i18n/config';
// import '../globals.css';

// type Props = {
//   children: React.ReactNode;
//   params: { locale: string };
// };

// export async function generateStaticParams() {
//   return locales.map((locale) => ({ locale }));
// }

// export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
//   const t = await getTranslations({ locale, namespace: 'metadata' });
//   return {
//     title: t('title'),
//     description: t('description'),
//     keywords: locale === 'de'
//       ? 'Baufirma Halle, Handwerker Halle, Renovierung Halle, Trockenbau Halle, Bauunternehmen Sachsen-Anhalt'
//       : 'строительная компания Halle, ремонт Halle, строительство Halle Saale',
//     openGraph: {
//       title: t('title'),
//       description: t('description'),
//       locale: locale === 'de' ? 'de_DE' : 'ru_RU',
//       type: 'website',
//     },
//   };
// }

// export default async function LocaleLayout({ children, params: { locale } }: Props) {
//   const messages = await getMessages();

//   return (
//     <html lang={locale} className="scroll-smooth">
//       <body className="font-body antialiased bg-white text-anthracite-950">
//         <NextIntlClientProvider messages={messages}>
//           {children}
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }
