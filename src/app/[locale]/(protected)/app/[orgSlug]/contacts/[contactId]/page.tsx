'use client';

import {
  ActivityIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  MessageSquareIcon,
  StickyNoteIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import type React from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DeleteDialog } from '@/components/global/delete-dialog';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { PageHeader } from '@/components/shared/page-header';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactForm } from '@/features/contacts/components/contact-form';
import { SendTemplateComposeDialog } from '@/features/inbox/components/send-template-compose-dialog';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { ROUTES } from '@/config/routes';
import {
  useContact,
  useDeleteContact,
  useUpdateContact,
} from '@/features/contacts/hooks/use-contacts';
import type { ContactFormValues } from '@/features/contacts/schemas/contact.schemas';
import { formatDateTime } from '@/utils/date';

export default function ContactDetailPage() {
  const t = useTranslations('contacts');
  const tCommon = useTranslations('common');
  const params = useParams<{ orgSlug: string; contactId: string }>();
  const { orgSlug, contactId } = params;
  const router = useRouter();
  const { can, canSendMessages } = usePermissions();
  const canManageContacts = can('contacts.manage');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  const { data: contact, isLoading, isError, error, refetch } = useContact(contactId);
  const updateMutation = useUpdateContact(contactId);
  const deleteMutation = useDeleteContact();

  const displayName =
    contact?.fullName ||
    [contact?.firstName, contact?.lastName].filter(Boolean).join(' ') ||
    contact?.profileName ||
    contact?.phone;

  const handleUpdate = (values: ContactFormValues) => {
    updateMutation.mutate({
      waId: values.waId || undefined,
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      profileName: values.profileName || undefined,
      profilePhotoUrl: values.profilePhotoUrl || undefined,
      email: values.email || undefined,
      notes: values.notes || undefined,
      isBlocked: values.isBlocked,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(contactId, {
      onSuccess: () => router.push(`/app/${orgSlug}/contacts`),
    });
  };

  return (
    <PermissionGuard permission="contacts.read">
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title={displayName ?? t('contactFallback')}
          description={contact?.phone}
          actions={
            <>
              <Button variant="outline" render={<Link href={`/app/${orgSlug}/contacts`} />}>
                <ArrowRightIcon data-icon="inline-start" />
                {t('backToList')}
              </Button>
              {canSendMessages && contact && !contact.isBlocked ? (
                <Button variant="gradient" onClick={() => setComposeOpen(true)}>
                  <MessageSquareIcon data-icon="inline-start" />
                  {t('sendTemplate')}
                </Button>
              ) : null}
              {canManageContacts ? (
                <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2Icon data-icon="inline-start" />
                  {tCommon('delete')}
                </Button>
              ) : null}
            </>
          }
        />

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!contact}
          emptyTitle={t('notFound')}
          onRetry={() => refetch()}
        >
          {contact && (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card
                className="stagger-in lg:col-span-2"
                style={{ '--stagger-delay': '60ms' } as React.CSSProperties}
              >
                <CardHeader>
                  <CardTitle>{t('editTitle')}</CardTitle>
                  <CardDescription>{t('editDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm
                    contact={contact}
                    mode="edit"
                    onSubmit={handleUpdate}
                    isLoading={updateMutation.isPending}
                    readOnly={!canManageContacts}
                  />
                </CardContent>
              </Card>

              <div
                className="stagger-in flex flex-col gap-4"
                style={{ '--stagger-delay': '120ms' } as React.CSSProperties}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t('infoTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                        <ActivityIcon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-muted-foreground">{t('status')}</span>
                      {contact.isBlocked ? (
                        <StatusBadge status="DISABLED" />
                      ) : (
                        <StatusBadge status="ACTIVE" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                        <MessageSquareIcon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-muted-foreground">{t('lastMessage')}</span>
                      <span>{formatDateTime(contact.lastMessageAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                        <CalendarIcon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-muted-foreground">{t('createdAt')}</span>
                      <span>{formatDateTime(contact.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                        <ClockIcon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="flex-1 text-muted-foreground">{t('updatedAt')}</span>
                      <span>{formatDateTime(contact.updatedAt)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2.5">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                        <StickyNoteIcon className="size-4" aria-hidden="true" />
                      </span>
                      {t('notesTitle')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {contact.notes?.trim() || t('noNotes')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </QueryState>

        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title={t('deleteTitle')}
          description={t('deleteDescription', { name: displayName ?? '' })}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
        />

        {contact ? (
          <SendTemplateComposeDialog
            open={composeOpen}
            onOpenChange={setComposeOpen}
            defaultRecipient={contact.phone}
            onSent={(conversationId) => {
              router.push(ROUTES.app.inboxConversation(orgSlug, conversationId));
            }}
          />
        ) : null}
      </div>
    </PermissionGuard>
  );
}
