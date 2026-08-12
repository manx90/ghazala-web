'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/config/routes';
import { LoadingScreen } from '@/components/global/loading-screen';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { useSession } from '@/features/auth/hooks/use-session';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: ('SUPER_ADMIN' | 'USER')[];
  requireSuperAdmin?: boolean;
  fallbackPath?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  requireSuperAdmin = false,
  fallbackPath = ROUTES.errors.forbidden,
}: RoleGuardProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const { isSessionLoading } = useSession();
  const { platformRole, isSuperAdmin } = usePermissions();

  const isAllowed = (() => {
    if (requireSuperAdmin) return isSuperAdmin;
    if (!allowedRoles?.length) return true;
    if (!platformRole) return false;
    return allowedRoles.includes(platformRole);
  })();

  useEffect(() => {
    if (!isSessionLoading && !isAllowed) {
      router.replace(fallbackPath);
    }
  }, [isAllowed, isSessionLoading, fallbackPath, router]);

  if (isSessionLoading) {
    return <LoadingScreen label={t('loading')} />;
  }

  if (!isAllowed) {
    return null;
  }

  return children;
}
