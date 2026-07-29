'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SETTINGS_NAV_ITEMS } from '@/features/settings/constants/settings-nav';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { cn } from '@/lib/utils';

interface SettingsSidebarProps {
  orgSlug: string;
}

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SettingsSidebar({ orgSlug }: SettingsSidebarProps) {
  const pathname = usePathname();
  const { can } = usePermissions();

  const items = SETTINGS_NAV_ITEMS.filter(
    (item) => !item.permission || can(item.permission),
  );

  return (
    <nav aria-label="إعدادات" className="flex flex-col gap-1">
      {items.map((item) => {
        const href = item.href(orgSlug);
        const active = isActiveRoute(pathname, href);
        const Icon = item.icon;

        return (
          <Link
            key={item.id}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              'hover:bg-muted hover:text-foreground',
              active && 'bg-muted text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
