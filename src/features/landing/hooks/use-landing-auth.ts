'use client';

import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types/auth.types';

export function useLandingAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSessionLoading = useAuthStore((state) => state.isSessionLoading);
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  return {
    user,
    isAuthenticated: isAuthenticated && Boolean(user),
    isSessionLoading,
    isSuperAdmin,
    workspaceHref: ROUTES.app.root,
    adminHref: ROUTES.admin.dashboard,
    registerHref: ROUTES.auth.register,
    loginHref: ROUTES.auth.login,
  };
}
