import type { MetadataRoute } from 'next';

function getBaseUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return 'https://onebbau.de';
  return siteUrl.replace(/\/+$/, '');
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
