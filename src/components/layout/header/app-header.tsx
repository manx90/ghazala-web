'use client';

import { MenuIcon } from 'lucide-react';
import { memo } from 'react';
import { BreadcrumbsNav } from '@/components/layout/header/breadcrumbs-nav';
import { GlobalSearch } from '@/components/layout/header/global-search';
import { NotificationButton } from '@/components/layout/header/notification-button';
import { OrganizationSwitcher } from '@/components/layout/header/organization-switcher';
import { QuickActions } from '@/components/layout/header/quick-actions';
import { ThemeSwitcher } from '@/components/layout/header/theme-switcher';
import { UserMenu } from '@/components/layout/header/user-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { ShellVariant } from '@/types/navigation.types';
import { useUiStore } from '@/store/ui.store';

interface AppHeaderProps {
  variant: ShellVariant;
  orgSlug?: string;
}

function AppHeaderComponent({ variant, orgSlug }: AppHeaderProps) {
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen);

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="فتح القائمة"
      >
        <MenuIcon />
      </Button>

      <div className="hidden min-w-0 flex-1 md:block">
        <BreadcrumbsNav />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
        <GlobalSearch />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <QuickActions variant={variant} orgSlug={orgSlug} />
        {variant === 'client' && <OrganizationSwitcher />}
        <NotificationButton />
        <ThemeSwitcher />
        <UserMenu variant={variant} orgSlug={orgSlug} />
      </div>
    </header>
  );
}

export const AppHeader = memo(AppHeaderComponent);
