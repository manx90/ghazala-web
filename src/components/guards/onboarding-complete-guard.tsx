'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useEffect, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { LoadingScreen } from '@/components/global/loading-screen';
import { useOnboardingStatus } from '@/features/onboarding/hooks/use-onboarding-status';
import { useSession } from '@/features/auth/hooks/use-session';
import { isOnboardingComplete, resolveOnboardingPath } from '@/utils/onboarding';
import { matchOrgSlugFromPath } from '@/utils/route';
import { organizationStorage } from '@/utils/storage';

interface OnboardingCompleteGuardProps {
  children: ReactNode;
}

export function OnboardingCompleteGuard({ children }: OnboardingCompleteGuardProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const { isSessionLoading, currentOrganization } = useSession();
  const orgSlug =
    currentOrganization?.slug ?? matchOrgSlugFromPath(pathname) ?? organizationStorage.getSlug();

  const { data: state, isLoading, isFetching } = useOnboardingStatus(
    !isSessionLoading && Boolean(orgSlug),
  );

  const isResolving = isSessionLoading || isLoading || isFetching;

  useEffect(() => {
    if (isResolving || !state) return;

    if (!isOnboardingComplete(state)) {
      router.replace(resolveOnboardingPath(state));
    }
  }, [isResolving, state, router]);

  if (isResolving) {
    return <LoadingScreen label={t('loading')} />;
  }

  if (state && !isOnboardingComplete(state)) {
    return null;
  }

  return children;
}
