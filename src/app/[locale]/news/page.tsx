// src/app/[locale]/news/page.tsx
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { COMPANY_STREET_ADDRESS } from '@/lib/contact';
import { getSiteUrl } from '@/lib/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsListClient from './NewsListClient';

type Params = Promise<{ locale: string }>;

const metaTitles: Record<string, string> = {
  de: 'Neuigkeiten — Onebbau | Aktuelles aus Bau und Renovierung',
  ru: 'Новости — Onebbau | Актуальное из строительства и ремонта',
};

const metaDescriptions: Record<string, string> = {
  de: 'Aktuelle Nachrichten, Tipps und Projektberichte von Onebbau – Ihrem Bauunternehmen in Halle (Saale).',
  ru: 'Актуальные новости, советы и отчёты о проектах от Onebbau – вашей строительной компании в Галле (Заале).',
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === 'ru' ? 'ru' : 'de';

  return {
    title: metaTitles[lang],
    description: metaDescriptions[lang],
    alternates: {
      canonical: `/${lang}/news`,
      languages: { de: '/de/news', ru: '/ru/news' },
    },
    openGraph: {
      title: metaTitles[lang],
      description: metaDescriptions[lang],
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'ru_RU',
    },
  };
}

async function getPublishedArticles() {
  return prisma.newsArticle.findMany({
    where: { published: true, publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      titleRu: true,
      excerpt: true,
      excerptRu: true,
      coverUrl: true,
      coverWidth: true,
      coverHeight: true,
      publishedAt: true,
    },
  });
}

export default async function NewsPage({ params }: { params: Params }) {
  const { locale } = await params;
  const articles = await getPublishedArticles();
  const lang = locale === 'ru' ? 'ru' : 'de';
  const siteUrl = getSiteUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: metaTitles[lang],
    description: metaDescriptions[lang],
    url: `${siteUrl}/${lang}/news`,
    publisher: {
      '@type': 'HomeAndConstructionBusiness',
      name: 'Onebbau',
      address: {
        '@type': 'PostalAddress',
        streetAddress: COMPANY_STREET_ADDRESS,
        postalCode: '06130',
        addressLocality: 'Halle (Saale)',
        addressRegion: 'Sachsen-Anhalt',
        addressCountry: 'DE',
      },
    },
    blogPost: articles.map((a) => ({
      '@type': 'BlogPosting',
      headline: lang === 'ru' ? (a.titleRu || a.title) : a.title,
      description: lang === 'ru' ? (a.excerptRu || a.excerpt) : a.excerpt,
      url: `${siteUrl}/${lang}/news/${a.slug}`,
      datePublished: a.publishedAt.toISOString(),
      ...(a.coverUrl ? { image: `${siteUrl}${a.coverUrl}` } : {}),
    })),
  };

  const serialized = articles.map((a) => ({
    ...a,
    publishedAt: a.publishedAt.toISOString(),
  }));

  return (
    <>
      <Header />
      <NewsListClient locale={locale} articles={serialized} />
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
