'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { toastApiError, toastSuccess } from '@/components/global/toast-helpers';
import { useNetworkAware } from '@/hooks/use-network-aware';
import { useOrganizationStore } from '@/store/organization.store';
import { messagesApi } from '@/features/messages/api/messages.api';
import { MessageStatus } from '@/types/message.types';

export function useMessages() {
  const orgId = useOrganizationStore((state) => state.currentOrganization?.id);
  const { isOnline } = useNetworkAware();

  return useQuery({
    queryKey: queryKeys.messages.list,
    queryFn: () => messagesApi.list(),
    enabled: Boolean(orgId) && isOnline,
    ...queryConfig.fast,
  });
}

export function useMessage(messageId: string) {
  const orgId = useOrganizationStore((state) => state.currentOrganization?.id);
  const { isOnline } = useNetworkAware();

  return useQuery({
    queryKey: queryKeys.messages.detail(messageId),
    queryFn: () => messagesApi.getById(messageId),
    enabled: Boolean(orgId) && Boolean(messageId) && isOnline,
    ...queryConfig.fast,
  });
}

export function useMessageStatus(messageId: string) {
  const orgId = useOrganizationStore((state) => state.currentOrganization?.id);
  const { isOnline } = useNetworkAware();

  return useQuery({
    queryKey: queryKeys.messages.status(messageId),
    queryFn: () => messagesApi.getStatus(messageId),
    enabled: Boolean(orgId) && Boolean(messageId) && isOnline,
    ...queryConfig.messages.status,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === MessageStatus.QUEUED || status === MessageStatus.SENDING) return 5_000;
      return false;
    },
  });
}

export function useRetryMessage() {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkAware();

  return useMutation({
    mutationFn: (messageId: string) => {
      if (!isOnline) throw new Error('لا يوجد اتصال بالإنترنت');
      return messagesApi.retry(messageId);
    },
    onSuccess: (_data, messageId) => {
      toastSuccess('تم إعادة إرسال الرسالة');
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages.list });
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages.detail(messageId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages.status(messageId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
    },
    onError: toastApiError,
  });
}
