'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { billingApi } from '@/features/billing/api/billing.api';
import { queryKeys } from '@/config/query-keys';
import { ROUTES } from '@/config/routes';
import { useOrganizationStore } from '@/store/organization.store';
import type { BillingCycle } from '@/types/billing.types';
import { getErrorMessage } from '@/utils/error';
import { toastError, toastSuccess } from '@/components/global/toast-helpers';

export function useBillingPlans() {
  return useQuery({
    queryKey: queryKeys.billing.plans,
    queryFn: () => billingApi.listPlans(),
  });
}

export function useSubscribePlan() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization);

  return useMutation({
    mutationFn: ({ planId, billingCycle }: { planId: string; billingCycle: BillingCycle }) =>
      billingApi.subscribe({ planId, billingCycle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription });
      toastSuccess('تم الاشتراك في الخطة بنجاح');
      if (currentOrganization?.slug) {
        router.push(ROUTES.app.dashboard(currentOrganization.slug));
      }
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}
