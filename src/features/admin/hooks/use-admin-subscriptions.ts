'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useToastI18n } from '@/hooks/use-toast-i18n';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { adminSubscriptionsApi } from '@/features/admin/api/subscriptions.api';
import type { AdminSubscriptionListParams, ExtendSubscriptionPayload } from '@/types/admin.types';

export function useAdminSubscriptionStats() {
  return useQuery({
    queryKey: queryKeys.admin.subscriptions.stats,
    queryFn: () => adminSubscriptionsApi.getStats(),
    ...queryConfig.admin,
  });
}

export function useAdminSubscriptions(params?: AdminSubscriptionListParams) {
  return useQuery({
    queryKey: queryKeys.admin.subscriptions.list(params as Record<string, unknown> | undefined),
    queryFn: () => adminSubscriptionsApi.list(params),
    ...queryConfig.admin,
  });
}

export function useAdminSubscriptionDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.subscriptions.detail(id),
    queryFn: () => adminSubscriptionsApi.getById(id),
    enabled: enabled && !!id,
    ...queryConfig.admin,
  });
}

export function useActivateAdminSubscription() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (id: string) => adminSubscriptionsApi.activate(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.subscriptions.all });
      toastSuccess(t('subscriptionActivated'));
    },
    onError: toastApiError,
  });
}

export function useExtendAdminSubscription() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ExtendSubscriptionPayload }) =>
      adminSubscriptionsApi.extend(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.subscriptions.all });
      toastSuccess(t('subscriptionExtended'));
    },
    onError: toastApiError,
  });
}
