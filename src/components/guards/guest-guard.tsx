'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LoadingScreen } from '@/components/global/loading-screen';
import { useSession } from '@/features/auth/hooks/use-session';
import { getPostLoginRedirect } from '@/utils/route';

interface GuestGuardProps {
  children: ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const { isAuthenticated, isSessionLoading, user, currentOrganization } = useSession();

  useEffect(() => {
    if (isSessionLoading || !isAuthenticated || !user) return;

    router.replace(getPostLoginRedirect(user.role, currentOrganization?.slug));
  }, [isAuthenticated, isSessionLoading, user, currentOrganization?.slug, router]);

  if (isSessionLoading) {
    return <LoadingScreen label={t('loading')} />;
  }

  if (isAuthenticated) {
    return <LoadingScreen label={t('loading')} />;
  }

  return children;
}
