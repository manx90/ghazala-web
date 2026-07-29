'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { ROUTES } from '@/config/routes';
import { LoadingScreen } from '@/components/global/loading-screen';
import { useSession } from '@/features/auth/hooks/use-session';
import { useOrganizationStore } from '@/store/organization.store';
import { matchOrgSlugFromPath } from '@/utils/route';

interface OrganizationGuardProps {
  children: ReactNode;
  orgSlug?: string;
  fallbackPath?: string;
}

export function OrganizationGuard({
  children,
  orgSlug,
  fallbackPath = ROUTES.onboarding.createOrganization,
}: OrganizationGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSessionLoading } = useSession();
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization);

  const resolvedSlug = orgSlug ?? matchOrgSlugFromPath(pathname);
  const hasOrganization = Boolean(currentOrganization);
  const slugMatches = !resolvedSlug || currentOrganization?.slug === resolvedSlug;

  useEffect(() => {
    if (isSessionLoading) return;

    if (!hasOrganization) {
      router.replace(fallbackPath);
      return;
    }

    if (!slugMatches && currentOrganization) {
      router.replace(ROUTES.app.dashboard(currentOrganization.slug));
    }
  }, [hasOrganization, slugMatches, isSessionLoading, fallbackPath, router, currentOrganization]);

  if (isSessionLoading) {
    return <LoadingScreen label="جاري تحميل المنظمة..." />;
  }

  if (!hasOrganization || !slugMatches) {
    return null;
  }

  return children;
}
