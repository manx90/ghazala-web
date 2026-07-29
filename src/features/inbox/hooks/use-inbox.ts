'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { toastApiError, toastSuccess } from '@/components/global/toast-helpers';
import { useNetworkAware } from '@/hooks/use-network-aware';
import { conversationsApi } from '@/features/shell/api/conversations.api';
import { useOrganizationStore } from '@/store/organization.store';
import { ConversationStatus } from '@/types/conversation.types';
import type { Conversation, ConversationQueryParams } from '@/types/conversation.types';
import type { Message } from '@/types/message.types';

export const MESSAGES_PAGE_SIZE = 30;

export type InboxStatusFilter = ConversationStatus | 'ALL';

export interface InboxFilters {
  status: InboxStatusFilter;
  phoneNumberId?: string;
  customerPhone?: string;
}

const defaultFilters: InboxFilters = {
  status: 'ALL',
};

function buildConversationParams(filters: InboxFilters): ConversationQueryParams {
  return {
    page: 1,
    limit: 50,
    ...(filters.status !== 'ALL' ? { status: filters.status } : {}),
    ...(filters.phoneNumberId ? { phoneNumberId: filters.phoneNumberId } : {}),
    ...(filters.customerPhone?.trim()
      ? { customerPhone: filters.customerPhone.trim() }
      : {}),
  };
}

function flattenMessages(pages: { items: Message[] }[]): Message[] {
  const merged = pages.flatMap((page) => page.items);
  return [...merged].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function useInbox(conversationId?: string) {
  const queryClient = useQueryClient();
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization);
  const { isOnline } = useNetworkAware();
  const [filters, setFilters] = useState<InboxFilters>(defaultFilters);

  const listParams = useMemo(() => buildConversationParams(filters), [filters]);
  const orgId = currentOrganization?.id;

  const conversationsQuery = useQuery({
    queryKey: queryKeys.conversations.list({ ...listParams, orgId }),
    queryFn: () => conversationsApi.list(listParams),
    enabled: Boolean(orgId) && isOnline,
    ...queryConfig.inbox.conversations,
  });

  const conversationQuery = useQuery({
    queryKey: queryKeys.conversations.detail(conversationId ?? ''),
    queryFn: () => conversationsApi.getById(conversationId!),
    enabled: Boolean(orgId && conversationId) && isOnline,
    staleTime: queryConfig.fast.staleTime,
    gcTime: queryConfig.fast.gcTime,
  });

  const messagesQuery = useInfiniteQuery({
    queryKey: queryKeys.conversations.messages(conversationId ?? '', { limit: MESSAGES_PAGE_SIZE, orgId }),
    queryFn: ({ pageParam }) =>
      conversationsApi.messages(conversationId!, {
        page: pageParam,
        limit: MESSAGES_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.items.length, 0);
      if (loaded >= lastPage.total) return undefined;
      return allPages.length + 1;
    },
    enabled: Boolean(orgId && conversationId) && isOnline,
    ...queryConfig.inbox.messages,
  });

  const invalidateConversation = useCallback(
    (id: string) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.detail(id) });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.messages(id, { limit: MESSAGES_PAGE_SIZE }),
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
    },
    [queryClient],
  );

  const setOptimisticStatus = useCallback(
    (id: string, status: ConversationStatus) => {
      queryClient.setQueryData<Conversation>(
        [...queryKeys.conversations.detail(id)],
        (old) => (old ? { ...old, status } : old),
      );
      queryClient.setQueriesData<{ items: Conversation[] }>(
        { queryKey: queryKeys.conversations.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((c) => (c.id === id ? { ...c, status } : c)),
          };
        },
      );
    },
    [queryClient],
  );

  const closeMutation = useMutation({
    mutationFn: (id: string) => conversationsApi.close(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.conversations.detail(id) });
      setOptimisticStatus(id, ConversationStatus.CLOSED);
    },
    onSuccess: (conversation) => {
      toastSuccess('تم إغلاق المحادثة');
      invalidateConversation(conversation.id);
    },
    onError: (error, id) => {
      setOptimisticStatus(id, ConversationStatus.OPEN);
      toastApiError(error);
    },
  });

  const reopenMutation = useMutation({
    mutationFn: (id: string) => conversationsApi.reopen(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.conversations.detail(id) });
      setOptimisticStatus(id, ConversationStatus.OPEN);
    },
    onSuccess: (conversation) => {
      toastSuccess('تم إعادة فتح المحادثة');
      invalidateConversation(conversation.id);
    },
    onError: (error, id) => {
      setOptimisticStatus(id, ConversationStatus.CLOSED);
      toastApiError(error);
    },
  });

  const messages = useMemo(
    () => flattenMessages(messagesQuery.data?.pages ?? []),
    [messagesQuery.data?.pages],
  );

  const updateFilters = useCallback((patch: Partial<InboxFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
    conversations: conversationsQuery.data?.items ?? [],
    conversationsQuery,
    conversation: conversationQuery.data,
    conversationQuery,
    messages,
    messagesQuery,
    closeConversation: closeMutation.mutate,
    reopenConversation: reopenMutation.mutate,
    isClosing: closeMutation.isPending,
    isReopening: reopenMutation.isPending,
    loadOlderMessages: messagesQuery.fetchNextPage,
    hasOlderMessages: messagesQuery.hasNextPage,
    isLoadingOlderMessages: messagesQuery.isFetchingNextPage,
  };
}
