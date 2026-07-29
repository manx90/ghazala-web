'use client';

import { GitMergeIcon, PlusIcon, SearchIcon, UploadIcon, DownloadIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
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
import type { ContactFormValues } from '@/features/contacts/schemas/contact.schemas';
import type { Contact } from '@/types/contact.types';

const PAGE_LIMIT = 20;

export default function ContactsPage() {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug;
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
              <Button
                variant="outline"
                disabled={selectedIds.length < 2}
                onClick={() => setMergeOpen(true)}
              >
                <GitMergeIcon data-icon="inline-start" />
                دمج ({selectedIds.length})
              </Button>
              <Button onClick={() => setCreateOpen(true)}>
                <PlusIcon data-icon="inline-start" />
                جهة اتصال جديدة
              </Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UploadIcon className="size-4" />
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DownloadIcon className="size-4" />
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

        <div className="flex gap-2">
          <Input
            placeholder="بحث بالاسم أو الهاتف..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={handleSearch}>
            <SearchIcon data-icon="inline-start" />
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
            <Button onClick={() => setCreateOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              إضافة جهة اتصال
            </Button>
          }
          onRetry={() => refetch()}
        >
          <ContactTable
            contacts={contacts}
            orgSlug={orgSlug}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onDelete={setDeleteTarget}
            onMerge={() => setMergeOpen(true)}
          />
          <PaginationControls
            page={data?.page ?? page}
            limit={data?.limit ?? PAGE_LIMIT}
            total={data?.total ?? 0}
            onPageChange={setPage}
          />
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
      </div>
    </PermissionGuard>
  );
}
