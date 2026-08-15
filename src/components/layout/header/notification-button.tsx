'use client';

import { BellIcon, CheckCheckIcon } from 'lucide-react';
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
import { useMarkAllNotificationsAsRead, useNotifications } from '@/features/shell/hooks/use-notifications-api';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useLocale } from 'next-intl';

function NotificationButtonComponent() {
  const { data, isLoading } = useNotifications();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const t = useTranslations('nav.notifications');
  const locale = useLocale();

  const unreadCount = data?.unreadCount ?? 0;
  const items = data?.items ?? [];
  const ariaLabel =
    unreadCount > 0 ? t('ariaLabelUnread', { count: unreadCount }) : t('ariaLabel');

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: locale === 'ar' ? ar : enUS,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={ariaLabel}
            disabled={isLoading}
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
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>{t('title')}</span>
            {unreadCount > 0 && (
              <button
                type="button"
                className="flex items-center gap-1 text-xs font-normal text-primary hover:underline"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
              >
                <CheckCheckIcon className="size-3" />
                {t('markAllRead')}
              </button>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {isLoading && (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            {t('loading')}
          </div>
        )}
        {!isLoading && items.length === 0 && (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            {t('empty')}
          </div>
        )}
        {!isLoading &&
          items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className={cn(
                'flex flex-col items-start gap-1 py-3',
                !item.read && 'bg-muted/50',
              )}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground">{formatTime(item.createdAt)}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.message}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const NotificationButton = memo(NotificationButtonComponent);
