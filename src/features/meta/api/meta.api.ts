import { apiClient } from '@/services/api/client';
import type { ApiMessageResponse } from '@/types/api.types';
import type {
  ConnectMetaPayload,
  MetaIntegration,
  MetaStatusResponse,
} from '@/types/meta.types';

const BASE = '/meta';

export const metaApi = {
  status(): Promise<MetaStatusResponse> {
    return apiClient.get<MetaStatusResponse>(`${BASE}/status`);
  },

  connect(payload: ConnectMetaPayload): Promise<MetaIntegration> {
    return apiClient.post<MetaIntegration>(`${BASE}/connect`, payload);
  },

  disconnect(): Promise<ApiMessageResponse> {
    return apiClient.post<ApiMessageResponse>(`${BASE}/disconnect`);
  },

  sync(): Promise<ApiMessageResponse> {
    return apiClient.post<ApiMessageResponse>(`${BASE}/sync`);
  },
};
