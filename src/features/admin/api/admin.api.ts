import { apiClient } from '@/services/api/client';
import type {
  AdminDashboardResponse,
  AdminMessageResponse,
  AdminActivityTimeline,
  AdminHealthComponent,
  AdminMessageStats,
  AdminMessageStatsPeriod,
  AdminOrganizationListParams,
  AdminOrganizationListResponse,
  AdminOrganizationPhoneNumberListResponse,
  AdminOrganizationSubscriptionResponse,
  AdminOrganizationUsageResponse,
  AdminPhoneNumberStats,
  AdminQueueStatus,
  AdminRevenueStats,
  AdminStorageHealth,
  AdminSubscriptionSummary,
  AdminWabaStats,
  AdminWorkersStatus,
  BulkAdminOrganizationPayload,
  UpdateAdminOrganizationPayload,
  AdminUserListParams,
  AdminUserListResponse,
  AdminUserOrganizationsResponse,
} from '@/types/admin.types';
import type { OrganizationMemberListResponse } from '@/types/member.types';
import type { Organization } from '@/types/organization.types';
import type { User } from '@/types/auth.types';
import { toQueryString } from '@/utils/query';

const ADMIN_OPTS = { skipOrgHeader: true } as const;

export const adminApi = {
  getDashboard(): Promise<AdminDashboardResponse> {
    return apiClient.get<AdminDashboardResponse>('/admin/dashboard', undefined, ADMIN_OPTS);
  },

  getWabaStats(): Promise<AdminWabaStats> {
    return apiClient.get<AdminWabaStats>('/admin/stats/waba', undefined, ADMIN_OPTS);
  },

  getPhoneNumberStats(): Promise<AdminPhoneNumberStats> {
    return apiClient.get<AdminPhoneNumberStats>('/admin/stats/phone-numbers', undefined, ADMIN_OPTS);
  },

  getMessageStats(period: AdminMessageStatsPeriod = 'month'): Promise<AdminMessageStats> {
    return apiClient.get<AdminMessageStats>(
      `/admin/stats/messages${toQueryString({ period })}`,
      undefined,
      ADMIN_OPTS,
    );
  },

  getRevenueStats(): Promise<AdminRevenueStats> {
    return apiClient.get<AdminRevenueStats>('/admin/stats/revenue', undefined, ADMIN_OPTS);
  },

  getSubscriptionSummary(): Promise<AdminSubscriptionSummary> {
    return apiClient.get<AdminSubscriptionSummary>(
      '/admin/subscriptions/summary',
      undefined,
      ADMIN_OPTS,
    );
  },

  getQueueStatus(): Promise<AdminQueueStatus> {
    return apiClient.get<AdminQueueStatus>('/admin/queue/status', undefined, ADMIN_OPTS);
  },

  getWorkersStatus(): Promise<AdminWorkersStatus> {
    return apiClient.get<AdminWorkersStatus>('/admin/workers/status', undefined, ADMIN_OPTS);
  },

  getActivityTimeline(): Promise<AdminActivityTimeline> {
    return apiClient.get<AdminActivityTimeline>('/admin/activity/timeline', undefined, ADMIN_OPTS);
  },

  getDatabaseHealth(): Promise<AdminHealthComponent> {
    return apiClient.get<AdminHealthComponent>('/admin/health/database', undefined, ADMIN_OPTS);
  },

  getRedisHealth(): Promise<AdminHealthComponent> {
    return apiClient.get<AdminHealthComponent>('/admin/health/redis', undefined, ADMIN_OPTS);
  },

  getStorageHealth(): Promise<AdminStorageHealth> {
    return apiClient.get<AdminStorageHealth>('/admin/health/storage', undefined, ADMIN_OPTS);
  },

  listOrganizations(params?: AdminOrganizationListParams): Promise<AdminOrganizationListResponse> {
    return apiClient.get<AdminOrganizationListResponse>(
      `/admin/organizations${toQueryString(params)}`,
      undefined,
      ADMIN_OPTS,
    );
  },

  getOrganization(id: string): Promise<Organization> {
    return apiClient.get<Organization>(`/admin/organizations/${id}`, undefined, ADMIN_OPTS);
  },

  updateOrganization(id: string, payload: UpdateAdminOrganizationPayload): Promise<Organization> {
    return apiClient.patch<Organization>(
      `/admin/organizations/${id}`,
      payload,
      undefined,
      ADMIN_OPTS,
    );
  },

  getOrganizationUsage(id: string): Promise<AdminOrganizationUsageResponse> {
    return apiClient.get<AdminOrganizationUsageResponse>(
      `/admin/organizations/${id}/usage`,
      undefined,
      ADMIN_OPTS,
    );
  },

  getOrganizationSubscription(id: string): Promise<AdminOrganizationSubscriptionResponse> {
    return apiClient.get<AdminOrganizationSubscriptionResponse>(
      `/admin/organizations/${id}/subscription`,
      undefined,
      ADMIN_OPTS,
    );
  },

  getOrganizationMembers(id: string): Promise<OrganizationMemberListResponse> {
    return apiClient.get<OrganizationMemberListResponse>(
      `/admin/organizations/${id}/members`,
      undefined,
      ADMIN_OPTS,
    );
  },

  getOrganizationPhoneNumbers(id: string): Promise<AdminOrganizationPhoneNumberListResponse> {
    return apiClient.get<AdminOrganizationPhoneNumberListResponse>(
      `/admin/organizations/${id}/phone-numbers`,
      undefined,
      ADMIN_OPTS,
    );
  },

  bulkOrganizations(payload: BulkAdminOrganizationPayload): Promise<AdminMessageResponse> {
    return apiClient.post<AdminMessageResponse>(
      '/admin/organizations/bulk',
      payload,
      undefined,
      ADMIN_OPTS,
    );
  },

  activateOrganization(id: string): Promise<Organization> {
    return apiClient.patch<Organization>(
      `/admin/organizations/${id}/activate`,
      undefined,
      undefined,
      ADMIN_OPTS,
    );
  },

  suspendOrganization(id: string): Promise<Organization> {
    return apiClient.patch<Organization>(
      `/admin/organizations/${id}/suspend`,
      undefined,
      undefined,
      ADMIN_OPTS,
    );
  },

  deleteOrganization(id: string): Promise<AdminMessageResponse> {
    return apiClient.delete<AdminMessageResponse>(
      `/admin/organizations/${id}`,
      undefined,
      ADMIN_OPTS,
    );
  },

  listUsers(params?: AdminUserListParams): Promise<AdminUserListResponse> {
    return apiClient.get<AdminUserListResponse>(
      `/admin/users${toQueryString(params)}`,
      undefined,
      ADMIN_OPTS,
    );
  },

  getUserOrganizations(id: string): Promise<AdminUserOrganizationsResponse> {
    return apiClient.get<AdminUserOrganizationsResponse>(
      `/admin/users/${id}/organizations`,
      undefined,
      ADMIN_OPTS,
    );
  },

  sendUserVerification(id: string): Promise<AdminMessageResponse> {
    return apiClient.post<AdminMessageResponse>(
      `/admin/users/${id}/send-verification`,
      undefined,
      undefined,
      ADMIN_OPTS,
    );
  },

  getUser(id: string): Promise<User> {
    return apiClient.get<User>(`/admin/users/${id}`, undefined, ADMIN_OPTS);
  },

  enableUser(id: string): Promise<User> {
    return apiClient.patch<User>(`/admin/users/${id}/enable`, undefined, undefined, ADMIN_OPTS);
  },

  disableUser(id: string): Promise<User> {
    return apiClient.patch<User>(`/admin/users/${id}/disable`, undefined, undefined, ADMIN_OPTS);
  },

  deleteUser(id: string): Promise<AdminMessageResponse> {
    return apiClient.delete<AdminMessageResponse>(`/admin/users/${id}`, undefined, ADMIN_OPTS);
  },
};
