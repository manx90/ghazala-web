'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toastSuccess, toastApiError } from '@/components/global/toast-helpers';
import { queryKeys } from '@/config/query-keys';
import { templatesApi } from '@/features/templates/api/templates.api';
import type {
  CreateTemplatePayload,
  SyncTemplatesParams,
  UpdateTemplatePayload,
} from '@/types/template.types';

export function useTemplatesList() {
  return useQuery({
    queryKey: queryKeys.templates.list,
    queryFn: () => templatesApi.list(),
  });
}

export function useTemplate(templateId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.templates.detail(templateId),
    queryFn: () => templatesApi.getById(templateId),
    enabled: enabled && !!templateId,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTemplatePayload) => templatesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess('تم إنشاء القالب بنجاح');
    },
    onError: toastApiError,
  });
}

export function useUpdateTemplate(templateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTemplatePayload) => templatesApi.update(templateId, payload),
    onSuccess: (template) => {
      queryClient.setQueryData(queryKeys.templates.detail(templateId), template);
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess('تم تحديث القالب بنجاح');
    },
    onError: toastApiError,
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) => templatesApi.delete(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess('تم حذف القالب بنجاح');
    },
    onError: toastApiError,
  });
}

export function useSyncTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params?: SyncTemplatesParams) => templatesApi.sync(params),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess(`تمت المزامنة: ${result.synced} قالب`);
    },
    onError: toastApiError,
  });
}

export function useArchiveTemplate(templateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => templatesApi.archive(templateId),
    onSuccess: (template) => {
      queryClient.setQueryData(queryKeys.templates.detail(templateId), template);
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess('تم أرشفة القالب بنجاح');
    },
    onError: toastApiError,
  });
}

export function useResubmitTemplate(templateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => templatesApi.resubmit(templateId),
    onSuccess: (template) => {
      queryClient.setQueryData(queryKeys.templates.detail(templateId), template);
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess('تم إعادة إرسال القالب للمراجعة');
    },
    onError: toastApiError,
  });
}
