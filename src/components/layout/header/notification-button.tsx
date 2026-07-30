'use client';

import { BellIcon } from 'lucide-react';
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
  const { isAvailable, unreadCount, items, message, markAllAsRead } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`الإشعارات${unreadCount > 0 ? `، ${unreadCount} غير مقروء` : ''}`}
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
            <span>الإشعارات</span>
            {isAvailable && unreadCount > 0 && (
              <button
                type="button"
                className="text-xs font-normal text-primary hover:underline"
                onClick={markAllAsRead}
              >
                تحديد الكل كمقروء
              </button>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {!isAvailable && (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">{message}</div>
        )}
        {isAvailable && items.length === 0 && (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            لا توجد إشعارات
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
