import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { locales } from '@/i18n/config';

const STATIC_PATHS = ['', '/news', '/galerie', '/impressum', '/datenschutz'] as const;

function getBaseUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return 'https://onebbau.de';
  return siteUrl.replace(/\/+$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === '' ? 'weekly' : 'monthly',
      priority: path === '' ? 1 : path === '/news' ? 0.9 : 0.7,
    }))
  );

  const articles = await prisma.newsArticle.findMany({
    where: {
      published: true,
      publishedAt: { lte: now },
    },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  const articleEntries: MetadataRoute.Sitemap = articles.flatMap((article) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/news/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  );

  return [...staticEntries, ...articleEntries];
}
