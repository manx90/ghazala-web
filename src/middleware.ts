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
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get(AUTH_COOKIE_NAME)?.value === '1';

  if (isGuestRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.app.root, request.url));
  }

  if ((isProtectedRoute(pathname) || isAdminRoute(pathname)) && !isAuthenticated) {
    const loginUrl = new URL(ROUTES.auth.login, request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
