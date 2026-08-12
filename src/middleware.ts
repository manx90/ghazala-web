import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import {
  ADMIN_ROUTE_PREFIX,
  AUTH_COOKIE_NAME,
  BILLING_ROUTE_PREFIX,
  GUEST_ROUTES,
  ONBOARDING_ROUTE_PREFIX,
  PROTECTED_ROUTE_PREFIX,
  ROUTES,
} from '@/config/routes';
import { routing, type Locale } from '@/i18n/routing';
import { stripLocalePrefix } from '@/i18n/utils';

const handleI18nRouting = createMiddleware(routing);

function resolveLocale(pathname: string): Locale {
  const segment = pathname.split('/')[1];
  return routing.locales.includes(segment as Locale)
    ? (segment as Locale)
    : routing.defaultLocale;
}

function localizedPath(locale: Locale, path: string): string {
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

function isGuestRoute(pathname: string): boolean {
  return GUEST_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith(PROTECTED_ROUTE_PREFIX) ||
    pathname.startsWith(ONBOARDING_ROUTE_PREFIX) ||
    pathname.startsWith(BILLING_ROUTE_PREFIX)
  );
}

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith(ADMIN_ROUTE_PREFIX);
}

export function middleware(request: NextRequest) {
  const intlResponse = handleI18nRouting(request);
  const { pathname } = request.nextUrl;
  const pathnameWithoutLocale = stripLocalePrefix(pathname);
  const locale = resolveLocale(pathname);
  const isAuthenticated = request.cookies.get(AUTH_COOKIE_NAME)?.value === '1';

  if (isGuestRoute(pathnameWithoutLocale) && isAuthenticated) {
    return NextResponse.redirect(
      new URL(localizedPath(locale, ROUTES.app.root), request.url),
    );
  }

  if ((isProtectedRoute(pathnameWithoutLocale) || isAdminRoute(pathnameWithoutLocale)) && !isAuthenticated) {
    const loginUrl = new URL(localizedPath(locale, ROUTES.auth.login), request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
