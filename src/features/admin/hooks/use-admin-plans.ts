'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useToastI18n } from '@/hooks/use-toast-i18n';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { adminPlansApi } from '@/features/admin/api/plans.api';
import type { CreatePlanPayload, UpdatePlanPayload } from '@/types/admin.types';

export function useAdminPlans() {
  return useQuery({
    queryKey: queryKeys.admin.plans.list,
    queryFn: () => adminPlansApi.listPlans(),
    ...queryConfig.admin,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (payload: CreatePlanPayload) => adminPlansApi.createPlan(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.plans.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing.plans });
      toastSuccess(t('planCreated'));
    },
    onError: toastApiError,
  });
}

export function useUpdatePlan(planId: string) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (payload: UpdatePlanPayload) => adminPlansApi.updatePlan(planId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.plans.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing.plans });
      toastSuccess(t('planUpdated'));
    },
    onError: toastApiError,
  });
}

export function useDisablePlan() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (planId: string) => adminPlansApi.disablePlan(planId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.plans.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing.plans });
      toastSuccess(t('planDisabled'));
    },
    onError: toastApiError,
  });
}
