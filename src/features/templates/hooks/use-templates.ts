'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toastSuccess, toastApiError } from '@/components/global/toast-helpers';
import { queryKeys } from '@/config/query-keys';
import { templatesApi } from '@/features/templates/api/templates.api';
import type {
  CreateFromLibraryPayload,
  CreateTemplatePayload,
  ListTemplateLibraryParams,
  ListTemplatesParams,
  SyncTemplatesParams,
  UpdateTemplatePayload,
} from '@/types/template.types';
import { TemplateStatus } from '@/types/template.types';

export function useTemplatesList(params?: ListTemplatesParams) {
  return useQuery({
    queryKey: queryKeys.templates.list(params as Record<string, unknown> | undefined),
    queryFn: () => templatesApi.list(params),
  });
}

export function useTemplateLanguages() {
  return useQuery({
    queryKey: queryKeys.templates.languages,
    queryFn: () => templatesApi.getLanguages(),
  });
}

export function useTemplateLibrary(params?: ListTemplateLibraryParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.templates.library(params as Record<string, unknown> | undefined),
    queryFn: () => templatesApi.listLibrary(params),
    enabled,
    staleTime: 60_000,
    placeholderData: (previous) => previous,
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
  const t = useTranslations('templates');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTemplatePayload) => templatesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess(t('toast.created'));
    },
    onError: toastApiError,
  });
}

export function useCreateFromLibrary() {
  const t = useTranslations('templates');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFromLibraryPayload) => templatesApi.createFromLibrary(payload),
    onSuccess: (template) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });

      if (template.status === TemplateStatus.APPROVED) {
        toastSuccess(t('toast.addedApproved'));
      } else if (template.status === TemplateStatus.PENDING) {
        toastSuccess(t('toast.addedPending'));
      } else {
        toastSuccess(t('toast.added'));
      }
    },
    onError: toastApiError,
  });
}

export function useUpdateTemplate(templateId: string) {
  const t = useTranslations('templates');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTemplatePayload) => templatesApi.update(templateId, payload),
    onSuccess: (template) => {
      queryClient.setQueryData(queryKeys.templates.detail(templateId), template);
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess(t('toast.updated'));
    },
    onError: toastApiError,
  });
}

export function useDeleteTemplate() {
  const t = useTranslations('templates');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) => templatesApi.delete(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess(t('toast.deleted'));
    },
    onError: toastApiError,
  });
}

export function useSyncTemplates() {
  const t = useTranslations('templates');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params?: SyncTemplatesParams) => templatesApi.sync(params),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess(t('toast.synced', { count: result.synced }));
    },
    onError: toastApiError,
  });
}

export function useArchiveTemplate(templateId: string) {
  const t = useTranslations('templates');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => templatesApi.archive(templateId),
    onSuccess: (template) => {
      queryClient.setQueryData(queryKeys.templates.detail(templateId), template);
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess(t('toast.archived'));
    },
    onError: toastApiError,
  });
}

export function useResubmitTemplate(templateId: string) {
  const t = useTranslations('templates');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => templatesApi.resubmit(templateId),
    onSuccess: (template) => {
      queryClient.setQueryData(queryKeys.templates.detail(templateId), template);
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toastSuccess(t('toast.resubmitted'));
    },
    onError: toastApiError,
  });
}
