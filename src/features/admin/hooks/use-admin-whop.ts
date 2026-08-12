'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useToastI18n } from '@/hooks/use-toast-i18n';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { adminPlansApi } from '@/features/admin/api/plans.api';
import { adminWhopApi } from '@/features/admin/api/whop.api';
import type { CreateAdminWhopPromoCodePayload, UpdatePlanPayload } from '@/types/admin.types';

export function useAdminWhopStatus() {
  return useQuery({
    queryKey: queryKeys.admin.whop.status,
    queryFn: () => adminWhopApi.getStatus(),
    ...queryConfig.admin,
  });
}

export function useAdminWhopPlans() {
  return useQuery({
    queryKey: queryKeys.admin.whop.plans,
    queryFn: () => adminWhopApi.getPlans(),
    ...queryConfig.admin,
  });
}

export function useAdminWhopPayments(limit = 20) {
  return useQuery({
    queryKey: queryKeys.admin.whop.payments(limit),
    queryFn: () => adminWhopApi.getPayments(limit),
    ...queryConfig.admin,
  });
}

export function useAdminWhopMemberships(limit = 20) {
  return useQuery({
    queryKey: queryKeys.admin.whop.memberships(limit),
    queryFn: () => adminWhopApi.getMemberships(limit),
    ...queryConfig.admin,
  });
}

export function useAdminWhopWebhookEvents(limit = 20) {
  return useQuery({
    queryKey: queryKeys.admin.whop.webhookEvents(limit),
    queryFn: () => adminWhopApi.getWebhookEvents(limit),
    ...queryConfig.admin,
  });
}

export function useAdminWhopPromoCodes(limit = 50) {
  return useQuery({
    queryKey: queryKeys.admin.whop.promoCodes.list(limit),
    queryFn: () => adminWhopApi.listPromoCodes(limit),
    ...queryConfig.admin,
  });
}

export function useAdminWhopWebhooks() {
  return useQuery({
    queryKey: queryKeys.admin.whop.webhooks.list,
    queryFn: () => adminWhopApi.listWebhooks(),
    ...queryConfig.admin,
  });
}

function invalidateWhop(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.admin.whop.all });
  void queryClient.invalidateQueries({ queryKey: queryKeys.admin.plans.all });
}

export function useSyncWhopPlan() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.whop.toast');

  return useMutation({
    mutationFn: (planId: string) => adminWhopApi.syncPlan(planId),
    onSuccess: () => {
      invalidateWhop(queryClient);
      toastSuccess(t('planSynced'));
    },
    onError: toastApiError,
  });
}

export function useSyncAllWhopPlans() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.whop.toast');

  return useMutation({
    mutationFn: () => adminWhopApi.syncAllPlans(),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(t('plansSynced', { synced: data.synced, failed: data.failed ? ` — ${data.failed}` : '' }));
    },
    onError: toastApiError,
  });
}

export function useApplyWhopPlanSuggestion() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.whop.toast');

  return useMutation({
    mutationFn: ({
      planId,
      whopPlanId,
      billingCycle,
      currentMonthly,
      currentYearly,
    }: {
      planId: string;
      whopPlanId: string;
      billingCycle: 'monthly' | 'yearly';
      currentMonthly: string | null;
      currentYearly: string | null;
    }) => {
      const payload: UpdatePlanPayload =
        billingCycle === 'monthly'
          ? { whopPlanIdMonthly: whopPlanId }
          : { whopPlanIdYearly: whopPlanId };

      if (billingCycle === 'monthly' && currentYearly) payload.whopPlanIdYearly = currentYearly;
      if (billingCycle === 'yearly' && currentMonthly) payload.whopPlanIdMonthly = currentMonthly;

      return adminPlansApi.updatePlan(planId, payload);
    },
    onSuccess: () => {
      invalidateWhop(queryClient);
      toastSuccess(t('planLinked'));
    },
    onError: toastApiError,
  });
}

export function useUpdateWhopPlanMapping(planId: string) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.whop.toast');

  return useMutation({
    mutationFn: (payload: UpdatePlanPayload) => adminPlansApi.updatePlan(planId, payload),
    onSuccess: () => {
      invalidateWhop(queryClient);
      toastSuccess(t('mappingUpdated'));
    },
    onError: toastApiError,
  });
}

export function useRefundWhopPayment() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();

  return useMutation({
    mutationFn: ({ paymentId, partialAmount }: { paymentId: string; partialAmount?: number | null }) =>
      adminWhopApi.refundPayment(paymentId, partialAmount),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(data.message);
    },
    onError: toastApiError,
  });
}

export function useRetryWhopPayment() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();

  return useMutation({
    mutationFn: (paymentId: string) => adminWhopApi.retryPayment(paymentId),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(data.message);
    },
    onError: toastApiError,
  });
}

export function useVoidWhopPayment() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();

  return useMutation({
    mutationFn: (paymentId: string) => adminWhopApi.voidPayment(paymentId),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(data.message);
    },
    onError: toastApiError,
  });
}

export function useCreateWhopCheckout() {
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.whop.toast');

  return useMutation({
    mutationFn: ({ whopPlanId, metadata }: { whopPlanId: string; metadata?: Record<string, unknown> }) =>
      adminWhopApi.createCheckout(whopPlanId, metadata),
    onSuccess: (data) => {
      if (data.purchaseUrl) {
        window.open(data.purchaseUrl, '_blank', 'noopener,noreferrer');
      }
      toastSuccess(t('checkoutCreated'));
    },
    onError: toastApiError,
  });
}

export function useCancelWhopMembership() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();

  return useMutation({
    mutationFn: ({
      membershipId,
      mode,
    }: {
      membershipId: string;
      mode?: 'at_period_end' | 'immediate';
    }) => adminWhopApi.cancelMembership(membershipId, mode),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(data.message);
    },
    onError: toastApiError,
  });
}

export function usePauseWhopMembership() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();

  return useMutation({
    mutationFn: (membershipId: string) => adminWhopApi.pauseMembership(membershipId),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(data.message);
    },
    onError: toastApiError,
  });
}

export function useResumeWhopMembership() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();

  return useMutation({
    mutationFn: (membershipId: string) => adminWhopApi.resumeMembership(membershipId),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(data.message);
    },
    onError: toastApiError,
  });
}

export function useUncancelWhopMembership() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();

  return useMutation({
    mutationFn: (membershipId: string) => adminWhopApi.uncancelMembership(membershipId),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(data.message);
    },
    onError: toastApiError,
  });
}

export function useAddWhopFreeDays() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();

  return useMutation({
    mutationFn: ({ membershipId, freeDays }: { membershipId: string; freeDays: number }) =>
      adminWhopApi.addFreeDays(membershipId, freeDays),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(data.message);
    },
    onError: toastApiError,
  });
}

export function useCreateWhopPromoCode() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.whop.toast');

  return useMutation({
    mutationFn: (payload: CreateAdminWhopPromoCodePayload) => adminWhopApi.createPromoCode(payload),
    onSuccess: () => {
      invalidateWhop(queryClient);
      toastSuccess(t('promoCreated'));
    },
    onError: toastApiError,
  });
}

export function useDeleteWhopPromoCode() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.whop.toast');

  return useMutation({
    mutationFn: (promoId: string) => adminWhopApi.deletePromoCode(promoId),
    onSuccess: () => {
      invalidateWhop(queryClient);
      toastSuccess(t('promoArchived'));
    },
    onError: toastApiError,
  });
}

export function useRegisterWhopWebhook() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();

  return useMutation({
    mutationFn: () => adminWhopApi.registerWebhook(),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(data.message);
    },
    onError: toastApiError,
  });
}
