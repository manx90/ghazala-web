import { OrganizationMemberRole, UserRole } from '@/types';

export type Permission =
  | 'platform.admin'
  | 'org.read'
  | 'org.manage'
  | 'org.delete'
  | 'team.manage'
  | 'billing.manage'
  | 'meta.manage'
  | 'whatsapp.manage'
  | 'messages.send'
  | 'messages.read'
  | 'contacts.manage'
  | 'contacts.read'
  | 'templates.manage'
  | 'templates.read';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: ['platform.admin'],
  [UserRole.USER]: [],
};

const ORG_ROLE_PERMISSIONS: Record<OrganizationMemberRole, Permission[]> = {
  [OrganizationMemberRole.OWNER]: [
    'org.read',
    'org.manage',
    'org.delete',
    'team.manage',
    'billing.manage',
    'meta.manage',
    'whatsapp.manage',
    'messages.send',
    'messages.read',
    'contacts.manage',
    'contacts.read',
    'templates.manage',
    'templates.read',
  ],
  [OrganizationMemberRole.ADMIN]: [
    'org.read',
    'org.manage',
    'team.manage',
    'billing.manage',
    'meta.manage',
    'whatsapp.manage',
    'messages.send',
    'messages.read',
    'contacts.manage',
    'contacts.read',
    'templates.manage',
    'templates.read',
  ],
  [OrganizationMemberRole.MEMBER]: [
    'org.read',
    'messages.read',
    'contacts.read',
    'templates.read',
  ],
};

export function getPlatformPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function getOrganizationPermissions(
  role: OrganizationMemberRole | null | undefined,
): Permission[] {
  if (!role) return [];
  return ORG_ROLE_PERMISSIONS[role] ?? [];
}

export function hasPlatformPermission(role: UserRole, permission: Permission): boolean {
  return getPlatformPermissions(role).includes(permission);
}

export function hasOrganizationPermission(
  role: OrganizationMemberRole | null | undefined,
  permission: Permission,
): boolean {
  return getOrganizationPermissions(role).includes(permission);
}

export function isSuperAdmin(role: UserRole | null | undefined): boolean {
  return role === UserRole.SUPER_ADMIN;
}

export function canManageOrganization(role: OrganizationMemberRole | null | undefined): boolean {
  return hasOrganizationPermission(role, 'org.manage');
}

export function canSendMessages(role: OrganizationMemberRole | null | undefined): boolean {
  return hasOrganizationPermission(role, 'messages.send');
}
