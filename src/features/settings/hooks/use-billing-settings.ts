'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toastApiError, toastSuccess } from '@/components/global/toast-helpers';
import { queryKeys } from '@/config/query-keys';
import { billingApi } from '@/features/billing/api/billing.api';
import { redirectToCheckoutOrComplete } from '@/features/billing/utils/checkout';
import type { ChangePlanPayload, SubscribePayload } from '@/types/billing.types';

export function useBillingPlans() {
  return useQuery({
    queryKey: queryKeys.billing.plans,
    queryFn: () => billingApi.listPlans(),
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: queryKeys.billing.subscription,
    queryFn: () => billingApi.getSubscription(),
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: queryKeys.billing.invoices,
    queryFn: () => billingApi.listInvoices(),
  });
}

export function useUsage(enabled = true) {
  return useQuery({
    queryKey: queryKeys.billing.usage,
    queryFn: () => billingApi.getUsage(),
    enabled,
  });
}

export function useSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubscribePayload) => billingApi.subscribe(payload),
    onSuccess: (session) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription });
      redirectToCheckoutOrComplete(session, () => {
        toastSuccess('تم الاشتراك بنجاح');
      });
    },
    onError: toastApiError,
  });
}

export function useChangePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangePlanPayload) => billingApi.changePlan(payload),
    onSuccess: (session) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription });
      redirectToCheckoutOrComplete(session, () => {
        toastSuccess('تم تغيير الخطة');
      });
    },
    onError: toastApiError,
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => billingApi.cancelSubscription(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription });
      toastSuccess('تم إلغاء الاشتراك');
    },
    onError: toastApiError,
  });
}
