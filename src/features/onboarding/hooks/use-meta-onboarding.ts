'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { metaApi } from '@/features/meta/api/meta.api';
import { whatsappApi } from '@/features/whatsapp/api/whatsapp.api';
import { queryKeys } from '@/config/query-keys';
import { getErrorMessage } from '@/utils/error';
import { toastError, toastSuccess } from '@/components/global/toast-helpers';
import type { ConnectMetaPayload } from '@/types/meta.types';

export function useMetaStatus(enabled = true) {
  return useQuery({
    queryKey: queryKeys.meta.status,
    queryFn: () => metaApi.status(),
    enabled,
  });
}

export function useConnectMeta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConnectMetaPayload) => metaApi.connect(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.meta.status }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.businessAccounts }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers }),
      ]);
      toastSuccess('تم ربط WhatsApp Business بنجاح');
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useDisconnectMeta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => metaApi.disconnect(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.meta.status }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.businessAccounts }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers }),
      ]);
      toastSuccess('تم فصل WhatsApp Business');
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useSyncMeta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => metaApi.sync(),
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.meta.status }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.businessAccounts }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers }),
      ]);
      toastSuccess(response.message || 'تمت المزامنة');
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useWhatsappBusinessAccounts(enabled = true) {
  return useQuery({
    queryKey: queryKeys.whatsapp.businessAccounts,
    queryFn: () => whatsappApi.listBusinessAccounts(),
    enabled,
  });
}

export function useWhatsappPhoneNumbers(enabled = true) {
  return useQuery({
    queryKey: queryKeys.whatsapp.phoneNumbers,
    queryFn: () => whatsappApi.listPhoneNumbers(),
    enabled,
  });
}
