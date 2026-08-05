'use client';

import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, PanelLeftIcon } from 'lucide-react';
import { memo } from 'react';
import { SidebarNav } from '@/components/layout/sidebar/sidebar-nav';
import { Button, buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';
import type { NavGroup, ShellVariant } from '@/types/navigation.types';
import { useUiStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';

interface SidebarProps {
  variant: ShellVariant;
  navigation: NavGroup[];
  className?: string;
}

function SidebarComponent({ variant, navigation, className }: SidebarProps) {
  const isCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  const portalLabel = variant === 'admin' ? 'لوحة الإدارة' : 'بوابة العملاء';

  return (
    <aside
      className={cn(
        'hidden h-svh flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-out lg:flex',
        isCollapsed ? 'w-16' : 'w-64',
        className,
      )}
      aria-label={portalLabel}
    >
      <div
        className={cn(
          'flex h-14 shrink-0 items-center border-b border-sidebar-border px-3',
          isCollapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!isCollapsed && (
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2.5 truncate rounded-md px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-sm font-bold text-white shadow-sm">
              {env.NEXT_PUBLIC_APP_NAME.trim().charAt(0)}
            </span>
            <span className="flex flex-col gap-0.5 truncate">
              <span className="text-sm font-semibold tracking-tight">{env.NEXT_PUBLIC_APP_NAME}</span>
              <span className="text-xs text-muted-foreground">{portalLabel}</span>
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'توسيع الشريط الجانبي' : 'طي الشريط الجانبي'}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <SidebarNav groups={navigation} collapsed={isCollapsed} />
      </ScrollArea>

      {!isCollapsed && variant === 'admin' && (
        <>
          <Separator />
          <div className="p-3">
            <Link
              href={ROUTES.app.root}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'w-full',
              )}
            >
              <PanelLeftIcon data-icon="inline-start" />
              بوابة العملاء
            </Link>
          </div>
        </>
      )}
    </aside>
  );
}

export const Sidebar = memo(SidebarComponent);
