'use client';

import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ChevronDownIcon } from 'lucide-react';
import { memo, useState } from 'react';
import { SidebarNavItem } from '@/components/layout/sidebar/sidebar-nav-item';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { NavGroup, NavItem } from '@/types/navigation.types';
import { cn } from '@/lib/utils';

interface SidebarNavGroupProps {
  group: NavGroup;
  collapsed: boolean;
  onNavigate?: () => void;
}

function hasActiveChild(pathname: string, items: NavItem[]): boolean {
  return items.some((item) => {
    const active =
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`) ||
      (item.children?.some(
        (child) => pathname === child.href || pathname.startsWith(`${child.href}/`),
      ) ??
        false);
    return active;
  });
}

function SidebarNavGroupComponent({ group, collapsed, onNavigate }: SidebarNavGroupProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    group.items.forEach((item) => {
      if (item.children?.length) {
        initial[item.id] = hasActiveChild(pathname, [item]);
      }
    });
    return initial;
  });

  return (
    <div className="flex flex-col gap-1">
      {group.label && !collapsed && (
        <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {group.label}
        </p>
      )}
      {group.items.map((item) => {
        if (item.children?.length) {
          const isOpen = openItems[item.id] ?? false;
          const Icon = item.icon;

          return (
            <Collapsible
              key={item.id}
              open={collapsed ? false : isOpen}
              onOpenChange={(open) =>
                setOpenItems((prev) => ({ ...prev, [item.id]: open }))
              }
            >
              <CollapsibleTrigger
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  collapsed && 'justify-center px-2',
                )}
                aria-label={item.label}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate text-start">{item.label}</span>
                    <ChevronDownIcon
                      className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
                      aria-hidden="true"
                    />
                  </>
                )}
              </CollapsibleTrigger>
              {!collapsed && (
                <CollapsibleContent className="mt-1 flex flex-col gap-1">
                  {item.children.map((child) => (
                    <SidebarNavItem
                      key={child.id}
                      item={child}
                      collapsed={collapsed}
                      depth={1}
                      onNavigate={onNavigate}
                    />
                  ))}
                </CollapsibleContent>
              )}
            </Collapsible>
          );
        }

        return (
          <SidebarNavItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        );
      })}
    </div>
  );
}

export const SidebarNavGroup = memo(SidebarNavGroupComponent);

interface SidebarNavProps {
  groups: NavGroup[];
  collapsed: boolean;
  onNavigate?: () => void;
}

function SidebarNavComponent({ groups, collapsed, onNavigate }: SidebarNavProps) {
  const t = useTranslations('nav');

  return (
    <nav aria-label={t('mainNav')} className="flex flex-col gap-4">
      {groups.map((group) => (
        <SidebarNavGroup
          key={group.id}
          group={group}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

export const SidebarNav = memo(SidebarNavComponent);
