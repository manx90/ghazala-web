import type { Organization } from '@/types/organization.types';
import type { User } from '@/types/auth.types';
import type { PaginationParams } from '@/types/pagination.types';

export interface AdminUserStats {
  total: number;
  active: number;
  disabled: number;
}

export interface AdminOrganizationStats {
  total: number;
  active: number;
  suspended: number;
}

export interface AdminPlatformStats {
  totalApiRequests: number;
  totalMessages: number;
}

export interface AdminDashboardResponse {
  users: AdminUserStats;
  organizations: AdminOrganizationStats;
  platform: AdminPlatformStats;
  generatedAt: string;
}

export interface AdminPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type AdminOrganizationListResponse = AdminPaginatedResponse<Organization>;
export type AdminUserListResponse = AdminPaginatedResponse<User>;

export type AdminPaginationParams = PaginationParams;

export interface AdminMessageResponse {
  message: string;
}

export interface HealthResponse {
  status: 'ok';
}

export interface CreatePlanPayload {
  name: string;
  code: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency?: string;
  isActive?: boolean;
}

export interface UpdatePlanPayload {
  name?: string;
  description?: string | null;
  monthlyPrice?: number;
  yearlyPrice?: number;
  currency?: string;
  isActive?: boolean;
}
