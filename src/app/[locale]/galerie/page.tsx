// src/app/[locale]/galerie/page.tsx
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalerieClient from './GalerieClient';

type Params = Promise<{ locale: string }>;

const metaTitles: Record<string, string> = {
  de: 'Galerie — Onebbau | Bau- und Renovierungsprojekte in Halle (Saale)',
  ru: 'Галерея — Onebbau | Строительные и ремонтные проекты в Галле (Заале)',
};

const metaDescriptions: Record<string, string> = {
  de: 'Entdecken Sie unsere abgeschlossenen Bau- und Renovierungsprojekte: Badezimmer, Fassaden, Terrassen, Innenausbau und mehr in Halle (Saale).',
  ru: 'Посмотрите наши завершённые строительные и ремонтные проекты: ванные, фасады, террасы, интерьеры и многое другое в Галле (Заале).',
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === 'ru' ? 'ru' : 'de';

  return {
    title: metaTitles[lang],
    description: metaDescriptions[lang],
    alternates: {
      canonical: `/${lang}/galerie`,
      languages: {
        de: '/de/galerie',
        ru: '/ru/galerie',
      },
    },
    openGraph: {
      title: metaTitles[lang],
      description: metaDescriptions[lang],
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'ru_RU',
    },
  };
}

async function getGalleryImages() {
  return prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      url: true,
      filename: true,
      category: true,
      caption: true,
      captionRu: true,
      width: true,
      height: true,
    },
  });
}

export default async function GaleriePage({ params }: { params: Params }) {
  const { locale } = await params;
  const images = await getGalleryImages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: metaTitles[locale === 'ru' ? 'ru' : 'de'],
    description: metaDescriptions[locale === 'ru' ? 'ru' : 'de'],
    numberOfItems: images.length,
    provider: {
      '@type': 'HomeAndConstructionBusiness',
      name: 'Onebbau',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Halle (Saale)',
        addressRegion: 'Sachsen-Anhalt',
        addressCountry: 'DE',
      },
    },
  };

  return (
    <>
      <Header />
      <GalerieClient locale={locale} images={images} />
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}




//-------пробую улучшить галерею
// import type { Metadata } from 'next';
// import { prisma } from '@/lib/prisma';
// import { getTranslations } from 'next-intl/server';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import GalerieClient from './GalerieClient';

// type Params = Promise<{ locale: string }>;

// export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
//   const { locale } = await params;
//   const isRu = locale === 'ru';

//   return {
//     title: isRu
//       ? 'Галерея — Onebbau | Наши проекты в Halle (Saale)'
//       : 'Galerie — Onebbau | Unsere Projekte in Halle (Saale)',
//     description: isRu
//       ? 'Посмотрите наши строительные и ремонтные проекты в Галле (Заале) и окрестностях.'
//       : 'Entdecken Sie unsere Bau- und Renovierungsprojekte in Halle (Saale) und Umgebung.',
//   };
// }

// async function getGalleryImages() {
//   const images = await prisma.galleryImage.findMany({
//     orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
//   });
//   return images;
// }

// export default async function GaleriePage({ params }: { params: Params }) {
//   const { locale } = await params;
//   const images = await getGalleryImages();

//   return (
//     <>
//       <Header />
//       <GalerieClient locale={locale} images={images} />
//       <Footer />
//     </>
//   );
// }
