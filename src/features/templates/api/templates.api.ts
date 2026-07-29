import { apiClient } from '@/services/api/client';
import type { ApiMessageResponse } from '@/types/api.types';
import type {
  CreateTemplatePayload,
  SyncTemplatesParams,
  Template,
  TemplateListResponse,
  TemplateSyncResult,
  UpdateTemplatePayload,
} from '@/types/template.types';
import { toQueryString } from '@/utils/query';

const BASE = '/templates';

export const templatesApi = {
  list(): Promise<TemplateListResponse> {
    return apiClient.get<TemplateListResponse>(BASE);
  },

  getById(id: string): Promise<Template> {
    return apiClient.get<Template>(`${BASE}/${id}`);
  },

  create(payload: CreateTemplatePayload): Promise<Template> {
    return apiClient.post<Template>(BASE, payload);
  },

  update(id: string, payload: UpdateTemplatePayload): Promise<Template> {
    return apiClient.patch<Template>(`${BASE}/${id}`, payload);
  },

  delete(id: string): Promise<ApiMessageResponse> {
    return apiClient.delete<ApiMessageResponse>(`${BASE}/${id}`);
  },

  sync(params?: SyncTemplatesParams): Promise<TemplateSyncResult> {
    return apiClient.post<TemplateSyncResult>(`${BASE}/sync${toQueryString(params)}`);
  },

  archive(id: string): Promise<Template> {
    return apiClient.post<Template>(`${BASE}/${id}/archive`);
  },

  resubmit(id: string): Promise<Template> {
    return apiClient.post<Template>(`${BASE}/${id}/resubmit`);
  },
};
