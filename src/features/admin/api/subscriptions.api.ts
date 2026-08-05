import { apiClient } from '@/services/api/client';
import type {
  AdminSubscriptionDetail,
  AdminSubscriptionListParams,
  AdminSubscriptionListResponse,
  AdminSubscriptionStats,
  AdminSubscription,
  ExtendSubscriptionPayload,
} from '@/types/admin.types';
import { toQueryString } from '@/utils/query';

const ADMIN_OPTS = { skipOrgHeader: true } as const;

export const adminSubscriptionsApi = {
  getStats(): Promise<AdminSubscriptionStats> {
    return apiClient.get<AdminSubscriptionStats>('/admin/subscriptions/stats', undefined, ADMIN_OPTS);
  },

  list(params?: AdminSubscriptionListParams): Promise<AdminSubscriptionListResponse> {
    return apiClient.get<AdminSubscriptionListResponse>(
      `/admin/subscriptions${toQueryString(params)}`,
      undefined,
      ADMIN_OPTS,
    );
  },

  getById(id: string): Promise<AdminSubscriptionDetail> {
    return apiClient.get<AdminSubscriptionDetail>(`/admin/subscriptions/${id}`, undefined, ADMIN_OPTS);
  },

  activate(id: string): Promise<AdminSubscription> {
    return apiClient.patch<AdminSubscription>(
      `/admin/subscriptions/${id}/activate`,
      undefined,
      undefined,
      ADMIN_OPTS,
    );
  },

  extend(id: string, payload: ExtendSubscriptionPayload): Promise<AdminSubscription> {
    return apiClient.patch<AdminSubscription>(
      `/admin/subscriptions/${id}/extend`,
      payload,
      undefined,
      ADMIN_OPTS,
    );
  },
};
