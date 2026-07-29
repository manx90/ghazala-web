import { apiClient } from '@/services/api/client';
import type { ApiMessageResponse } from '@/types/api.types';
import type {
  AddOrganizationMemberPayload,
  OrganizationMember,
  OrganizationMemberListResponse,
  UpdateOrganizationMemberPayload,
} from '@/types/member.types';
import type { UpdateOrganizationSettingsPayload } from '@/types/organization.types';
import type { Organization } from '@/types/organization.types';

const BASE = '/organizations/current';

export const settingsApi = {
  getOrganization(): Promise<Organization> {
    return apiClient.get<Organization>('/organizations/current');
  },

  updateOrganizationSettings(payload: UpdateOrganizationSettingsPayload): Promise<Organization> {
    return apiClient.patch<Organization>(`${BASE}/settings`, payload);
  },

  listMembers(): Promise<OrganizationMemberListResponse> {
    return apiClient.get<OrganizationMemberListResponse>(`${BASE}/members`);
  },

  addMember(payload: AddOrganizationMemberPayload): Promise<OrganizationMember> {
    return apiClient.post<OrganizationMember>(`${BASE}/members`, payload);
  },

  updateMember(id: string, payload: UpdateOrganizationMemberPayload): Promise<OrganizationMember> {
    return apiClient.patch<OrganizationMember>(`${BASE}/members/${id}`, payload);
  },

  removeMember(id: string): Promise<ApiMessageResponse> {
    return apiClient.delete<ApiMessageResponse>(`${BASE}/members/${id}`);
  },

  leaveOrganization(): Promise<ApiMessageResponse> {
    return apiClient.post<ApiMessageResponse>(`${BASE}/leave`);
  },
};
