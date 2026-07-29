'use client';

import { ArrowRightIcon, PauseIcon, PlayIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { DeleteDialog } from '@/components/global/delete-dialog';
import { InformationCard } from '@/components/cards';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { Button } from '@/components/ui/button';
import {
  useActivateOrganization,
  useAdminOrganization,
  useDeleteOrganization,
  useSuspendOrganization,
} from '@/features/admin/hooks/use-admin-organizations';
import { ROUTES } from '@/config/routes';
import { OrganizationStatus } from '@/types/organization.types';
import { formatDateTime } from '@/utils/date';

export default function AdminOrganizationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orgId = params.id;

  const { data: org, isLoading, isError, error, refetch } = useAdminOrganization(orgId);
  const activateMutation = useActivateOrganization();
  const suspendMutation = useSuspendOrganization();
  const deleteMutation = useDeleteOrganization();

  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <PageContainer size="md">
      <div className="flex flex-col gap-6">
        <PageHeader
          title={org?.name ?? 'تفاصيل المنظمة'}
          description={org ? org.slug : 'جاري التحميل...'}
          actions={
            <Button variant="outline" size="sm" render={<Link href={ROUTES.admin.organizations} />}>
              <ArrowRightIcon data-icon="inline-start" />
              العودة للقائمة
            </Button>
          }
        />

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!org}
          emptyTitle="المنظمة غير موجودة"
          onRetry={() => refetch()}
        >
          {org && (
            <>
              <InformationCard
                title="معلومات أساسية"
                rows={[
                  { label: 'البلد', value: org.country },
                  { label: 'المنطقة الزمنية', value: org.timezone },
                  { label: 'تاريخ الإنشاء', value: formatDateTime(org.createdAt) },
                  { label: 'آخر تحديث', value: formatDateTime(org.updatedAt) },
                ]}
              />

              <div className="flex items-center justify-between">
                <StatusBadge status={org.status} />
                <div className="flex flex-wrap gap-2">
                  {org.status !== OrganizationStatus.ACTIVE && (
                    <Button
                      size="sm"
                      onClick={() => activateMutation.mutate(org.id)}
                      disabled={activateMutation.isPending}
                    >
                      <PlayIcon data-icon="inline-start" />
                      تفعيل
                    </Button>
                  )}
                  {org.status !== OrganizationStatus.SUSPENDED && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => suspendMutation.mutate(org.id)}
                      disabled={suspendMutation.isPending}
                    >
                      <PauseIcon data-icon="inline-start" />
                      تعليق
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => setDeleteOpen(true)}>
                    <Trash2Icon data-icon="inline-start" />
                    حذف
                  </Button>
                </div>
              </div>

              <UnavailableFeatureAlert
                title="تفاصيل إضافية غير متوفرة"
                description="الأقسام التالية تتطلب endpoints admin إضافية."
                requiredEndpoints={[
                  'GET /admin/organizations/:id/usage',
                  'GET /admin/organizations/:id/subscription',
                  'GET /admin/organizations/:id/limits',
                  'GET /admin/organizations/:id/members',
                  'GET /admin/organizations/:id/phone-numbers',
                ]}
              />
            </>
          )}
        </QueryState>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف المنظمة"
        description={`سيتم حذف "${org?.name}" (soft delete).`}
        onConfirm={() => {
          if (!org) return;
          deleteMutation.mutate(org.id, {
            onSuccess: () => router.push(ROUTES.admin.organizations),
          });
        }}
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
