'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingScreen } from '@/components/global/loading-screen';
import { ROUTES } from '@/config/routes';
import { fetchOnboardingState } from '@/features/onboarding/services/onboarding.service';
import { useSession } from '@/features/auth/hooks/use-session';
import { UserRole } from '@/types/auth.types';
import { resolveOnboardingPath } from '@/utils/onboarding';
import { organizationStorage } from '@/utils/storage';

export default function AppResolverPage() {
  const router = useRouter();
  const { isSessionLoading, user, currentOrganization } = useSession();

  useEffect(() => {
    if (isSessionLoading) return;

    if (!user) {
      router.replace(ROUTES.auth.login);
      return;
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      router.replace(ROUTES.admin.dashboard);
      return;
    }

    const orgSlug = currentOrganization?.slug ?? organizationStorage.getSlug();

    void fetchOnboardingState(orgSlug).then((state) => {
      router.replace(resolveOnboardingPath(state));
    });
  }, [isSessionLoading, user, currentOrganization?.slug, router]);

  return <LoadingScreen label="جاري التوجيه..." />;
}
