'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toastApiError, toastSuccess } from '@/components/global/toast-helpers';
import { queryKeys } from '@/config/query-keys';
import { useNetworkAware } from '@/hooks/use-network-aware';
import { messagesApi } from '@/features/messages/api/messages.api';
import { MESSAGES_PAGE_SIZE } from '@/features/inbox/hooks/use-inbox';
import { MessageDirection, MessageStatus, MessageType } from '@/types/message.types';
import type {
  Message,
  SendMediaMessagePayload,
  SendTemplateMessagePayload,
  SendTextMessagePayload,
} from '@/types/message.types';

function buildOptimisticMessage(payload: SendTextMessagePayload | SendTemplateMessagePayload | SendMediaMessagePayload): Message {
  const now = new Date().toISOString();
  const isText = 'body' in payload;
  const isTemplate = 'templateId' in payload;

  let optimisticPayload: Record<string, unknown>;
  if (isText) {
    optimisticPayload = { body: payload.body };
  } else if (isTemplate) {
    optimisticPayload = {
      templateId: payload.templateId,
      templateName: payload.templateName,
      templateLanguage: payload.templateLanguage,
      templatePreview: payload.templatePreview,
    };
  } else {
    optimisticPayload = { link: (payload as SendMediaMessagePayload).link };
  }

  return {
    id: `optimistic-${crypto.randomUUID()}`,
    organizationId: '',
    phoneNumberId: payload.phoneNumberId,
    conversationId: payload.conversationId ?? null,
    metaMessageId: null,
    recipient: payload.recipient,
    sender: null,
    messageType: isText ? MessageType.TEXT : isTemplate ? MessageType.TEMPLATE : MessageType.IMAGE,
    direction: MessageDirection.OUTBOUND,
    status: MessageStatus.QUEUED,
    templateId: isTemplate ? payload.templateId : null,
    payload: optimisticPayload,
    errorCode: null,
    errorMessage: null,
    retryCount: 0,
    maxRetries: 3,
    nextRetryAt: null,
    sentAt: null,
    deliveredAt: null,
    readAt: null,
    failedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

function invalidateAfterSend(queryClient: ReturnType<typeof useQueryClient>, conversationId?: string) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all });
  if (conversationId) {
    void queryClient.invalidateQueries({ queryKey: queryKeys.conversations.detail(conversationId) });
    void queryClient.invalidateQueries({
      queryKey: queryKeys.conversations.messages(conversationId, { limit: MESSAGES_PAGE_SIZE }),
    });
  }
}

function applyOptimisticMessage(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: string | undefined,
  message: Message,
) {
  if (!conversationId) return;
  const key = queryKeys.conversations.messages(conversationId, { limit: MESSAGES_PAGE_SIZE });
  queryClient.setQueryData<{ pages: { items: Message[]; total: number; page: number; limit: number }[]; pageParams: number[] }>(
    [...key],
    (old) => {
      if (!old) return old;
      const lastPage = old.pages[old.pages.length - 1];
      const updatedLastPage = { ...lastPage, items: [...lastPage.items, message], total: lastPage.total + 1 };
      return {
        ...old,
        pages: [...old.pages.slice(0, old.pages.length - 1), updatedLastPage],
      };
    },
  );
}

function revertOptimisticMessage(queryClient: ReturnType<typeof useQueryClient>, conversationId: string | undefined, tempId: string) {
  if (!conversationId) return;
  const key = queryKeys.conversations.messages(conversationId, { limit: MESSAGES_PAGE_SIZE });
  queryClient.setQueryData<{ pages: { items: Message[]; total: number; page: number; limit: number }[] }>(
    [...key],
    (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.filter((m) => m.id !== tempId),
          total: Math.max(0, page.total - 1),
        })),
      };
    },
  );
}

function useSendMessageMutation<T extends SendTextMessagePayload | SendTemplateMessagePayload | SendMediaMessagePayload>(
  sendFn: (payload: T) => Promise<Message>,
  successMessage: string,
  offlineMessage: string,
) {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkAware();

  return useMutation({
    mutationFn: (payload: T) => {
      if (!isOnline) throw new Error(offlineMessage);
      return sendFn(payload);
    },
    onMutate: async (payload) => {
      const conversationId = payload.conversationId;
      if (!conversationId) return { tempId: null as string | null };
      await queryClient.cancelQueries({
        queryKey: queryKeys.conversations.messages(conversationId, { limit: MESSAGES_PAGE_SIZE }),
      });
      const temp = buildOptimisticMessage(payload);
      applyOptimisticMessage(queryClient, conversationId, temp);
      return { tempId: temp.id };
    },
    onSuccess: (message, _payload, context) => {
      toastSuccess(successMessage);
      if (context?.tempId && message.conversationId) {
        revertOptimisticMessage(queryClient, message.conversationId, context.tempId);
      }
      invalidateAfterSend(queryClient, message.conversationId ?? undefined);
    },
    onError: (error, payload, context) => {
      if (context?.tempId) {
        revertOptimisticMessage(queryClient, payload.conversationId, context.tempId);
      }
      toastApiError(error);
    },
  });
}

export function useSendMessage() {
  const t = useTranslations('inbox');

  const sendTextMutation = useSendMessageMutation(
    (payload: SendTextMessagePayload) => messagesApi.sendText(payload),
    t('toast.textSent'),
    t('errors.noInternet'),
  );
  const sendTemplateMutation = useSendMessageMutation(
    (payload: SendTemplateMessagePayload) => messagesApi.sendTemplate(payload),
    t('toast.templateSent'),
    t('errors.noInternet'),
  );
  const sendImageMutation = useSendMessageMutation(
    (payload: SendMediaMessagePayload) => messagesApi.sendImage(payload),
    t('toast.imageSent'),
    t('errors.noInternet'),
  );
  const sendDocumentMutation = useSendMessageMutation(
    (payload: SendMediaMessagePayload) => messagesApi.sendDocument(payload),
    t('toast.documentSent'),
    t('errors.noInternet'),
  );

  return {
    sendText: sendTextMutation.mutateAsync,
    sendTemplate: sendTemplateMutation.mutateAsync,
    sendImage: sendImageMutation.mutateAsync,
    sendDocument: sendDocumentMutation.mutateAsync,
    isSending:
      sendTextMutation.isPending ||
      sendTemplateMutation.isPending ||
      sendImageMutation.isPending ||
      sendDocumentMutation.isPending,
  };
}
