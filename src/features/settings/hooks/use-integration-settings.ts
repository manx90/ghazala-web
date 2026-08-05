'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toastApiError, toastSuccess } from '@/components/global/toast-helpers';
import { queryKeys } from '@/config/query-keys';
import { metaApi } from '@/features/meta/api/meta.api';
import { whatsappApi } from '@/features/whatsapp/api/whatsapp.api';
import type { ConnectMetaPayload } from '@/types/meta.types';
import type { WhatsappSyncResult } from '@/types/whatsapp.types';

function syncSuccessMessage(result: WhatsappSyncResult, includeWabas = false): string {
  const parts: string[] = [];
  if (includeWabas) {
    parts.push(`تمت مزامنة ${result.wabasSynced} حساب و ${result.phoneNumbersSynced} رقم`);
  } else {
    parts.push(`تمت مزامنة ${result.phoneNumbersSynced} رقم`);
  }
  if (result.phoneNumbersRegistered > 0) {
    parts.push(`وتم تسجيل ${result.phoneNumbersRegistered} رقم على Cloud API`);
  }
  return parts.join(' ');
}

export function useMetaStatus() {
  return useQuery({
    queryKey: queryKeys.meta.status,
    queryFn: () => metaApi.status(),
  });
}

export function useConnectMeta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConnectMetaPayload) => metaApi.connect(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.meta.status });
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.businessAccounts });
      toastSuccess('تم ربط Meta بنجاح');
    },
    onError: toastApiError,
  });
}

export function useDisconnectMeta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => metaApi.disconnect(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.meta.status });
      toastSuccess('تم فصل Meta');
    },
    onError: toastApiError,
  });
}

export function useSyncMeta() {
  const queryClient = useQueryClient();

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
      toastSuccess(response.message || 'تمت المزامنة');
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

export function useSyncWhatsappAccounts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => whatsappApi.syncBusinessAccounts(),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.businessAccounts });
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers });
      toastSuccess(syncSuccessMessage(result, true));
    },
    onError: toastApiError,
  });
}

export function useSyncWhatsappPhoneNumbers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => whatsappApi.syncPhoneNumbers(),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers });
      toastSuccess(syncSuccessMessage(result));
    },
    onError: toastApiError,
  });
}

export function useDisconnectPhoneNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => whatsappApi.disconnectPhoneNumber(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers });
      toastSuccess('تم فصل رقم الهاتف');
    },
    onError: toastApiError,
  });
}
