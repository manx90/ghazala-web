'use client';

import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('nav');
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
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
        'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active && 'bg-sidebar-accent text-sidebar-accent-foreground shadow-2xs',
        depth > 0 && 'mr-4',
        collapsed && depth === 0 && 'justify-center px-2',
      )}
    >
      {active && depth === 0 && (
        <span
          aria-hidden="true"
          className="animate-scale-in absolute start-0.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-gradient-brand"
        />
      )}
      <Icon
        className={cn(
          'size-4 shrink-0 transition-colors duration-200',
          active && 'text-sidebar-primary',
        )}
        aria-hidden="true"
      />
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
        <span className="sr-only">{t('sidebar.unreadBadge', { count: item.badge.value })}</span>
      )}
    </Link>
  );
}

export const SidebarNavItem = memo(SidebarNavItemComponent);
