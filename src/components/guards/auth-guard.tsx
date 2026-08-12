'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/config/routes';
import { LoadingScreen } from '@/components/global/loading-screen';
import { useSession } from '@/features/auth/hooks/use-session';
import { sanitizeRedirectPath } from '@/utils/route';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = ROUTES.auth.login }: AuthGuardProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const { isAuthenticated, isSessionLoading } = useSession();

  useEffect(() => {
    if (!isSessionLoading && !isAuthenticated) {
      const returnUrl = sanitizeRedirectPath(window.location.pathname + window.location.search, redirectTo);
      router.replace(`${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [isAuthenticated, isSessionLoading, redirectTo, router]);

  if (isSessionLoading) {
    return <LoadingScreen label={t('loading')} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
