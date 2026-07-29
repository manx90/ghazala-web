import { apiClient } from '@/services/api/client';
import type {
  Message,
  MessageListResponse,
  MessageStatusResponse,
  SendMediaMessagePayload,
  SendTemplateMessagePayload,
  SendTextMessagePayload,
} from '@/types/message.types';

const BASE = '/messages';

export const messagesApi = {
  list(): Promise<MessageListResponse> {
    return apiClient.get<MessageListResponse>(BASE);
  },

  getById(id: string): Promise<Message> {
    return apiClient.get<Message>(`${BASE}/${id}`);
  },

  getStatus(id: string): Promise<MessageStatusResponse> {
    return apiClient.get<MessageStatusResponse>(`${BASE}/${id}/status`);
  },

  sendText(payload: SendTextMessagePayload): Promise<Message> {
    return apiClient.post<Message>(`${BASE}/text`, payload);
  },

  sendTemplate(payload: SendTemplateMessagePayload): Promise<Message> {
    return apiClient.post<Message>(`${BASE}/template`, payload);
  },

  sendImage(payload: SendMediaMessagePayload): Promise<Message> {
    return apiClient.post<Message>(`${BASE}/image`, payload);
  },

  sendDocument(payload: SendMediaMessagePayload): Promise<Message> {
    return apiClient.post<Message>(`${BASE}/document`, payload);
  },

  retry(id: string): Promise<Message> {
    return apiClient.post<Message>(`${BASE}/${id}/retry`);
  },
};
