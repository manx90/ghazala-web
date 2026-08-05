'use client';

import { GitMergeIcon, PlusIcon, SearchIcon, UploadIcon, DownloadIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import type React from 'react';
import { useMemo, useState } from 'react';
import { DeleteDialog } from '@/components/global/delete-dialog';
import { ModalWrapper } from '@/components/global/modal-wrapper';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { PageHeader } from '@/components/shared/page-header';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { QueryState } from '@/components/shared/query-state';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ContactForm } from '@/features/contacts/components/contact-form';
import { ContactTable } from '@/features/contacts/components/contact-table';
import { MergeContactsDialog } from '@/features/contacts/components/merge-contacts-dialog';
import {
  useContactsList,
  useCreateContact,
  useDeleteContact,
  useMergeContacts,
} from '@/features/contacts/hooks/use-contacts';
import { SendTemplateComposeDialog } from '@/features/inbox/components/send-template-compose-dialog';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { ROUTES } from '@/config/routes';
import type { ContactFormValues } from '@/features/contacts/schemas/contact.schemas';
import type { Contact } from '@/types/contact.types';

const PAGE_LIMIT = 20;

export default function ContactsPage() {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug;
  const router = useRouter();
  const { can, canSendMessages } = usePermissions();
  const canManageContacts = can('contacts.manage');

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeRecipient, setComposeRecipient] = useState('');

  const queryParams = useMemo(
    () => ({ page, limit: PAGE_LIMIT, search: search || undefined }),
    [page, search],
  );

  const { data, isLoading, isError, error, refetch } = useContactsList(queryParams);
  const createMutation = useCreateContact();
  const deleteMutation = useDeleteContact();
  const mergeMutation = useMergeContacts();

  const contacts = data?.items ?? [];

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleCreate = (values: ContactFormValues) => {
    createMutation.mutate(
      {
        phone: values.phone,
        waId: values.waId || undefined,
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
        profileName: values.profileName || undefined,
        profilePhotoUrl: values.profilePhotoUrl || undefined,
        email: values.email || undefined,
        notes: values.notes || undefined,
      },
      {
        onSuccess: (contact) => {
          setCreateOpen(false);
          router.push(`/app/${orgSlug}/contacts/${contact.id}`);
        },
      },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      },
    });
  };

  const handleMerge = (values: { primaryContactId: string; duplicateContactId: string }) => {
    mergeMutation.mutate(values, {
      onSuccess: (result) => {
        setMergeOpen(false);
        setSelectedIds([]);
        router.push(`/app/${orgSlug}/contacts/${result.contact.id}`);
      },
    });
  };

  return (
    <PermissionGuard permission="contacts.read">
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title="جهات الاتصال"
          description="إدارة جهات اتصال WhatsApp الخاصة بمنظمتك"
          actions={
            <>
              {canSendMessages ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setComposeRecipient('');
                    setComposeOpen(true);
                  }}
                >
                  إرسال قالب
                </Button>
              ) : null}
              {canManageContacts ? (
                <>
                  <Button
                    variant="outline"
                    disabled={selectedIds.length < 2}
                    onClick={() => setMergeOpen(true)}
                  >
                    <GitMergeIcon data-icon="inline-start" />
                    دمج ({selectedIds.length})
                  </Button>
                  <Button variant="gradient" onClick={() => setCreateOpen(true)}>
                    <PlusIcon data-icon="inline-start" />
                    جهة اتصال جديدة
                  </Button>
                </>
              ) : null}
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="stagger-in" style={{ '--stagger-delay': '60ms' } as React.CSSProperties}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-base">
                <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                  <UploadIcon className="size-4" aria-hidden="true" />
                </span>
                استيراد جهات الاتصال
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UnavailableFeatureAlert
                title="الاستيراد غير متاح"
                description="واجهة استيراد جهات الاتصال تتطلب API غير متوفر حالياً."
                requiredEndpoints={['POST /contacts/import']}
              />
            </CardContent>
          </Card>
          <Card className="stagger-in" style={{ '--stagger-delay': '120ms' } as React.CSSProperties}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-base">
                <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                  <DownloadIcon className="size-4" aria-hidden="true" />
                </span>
                تصدير جهات الاتصال
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UnavailableFeatureAlert
                title="التصدير غير متاح"
                description="واجهة تصدير جهات الاتصال تتطلب API غير متوفر حالياً."
                requiredEndpoints={['GET /contacts/export']}
              />
            </CardContent>
          </Card>
        </div>

        <div
          className="stagger-in flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3 shadow-2xs"
          style={{ '--stagger-delay': '180ms' } as React.CSSProperties}
        >
          <div className="relative w-full max-w-sm">
            <SearchIcon
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              placeholder="بحث بالاسم أو الهاتف..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="ps-9"
            />
          </div>
          <Button variant="outline" onClick={handleSearch}>
            بحث
          </Button>
        </div>

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!isLoading && contacts.length === 0}
          emptyTitle="لا توجد جهات اتصال"
          emptyDescription={search ? 'لم يتم العثور على نتائج مطابقة' : 'ابدأ بإضافة جهة اتصال جديدة'}
          emptyAction={
            canManageContacts ? (
              <Button onClick={() => setCreateOpen(true)}>
                <PlusIcon data-icon="inline-start" />
                إضافة جهة اتصال
              </Button>
            ) : canSendMessages ? (
              <Button variant="gradient" onClick={() => setComposeOpen(true)}>
                إرسال قالب لرقم
              </Button>
            ) : undefined
          }
          onRetry={() => refetch()}
        >
          <div
            className="stagger-in flex flex-col gap-4"
            style={{ '--stagger-delay': '240ms' } as React.CSSProperties}
          >
            <ContactTable
              contacts={contacts}
              orgSlug={orgSlug}
              selectedIds={canManageContacts ? selectedIds : undefined}
              onSelectionChange={canManageContacts ? setSelectedIds : undefined}
              onDelete={canManageContacts ? setDeleteTarget : undefined}
              onMerge={canManageContacts ? () => setMergeOpen(true) : undefined}
              onSendTemplate={
                canSendMessages
                  ? (contact) => {
                      setComposeRecipient(contact.phone);
                      setComposeOpen(true);
                    }
                  : undefined
              }
            />
            <PaginationControls
              page={data?.page ?? page}
              limit={data?.limit ?? PAGE_LIMIT}
              total={data?.total ?? 0}
              onPageChange={setPage}
            />
          </div>
        </QueryState>

        <ModalWrapper
          open={createOpen}
          onOpenChange={setCreateOpen}
          title="جهة اتصال جديدة"
          description="أدخل بيانات جهة الاتصال"
        >
          <ContactForm
            mode="create"
            onSubmit={handleCreate}
            isLoading={createMutation.isPending}
            onCancel={() => setCreateOpen(false)}
          />
        </ModalWrapper>

        <DeleteDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="حذف جهة الاتصال"
          description={`هل تريد حذف "${deleteTarget?.fullName ?? deleteTarget?.phone}"؟`}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
        />

        <MergeContactsDialog
          open={mergeOpen}
          onOpenChange={setMergeOpen}
          contacts={contacts}
          preselectedIds={selectedIds}
          onConfirm={handleMerge}
          isLoading={mergeMutation.isPending}
        />

        <SendTemplateComposeDialog
          open={composeOpen}
          onOpenChange={setComposeOpen}
          defaultRecipient={composeRecipient}
          onSent={(conversationId) => {
            setComposeRecipient('');
            router.push(ROUTES.app.inboxConversation(orgSlug, conversationId));
          }}
        />
      </div>
    </PermissionGuard>
  );
}
