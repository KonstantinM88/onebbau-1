import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { locales } from '@/i18n/config';
import { getSiteUrl } from '@/lib/site';
import { landings } from '@/lib/landings';

const STATIC_PATHS = [
  '',
  '/about',
  '/services',
  '/why-us',
  '/contact',
  '/news',
  '/galerie',
  '/impressum',
  '/datenschutz',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
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

  const landingEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    landings.map((landing) => ({
      url: `${baseUrl}/${locale}/leistungen/${landing.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }))
  );

  const articleEntries: MetadataRoute.Sitemap = articles.flatMap((article) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/news/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  );

  return [...staticEntries, ...landingEntries, ...articleEntries];
}
