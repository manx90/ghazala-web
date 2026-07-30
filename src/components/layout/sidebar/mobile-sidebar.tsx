'use client';

import Link from 'next/link';
import { memo } from 'react';
import { SidebarNav } from '@/components/layout/sidebar/sidebar-nav';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';
import type { NavGroup, ShellVariant } from '@/types/navigation.types';
import { useUiStore } from '@/store/ui.store';

interface MobileSidebarProps {
  variant: ShellVariant;
  navigation: NavGroup[];
}

function MobileSidebarComponent({ variant, navigation }: MobileSidebarProps) {
  const isOpen = useUiStore((state) => state.isMobileSidebarOpen);
  const setOpen = useUiStore((state) => state.setMobileSidebarOpen);

  const homeHref = variant === 'admin' ? ROUTES.admin.dashboard : ROUTES.app.root;
  const portalLabel = variant === 'admin' ? 'لوحة الإدارة' : 'بوابة العملاء';

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-72 p-0">
        <SheetHeader className="border-b px-4 py-4 text-start">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-sm font-bold text-white shadow-sm">
              {env.NEXT_PUBLIC_APP_NAME.trim().charAt(0)}
            </span>
            <div className="flex flex-col gap-0.5">
              <SheetTitle>{env.NEXT_PUBLIC_APP_NAME}</SheetTitle>
              <SheetDescription>{portalLabel}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1 px-3 py-4">
          <SidebarNav
            groups={navigation}
            collapsed={false}
            onNavigate={() => setOpen(false)}
          />
        </ScrollArea>
        {variant === 'admin' && (
          <div className="border-t p-4">
            <Link
              href={ROUTES.app.root}
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              العودة لبوابة العملاء
            </Link>
          </div>
        )}
        <Link href={homeHref} className="sr-only">
          {portalLabel}
        </Link>
      </SheetContent>
    </Sheet>
  );
}

export const MobileSidebar = memo(MobileSidebarComponent);
