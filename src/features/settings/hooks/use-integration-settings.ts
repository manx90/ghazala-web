'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useToastI18n } from '@/hooks/use-toast-i18n';
import { queryKeys } from '@/config/query-keys';
import { metaApi } from '@/features/meta/api/meta.api';
import { whatsappApi } from '@/features/whatsapp/api/whatsapp.api';
import type { ConnectMetaPayload } from '@/types/meta.types';
import type { WhatsappSyncResult } from '@/types/whatsapp.types';

export function useMetaStatus() {
  return useQuery({
    queryKey: queryKeys.meta.status,
    queryFn: () => metaApi.status(),
  });
}

export function useConnectMeta() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('settings.toast');

  return useMutation({
    mutationFn: (payload: ConnectMetaPayload) => metaApi.connect(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.meta.status });
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.businessAccounts });
      toastSuccess(t('metaConnected'));
    },
    onError: toastApiError,
  });
}

export function useDisconnectMeta() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('settings.toast');

  return useMutation({
    mutationFn: () => metaApi.disconnect(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.meta.status });
      toastSuccess(t('metaDisconnected'));
    },
    onError: toastApiError,
  });
}

export function useSyncMeta() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('settings.toast');

  return useMutation({
    mutationFn: async () => {
      const metaResponse = await metaApi.sync();
      await whatsappApi.syncBusinessAccounts();
      return metaResponse;
    },
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.meta.status });
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.businessAccounts });
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers });
      toastSuccess(response.message || t('synced'));
    },
    onError: toastApiError,
  });
}

export function useWhatsappBusinessAccounts() {
  return useQuery({
    queryKey: queryKeys.whatsapp.businessAccounts,
    queryFn: () => whatsappApi.listBusinessAccounts(),
  });
}

export function useWhatsappPhoneNumbers() {
  return useQuery({
    queryKey: queryKeys.whatsapp.phoneNumbers,
    queryFn: () => whatsappApi.listPhoneNumbers(),
  });
}

function useSyncSuccessMessage() {
  const t = useTranslations('settings.toast');

  return (result: WhatsappSyncResult, includeWabas = false) => {
    const parts: string[] = [];
    if (includeWabas) {
      parts.push(t('syncDetailed', { wabas: result.wabasSynced, phones: result.phoneNumbersSynced }));
    } else {
      parts.push(t('syncPhones', { phones: result.phoneNumbersSynced }));
    }
    if (result.phoneNumbersRegistered > 0) {
      parts.push(t('syncRegistered', { count: result.phoneNumbersRegistered }));
    }
    return parts.join(' ');
  };
}

export function useSyncWhatsappAccounts() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const syncMessage = useSyncSuccessMessage();

  return useMutation({
    mutationFn: () => whatsappApi.syncBusinessAccounts(),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.businessAccounts });
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers });
      toastSuccess(syncMessage(result, true));
    },
    onError: toastApiError,
  });
}

export function useSyncWhatsappPhoneNumbers() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const syncMessage = useSyncSuccessMessage();

  return useMutation({
    mutationFn: () => whatsappApi.syncPhoneNumbers(),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers });
      toastSuccess(syncMessage(result));
    },
    onError: toastApiError,
  });
}

export function useDisconnectPhoneNumber() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastApiError } = useToastI18n();
  const t = useTranslations('settings.toast');

  return useMutation({
    mutationFn: (id: string) => whatsappApi.disconnectPhoneNumber(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers });
      toastSuccess(t('phoneDisconnected'));
    },
    onError: toastApiError,
  });
}
