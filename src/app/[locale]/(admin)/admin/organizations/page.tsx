'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontalIcon, PauseIcon, PlayIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from '@/i18n/navigation';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { DeleteDialog } from '@/components/global/delete-dialog';
import { DataTable } from '@/components/data-table';
import { BulkActionsBar, FilterBar, SearchBar } from '@/components/feedback/bars';
import { NoOrganizationsEmpty } from '@/components/feedback/empty-presets';
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
import {
  useActivateOrganization,
  useAdminOrganizations,
  useBulkOrganizations,
  useDeleteOrganization,
  useSuspendOrganization,
} from '@/features/admin/hooks/use-admin-organizations';
import { AdminOrganizationBulkAction } from '@/types/admin.types';
import type { AdminOrganizationListItem } from '@/types/admin.types';
import { OrganizationStatus } from '@/types/organization.types';
import { formatDateTime } from '@/utils/date';

const PAGE_LIMIT = 20;

export default function AdminOrganizationsPage() {
  const t = useTranslations('admin.organizations');
  const tPages = useTranslations('admin.pages.organizations');
  const tCommon = useTranslations('admin.common');
  const tDialogs = useTranslations('admin.organizations.dialogs');
  const tUsersFilters = useTranslations('admin.users.filters');

  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [suspendTarget, setSuspendTarget] = useState<AdminOrganizationListItem | null>(null);
  const [activateTarget, setActivateTarget] = useState<AdminOrganizationListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminOrganizationListItem | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(searchInput.trim() ? { search: searchInput.trim() } : {}),
      ...(statusFilter !== 'all' ? { status: statusFilter as OrganizationStatus } : {}),
    }),
    [page, searchInput, statusFilter],
  );

  const { data, isLoading, isError, error, refetch } = useAdminOrganizations(listParams);
  const activateMutation = useActivateOrganization();
  const suspendMutation = useSuspendOrganization();
  const deleteMutation = useDeleteOrganization();
  const bulkMutation = useBulkOrganizations();

  const columns = useMemo<ColumnDef<AdminOrganizationListItem, unknown>[]>(
    () => [
      {
        id: 'name',
        header: t('columns.name'),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback>{row.original.name.trim().charAt(0) || tCommon('notAvailable')}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        id: 'slug',
        header: t('columns.slug'),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground" dir="ltr">
            {row.original.slug}
          </span>
        ),
      },
      {
        id: 'plan',
        header: t('columns.plan'),
        cell: ({ row }) => {
          const plan = row.original.plan;
          if (!plan?.planName) return <span className="text-muted-foreground">{tCommon('notAvailable')}</span>;
          return (
            <div className="flex flex-col gap-0.5">
              <span className="text-sm">{plan.planName}</span>
              {plan.subscriptionStatus && (
                <StatusBadge status={plan.subscriptionStatus} className="w-fit" />
              )}
            </div>
          );
        },
      },
      {
        id: 'country',
        header: t('columns.country'),
        cell: ({ row }) => row.original.country,
      },
      {
        id: 'status',
        header: t('columns.status'),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'createdAt',
        header: t('columns.createdAt'),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 48,
        cell: ({ row }) => {
          const org = row.original;
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
                <DropdownMenuItem render={<Link href={ROUTES.admin.organization(org.id)} />}>
                  {tCommon('details')}
                </DropdownMenuItem>
                {org.status !== OrganizationStatus.ACTIVE && (
                  <DropdownMenuItem onClick={() => setActivateTarget(org)}>
                    <PlayIcon data-icon="inline-start" />
                    {tCommon('activate')}
                  </DropdownMenuItem>
                )}
                {org.status !== OrganizationStatus.SUSPENDED && (
                  <DropdownMenuItem onClick={() => setSuspendTarget(org)}>
                    <PauseIcon data-icon="inline-start" />
                    {tCommon('suspend')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(org)}>
                  <Trash2Icon data-icon="inline-start" />
                  {tCommon('delete')}
                </DropdownMenuItem>
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
              emptyTitle={t('empty')}
              emptyAction={<NoOrganizationsEmpty />}
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
                    onValueChange={(v) => {
                      if (v) {
                        setStatusFilter(v);
                        setPage(1);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder={t('filters.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{tUsersFilters('allStatuses')}</SelectItem>
                      <SelectItem value={OrganizationStatus.ACTIVE}>{t('filters.active')}</SelectItem>
                      <SelectItem value={OrganizationStatus.SUSPENDED}>{t('filters.suspended')}</SelectItem>
                      <SelectItem value={OrganizationStatus.INACTIVE}>{t('filters.inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FilterBar>
              }
              bulkActions={(ids) => (
                <BulkActionsBar selectedCount={ids.length} onClear={() => setSelectedIds({})}>
                  <Button
                    size="xs"
                    onClick={() =>
                      bulkMutation.mutate(
                        { action: AdminOrganizationBulkAction.ACTIVATE, ids },
                        { onSuccess: () => setSelectedIds({}) },
                      )
                    }
                    disabled={bulkMutation.isPending}
                  >
                    <PlayIcon data-icon="inline-start" />
                    {t('bulk.activateSelected')}
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() =>
                      bulkMutation.mutate(
                        { action: AdminOrganizationBulkAction.SUSPEND, ids },
                        { onSuccess: () => setSelectedIds({}) },
                      )
                    }
                    disabled={bulkMutation.isPending}
                  >
                    <PauseIcon data-icon="inline-start" />
                    {t('bulk.suspendSelected')}
                  </Button>
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
                    {t('bulk.deleteSelected')}
                  </Button>
                </BulkActionsBar>
              )}
            />
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!activateTarget}
        onOpenChange={(open) => !open && setActivateTarget(null)}
        title={tDialogs('activateTitle')}
        description={activateTarget ? tDialogs('activateDescription', { name: activateTarget.name }) : ''}
        confirmLabel={tCommon('activate')}
        onConfirm={() => {
          if (!activateTarget) return;
          activateMutation.mutate(activateTarget.id, { onSuccess: () => setActivateTarget(null) });
        }}
        isLoading={activateMutation.isPending}
      />

      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
        title={tDialogs('suspendTitle')}
        description={suspendTarget ? tDialogs('suspendDescription', { name: suspendTarget.name }) : ''}
        confirmLabel={tCommon('suspend')}
        variant="destructive"
        onConfirm={() => {
          if (!suspendTarget) return;
          suspendMutation.mutate(suspendTarget.id, { onSuccess: () => setSuspendTarget(null) });
        }}
        isLoading={suspendMutation.isPending}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={tDialogs('deleteTitle')}
        description={deleteTarget ? tDialogs('deleteDescription', { name: deleteTarget.name }) : ''}
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
