import type { OrganizationMemberRole } from './organization.types';

export type InviteStatus = 'pending' | 'accepted' | 'expired';

export interface OrganizationInvite {
  id: string;
  email: string;
  role: OrganizationMemberRole;
  status: InviteStatus;
  createdAt: string;
  expiresAt: string;
}

export interface OrganizationInviteListResponse {
  items: OrganizationInvite[];
  total: number;
}

export interface InviteMemberPayload {
  email: string;
  role: OrganizationMemberRole;
}

export interface InvitePublicInfo {
  organizationName: string;
  organizationSlug: string;
  email: string;
  role: OrganizationMemberRole;
  expiresAt: string;
  isValid: boolean;
}

export interface AcceptInvitePayload {
  token: string;
}

export interface AcceptInviteResponse {
  organizationSlug: string;
}
