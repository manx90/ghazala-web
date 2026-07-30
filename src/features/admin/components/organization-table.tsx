'use client';

import { EyeIcon, MoreHorizontalIcon, PauseIcon, PlayIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
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
import { OrganizationStatus } from '@/types/organization.types';
import type { Organization } from '@/types/organization.types';
import { formatDateTime } from '@/utils/date';

interface OrganizationTableProps {
  organizations: Organization[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onActivate?: (org: Organization) => void;
  onSuspend?: (org: Organization) => void;
  onDelete?: (org: Organization) => void;
}

export function OrganizationTable({
  organizations,
  selectedIds = [],
  onSelectionChange,
  onActivate,
  onSuspend,
  onDelete,
}: OrganizationTableProps) {
  const toggleSelection = (id: string, checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? [...selectedIds, id] : selectedIds.filter((x) => x !== id));
  };

  const toggleAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? organizations.map((o) => o.id) : []);
  };

  const allSelected = organizations.length > 0 && selectedIds.length === organizations.length;

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
          <TableHead>المعرّف</TableHead>
          <TableHead>البلد</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>تاريخ الإنشاء</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((org) => (
          <TableRow key={org.id}>
            {onSelectionChange && (
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(org.id)}
                  onCheckedChange={(checked) => toggleSelection(org.id, checked === true)}
                  aria-label={`تحديد ${org.name}`}
                />
              </TableCell>
            )}
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback>{org.name.trim().charAt(0) || '—'}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{org.name}</span>
              </div>
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground" dir="ltr">{org.slug}</TableCell>
            <TableCell>{org.country}</TableCell>
            <TableCell>
              <StatusBadge status={org.status} />
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">{formatDateTime(org.createdAt)}</TableCell>
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
                  <DropdownMenuItem render={<Link href={ROUTES.admin.organization(org.id)} />}>
                    <EyeIcon data-icon="inline-start" />
                    التفاصيل
                  </DropdownMenuItem>
                  {org.status !== OrganizationStatus.ACTIVE && onActivate && (
                    <DropdownMenuItem onClick={() => onActivate(org)}>
                      <PlayIcon />
                      تفعيل
                    </DropdownMenuItem>
                  )}
                  {org.status !== OrganizationStatus.SUSPENDED && onSuspend && (
                    <DropdownMenuItem onClick={() => onSuspend(org)}>
                      <PauseIcon />
                      تعليق
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => onDelete(org)}>
                        <Trash2Icon />
                        حذف
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
