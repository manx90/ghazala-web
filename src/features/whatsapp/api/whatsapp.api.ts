import { apiClient } from '@/services/api/client';
import type { ApiMessageResponse } from '@/types/api.types';
import type {
  PhoneNumber,
  PhoneNumberListResponse,
  WhatsappBusinessAccount,
  WhatsappBusinessAccountListResponse,
  WhatsappSyncResult,
} from '@/types/whatsapp.types';

export const whatsappApi = {
  listBusinessAccounts(): Promise<WhatsappBusinessAccountListResponse> {
    return apiClient.get<WhatsappBusinessAccountListResponse>('/whatsapp/business-accounts');
  },

  syncBusinessAccounts(): Promise<WhatsappSyncResult> {
    return apiClient.post<WhatsappSyncResult>('/whatsapp/business-accounts/sync');
  },

  getBusinessAccount(id: string): Promise<WhatsappBusinessAccount> {
    return apiClient.get<WhatsappBusinessAccount>(`/whatsapp/business-accounts/${id}`);
  },

  listPhoneNumbers(): Promise<PhoneNumberListResponse> {
    return apiClient.get<PhoneNumberListResponse>('/whatsapp/phone-numbers');
  },

  syncPhoneNumbers(): Promise<WhatsappSyncResult> {
    return apiClient.post<WhatsappSyncResult>('/whatsapp/phone-numbers/sync');
  },

  getPhoneNumber(id: string): Promise<PhoneNumber> {
    return apiClient.get<PhoneNumber>(`/whatsapp/phone-numbers/${id}`);
  },

  disconnectPhoneNumber(id: string): Promise<ApiMessageResponse> {
    return apiClient.post<ApiMessageResponse>(`/whatsapp/phone-numbers/${id}/disconnect`);
  },
};
