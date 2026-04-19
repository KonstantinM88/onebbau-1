const PROD_SITE_URL = 'https://onebbau.de';
const DEV_SITE_URL = 'http://localhost:3000';

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) return siteUrl.replace(/\/+$/, '');
  return process.env.NODE_ENV === 'production' ? PROD_SITE_URL : DEV_SITE_URL;
}
