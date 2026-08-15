'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useEffect, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { LoadingScreen } from '@/components/global/loading-screen';
import { useOnboardingStatus } from '@/features/onboarding/hooks/use-onboarding-status';
import { useSession } from '@/features/auth/hooks/use-session';
import { resolveOnboardingPath, isOptionalWhatsappOnboardingPath } from '@/utils/onboarding';

interface OnboardingStepGuardProps {
  children: ReactNode;
}

export function OnboardingStepGuard({ children }: OnboardingStepGuardProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const { isSessionLoading } = useSession();
  const { data: state, isLoading, isFetching } = useOnboardingStatus(!isSessionLoading);

  const isResolving = isSessionLoading || isLoading || isFetching;

  useEffect(() => {
    if (isResolving || !state) return;

    const target = resolveOnboardingPath(state);
    const canStayOnWhatsappStep = isOptionalWhatsappOnboardingPath(pathname, state);

    if (pathname !== target && !canStayOnWhatsappStep) {
      router.replace(target);
    }
  }, [isResolving, state, pathname, router]);

  if (isResolving) {
    return <LoadingScreen label={t('loading')} />;
  }

  if (state && pathname !== resolveOnboardingPath(state) && !isOptionalWhatsappOnboardingPath(pathname, state)) {
    return null;
  }

  return children;
}
