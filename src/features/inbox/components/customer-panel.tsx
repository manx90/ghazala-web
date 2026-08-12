'use client';

import { useQuery } from '@tanstack/react-query';
import { MailIcon, PhoneIcon, UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
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

function getInitials(name?: string | null, phone?: string, fallback = '?'): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  }
  return phone?.slice(-2) ?? fallback;
}

export function CustomerPanel({ conversation }: CustomerPanelProps) {
  const t = useTranslations('inbox.customerPanel');
  const tInbox = useTranslations('inbox');
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
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand-soft text-primary">
          <UserIcon className="size-5" />
        </div>
        <p className="text-sm text-muted-foreground">{t('selectConversationHint')}</p>
      </div>
    );
  }

  const displayName =
    contact?.fullName?.trim() ||
    contact?.profileName?.trim() ||
    formatPhoneDisplay(conversation.customerPhone);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex h-14 shrink-0 items-center border-b border-border/60 px-4">
        <h2 className="text-sm font-semibold">{tInbox('customerData')}</h2>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-5 text-center shadow-2xs">
          <div className="rounded-full bg-gradient-brand p-[3px] shadow-md">
            <Avatar className="size-16 border-2 border-card">
              {contact?.profilePhotoUrl ? (
                <AvatarImage src={contact.profilePhotoUrl} alt={displayName} />
              ) : null}
              <AvatarFallback className="bg-muted text-lg font-semibold text-primary">
                {getInitials(displayName, conversation.customerPhone, tInbox('initialsFallback'))}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-muted-foreground" dir="ltr">
              {formatPhoneDisplay(conversation.customerPhone)}
            </p>
          </div>
          <StatusBadge status={conversation.status} />
        </div>

        {contactQuery.isLoading ? (
          <div className="space-y-2.5 rounded-2xl border border-border/60 bg-card p-4 shadow-2xs">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-3/4" />
          </div>
        ) : (
          <dl className="space-y-3 rounded-2xl border border-border/60 bg-card p-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                <PhoneIcon className="size-4" />
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">{t('phone')}</dt>
                <dd className="truncate text-sm font-medium" dir="ltr">
                  {formatPhoneDisplay(conversation.customerPhone)}
                </dd>
              </div>
            </div>

            {contact?.email && (
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                  <MailIcon className="size-4" />
                </div>
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{t('email')}</dt>
                  <dd className="truncate text-sm font-medium" dir="ltr">{contact.email}</dd>
                </div>
              </div>
            )}

            {(contact?.firstName || contact?.lastName) && (
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                  <UserIcon className="size-4" />
                </div>
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{t('name')}</dt>
                  <dd className="truncate text-sm font-medium">
                    {[contact.firstName, contact.lastName].filter(Boolean).join(' ')}
                  </dd>
                </div>
              </div>
            )}

            {contact?.notes && (
              <div>
                <dt className="mb-1.5 text-xs text-muted-foreground">{t('notes')}</dt>
                <dd className="rounded-xl bg-muted/60 p-3 text-sm leading-relaxed">
                  {contact.notes}
                </dd>
              </div>
            )}

            {!contact && !contactQuery.isLoading && (
              <p className="text-xs text-muted-foreground">{t('noContactFound')}</p>
            )}
          </dl>
        )}

        <dl className="space-y-2.5 rounded-2xl border border-border/60 bg-card p-4 text-xs shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">{t('conversationStarted')}</dt>
            <dd className="font-medium">{formatDateTime(conversation.startedAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">{t('lastMessage')}</dt>
            <dd className="font-medium">{formatDateTime(conversation.lastMessageAt)}</dd>
          </div>
          {conversation.closedAt && (
            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground">{t('closedAt')}</dt>
              <dd className="font-medium">{formatDateTime(conversation.closedAt)}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
