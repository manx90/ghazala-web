'use client';

import {
  ArrowRightIcon,
  CalendarClockIcon,
  CalendarPlusIcon,
  ClockIcon,
  GlobeIcon,
  PauseIcon,
  PlayIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { DeleteDialog } from '@/components/global/delete-dialog';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { AdminDetailHero, AdminInfoGrid } from '@/features/admin/components/admin-detail-ui';
import { AdminOrganizationEditForm } from '@/features/admin/components/admin-organization-edit-form';
import { AdminOrganizationMembersCard } from '@/features/admin/components/admin-organization-members-card';
import { AdminOrganizationPhoneNumbersCard } from '@/features/admin/components/admin-organization-phone-numbers-card';
import { AdminOrganizationSubscriptionCard } from '@/features/admin/components/admin-organization-subscription-card';
import { AdminOrganizationUsageCard } from '@/features/admin/components/admin-organization-usage-card';
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
              <AdminDetailHero
                title={org.name}
                subtitle={org.slug}
                initials={org.name.trim().charAt(0) || '—'}
                badges={<StatusBadge status={org.status} />}
                actions={
                  <>
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteOpen(true)}
                    >
                      <Trash2Icon data-icon="inline-start" />
                      حذف
                    </Button>
                  </>
                }
              />

              <AdminInfoGrid
                title="معلومات أساسية"
                items={[
                  { label: 'البلد', value: org.country, icon: GlobeIcon },
                  { label: 'المنطقة الزمنية', value: org.timezone, icon: ClockIcon },
                  { label: 'تاريخ الإنشاء', value: formatDateTime(org.createdAt), icon: CalendarPlusIcon },
                  { label: 'آخر تحديث', value: formatDateTime(org.updatedAt), icon: CalendarClockIcon },
                ]}
              />

              <AdminOrganizationEditForm organization={org} />

              <div className="grid gap-6 lg:grid-cols-2">
                <AdminOrganizationSubscriptionCard organizationId={org.id} />
                <AdminOrganizationUsageCard organizationId={org.id} />
              </div>

              <AdminOrganizationMembersCard organizationId={org.id} />
              <AdminOrganizationPhoneNumbersCard organizationId={org.id} />
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
