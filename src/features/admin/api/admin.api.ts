import { apiClient } from '@/services/api/client';
import type {
  AdminDashboardResponse,
  AdminMessageResponse,
  AdminOrganizationListResponse,
  AdminPaginationParams,
  AdminUserListResponse,
} from '@/types/admin.types';
import type { Organization } from '@/types/organization.types';
import type { User } from '@/types/auth.types';
import { toQueryString } from '@/utils/query';

const ADMIN_OPTS = { skipOrgHeader: true } as const;

export const adminApi = {
  getDashboard(): Promise<AdminDashboardResponse> {
    return apiClient.get<AdminDashboardResponse>('/admin/dashboard', undefined, ADMIN_OPTS);
  },

  listOrganizations(params?: AdminPaginationParams): Promise<AdminOrganizationListResponse> {
    return apiClient.get<AdminOrganizationListResponse>(
      `/admin/organizations${toQueryString(params)}`,
      undefined,
      ADMIN_OPTS,
    );
  },

  getOrganization(id: string): Promise<Organization> {
    return apiClient.get<Organization>(`/admin/organizations/${id}`, undefined, ADMIN_OPTS);
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

  listUsers(params?: AdminPaginationParams): Promise<AdminUserListResponse> {
    return apiClient.get<AdminUserListResponse>(
      `/admin/users${toQueryString(params)}`,
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
