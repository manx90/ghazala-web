export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  unreadCount: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAllReadResponse {
  updated: number;
}

export type WebhookEvent =
  | 'message.received'
  | 'message.status.updated'
  | 'template.status.updated'
  | 'phone_number.quality.updated'
  | 'account.updated'
  | 'history.synced'
  | 'contact.synced';

export interface WebhookEndpoint {
  id: string;
  url: string;
  description: string | null;
  events: WebhookEvent[];
  active: boolean;
  secret: string;
  lastTriggeredAt: string | null;
  createdAt: string;
}

export interface WebhookEndpointListResponse {
  items: WebhookEndpoint[];
  total: number;
}

export interface CreateWebhookEndpointPayload {
  url: string;
  description?: string;
  events: WebhookEvent[];
  active?: boolean;
}

export interface UpdateWebhookEndpointPayload {
  url?: string;
  description?: string;
  events?: WebhookEvent[];
  active?: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string | null;
  active: boolean;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface ApiKeyCreated extends ApiKey {
  key: string;
}

export interface ApiKeyListResponse {
  items: ApiKey[];
  total: number;
}

export interface CreateApiKeyPayload {
  name: string;
  expiresAt?: string;
}

export interface SessionInfo {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}
