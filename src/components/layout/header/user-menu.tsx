'use client';

import Link from 'next/link';
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/config/routes';
import { useLogout } from '@/features/auth/hooks/use-auth';
import { useSession } from '@/features/auth/hooks/use-session';
import type { ShellVariant } from '@/types/navigation.types';

interface UserMenuProps {
  variant: ShellVariant;
  orgSlug?: string;
}

function getUserInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

function UserMenuComponent({ variant, orgSlug }: UserMenuProps) {
  const router = useRouter();
  const { user, isSessionLoading } = useSession();
  const logout = useLogout();

  if (isSessionLoading || !user) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  const settingsHref =
    variant === 'admin'
      ? ROUTES.admin.dashboard
      : orgSlug
        ? ROUTES.app.settings.profile(orgSlug)
        : ROUTES.app.root;

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.replace(ROUTES.auth.login);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            aria-label="قائمة المستخدم"
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback>{getUserInitials(user.firstName, user.lastName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={settingsHref} />}>
          <UserIcon data-icon="inline-start" />
          الملف الشخصي
        </DropdownMenuItem>
        {variant === 'client' && orgSlug && (
          <DropdownMenuItem render={<Link href={ROUTES.app.settings.root(orgSlug)} />}>
            <SettingsIcon data-icon="inline-start" />
            الإعدادات
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={logout.isPending}
          onClick={() => void handleLogout()}
        >
          <LogOutIcon data-icon="inline-start" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const UserMenu = memo(UserMenuComponent);
