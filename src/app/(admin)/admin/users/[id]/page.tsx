'use client';

import { ArrowRightIcon, ShieldCheckIcon, ShieldOffIcon, Trash2Icon } from 'lucide-react';
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
  useAdminUser,
  useDeleteUser,
  useDisableUser,
  useEnableUser,
} from '@/features/admin/hooks/use-admin-users';
import { ROUTES } from '@/config/routes';
import { UserRole, UserStatus } from '@/types/auth.types';
import { formatDateTime } from '@/utils/date';

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params.id;

  const { data: user, isLoading, isError, error, refetch } = useAdminUser(userId);
  const enableMutation = useEnableUser();
  const disableMutation = useDisableUser();
  const deleteMutation = useDeleteUser();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : '';

  return (
    <PageContainer size="md">
      <div className="flex flex-col gap-6">
        <PageHeader
          title={fullName || user?.email || 'تفاصيل المستخدم'}
          description={user?.email}
          actions={
            <Button variant="outline" size="sm" render={<Link href={ROUTES.admin.users} />}>
              <ArrowRightIcon data-icon="inline-start" />
              العودة للقائمة
            </Button>
          }
        />

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!user}
          emptyTitle="المستخدم غير موجود"
          onRetry={() => refetch()}
        >
          {user && (
            <>
              <InformationCard
                title="معلومات المستخدم"
                rows={[
                  { label: 'البريد', value: user.email },
                  { label: 'البريد موثّق', value: user.emailVerified ? 'نعم' : 'لا' },
                  { label: 'آخر دخول', value: user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '—' },
                  { label: 'تاريخ التسجيل', value: formatDateTime(user.createdAt) },
                ]}
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <StatusBadge status={user.role} />
                  <StatusBadge status={user.status} />
                </div>
                {!isSuperAdmin && (
                  <div className="flex flex-wrap gap-2">
                    {user.status !== UserStatus.ACTIVE && (
                      <Button
                        size="sm"
                        onClick={() => enableMutation.mutate(user.id)}
                        disabled={enableMutation.isPending}
                      >
                        <ShieldCheckIcon data-icon="inline-start" />
                        تفعيل
                      </Button>
                    )}
                    {user.status !== UserStatus.DISABLED && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => disableMutation.mutate(user.id)}
                        disabled={disableMutation.isPending}
                      >
                        <ShieldOffIcon data-icon="inline-start" />
                        تعطيل
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => setDeleteOpen(true)}>
                      <Trash2Icon data-icon="inline-start" />
                      حذف
                    </Button>
                  </div>
                )}
              </div>

              <UnavailableFeatureAlert
                title="عمليات غير متوفرة"
                requiredEndpoints={[
                  'PATCH /admin/users/:id/assign-organization',
                  'PATCH /admin/users/:id/assign-role',
                  'POST /admin/users/:id/reset-password',
                ]}
                description="تعيين المنظمة والدور وإعادة تعيين كلمة المرور تتطلب backend."
              />
            </>
          )}
        </QueryState>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف المستخدم"
        description={`حذف ${user?.email}؟`}
        onConfirm={() => {
          if (!user) return;
          deleteMutation.mutate(user.id, {
            onSuccess: () => router.push(ROUTES.admin.users),
          });
        }}
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
