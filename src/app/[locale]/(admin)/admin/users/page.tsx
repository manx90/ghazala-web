'use client';

import { type ColumnDef } from '@tanstack/react-table';
import {
  Building2Icon,
  MoreHorizontalIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from '@/i18n/navigation';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { DeleteDialog } from '@/components/global/delete-dialog';
import { DataTable } from '@/components/data-table';
import { BulkActionsBar, FilterBar, SearchBar } from '@/components/feedback/bars';
import { NoDataEmpty } from '@/components/feedback/empty-presets';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROUTES } from '@/config/routes';
import { AdminUserOrganizationsDialog } from '@/features/admin/components/admin-user-organizations-dialog';
import {
  useAdminUsers,
  useDeleteUser,
  useDisableUser,
  useEnableUser,
} from '@/features/admin/hooks/use-admin-users';
import type { AdminUserListItem } from '@/types/admin.types';
import { UserRole, UserStatus } from '@/types/auth.types';
import { formatDateTime } from '@/utils/date';

const PAGE_LIMIT = 20;

function getFullName(user: AdminUserListItem): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
}

function getInitials(user: AdminUserListItem): string {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  if (parts.length === 0) return user.email.charAt(0).toUpperCase();
  return parts.map((p) => p.trim().charAt(0)).join('').toUpperCase();
}

