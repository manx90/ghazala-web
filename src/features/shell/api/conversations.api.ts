import { apiClient } from '@/services/api/client';
import type {
  Conversation,
  ConversationListResponse,
  ConversationQueryParams,
  ConversationStatistics,
} from '@/types/conversation.types';
import type {
  ConversationMessagesQueryParams,
  ConversationMessagesResponse,
} from '@/types/message.types';
import { toQueryString } from '@/utils/query';

const BASE = '/conversations';

export const conversationsApi = {
  statistics(): Promise<ConversationStatistics> {
    return apiClient.get<ConversationStatistics>(`${BASE}/statistics`);
  },

  list(params?: ConversationQueryParams): Promise<ConversationListResponse> {
    return apiClient.get<ConversationListResponse>(`${BASE}${toQueryString(params)}`);
  },

  getById(id: string): Promise<Conversation> {
    return apiClient.get<Conversation>(`${BASE}/${id}`);
  },

  messages(id: string, params?: ConversationMessagesQueryParams): Promise<ConversationMessagesResponse> {
    return apiClient.get<ConversationMessagesResponse>(
      `${BASE}/${id}/messages${toQueryString(params)}`,
    );
  },

  close(id: string): Promise<Conversation> {
    return apiClient.post<Conversation>(`${BASE}/${id}/close`);
  },

  reopen(id: string): Promise<Conversation> {
    return apiClient.post<Conversation>(`${BASE}/${id}/reopen`);
  },
};
