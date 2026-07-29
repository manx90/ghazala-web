'use client';

import { EyeIcon, MoreHorizontalIcon, ShieldOffIcon, ShieldCheckIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/status-badge';
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

export function UserTable({
  users,
  selectedIds = [],
  onSelectionChange,
  onEnable,
  onDisable,
  onDelete,
}: UserTableProps) {
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
                aria-label="تحديد الكل"
              />
            </TableHead>
          )}
          <TableHead>الاسم</TableHead>
          <TableHead>البريد</TableHead>
          <TableHead>الدور</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>آخر دخول</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;

          return (
            <TableRow key={user.id}>
              {onSelectionChange && (
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(user.id)}
                    onCheckedChange={(checked) => toggleSelection(user.id, checked === true)}
                    aria-label={`تحديد ${getFullName(user)}`}
                    disabled={isSuperAdmin}
                  />
                </TableCell>
              )}
              <TableCell className="font-medium">{getFullName(user)}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <StatusBadge status={user.role} />
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '—'}
              </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="sm" aria-label="إجراءات">
                      <MoreHorizontalIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem render={<Link href={ROUTES.admin.user(user.id)} />}>
                    <EyeIcon data-icon="inline-start" />
                    التفاصيل
                  </DropdownMenuItem>
                    {!isSuperAdmin && user.status !== UserStatus.ACTIVE && onEnable && (
                      <DropdownMenuItem onClick={() => onEnable(user)}>
                        <ShieldCheckIcon />
                        تفعيل
                      </DropdownMenuItem>
                    )}
                    {!isSuperAdmin && user.status !== UserStatus.DISABLED && onDisable && (
                      <DropdownMenuItem onClick={() => onDisable(user)}>
                        <ShieldOffIcon />
                        تعطيل
                      </DropdownMenuItem>
                    )}
                    {!isSuperAdmin && onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => onDelete(user)}>
                          <Trash2Icon />
                          حذف
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
