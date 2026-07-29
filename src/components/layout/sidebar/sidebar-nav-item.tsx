'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import type { NavItem } from '@/types/navigation.types';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
  onNavigate?: () => void;
}

function isActiveRoute(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNavItemComponent({
  item,
  collapsed,
  depth = 0,
  onNavigate,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const active = isActiveRoute(pathname, item.href, item.exact);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed && depth === 0 ? item.label : undefined}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed && depth === 0 ? item.label : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active && 'bg-sidebar-accent text-sidebar-accent-foreground',
        depth > 0 && 'mr-4',
        collapsed && depth === 0 && 'justify-center px-2',
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <Badge variant={item.badge.variant ?? 'secondary'} className="ms-auto">
              {item.badge.value}
            </Badge>
          )}
        </>
      )}
      {collapsed && item.badge && (
        <span className="sr-only">{item.badge.value} غير مقروء</span>
      )}
    </Link>
  );
}

export const SidebarNavItem = memo(SidebarNavItemComponent);
