// src/app/[locale]/news/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleClient from './ArticleClient';

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const isRu = locale === 'ru';

  const article = await prisma.newsArticle.findUnique({
    where: { slug },
    select: {
      title: true,
      titleRu: true,
      excerpt: true,
      excerptRu: true,
      metaTitle: true,
      metaTitleRu: true,
      metaDesc: true,
      metaDescRu: true,
      coverUrl: true,
    },
  });

  if (!article) return { title: 'Not Found' };

  const title = isRu
    ? (article.metaTitleRu || article.titleRu || article.title)
    : (article.metaTitle || article.title);
  const description = isRu
    ? (article.metaDescRu || article.excerptRu || article.excerpt)
    : (article.metaDesc || article.excerpt);
  const fullTitle = `${title} — Onebbau`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: `/${locale}/news/${slug}`,
      languages: { de: `/de/news/${slug}`, ru: `/ru/news/${slug}` },
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'article',
      locale: isRu ? 'ru_RU' : 'de_DE',
      url: `https://onebbau.de/${locale}/news/${slug}`,
      siteName: 'Onebbau',
      ...(article.coverUrl
        ? {
            images: [
              {
                url: `https://onebbau.de${article.coverUrl}`,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Generate static slugs
export async function generateStaticParams() {
  const articles = await prisma.newsArticle.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const isRu = locale === 'ru';

  const article = await prisma.newsArticle.findUnique({ where: { slug } });

  if (!article || (!article.published && process.env.NODE_ENV === 'production')) {
    notFound();
  }

  const title = isRu ? (article.titleRu || article.title) : article.title;
  const excerpt = isRu ? (article.excerptRu || article.excerpt) : article.excerpt;
  const content = isRu ? (article.contentRu || article.content) : article.content;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    url: `https://onebbau.de/${locale}/news/${slug}`,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    inLanguage: isRu ? 'ru' : 'de',
    ...(article.coverUrl
      ? {
          image: {
            '@type': 'ImageObject',
            url: `https://onebbau.de${article.coverUrl}`,
            width: article.coverWidth,
            height: article.coverHeight,
          },
        }
      : {}),
    author: {
      '@type': 'Organization',
      name: 'Onebbau',
      url: 'https://onebbau.de',
    },
    publisher: {
      '@type': 'HomeAndConstructionBusiness',
      name: 'Onebbau',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Halle (Saale)',
        addressRegion: 'Sachsen-Anhalt',
        addressCountry: 'DE',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://onebbau.de/${locale}/news/${slug}`,
    },
  };

  return (
    <>
      <Header />
      <ArticleClient
        locale={locale}
        title={title}
        excerpt={excerpt}
        content={content}
        coverUrl={article.coverUrl}
        coverWidth={article.coverWidth}
        coverHeight={article.coverHeight}
        publishedAt={article.publishedAt.toISOString()}
        slug={slug}
      />
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}