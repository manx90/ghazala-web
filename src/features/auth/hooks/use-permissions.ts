'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useOrganizationStore } from '@/store/organization.store';
import type { Permission } from '@/utils/permission';
import {
  canSendMessages as checkCanSendMessages,
  getOrganizationPermissions,
  getPlatformPermissions,
  hasOrganizationPermission,
  hasPlatformPermission,
  isSuperAdmin,
} from '@/utils/permission';

export function usePermissions() {
  const user = useAuthStore((state) => state.user);
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization);

  return useMemo(() => {
    const platformRole = user?.role ?? null;
    const orgRole = currentOrganization?.role ?? null;

    const platformPermissions = platformRole ? getPlatformPermissions(platformRole) : [];
    const organizationPermissions = getOrganizationPermissions(orgRole);

    const can = (permission: Permission): boolean => {
      if (platformRole && hasPlatformPermission(platformRole, permission)) {
        return true;
      }

      return hasOrganizationPermission(orgRole, permission);
    };

    return {
      user,
      platformRole,
      orgRole,
      platformPermissions,
      organizationPermissions,
      isSuperAdmin: isSuperAdmin(platformRole),
      canSendMessages: checkCanSendMessages(orgRole),
      can,
    };
  }, [user, currentOrganization?.role]);
}
