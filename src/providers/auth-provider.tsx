'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@/config/routes';
import { useSessionRecovery } from '@/features/auth/hooks/use-session';
import { LoadingScreen } from '@/components/global/loading-screen';
import type { ApiError } from '@/types/api.types';
import { UserRole } from '@/types/auth.types';
import { useAuthStore } from '@/store/auth.store';
import { getPostLoginRedirect, isAdminRoute, isGuestRoute, isProtectedRoute } from '@/utils/route';
import { useOrganizationStore } from '@/store/organization.store';
import { clearAuthSession } from '@/services/api/client';
import { UNAUTHORIZED_EVENT } from '@/utils/events';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { isHydrated, isSessionLoading } = useSessionRecovery();
  const user = useAuthStore((state) => state.user);
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization);

  const shouldBlockRender =
    isProtectedRoute(pathname) || isAdminRoute(pathname) || pathname.startsWith('/onboarding');

  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const detail = (event as CustomEvent<ApiError>).detail;
      if (detail?.isUnauthorized) {
        clearAuthSession();
        useAuthStore.getState().clearAuth();
        useOrganizationStore.getState().clearOrganization();
        queryClient.clear();
        router.replace(ROUTES.auth.login);
      }
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [router, queryClient]);

  useEffect(() => {
    if (!isHydrated || isSessionLoading || !user) return;

    if (user.role === UserRole.SUPER_ADMIN && pathname.startsWith('/app')) {
      router.replace(ROUTES.admin.dashboard);
    }

    if (user.role === UserRole.USER && isAdminRoute(pathname)) {
      router.replace(ROUTES.errors.forbidden);
    }

    if (isGuestRoute(pathname) && user) {
      router.replace(getPostLoginRedirect(user.role, currentOrganization?.slug));
    }
  }, [isHydrated, isSessionLoading, user, pathname, router, currentOrganization?.slug]);

  if (!isHydrated) {
    return shouldBlockRender ? <LoadingScreen label="جاري التحميل..." /> : null;
  }

  if (isSessionLoading && shouldBlockRender) {
    return <LoadingScreen label="جاري تحميل الجلسة..." />;
  }

  return children;
}