export default function AdminUsersPage() {
  const t = useTranslations('admin.users');
  const tPages = useTranslations('admin.pages.users');
  const tCommon = useTranslations('admin.common');
  const tDialogs = useTranslations('admin.users.dialogs');

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [enableTarget, setEnableTarget] = useState<AdminUserListItem | null>(null);
  const [disableTarget, setDisableTarget] = useState<AdminUserListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserListItem | null>(null);
  const [organizationsTarget, setOrganizationsTarget] = useState<AdminUserListItem | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(searchInput.trim() ? { search: searchInput.trim() } : {}),
      ...(statusFilter !== 'all' ? { status: statusFilter as UserStatus } : {}),
      ...(roleFilter !== 'all' ? { role: roleFilter as UserRole } : {}),
    }),
    [page, searchInput, statusFilter, roleFilter],
  );

  const { data, isLoading, isError, error, refetch } = useAdminUsers(listParams);
  const enableMutation = useEnableUser();
  const disableMutation = useDisableUser();
  const deleteMutation = useDeleteUser();

  const columns = useMemo<ColumnDef<AdminUserListItem, unknown>[]>(
    () => [
      {
        id: 'name',
        header: t('columns.name'),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback>{getInitials(row.original)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{getFullName(row.original)}</span>
          </div>
        ),
      },
      {
        id: 'email',
        header: t('columns.email'),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground" dir="ltr">
            {row.original.email}
          </span>
        ),
      },
      {
        id: 'organizations',
        header: t('columns.organizations'),
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 px-2"
            onClick={() => setOrganizationsTarget(row.original)}
          >
            <Building2Icon className="size-4" />
            <span className="tabular-nums">{row.original.organizationsCount}</span>
          </Button>
        ),
      },
      {
        id: 'role',
        header: t('columns.role'),
        cell: ({ row }) => <StatusBadge status={row.original.role} />,
      },
      {
        id: 'status',
        header: t('columns.status'),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'lastLoginAt',
        header: t('columns.lastLogin'),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.lastLoginAt ? formatDateTime(row.original.lastLoginAt) : tCommon('notAvailable')}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 48,
        cell: ({ row }) => {
          const user = row.original;
          const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" aria-label={tCommon('actions')}>
                    <MoreHorizontalIcon />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href={ROUTES.admin.user(user.id)} />}>
                  {t('actions.details')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOrganizationsTarget(user)}>
                  <Building2Icon data-icon="inline-start" />
                  {t('actions.organizations')}
                </DropdownMenuItem>
                {!isSuperAdmin && user.status !== UserStatus.ACTIVE && (
                  <DropdownMenuItem onClick={() => setEnableTarget(user)}>
                    <ShieldCheckIcon data-icon="inline-start" />
                    {t('actions.enable')}
                  </DropdownMenuItem>
                )}
                {!isSuperAdmin && user.status !== UserStatus.DISABLED && (
                  <DropdownMenuItem onClick={() => setDisableTarget(user)}>
                    <ShieldOffIcon data-icon="inline-start" />
                    {t('actions.disable')}
                  </DropdownMenuItem>
                )}
                {!isSuperAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(user)}>
                      <Trash2Icon data-icon="inline-start" />
                      {t('actions.delete')}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t, tCommon],
  );

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader title={tPages('title')} description={tPages('description')} />

        <Card>
          <CardContent className="pt-6">
            <DataTable
              data={data?.items ?? []}
              columns={columns}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={() => refetch()}
              rowCount={data?.total ?? 0}
              pagination={{ page, limit: PAGE_LIMIT }}
              onPageChange={setPage}
              rowSelection={selectedIds}
              onRowSelectionChange={setSelectedIds}
              getRowId={(row) => row.id}
              isRowSelectable={(row) => row.role !== UserRole.SUPER_ADMIN}
              emptyTitle={t('empty')}
              emptyAction={<NoDataEmpty title={t('empty')} />}
              toolbar={
                <FilterBar>
                  <SearchBar
                    value={searchInput}
                    onChange={(value) => {
                      setSearchInput(value);
                      setPage(1);
                    }}
                    placeholder={t('searchPlaceholder')}
                    className="flex-1"
                  />
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      if (value) {
                        setStatusFilter(value);
                        setPage(1);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-36">
                      <SelectValue placeholder={t('filters.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
                      <SelectItem value={UserStatus.ACTIVE}>{t('filters.active')}</SelectItem>
                      <SelectItem value={UserStatus.DISABLED}>{t('filters.disabled')}</SelectItem>
                      <SelectItem value={UserStatus.PENDING_VERIFICATION}>
                        {t('filters.pendingVerification')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={roleFilter}
                    onValueChange={(value) => {
                      if (value) {
                        setRoleFilter(value);
                        setPage(1);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-36">
                      <SelectValue placeholder={t('filters.role')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('filters.allRoles')}</SelectItem>
                      <SelectItem value={UserRole.SUPER_ADMIN}>{t('filters.superAdmin')}</SelectItem>
                      <SelectItem value={UserRole.USER}>{t('filters.user')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FilterBar>
              }
              bulkActions={(ids) => (
                <BulkActionsBar selectedCount={ids.length} onClear={() => setSelectedIds({})}>
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={() => {
                      void (async () => {
                        for (const id of ids) {
                          await deleteMutation.mutateAsync(id);
                        }
                        setSelectedIds({});
                        router.refresh();
                      })();
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2Icon data-icon="inline-start" />
                    {t('actions.deleteSelected')}
                  </Button>
                </BulkActionsBar>
              )}
            />
          </CardContent>
        </Card>
      </div>

      <AdminUserOrganizationsDialog
        userId={organizationsTarget?.id ?? null}
        userName={organizationsTarget ? getFullName(organizationsTarget) : undefined}
        open={!!organizationsTarget}
        onOpenChange={(open) => !open && setOrganizationsTarget(null)}
      />

      <ConfirmDialog
        open={!!enableTarget}
        onOpenChange={(open) => !open && setEnableTarget(null)}
        title={tDialogs('enableTitle')}
        description={enableTarget ? tDialogs('enableDescription', { email: enableTarget.email }) : ''}
        onConfirm={() => {
          if (!enableTarget) return;
          enableMutation.mutate(enableTarget.id, { onSuccess: () => setEnableTarget(null) });
        }}
        isLoading={enableMutation.isPending}
      />

      <ConfirmDialog
        open={!!disableTarget}
        onOpenChange={(open) => !open && setDisableTarget(null)}
        title={tDialogs('disableTitle')}
        description={disableTarget ? tDialogs('disableDescription', { email: disableTarget.email }) : ''}
        variant="destructive"
        onConfirm={() => {
          if (!disableTarget) return;
          disableMutation.mutate(disableTarget.id, { onSuccess: () => setDisableTarget(null) });
        }}
        isLoading={disableMutation.isPending}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={tDialogs('deleteTitle')}
        description={deleteTarget ? tDialogs('deleteDescription', { email: deleteTarget.email }) : ''}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              setDeleteTarget(null);
              router.refresh();
            },
          });
        }}
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
