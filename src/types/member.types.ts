import type { OrganizationMemberRole } from './organization.types';

export interface OrganizationMemberUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationMemberRole;
  joinedAt: string;
  user: OrganizationMemberUser;
}

export interface OrganizationMemberListResponse {
  items: OrganizationMember[];
  total: number;
}

export interface AddOrganizationMemberPayload {
  userId: string;
  role?: OrganizationMemberRole;
}

export interface UpdateOrganizationMemberPayload {
  role: OrganizationMemberRole;
}
