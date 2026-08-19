import { apiClient } from '@/services/api/client';
import type { ApiMessageResponse } from '@/types/api.types';
import type {
  CreateFromLibraryPayload,
  CreateTemplatePayload,
  ListTemplateLibraryParams,
  ListTemplatesParams,
  SyncTemplatesParams,
  Template,
  TemplateLanguagesResponse,
  TemplateLibraryListResponse,
  TemplateListResponse,
  TemplateSyncResult,
  UpdateTemplatePayload,
} from '@/types/template.types';
import { toQueryString } from '@/utils/query';
import { sanitizeCreateFromLibraryPayload } from '@/features/templates/utils/library-template';
import { apiRequest } from '@/services/api/client';

const BASE = '/templates';
const LIBRARY_BASE = '/template-library';
const LIBRARY_REQUEST_TIMEOUT_MS = 60_000;

export const templatesApi = {
  list(params?: ListTemplatesParams): Promise<TemplateListResponse> {
    return apiClient.get<TemplateListResponse>(`${BASE}${toQueryString(params)}`);
  },

  getLanguages(): Promise<TemplateLanguagesResponse> {
    return apiClient.get<TemplateLanguagesResponse>(`${LIBRARY_BASE}/languages`);
  },

  listLibrary(params?: ListTemplateLibraryParams): Promise<TemplateLibraryListResponse> {
    return apiClient.get<TemplateLibraryListResponse>(
      `${LIBRARY_BASE}${toQueryString({ limit: 50, ...params })}`,
      undefined,
      { timeout: LIBRARY_REQUEST_TIMEOUT_MS },
    );
  },

  createFromLibrary(payload: CreateFromLibraryPayload): Promise<Template> {
    return apiClient.post<Template>(LIBRARY_BASE, sanitizeCreateFromLibraryPayload(payload));
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

  uploadHeaderMedia(
    payload: { format: 'IMAGE' | 'VIDEO' | 'DOCUMENT'; file?: File; url?: string },
  ): Promise<{ handle: string }> {
    if (payload.file) {
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('format', payload.format);
      return apiRequest<{ handle: string }>({
        method: 'POST',
        url: `${BASE}/header-media`,
        data: formData,
        timeout: 60_000,
      });
    }

    return apiClient.post<{ handle: string }>(
      `${BASE}/header-media`,
      { format: payload.format, url: payload.url },
      undefined,
      { timeout: 60_000 },
    );
  },
};
