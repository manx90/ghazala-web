'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useToastI18n } from '@/hooks/use-toast-i18n';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { adminApi } from '@/features/admin/api/admin.api';
import { UserStatus } from '@/types/auth.types';
import type { AdminUserListParams } from '@/types/admin.types';

export function useAdminUsers(params?: AdminUserListParams) {
  return useQuery({
    queryKey: queryKeys.admin.users.list(params as Record<string, unknown> | undefined),
    queryFn: () => adminApi.listUsers(params),
    ...queryConfig.admin,
  });
}

export function useAdminUser(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.users.detail(id),
    queryFn: () => adminApi.getUser(id),
    enabled: enabled && !!id,
    ...queryConfig.admin,
  });
}

export function useEnableUser() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (id: string) => adminApi.enableUser(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.admin.users.detail(id) });
      queryClient.setQueryData(queryKeys.admin.users.detail(id), (old) =>
        old ? { ...old, status: UserStatus.ACTIVE } : old,
      );
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.admin.users.detail(user.id), user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      toastSuccess(t('userEnabled'));
    },
    onError: (error, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.detail(id) });
      toastApiError(error);
    },
  });
}

export function useDisableUser() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (id: string) => adminApi.disableUser(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.admin.users.detail(id) });
      queryClient.setQueryData(queryKeys.admin.users.detail(id), (old) =>
        old ? { ...old, status: UserStatus.DISABLED } : old,
      );
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.admin.users.detail(user.id), user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      toastSuccess(t('userDisabled'));
    },
    onError: (error, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.detail(id) });
      toastApiError(error);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      toastSuccess(t('userDeleted'));
    },
    onError: toastApiError,
  });
}

export function useAdminUserOrganizations(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.users.organizations(id),
    queryFn: () => adminApi.getUserOrganizations(id),
    enabled: enabled && !!id,
    ...queryConfig.admin,
  });
}

export function useSendUserVerification() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (id: string) => adminApi.sendUserVerification(id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all });
      toastSuccess(t('verificationSent'));
    },
    onError: toastApiError,
  });
}
