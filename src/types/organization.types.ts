export enum OrganizationMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  timezone: string;
  country: string;
  status: OrganizationStatus;
  role?: OrganizationMemberRole;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationListResponse {
  items: Organization[];
  total: number;
}

export interface UpdateOrganizationSettingsPayload {
  name?: string;
  logo?: string;
  timezone?: string;
  country?: string;
}

export interface CreateOrganizationPayload {
  name: string;
  timezone?: string;
  country?: string;
}
