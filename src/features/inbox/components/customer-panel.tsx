'use client';

import { useQuery } from '@tanstack/react-query';
import { MailIcon, PhoneIcon, UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/shared/status-badge';
import { queryKeys } from '@/config/query-keys';
import { contactsApi } from '@/features/contacts/api/contacts.api';
import type { Conversation } from '@/types/conversation.types';
import { formatDateTime } from '@/utils/date';
import { formatPhoneDisplay } from '@/utils/phone';

interface CustomerPanelProps {
  conversation?: Conversation | null;
}

function getInitials(name?: string | null, phone?: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  }
  return phone?.slice(-2) ?? '؟';
}

export function CustomerPanel({ conversation }: CustomerPanelProps) {
  const phone = conversation?.customerPhone;

  const contactQuery = useQuery({
    queryKey: [...queryKeys.contacts.list({ search: phone }), phone],
    queryFn: () => contactsApi.list({ search: phone, limit: 5 }),
    enabled: Boolean(phone),
  });

  const contact =
    contactQuery.data?.items.find((item) => item.phone === phone) ??
    contactQuery.data?.items[0];

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        اختر محادثة لعرض بيانات العميل
      </div>
    );
  }

  const displayName =
    contact?.fullName?.trim() ||
    contact?.profileName?.trim() ||
    formatPhoneDisplay(conversation.customerPhone);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b p-4">
        <h2 className="font-semibold">بيانات العميل</h2>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar size="lg">
            {contact?.profilePhotoUrl ? (
              <AvatarImage src={contact.profilePhotoUrl} alt={displayName} />
            ) : null}
            <AvatarFallback>{getInitials(displayName, conversation.customerPhone)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{displayName}</p>
            <p className="text-sm text-muted-foreground" dir="ltr">
              {formatPhoneDisplay(conversation.customerPhone)}
            </p>
          </div>
          <StatusBadge status={conversation.status} />
        </div>

        {contactQuery.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <dl className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <PhoneIcon className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <dt className="text-muted-foreground">الهاتف</dt>
                <dd dir="ltr">{formatPhoneDisplay(conversation.customerPhone)}</dd>
              </div>
            </div>

            {contact?.email && (
              <div className="flex items-start gap-3">
                <MailIcon className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-muted-foreground">البريد</dt>
                  <dd dir="ltr">{contact.email}</dd>
                </div>
              </div>
            )}

            {(contact?.firstName || contact?.lastName) && (
              <div className="flex items-start gap-3">
                <UserIcon className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="text-muted-foreground">الاسم</dt>
                  <dd>{[contact.firstName, contact.lastName].filter(Boolean).join(' ')}</dd>
                </div>
              </div>
            )}

            {contact?.notes && (
              <div>
                <dt className="mb-1 text-muted-foreground">ملاحظات</dt>
                <dd className="rounded-lg bg-muted/50 p-3 text-sm">{contact.notes}</dd>
              </div>
            )}

            {!contact && !contactQuery.isLoading && (
              <p className="text-xs text-muted-foreground">
                لم يتم العثور على جهة اتصال مسجّلة — يُعرض رقم الهاتف فقط.
              </p>
            )}
          </dl>
        )}

        <div className="space-y-2 border-t pt-4 text-xs text-muted-foreground">
          <p>بدء المحادثة: {formatDateTime(conversation.startedAt)}</p>
          <p>آخر رسالة: {formatDateTime(conversation.lastMessageAt)}</p>
          {conversation.closedAt && (
            <p>تاريخ الإغلاق: {formatDateTime(conversation.closedAt)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
