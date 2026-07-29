export enum TemplateCategory {
  MARKETING = 'MARKETING',
  UTILITY = 'UTILITY',
  AUTHENTICATION = 'AUTHENTICATION',
}

export enum TemplateStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAUSED = 'PAUSED',
  DISABLED = 'DISABLED',
}

export enum TemplateComponentType {
  HEADER = 'HEADER',
  BODY = 'BODY',
  FOOTER = 'FOOTER',
  BUTTONS = 'BUTTONS',
}

export interface TemplateComponent {
  type: TemplateComponentType | string;
  format?: string;
  text?: string;
  buttons?: { type: string; text: string; url?: string; phone_number?: string }[];
  example?: Record<string, unknown>;
}

export interface Template {
  id: string;
  organizationId: string;
  wabaId: string;
  metaTemplateId: string | null;
  name: string;
  category: TemplateCategory;
  language: string;
  status: TemplateStatus;
  qualityScore: string;
  components: TemplateComponent[];
  rejectionReason: string | null;
  lastSyncedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateListResponse {
  items: Template[];
  total: number;
}

export interface CreateTemplatePayload {
  wabaId?: string;
  name: string;
  category: TemplateCategory;
  language: string;
  components: TemplateComponent[];
}

export interface UpdateTemplatePayload {
  category?: TemplateCategory;
  components?: TemplateComponent[];
}

export interface SyncTemplatesParams {
  incremental?: boolean;
  wabaId?: string;
}

export interface TemplateSyncResult {
  synced: number;
  created: number;
  updated: number;
  archived: number;
}
