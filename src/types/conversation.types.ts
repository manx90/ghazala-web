export enum ConversationStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

export enum ConversationCategory {
  SERVICE = 'SERVICE',
  MARKETING = 'MARKETING',
  AUTHENTICATION = 'AUTHENTICATION',
  UTILITY = 'UTILITY',
  UNKNOWN = 'UNKNOWN',
}

export enum ConversationPricingCategory {
  FREE = 'FREE',
  PAID = 'PAID',
  UNKNOWN = 'UNKNOWN',
}

export interface Conversation {
  id: string;
  organizationId: string;
  phoneNumberId: string;
  customerPhone: string;
  metaConversationId: string | null;
  category: ConversationCategory;
  status: ConversationStatus;
  pricingCategory: ConversationPricingCategory;
  metaExpirationAt: string | null;
  startedAt: string;
  lastMessageAt: string;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationStatistics {
  total: number;
  open: number;
  closed: number;
  expired: number;
}

export interface ConversationQueryParams {
  page?: number;
  limit?: number;
  status?: ConversationStatus;
  phoneNumberId?: string;
  customerPhone?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ConversationListResponse {
  items: Conversation[];
  total: number;
  page: number;
  limit: number;
}
