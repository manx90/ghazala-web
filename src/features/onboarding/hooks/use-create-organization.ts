'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { organizationApi } from '@/features/auth/api/organization.api';
import { queryKeys } from '@/config/query';
import { ROUTES } from '@/config/routes';
import { useOrganizationStore } from '@/store/organization.store';
import { getErrorMessage } from '@/utils/error';
import { toastError, toastSuccess } from '@/components/global/toast-helpers';
import type { CreateOrganizationFormValues } from '@/features/onboarding/schemas/onboarding.schemas';

export function useCreateOrganization() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setCurrentOrganization = useOrganizationStore((state) => state.setCurrentOrganization);
  const setOrganizations = useOrganizationStore((state) => state.setOrganizations);

  return useMutation({
    mutationFn: (values: CreateOrganizationFormValues) =>
      organizationApi.create({
        name: values.name,
        slug: values.slug,
        timezone: values.timezone,
        country: values.country,
      } as Parameters<typeof organizationApi.create>[0] & { slug: string }),
    onSuccess: (organization) => {
      organizationApi.selectOrganization(organization);
      setCurrentOrganization(organization);
      setOrganizations([organization]);
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
      toastSuccess('تم إنشاء المنظمة بنجاح');
      router.push(ROUTES.onboarding.connectWhatsapp);
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}
