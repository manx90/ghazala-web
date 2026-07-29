'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toastSuccess, toastApiError } from '@/components/global/toast-helpers';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { adminApi } from '@/features/admin/api/admin.api';
import type { AdminPaginationParams } from '@/types/admin.types';
import { OrganizationStatus } from '@/types/organization.types';

export function useAdminOrganizations(params?: AdminPaginationParams) {
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

export function useActivateOrganization() {
  const queryClient = useQueryClient();

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
      toastSuccess('تم تفعيل المنظمة بنجاح');
    },
    onError: (error, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.organizations.detail(id) });
      toastApiError(error);
    },
  });
}

export function useSuspendOrganization() {
  const queryClient = useQueryClient();

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
      toastSuccess('تم تعليق المنظمة بنجاح');
    },
    onError: (error, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.organizations.detail(id) });
      toastApiError(error);
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteOrganization(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.organizations.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      toastSuccess('تم حذف المنظمة بنجاح');
    },
    onError: toastApiError,
  });
}
