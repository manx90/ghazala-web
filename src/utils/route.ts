import {
  ADMIN_ROUTE_PREFIX,
  GUEST_ROUTES,
  ONBOARDING_ROUTE_PREFIX,
  PROTECTED_ROUTE_PREFIX,
  ROUTES,
} from '@/config/routes';
import { UserRole } from '@/types';

export function isGuestRoute(pathname: string): boolean {
  return GUEST_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith(PROTECTED_ROUTE_PREFIX) ||
    pathname.startsWith(ONBOARDING_ROUTE_PREFIX)
  );
}

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith(ADMIN_ROUTE_PREFIX);
}

export function getPostLoginRedirect(role: UserRole, orgSlug?: string | null): string {
  if (role === UserRole.SUPER_ADMIN) {
    return ROUTES.admin.dashboard;
  }

  if (orgSlug) {
    return ROUTES.app.root;
  }

  return ROUTES.onboarding.createOrganization;
}

export function getDefaultRedirectForAuth(
  isAuthenticated: boolean,
  role?: UserRole | null,
  orgSlug?: string | null,
): string {
  if (!isAuthenticated) {
    return ROUTES.auth.login;
  }

  return getPostLoginRedirect(role ?? UserRole.USER, orgSlug);
}

export function matchOrgSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/app\/([^/]+)/);
  return match?.[1] ?? null;
}

export function buildOrgScopedPath(orgSlug: string, subPath: string): string {
  const normalized = subPath.startsWith('/') ? subPath.slice(1) : subPath;
  return `/app/${orgSlug}/${normalized}`;
}

export function sanitizeRedirectPath(path: string | null | undefined, fallback: string): string {
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return fallback;
  }

  return path;
}
