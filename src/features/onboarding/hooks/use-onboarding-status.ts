'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/query-keys';
import { fetchOnboardingState } from '@/features/onboarding/services/onboarding.service';
import { organizationStorage } from '@/utils/storage';
import { useOrganizationStore } from '@/store/organization.store';

export function useOnboardingStatus(enabled = true) {
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization);
  const orgSlug = currentOrganization?.slug ?? organizationStorage.getSlug();

  return useQuery({
    queryKey: queryKeys.onboarding.state(orgSlug),
    queryFn: () => fetchOnboardingState(orgSlug),
    enabled,
    staleTime: 30_000,
  });
}
