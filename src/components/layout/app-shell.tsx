'use client';

import { memo, type ReactNode } from 'react';
import { AppHeader } from '@/components/layout/header';
import { MainContent } from '@/components/layout/main-content';
import { MobileSidebar, Sidebar } from '@/components/layout/sidebar';
import { useShellNavigation } from '@/features/shell/hooks/use-shell-navigation';
import type { ShellVariant } from '@/types/navigation.types';

interface AppShellProps {
  variant: ShellVariant;
  orgSlug?: string;
  children: ReactNode;
}

function AppShellComponent({ variant, orgSlug, children }: AppShellProps) {
  const navigation = useShellNavigation(variant, orgSlug);

  return (
    <div className="flex min-h-svh w-full bg-background">
      <Sidebar variant={variant} navigation={navigation} />
      <MobileSidebar variant={variant} navigation={navigation} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader variant={variant} orgSlug={orgSlug} />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}

export const AppShell = memo(AppShellComponent);
