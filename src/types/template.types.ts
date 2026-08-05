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

export interface ListTemplatesParams {
  language?: string;
  status?: TemplateStatus | string;
}

export interface TemplateLibraryButton {
  type: string;
  text?: string;
  url?: string;
  phone_number?: string;
}

export interface TemplateLibraryItem {
  id: string;
  name: string;
  language: string;
  category: string;
  topic?: string;
  usecase?: string;
  industry?: string[];
  header?: string;
  body: string;
  bodyParams?: string[];
  buttons?: TemplateLibraryButton[];
}

export interface TemplateLibraryListResponse {
  items: TemplateLibraryItem[];
  total: number;
  hasMore?: boolean;
}

export interface ListTemplateLibraryParams {
  search?: string;
  name?: string;
  language?: string;
  topic?: string;
  usecase?: string;
  industry?: string;
  limit?: number;
}

export interface LibraryTemplateButtonInput {
  type: string;
  phone_number?: string;
  url?: { base_url: string; url_suffix_example?: string };
}

export interface LibraryTemplateBodyInputs {
  add_contact_number?: boolean;
  add_learn_more_link?: boolean;
  add_security_recommendation?: boolean;
  add_track_package_link?: boolean;
  code_expiration_minutes?: number;
}

export interface CreateFromLibraryPayload {
  wabaId?: string;
  name: string;
  libraryTemplateName: string;
  language: string;
  category?: TemplateCategory;
  libraryTemplateButtonInputs?: LibraryTemplateButtonInput[];
  libraryTemplateBodyInputs?: LibraryTemplateBodyInputs;
}

export interface TemplateLanguagesResponse {
  languages: string[];
}

export interface TemplateSyncResult {
  synced: number;
  created: number;
  updated: number;
  archived: number;
}
