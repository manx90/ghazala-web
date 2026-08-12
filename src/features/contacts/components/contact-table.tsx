'use client';

import { EyeIcon, GitMergeIcon, MessageSquareIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { StatusBadge } from '@/components/shared/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  onSendTemplate?: (contact: Contact) => void;
}

function getDisplayName(contact: Contact): string {
  return (
    contact.fullName ||
    [contact.firstName, contact.lastName].filter(Boolean).join(' ') ||
    contact.profileName ||
    contact.phone
  );
}

function getInitials(contact: Contact): string {
  const name = getDisplayName(contact).trim();
  if (!name || name === contact.phone) return contact.phone.slice(-2);
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('');
}

export function ContactTable({
  contacts,
  orgSlug,
  selectedIds = [],
  onSelectionChange,
  onDelete,
  onMerge,
  onSendTemplate,
}: ContactTableProps) {
  const t = useTranslations('contacts.table');
  const tCommon = useTranslations('common');

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
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {onSelectionChange && (
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => toggleAll(checked === true)}
                  aria-label={t('selectAll')}
                />
              </TableHead>
            )}
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('phone')}</TableHead>
            <TableHead>{t('email')}</TableHead>
            <TableHead>{t('lastMessage')}</TableHead>
            <TableHead>{t('status')}</TableHead>
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
                    aria-label={t('selectContact', { name: getDisplayName(contact) })}
                  />
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="default">
                    {contact.profilePhotoUrl ? (
                      <AvatarImage src={contact.profilePhotoUrl} alt={getDisplayName(contact)} />
                    ) : null}
                    <AvatarFallback className="bg-gradient-brand-soft font-semibold text-primary">
                      {getInitials(contact)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{getDisplayName(contact)}</span>
                </div>
              </TableCell>
              <TableCell dir="ltr" className="text-start font-mono text-xs">
                {contact.phone}
              </TableCell>
              <TableCell dir="ltr" className="text-start text-muted-foreground">
                {contact.email ?? '—'}
              </TableCell>
              <TableCell
                title={formatDateTime(contact.lastMessageAt)}
                className="text-muted-foreground"
              >
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
                      <Button variant="ghost" size="sm" aria-label={tCommon('actions')}>
                        <MoreHorizontalIcon />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem render={<Link href={`/app/${orgSlug}/contacts/${contact.id}`} />}>
                      <EyeIcon data-icon="inline-start" />
                      {t('viewDetails')}
                    </DropdownMenuItem>
                    {onSendTemplate && !contact.isBlocked ? (
                      <DropdownMenuItem onClick={() => onSendTemplate(contact)}>
                        <MessageSquareIcon data-icon="inline-start" />
                        {t('sendTemplate')}
                      </DropdownMenuItem>
                    ) : null}
                    {onMerge && (
                      <DropdownMenuItem onClick={() => onMerge(contact)}>
                        <GitMergeIcon data-icon="inline-start" />
                        {t('merge')}
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem variant="destructive" onClick={() => onDelete(contact)}>
                        <Trash2Icon data-icon="inline-start" />
                        {tCommon('delete')}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
