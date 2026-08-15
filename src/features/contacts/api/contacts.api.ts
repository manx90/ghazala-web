import { apiClient } from '@/services/api/client';
import { downloadFromResponse } from '@/services/api/download';
import type { ApiMessageResponse } from '@/types/api.types';
import type {
  Contact,
  ContactListResponse,
  ContactQueryParams,
  CreateContactPayload,
  ImportContactsPayload,
  ImportContactsResult,
  MergeContactsPayload,
  MergeContactsResponse,
  UpdateContactPayload,
} from '@/types/contact.types';
import { toQueryString } from '@/utils/query';

const BASE = '/contacts';

export const contactsApi = {
  list(params?: ContactQueryParams): Promise<ContactListResponse> {
    return apiClient.get<ContactListResponse>(`${BASE}${toQueryString(params)}`);
  },

  getById(id: string): Promise<Contact> {
    return apiClient.get<Contact>(`${BASE}/${id}`);
  },

  create(payload: CreateContactPayload): Promise<Contact> {
    return apiClient.post<Contact>(BASE, payload);
  },

  update(id: string, payload: UpdateContactPayload): Promise<Contact> {
    return apiClient.patch<Contact>(`${BASE}/${id}`, payload);
  },

  delete(id: string): Promise<ApiMessageResponse> {
    return apiClient.delete<ApiMessageResponse>(`${BASE}/${id}`);
  },

  merge(payload: MergeContactsPayload): Promise<MergeContactsResponse> {
    return apiClient.post<MergeContactsResponse>(`${BASE}/merge`, payload);
  },

  importContacts(payload: ImportContactsPayload): Promise<ImportContactsResult> {
    return apiClient.post<ImportContactsResult>(`${BASE}/import`, payload);
  },

  async exportContacts(): Promise<void> {
    const response = await apiClient.download(`${BASE}/export`);
    await downloadFromResponse(response, { filename: 'contacts.csv', mimeType: 'text/csv' });
  },
};
