'use client';

import { BellIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/features/shell/hooks/use-notifications';
import { cn } from '@/lib/utils';

function NotificationButtonComponent() {
  const { isAvailable, unreadCount, items, markAllAsRead } = useNotifications();
  const t = useTranslations('nav.notifications');

  const ariaLabel =
    unreadCount > 0 ? t('ariaLabelUnread', { count: unreadCount }) : t('ariaLabel');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={ariaLabel}
          />
        }
      >
        <span className="relative">
          <BellIcon />
          {unreadCount > 0 && (
            <span
              className={cn(
                'absolute -top-1 -left-1 flex size-4 items-center justify-center rounded-full',
                'bg-destructive text-[10px] font-medium text-white ring-2 ring-background',
              )}
              aria-hidden="true"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>{t('title')}</span>
            {isAvailable && unreadCount > 0 && (
              <button
                type="button"
                className="text-xs font-normal text-primary hover:underline"
                onClick={markAllAsRead}
              >
                {t('markAllRead')}
              </button>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {!isAvailable && (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            {t('apiUnavailable')}
          </div>
        )}
        {isAvailable && items.length === 0 && (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            {t('empty')}
          </div>
        )}
        {isAvailable &&
          items.map((item) => (
            <DropdownMenuItem key={item.id} className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.body}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const NotificationButton = memo(NotificationButtonComponent);
