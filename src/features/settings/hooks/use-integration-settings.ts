'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toastApiError, toastSuccess } from '@/components/global/toast-helpers';
import { queryKeys } from '@/config/query-keys';
import { metaApi } from '@/features/meta/api/meta.api';
import { whatsappApi } from '@/features/whatsapp/api/whatsapp.api';
import type { ConnectMetaPayload } from '@/types/meta.types';

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
    mutationFn: () => metaApi.sync(),
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
      toastSuccess(`تمت مزامنة ${result.wabasSynced} حساب و ${result.phoneNumbersSynced} رقم`);
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
      toastSuccess(`تمت مزامنة ${result.phoneNumbersSynced} رقم`);
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
