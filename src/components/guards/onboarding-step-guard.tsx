'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { LoadingScreen } from '@/components/global/loading-screen';
import { useOnboardingStatus } from '@/features/onboarding/hooks/use-onboarding-status';
import { useSession } from '@/features/auth/hooks/use-session';
import { resolveOnboardingPath } from '@/utils/onboarding';

interface OnboardingStepGuardProps {
  children: ReactNode;
}

export function OnboardingStepGuard({ children }: OnboardingStepGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSessionLoading } = useSession();
  const { data: state, isLoading, isFetching } = useOnboardingStatus(!isSessionLoading);

  const isResolving = isSessionLoading || isLoading || isFetching;

  useEffect(() => {
    if (isResolving || !state) return;

    const target = resolveOnboardingPath(state);
    if (pathname !== target) {
      router.replace(target);
    }
  }, [isResolving, state, pathname, router]);

  if (isResolving) {
    return <LoadingScreen label="جاري تحميل خطوات التسجيل..." />;
  }

  if (state && pathname !== resolveOnboardingPath(state)) {
    return null;
  }

  return children;
}
