import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalerieClient from './GalerieClient';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';

  return {
    title: isRu
      ? 'Галерея — Onebbau | Наши проекты в Halle (Saale)'
      : 'Galerie — Onebbau | Unsere Projekte in Halle (Saale)',
    description: isRu
      ? 'Посмотрите наши строительные и ремонтные проекты в Галле (Заале) и окрестностях.'
      : 'Entdecken Sie unsere Bau- und Renovierungsprojekte in Halle (Saale) und Umgebung.',
  };
}

async function getGalleryImages() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return images;
}

export default async function GaleriePage({ params }: { params: Params }) {
  const { locale } = await params;
  const images = await getGalleryImages();

  return (
    <>
      <Header />
      <GalerieClient locale={locale} images={images} />
      <Footer />
    </>
  );
}
