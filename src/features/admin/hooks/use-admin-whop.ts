'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toastSuccess, toastApiError } from '@/components/global/toast-helpers';
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
  return useMutation({
    mutationFn: (planId: string) => adminWhopApi.syncPlan(planId),
    onSuccess: () => {
      invalidateWhop(queryClient);
      toastSuccess('تمت مزامنة الخطة مع Whop');
    },
    onError: toastApiError,
  });
}

export function useSyncAllWhopPlans() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminWhopApi.syncAllPlans(),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(`تمت مزامنة ${data.synced} خطة${data.failed ? ` — فشل ${data.failed}` : ''}`);
    },
    onError: toastApiError,
  });
}

export function useApplyWhopPlanSuggestion() {
  const queryClient = useQueryClient();
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
      toastSuccess('تم ربط الخطة بنجاح');
    },
    onError: toastApiError,
  });
}

export function useUpdateWhopPlanMapping(planId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePlanPayload) => adminPlansApi.updatePlan(planId, payload),
    onSuccess: () => {
      invalidateWhop(queryClient);
      toastSuccess('تم تحديث الربط');
    },
    onError: toastApiError,
  });
}

export function useRefundWhopPayment() {
  const queryClient = useQueryClient();
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
  return useMutation({
    mutationFn: ({ whopPlanId, metadata }: { whopPlanId: string; metadata?: Record<string, unknown> }) =>
      adminWhopApi.createCheckout(whopPlanId, metadata),
    onSuccess: (data) => {
      if (data.purchaseUrl) {
        window.open(data.purchaseUrl, '_blank', 'noopener,noreferrer');
      }
      toastSuccess('تم إنشاء رابط الدفع');
    },
    onError: toastApiError,
  });
}

export function useCancelWhopMembership() {
  const queryClient = useQueryClient();
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
  return useMutation({
    mutationFn: (payload: CreateAdminWhopPromoCodePayload) => adminWhopApi.createPromoCode(payload),
    onSuccess: () => {
      invalidateWhop(queryClient);
      toastSuccess('تم إنشاء كود الخصم');
    },
    onError: toastApiError,
  });
}

export function useDeleteWhopPromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (promoId: string) => adminWhopApi.deletePromoCode(promoId),
    onSuccess: () => {
      invalidateWhop(queryClient);
      toastSuccess('تم أرشفة كود الخصم');
    },
    onError: toastApiError,
  });
}

export function useRegisterWhopWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminWhopApi.registerWebhook(),
    onSuccess: (data) => {
      invalidateWhop(queryClient);
      toastSuccess(data.message);
    },
    onError: toastApiError,
  });
}
