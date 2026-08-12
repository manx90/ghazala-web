'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { metaApi } from '@/features/meta/api/meta.api';
import { whatsappApi } from '@/features/whatsapp/api/whatsapp.api';
import { queryKeys } from '@/config/query-keys';
import { invalidateOnboardingState } from '@/features/onboarding/utils/invalidate-onboarding';
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
  const t = useTranslations('onboarding.connectWhatsapp');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConnectMetaPayload) => metaApi.connect(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.meta.status }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.businessAccounts }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers }),
        invalidateOnboardingState(queryClient),
      ]);
      toastSuccess(t('connectSuccess'));
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useDisconnectMeta() {
  const t = useTranslations('onboarding.connectWhatsapp');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => metaApi.disconnect(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.meta.status }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.businessAccounts }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers }),
        invalidateOnboardingState(queryClient),
      ]);
      toastSuccess(t('disconnectSuccess'));
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useSyncMeta() {
  const t = useTranslations('onboarding.connectWhatsapp');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const metaResponse = await metaApi.sync();
      await whatsappApi.syncBusinessAccounts();
      return metaResponse;
    },
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.meta.status }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.businessAccounts }),
        queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.phoneNumbers }),
      ]);
      toastSuccess(response.message || t('syncSuccess'));
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
