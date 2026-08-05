'use client';

import {
  ArrowRightIcon,
  BadgeCheckIcon,
  Building2Icon,
  CalendarPlusIcon,
  LogInIcon,
  MailIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdminDetailHero, AdminInfoGrid } from '@/features/admin/components/admin-detail-ui';
import { AdminUserOrganizationsDialog } from '@/features/admin/components/admin-user-organizations-dialog';
import {
  useAdminUser,
  useAdminUserOrganizations,
  useDeleteUser,
  useDisableUser,
  useEnableUser,
  useSendUserVerification,
} from '@/features/admin/hooks/use-admin-users';
import { ROUTES } from '@/config/routes';
import { UserRole, UserStatus } from '@/types/auth.types';
import { formatDateTime } from '@/utils/date';

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params.id;

  const { data: user, isLoading, isError, error, refetch } = useAdminUser(userId);
  const organizationsQuery = useAdminUserOrganizations(userId);
  const enableMutation = useEnableUser();
  const disableMutation = useDisableUser();
  const deleteMutation = useDeleteUser();
  const sendVerification = useSendUserVerification();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [organizationsOpen, setOrganizationsOpen] = useState(false);

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : '';
  const initials = user
    ? [user.firstName, user.lastName].filter(Boolean).map((p) => p.trim().charAt(0)).join('').toUpperCase() ||
      user.email.charAt(0).toUpperCase()
    : '';

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
              <AdminDetailHero
                title={fullName || user.email}
                subtitle={user.email}
                initials={initials}
                badges={
                  <>
                    <StatusBadge status={user.role} />
                    <StatusBadge status={user.status} />
                  </>
                }
                actions={
                  !isSuperAdmin ? (
                    <>
                      {!user.emailVerified && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendVerification.mutate(user.id)}
                          disabled={sendVerification.isPending}
                        >
                          <MailIcon data-icon="inline-start" />
                          إرسال التحقق
                        </Button>
                      )}
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
                  ) : undefined
                }
              />

              <AdminInfoGrid
                title="معلومات المستخدم"
                items={[
                  { label: 'البريد', value: user.email, icon: MailIcon },
                  { label: 'البريد موثّق', value: user.emailVerified ? 'نعم' : 'لا', icon: BadgeCheckIcon },
                  {
                    label: 'آخر دخول',
                    value: user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '—',
                    icon: LogInIcon,
                  },
                  { label: 'تاريخ التسجيل', value: formatDateTime(user.createdAt), icon: CalendarPlusIcon },
                ]}
              />

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle className="text-base">المنظمات</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setOrganizationsOpen(true)}>
                    <Building2Icon data-icon="inline-start" />
                    عرض الكل
                  </Button>
                </CardHeader>
                <CardContent>
                  <QueryState
                    isLoading={organizationsQuery.isLoading}
                    isError={organizationsQuery.isError}
                    error={organizationsQuery.error}
                    isEmpty={!organizationsQuery.data?.items.length}
                    emptyTitle="لا ينتمي لأي منظمة"
                    onRetry={() => organizationsQuery.refetch()}
                  >
                    {organizationsQuery.data?.items.length ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>المنظمة</TableHead>
                            <TableHead>الدور</TableHead>
                            <TableHead>تاريخ الانضمام</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {organizationsQuery.data.items.slice(0, 5).map((item) => (
                            <TableRow key={item.organization.id}>
                              <TableCell>
                                <Link
                                  href={ROUTES.admin.organization(item.organization.id)}
                                  className="font-medium hover:underline"
                                >
                                  {item.organization.name}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={item.role} />
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {formatDateTime(item.joinedAt)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : null}
                  </QueryState>
                </CardContent>
              </Card>
            </>
          )}
        </QueryState>
      </div>

      <AdminUserOrganizationsDialog
        userId={userId}
        userName={fullName || user?.email}
        open={organizationsOpen}
        onOpenChange={setOrganizationsOpen}
      />

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
