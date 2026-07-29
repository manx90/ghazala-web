import { apiClient, persistOrganizationContext } from '@/services/api/client';
import type {
  CreateOrganizationPayload,
  Organization,
  OrganizationListResponse,
  UpdateOrganizationSettingsPayload,
} from '@/types/organization.types';

const ORG_BASE = '/organizations';

export const organizationApi = {
  list(): Promise<OrganizationListResponse> {
    return apiClient.get<OrganizationListResponse>(ORG_BASE, undefined, {
      skipOrgHeader: true,
    });
  },

  current(): Promise<Organization> {
    return apiClient.get<Organization>(`${ORG_BASE}/current`);
  },

  getById(id: string): Promise<Organization> {
    return apiClient.get<Organization>(`${ORG_BASE}/${id}`, undefined, {
      skipOrgHeader: true,
    });
  },

  create(payload: CreateOrganizationPayload): Promise<Organization> {
    return apiClient.post<Organization>(ORG_BASE, payload, undefined, {
      skipOrgHeader: true,
    });
  },

  updateSettings(payload: UpdateOrganizationSettingsPayload): Promise<Organization> {
    return apiClient.patch<Organization>(`${ORG_BASE}/current/settings`, payload);
  },

  update(id: string, payload: UpdateOrganizationSettingsPayload): Promise<Organization> {
    return apiClient.patch<Organization>(`${ORG_BASE}/${id}`, payload, undefined, {
      skipOrgHeader: true,
    });
  },

  delete(id: string): Promise<void> {
    return apiClient.delete<void>(`${ORG_BASE}/${id}`, undefined, {
      skipOrgHeader: true,
    });
  },

  selectOrganization(organization: Organization): Organization {
    persistOrganizationContext(organization.id, organization.slug);
    return organization;
  },
};
