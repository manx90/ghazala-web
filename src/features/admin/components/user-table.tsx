'use client';

import { useTranslations } from 'next-intl';
import { EyeIcon, MoreHorizontalIcon, ShieldOffIcon, ShieldCheckIcon, Trash2Icon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { StatusBadge } from '@/components/shared/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/config/routes';
import { UserRole, UserStatus } from '@/types/auth.types';
import type { User } from '@/types/auth.types';
import { formatDateTime } from '@/utils/date';

interface UserTableProps {
  users: User[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onEnable?: (user: User) => void;
  onDisable?: (user: User) => void;
  onDelete?: (user: User) => void;
}

function getFullName(user: User): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
}

function getInitials(user: User): string {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  if (parts.length === 0) return user.email.charAt(0).toUpperCase();
  return parts.map((p) => p.trim().charAt(0)).join('').toUpperCase();
}

export function UserTable({
  users,
  selectedIds = [],
  onSelectionChange,
  onEnable,
  onDisable,
  onDelete,
}: UserTableProps) {
  const t = useTranslations('admin.users');
  const tCommon = useTranslations('admin.common');

  const toggleSelection = (id: string, checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? [...selectedIds, id] : selectedIds.filter((x) => x !== id));
  };

  const toggleAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? users.map((u) => u.id) : []);
  };

  const allSelected = users.length > 0 && selectedIds.length === users.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {onSelectionChange && (
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => toggleAll(checked === true)}
                aria-label={tCommon('selectAll')}
              />
            </TableHead>
          )}
          <TableHead>{t('columns.name')}</TableHead>
          <TableHead>{t('columns.email')}</TableHead>
          <TableHead>{t('columns.role')}</TableHead>
          <TableHead>{t('columns.status')}</TableHead>
          <TableHead>{t('columns.lastLogin')}</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
          const fullName = getFullName(user);

          return (
            <TableRow key={user.id}>
              {onSelectionChange && (
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(user.id)}
                    onCheckedChange={(checked) => toggleSelection(user.id, checked === true)}
                    aria-label={tCommon('selectRow', { name: fullName })}
                    disabled={isSuperAdmin}
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>{getInitials(user)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{fullName}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground" dir="ltr">
                {user.email}
              </TableCell>
              <TableCell>
                <StatusBadge status={user.role} />
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : tCommon('notAvailable')}
              </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="sm" aria-label={tCommon('actions')}>
                      <MoreHorizontalIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem render={<Link href={ROUTES.admin.user(user.id)} />}>
                    <EyeIcon data-icon="inline-start" />
                    {t('actions.details')}
                  </DropdownMenuItem>
                    {!isSuperAdmin && user.status !== UserStatus.ACTIVE && onEnable && (
                      <DropdownMenuItem onClick={() => onEnable(user)}>
                        <ShieldCheckIcon />
                        {t('actions.enable')}
                      </DropdownMenuItem>
                    )}
                    {!isSuperAdmin && user.status !== UserStatus.DISABLED && onDisable && (
                      <DropdownMenuItem onClick={() => onDisable(user)}>
                        <ShieldOffIcon />
                        {t('actions.disable')}
                      </DropdownMenuItem>
                    )}
                    {!isSuperAdmin && onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => onDelete(user)}>
                          <Trash2Icon />
                          {t('actions.delete')}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
