'use client';

import { ArchiveIcon, ArrowRightIcon, RefreshCwIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { DeleteDialog } from '@/components/global/delete-dialog';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { PageHeader } from '@/components/shared/page-header';
import { QueryState } from '@/components/shared/query-state';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { isReservedTemplateSlug } from '@/features/templates/constants/template-routes';
import { TemplatePreview } from '@/features/templates/components/template-preview';
import {
  useArchiveTemplate,
  useDeleteTemplate,
  useResubmitTemplate,
  useTemplate,
} from '@/features/templates/hooks/use-templates';
import { TemplateStatus } from '@/types/template.types';

export default function TemplateDetailPage() {
  const params = useParams<{ orgSlug: string; templateId: string }>();
  const { orgSlug, templateId } = params;
  const router = useRouter();

  useEffect(() => {
    if (!templateId) return;

    if (templateId === 'library') {
      router.replace(ROUTES.app.templateLibrary(orgSlug));
      return;
    }

    if (templateId === 'new') {
      router.replace(`/app/${orgSlug}/templates/new`);
      return;
    }

    if (isReservedTemplateSlug(templateId)) {
      router.replace(ROUTES.app.templates(orgSlug));
    }
  }, [orgSlug, templateId, router]);

  const isReserved = isReservedTemplateSlug(templateId);

  const [archiveOpen, setArchiveOpen] = useState(false);
  const [resubmitOpen, setResubmitOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: template, isLoading, isError, error, refetch } = useTemplate(templateId, !isReserved);
  const archiveMutation = useArchiveTemplate(templateId);
  const resubmitMutation = useResubmitTemplate(templateId);
  const deleteMutation = useDeleteTemplate();

  const canResubmit =
    template?.status === TemplateStatus.REJECTED || template?.status === TemplateStatus.DRAFT;
  const isArchived = !!template?.archivedAt;

  const handleArchive = () => {
    archiveMutation.mutate(undefined, { onSuccess: () => setArchiveOpen(false) });
  };

  const handleResubmit = () => {
    resubmitMutation.mutate(undefined, { onSuccess: () => setResubmitOpen(false) });
  };

  const handleDelete = () => {
    deleteMutation.mutate(templateId, {
      onSuccess: () => router.push(`/app/${orgSlug}/templates`),
    });
  };

  if (isReserved) {
    return null;
  }

  return (
    <PermissionGuard permission="templates.read">
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title={template?.name ?? 'قالب'}
          description={template ? `${template.language} — ${template.category}` : undefined}
          actions={
            <>
              <Button variant="outline" render={<Link href={`/app/${orgSlug}/templates`} />}>
                <ArrowRightIcon data-icon="inline-start" />
                العودة للقائمة
              </Button>
              {canResubmit && !isArchived && (
                <Button variant="outline" onClick={() => setResubmitOpen(true)}>
                  <RefreshCwIcon data-icon="inline-start" />
                  إعادة إرسال
                </Button>
              )}
              {!isArchived && (
                <Button variant="outline" onClick={() => setArchiveOpen(true)}>
                  <ArchiveIcon data-icon="inline-start" />
                  أرشفة
                </Button>
              )}
              <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2Icon data-icon="inline-start" />
                حذف
              </Button>
            </>
          }
        />

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!template}
          emptyTitle="القالب غير موجود"
          onRetry={() => refetch()}
        >
          {template && (
            <div
              className="stagger-in"
              style={{ '--stagger-delay': '120ms' } as React.CSSProperties}
            >
              <TemplatePreview template={template} />
            </div>
          )}
        </QueryState>

        <ConfirmDialog
          open={archiveOpen}
          onOpenChange={setArchiveOpen}
          title="أرشفة القالب"
          description="سيتم أرشفة القالب ولن يكون متاحاً للإرسال."
          confirmLabel="أرشفة"
          onConfirm={handleArchive}
          isLoading={archiveMutation.isPending}
        />

        <ConfirmDialog
          open={resubmitOpen}
          onOpenChange={setResubmitOpen}
          title="إعادة إرسال للمراجعة"
          description="سيتم إرسال القالب إلى Meta للمراجعة مرة أخرى."
          confirmLabel="إرسال"
          onConfirm={handleResubmit}
          isLoading={resubmitMutation.isPending}
        />

        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="حذف القالب"
          description={`هل تريد حذف القالب "${template?.name}"؟`}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </PermissionGuard>
  );
}
