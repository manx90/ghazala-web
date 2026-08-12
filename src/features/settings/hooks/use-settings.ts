'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useToastI18n } from '@/hooks/use-toast-i18n';
import { queryKeys } from '@/config/query-keys';
import { settingsApi } from '@/features/settings/api/settings.api';
import { useOrganizationStore } from '@/store/organization.store';
import type {
  AddOrganizationMemberPayload,
  UpdateOrganizationMemberPayload,
} from '@/types/member.types';
import type { UpdateOrganizationSettingsPayload } from '@/types/organization.types';

export function useOrganizationSettings() {
  return useQuery({
    queryKey: queryKeys.organizations.current,
    queryFn: () => settingsApi.getOrganization(),
  });
}

export function useUpdateOrganizationSettings() {
  const queryClient = useQueryClient();
  const setCurrentOrganization = useOrganizationStore((state) => state.setCurrentOrganization);
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('settings.toast');

  return useMutation({
    mutationFn: (payload: UpdateOrganizationSettingsPayload) =>
      settingsApi.updateOrganizationSettings(payload),
    onSuccess: (organization) => {
      queryClient.setQueryData(queryKeys.organizations.current, organization);
      setCurrentOrganization(organization);
      toastSuccess(t('organizationSaved'));
    },
    onError: toastApiError,
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: queryKeys.members.list,
    queryFn: () => settingsApi.listMembers(),
  });
}

export function useAddTeamMember() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('settings.toast');

  return useMutation({
    mutationFn: (payload: AddOrganizationMemberPayload) => settingsApi.addMember(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.members.list });
      toastSuccess(t('memberAdded'));
    },
    onError: toastApiError,
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('settings.toast');

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrganizationMemberPayload }) =>
      settingsApi.updateMember(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.members.list });
      toastSuccess(t('memberUpdated'));
    },
    onError: toastApiError,
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('settings.toast');

  return useMutation({
    mutationFn: (id: string) => settingsApi.removeMember(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.members.list });
      toastSuccess(t('memberRemoved'));
    },
    onError: toastApiError,
  });
}
