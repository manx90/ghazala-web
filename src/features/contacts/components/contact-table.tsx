'use client';

import { EyeIcon, GitMergeIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { formatDateTime, formatRelativeTime } from '@/utils/date';
import type { Contact } from '@/types/contact.types';

interface ContactTableProps {
  contacts: Contact[];
  orgSlug: string;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onDelete?: (contact: Contact) => void;
  onMerge?: (contact: Contact) => void;
}

function getDisplayName(contact: Contact): string {
  return (
    contact.fullName ||
    [contact.firstName, contact.lastName].filter(Boolean).join(' ') ||
    contact.profileName ||
    contact.phone
  );
}

export function ContactTable({
  contacts,
  orgSlug,
  selectedIds = [],
  onSelectionChange,
  onDelete,
  onMerge,
}: ContactTableProps) {
  const toggleSelection = (contactId: string, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedIds, contactId]);
    } else {
      onSelectionChange(selectedIds.filter((id) => id !== contactId));
    }
  };

  const toggleAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? contacts.map((c) => c.id) : []);
  };

  const allSelected = contacts.length > 0 && selectedIds.length === contacts.length;

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
          <TableHead>الهاتف</TableHead>
          <TableHead>البريد</TableHead>
          <TableHead>آخر رسالة</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            {onSelectionChange && (
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(contact.id)}
                  onCheckedChange={(checked) => toggleSelection(contact.id, checked === true)}
                  aria-label={`تحديد ${getDisplayName(contact)}`}
                />
              </TableCell>
            )}
            <TableCell className="font-medium">{getDisplayName(contact)}</TableCell>
            <TableCell dir="ltr">{contact.phone}</TableCell>
            <TableCell dir="ltr">{contact.email ?? '—'}</TableCell>
            <TableCell title={formatDateTime(contact.lastMessageAt)}>
              {contact.lastMessageAt ? formatRelativeTime(contact.lastMessageAt) : '—'}
            </TableCell>
            <TableCell>
              {contact.isBlocked ? (
                <StatusBadge status="DISABLED" />
              ) : (
                <StatusBadge status="ACTIVE" />
              )}
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
                  <DropdownMenuItem render={<Link href={`/app/${orgSlug}/contacts/${contact.id}`} />}>
                    <EyeIcon data-icon="inline-start" />
                    عرض التفاصيل
                  </DropdownMenuItem>
                  {onMerge && (
                    <DropdownMenuItem onClick={() => onMerge(contact)}>
                      <GitMergeIcon data-icon="inline-start" />
                      دمج
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(contact)}>
                      <Trash2Icon data-icon="inline-start" />
                      حذف
                    </DropdownMenuItem>
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
