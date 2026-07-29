'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@/config/routes';
import { queryKeys } from '@/config/query';
import { authApi } from '@/features/auth/api/auth.api';
import { organizationApi } from '@/features/auth/api/organization.api';
import { useCurrentUser } from '@/features/auth/hooks/use-auth';
import { syncAuthCookies, clearAuthSession } from '@/services/api/client';
import { useAuthStore } from '@/store/auth.store';
import { useOrganizationStore } from '@/store/organization.store';
import { tokenStorage, organizationStorage } from '@/utils/storage';
import { ApiError } from '@/types/api.types';
import { UserRole } from '@/types/auth.types';
import { getPostLoginRedirect } from '@/utils/route';

interface UseSessionRecoveryOptions {
  redirectOnUnauthorized?: boolean;
}

export function useSessionRecovery(options: UseSessionRecoveryOptions = {}) {
  const { redirectOnUnauthorized = false } = options;
  const router = useRouter();
  const queryClient = useQueryClient();

  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSessionLoading = useAuthStore((state) => state.isSessionLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setSessionLoading = useAuthStore((state) => state.setSessionLoading);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const setOrganizations = useOrganizationStore((state) => state.setOrganizations);
  const setCurrentOrganization = useOrganizationStore((state) => state.setCurrentOrganization);
  const setOrgLoading = useOrganizationStore((state) => state.setLoading);

  const hasStoredToken = Boolean(tokenStorage.getAccessToken());

  const recoverSession = useCallback(async () => {
    if (!hasStoredToken) {
      clearAuth();
      setSessionLoading(false);
      return;
    }

    setSessionLoading(true);
    syncAuthCookies();

    try {
      const user = await authApi.me();
      setUser(user);

      if (user.role === UserRole.USER) {
        setOrgLoading(true);
        const orgList = await organizationApi.list();
        setOrganizations(orgList.items);

        const storedOrgId = organizationStorage.getId();
        const matchedOrg =
          orgList.items.find((org) => org.id === storedOrgId) ?? orgList.items[0] ?? null;

        if (matchedOrg) {
          organizationApi.selectOrganization(matchedOrg);
          setCurrentOrganization(matchedOrg);
        }
      }

      queryClient.setQueryData(queryKeys.auth.me, user);
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;

      if (apiError?.isUnauthorized) {
        clearAuthSession();
        clearAuth();
        useOrganizationStore.getState().clearOrganization();

        if (redirectOnUnauthorized) {
          router.replace(ROUTES.auth.login);
        }
      }
    } finally {
      setOrgLoading(false);
      setSessionLoading(false);
    }
  }, [
    clearAuth,
    hasStoredToken,
    queryClient,
    redirectOnUnauthorized,
    router,
    setCurrentOrganization,
    setOrgLoading,
    setOrganizations,
    setSessionLoading,
    setUser,
  ]);

  useEffect(() => {
    if (!isHydrated) return;
    void recoverSession();
  }, [isHydrated, recoverSession]);

  return {
    isHydrated,
    isAuthenticated,
    isSessionLoading,
    recoverSession,
  };
}

export function useSession() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSessionLoading = useAuthStore((state) => state.isSessionLoading);
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization);

  const { isLoading: isUserLoading, isFetching, refetch } = useCurrentUser(isAuthenticated);

  const redirectAfterLogin = useCallback(() => {
    if (!user) return ROUTES.auth.login;
    return getPostLoginRedirect(user.role, currentOrganization?.slug ?? organizationStorage.getSlug());
  }, [user, currentOrganization?.slug]);

  return {
    user,
    isAuthenticated,
    isSessionLoading: isSessionLoading || isUserLoading,
    isRefreshing: isFetching,
    currentOrganization,
    redirectAfterLogin,
    refetchUser: refetch,
  };
}
