'use client';

import { useMemo } from 'react';
import { ADMIN_NAVIGATION, getClientNavigation } from '@/config/navigation';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { useConversationStats } from '@/features/shell/hooks/use-conversation-stats';
import type { NavGroup, NavItem, ShellVariant } from '@/types/navigation.types';
import type { Permission } from '@/utils/permission';

function filterNavItems(items: NavItem[], can: (permission: Permission) => boolean): NavItem[] {
  return items
    .filter((item) => !item.permission || can(item.permission))
    .map((item) => ({
      ...item,
      children: item.children ? filterNavItems(item.children, can) : undefined,
    }))
    .filter((item) => !item.children || item.children.length > 0);
}

function filterNavGroups(groups: NavGroup[], can: (permission: Permission) => boolean): NavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: filterNavItems(group.items, can),
    }))
    .filter((group) => group.items.length > 0);
}

function applyInboxBadge(groups: NavGroup[], openCount: number): NavGroup[] {
  if (openCount <= 0) return groups;

  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.id === 'inbox'
        ? { ...item, badge: { value: openCount > 99 ? '99+' : openCount, variant: 'default' as const } }
        : item,
    ),
  }));
}

export function useShellNavigation(variant: ShellVariant, orgSlug?: string) {
  const { can } = usePermissions();
  const { data: stats } = useConversationStats();

  const navigation = useMemo(() => {
    const base =
      variant === 'admin'
        ? ADMIN_NAVIGATION
        : orgSlug
          ? getClientNavigation(orgSlug)
          : [];

    const filtered = filterNavGroups(base, can);

    if (variant === 'client') {
      return applyInboxBadge(filtered, stats?.open ?? 0);
    }

    return filtered;
  }, [variant, orgSlug, can, stats?.open]);

  return navigation;
}
