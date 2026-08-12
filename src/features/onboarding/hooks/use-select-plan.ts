'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { billingApi } from '@/features/billing/api/billing.api';
import { redirectToCheckoutOrComplete } from '@/features/billing/utils/checkout';
import { invalidateOnboardingState } from '@/features/onboarding/utils/invalidate-onboarding';
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
  const t = useTranslations('onboarding.selectPlan');
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization);

  return useMutation({
    mutationFn: ({ planId, billingCycle }: { planId: string; billingCycle: BillingCycle }) =>
      billingApi.subscribe({ planId, billingCycle }),
    onSuccess: async (session) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription }),
        invalidateOnboardingState(queryClient),
      ]);

      redirectToCheckoutOrComplete(session, () => {
        toastSuccess(t('success'));
        if (currentOrganization?.slug) {
          router.push(ROUTES.app.dashboard(currentOrganization.slug));
        }
      });
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}
