'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/navigation';
import { queryKeys } from '@/config/query';
import { ROUTES } from '@/config/routes';
import { organizationApi } from '@/features/auth/api/organization.api';
import { useOrganizationStore } from '@/store/organization.store';
import type { Organization } from '@/types/organization.types';

export function useOrganizations() {
  const setOrganizations = useOrganizationStore((state) => state.setOrganizations);
  const organizations = useOrganizationStore((state) => state.organizations);
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization);

  const query = useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: async () => {
      const response = await organizationApi.list();
      setOrganizations(response.items);
      return response;
    },
  });

  return {
    organizations: query.data?.items ?? organizations,
    currentOrganization,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useSwitchOrganization() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setCurrentOrganization = useOrganizationStore((state) => state.setCurrentOrganization);

  return useMutation({
    mutationFn: async (organization: Organization) => {
      organizationApi.selectOrganization(organization);
      setCurrentOrganization(organization);
      return organization;
    },
    onSuccess: (organization) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.current });
      router.push(ROUTES.app.dashboard(organization.slug));
    },
  });
}
