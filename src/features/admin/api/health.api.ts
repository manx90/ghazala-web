import { apiClient } from '@/services/api/client';
import type { HealthResponse } from '@/types/admin.types';

export const healthApi = {
  check(): Promise<HealthResponse> {
    return apiClient.get<HealthResponse>('/health', undefined, {
      skipAuth: true,
      skipOrgHeader: true,
    });
  },
};
