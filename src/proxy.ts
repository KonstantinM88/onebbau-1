// src/proxy.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
});

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes — check auth cookie
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Admin login & API routes — skip intl
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // All other routes — next-intl locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next|images|uploads|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
