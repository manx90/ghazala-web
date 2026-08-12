'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useToastI18n } from '@/hooks/use-toast-i18n';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { adminApi } from '@/features/admin/api/admin.api';
import type {
  AdminOrganizationListParams,
  BulkAdminOrganizationPayload,
  UpdateAdminOrganizationPayload,
} from '@/types/admin.types';
import { OrganizationStatus } from '@/types/organization.types';

export function useAdminOrganizations(params?: AdminOrganizationListParams) {
  return useQuery({
    queryKey: queryKeys.admin.organizations.list(params as Record<string, unknown> | undefined),
    queryFn: () => adminApi.listOrganizations(params),
    ...queryConfig.admin,
  });
}

export function useAdminOrganization(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.organizations.detail(id),
    queryFn: () => adminApi.getOrganization(id),
    enabled: enabled && !!id,
    ...queryConfig.admin,
  });
}

export function useAdminOrganizationUsage(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.organizations.usage(id),
    queryFn: () => adminApi.getOrganizationUsage(id),
    enabled: enabled && !!id,
    ...queryConfig.admin,
  });
}

export function useAdminOrganizationSubscription(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.organizations.subscription(id),
    queryFn: () => adminApi.getOrganizationSubscription(id),
    enabled: enabled && !!id,
    ...queryConfig.admin,
  });
}

export function useAdminOrganizationMembers(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.organizations.members(id),
    queryFn: () => adminApi.getOrganizationMembers(id),
    enabled: enabled && !!id,
    ...queryConfig.admin,
  });
}

export function useAdminOrganizationPhoneNumbers(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.organizations.phoneNumbers(id),
    queryFn: () => adminApi.getOrganizationPhoneNumbers(id),
    enabled: enabled && !!id,
    ...queryConfig.admin,
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminOrganizationPayload }) =>
      adminApi.updateOrganization(id, payload),
    onSuccess: (org) => {
      queryClient.setQueryData(queryKeys.admin.organizations.detail(org.id), org);
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.organizations.all });
      toastSuccess(t('organizationUpdated'));
    },
    onError: toastApiError,
  });
}

export function useBulkOrganizations() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (payload: BulkAdminOrganizationPayload) => adminApi.bulkOrganizations(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.organizations.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      toastSuccess(t('bulkSuccess'));
    },
    onError: toastApiError,
  });
}

export function useActivateOrganization() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (id: string) => adminApi.activateOrganization(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.admin.organizations.detail(id) });
      queryClient.setQueryData(queryKeys.admin.organizations.detail(id), (old) =>
        old ? { ...old, status: OrganizationStatus.ACTIVE } : old,
      );
    },
    onSuccess: (org) => {
      queryClient.setQueryData(queryKeys.admin.organizations.detail(org.id), org);
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.organizations.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      toastSuccess(t('organizationActivated'));
    },
    onError: (error, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.organizations.detail(id) });
      toastApiError(error);
    },
  });
}

export function useSuspendOrganization() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (id: string) => adminApi.suspendOrganization(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.admin.organizations.detail(id) });
      queryClient.setQueryData(queryKeys.admin.organizations.detail(id), (old) =>
        old ? { ...old, status: OrganizationStatus.SUSPENDED } : old,
      );
    },
    onSuccess: (org) => {
      queryClient.setQueryData(queryKeys.admin.organizations.detail(org.id), org);
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.organizations.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      toastSuccess(t('organizationSuspended'));
    },
    onError: (error, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.organizations.detail(id) });
      toastApiError(error);
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('admin.toast');

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteOrganization(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.organizations.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      toastSuccess(t('organizationDeleted'));
    },
    onError: toastApiError,
  });
}
