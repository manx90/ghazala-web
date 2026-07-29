'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toastSuccess, toastApiError } from '@/components/global/toast-helpers';
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

  return useMutation({
    mutationFn: (payload: CreatePlanPayload) => adminPlansApi.createPlan(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.plans.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing.plans });
      toastSuccess('تم إنشاء الخطة بنجاح');
    },
    onError: toastApiError,
  });
}

export function useUpdatePlan(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePlanPayload) => adminPlansApi.updatePlan(planId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.plans.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing.plans });
      toastSuccess('تم تحديث الخطة بنجاح');
    },
    onError: toastApiError,
  });
}

export function useDisablePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => adminPlansApi.disablePlan(planId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.plans.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.billing.plans });
      toastSuccess('تم تعطيل الخطة بنجاح');
    },
    onError: toastApiError,
  });
}
