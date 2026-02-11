import createMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';
import {locales, defaultLocale} from './i18n/config';

const middleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default function proxy(request: NextRequest) {
  return middleware(request);
}

export const config = {
  matcher: ['/', '/(de|ru)/:path*']
};
