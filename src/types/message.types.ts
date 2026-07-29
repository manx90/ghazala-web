export enum MessageType {
  TEXT = 'TEXT',
  TEMPLATE = 'TEMPLATE',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  AUDIO = 'AUDIO',
  STICKER = 'STICKER',
  LOCATION = 'LOCATION',
  CONTACTS = 'CONTACTS',
}

export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum MessageStatus {
  QUEUED = 'QUEUED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

export interface Message {
  id: string;
  organizationId: string;
  phoneNumberId: string;
  conversationId: string | null;
  metaMessageId: string | null;
  recipient: string;
  sender: string | null;
  messageType: MessageType;
  direction: MessageDirection;
  status: MessageStatus;
  templateId: string | null;
  payload: Record<string, unknown>;
  errorCode: string | null;
  errorMessage: string | null;
  retryCount: number;
  maxRetries: number;
  nextRetryAt: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageListResponse {
  items: Message[];
  total: number;
}

export interface MessageStatusResponse {
  id: string;
  status: MessageStatus;
  metaMessageId: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface BaseSendMessagePayload {
  phoneNumberId: string;
  recipient: string;
  conversationId?: string;
}

export interface SendTextMessagePayload extends BaseSendMessagePayload {
  body: string;
  previewUrl?: boolean;
}

export interface SendTemplateMessagePayload extends BaseSendMessagePayload {
  templateId: string;
  components?: { type: string; parameters?: Record<string, unknown>[] }[];
}

export interface SendMediaMessagePayload extends BaseSendMessagePayload {
  link: string;
  caption?: string;
  filename?: string;
}

export interface ConversationMessagesQueryParams {
  page?: number;
  limit?: number;
}

export interface ConversationMessagesResponse {
  items: Message[];
  total: number;
  page: number;
  limit: number;
}
