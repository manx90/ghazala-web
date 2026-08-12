'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/config/routes';
import { LoadingScreen } from '@/components/global/loading-screen';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { useSession } from '@/features/auth/hooks/use-session';
import type { Permission } from '@/utils/permission';

interface PermissionGuardProps {
  children: ReactNode;
  permission: Permission;
  fallbackPath?: string;
}

export function PermissionGuard({
  children,
  permission,
  fallbackPath = ROUTES.errors.forbidden,
}: PermissionGuardProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const { isSessionLoading } = useSession();
  const { can } = usePermissions();

  const isAllowed = can(permission);

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
