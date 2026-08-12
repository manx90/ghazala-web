'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { EditIcon, MoreHorizontalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DeleteDialog } from '@/components/global/delete-dialog';
import { DataTable } from '@/components/data-table';
import { SearchBar } from '@/components/feedback/bars';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/config/routes';
import { useAdminPlans, useDisablePlan } from '@/features/admin/hooks/use-admin-plans';
import type { Plan } from '@/types/billing.types';
import { formatDateTime } from '@/utils/date';

export default function AdminPlansPage() {
  const t = useTranslations('admin.plans');
  const tPages = useTranslations('admin.pages.plans');
  const tCommon = useTranslations('admin.common');

  const [searchInput, setSearchInput] = useState('');
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [disableTarget, setDisableTarget] = useState<Plan | null>(null);

  const { data, isLoading, isError, error, refetch } = useAdminPlans();
  const disableMutation = useDisablePlan();

  const filteredPlans = useMemo(() => {
    const items = data?.items ?? [];
    const q = searchInput.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
  }, [data?.items, searchInput]);

  const columns = useMemo<ColumnDef<Plan, unknown>[]>(
    () => [
      {
        id: 'name',
        header: t('columns.name'),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-xs font-bold text-primary ring-1 ring-primary/10">
              {row.original.name.trim().charAt(0) || tCommon('notAvailable')}
            </span>
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        id: 'code',
        header: t('columns.code'),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground" dir="ltr">
            {row.original.code}
          </span>
        ),
      },
      {
        id: 'monthly',
        header: t('columns.monthly'),
        cell: ({ row }) => (
          <span>
            <span className="font-medium tabular-nums">{row.original.monthlyPrice}</span>{' '}
            <span className="text-xs text-muted-foreground">{row.original.currency}</span>
          </span>
        ),
      },
      {
        id: 'yearly',
        header: t('columns.yearly'),
        cell: ({ row }) => (
          <span>
            <span className="font-medium tabular-nums">{row.original.yearlyPrice}</span>{' '}
            <span className="text-xs text-muted-foreground">{row.original.currency}</span>
          </span>
        ),
      },
      {
        id: 'limits',
        header: t('columns.messagesPerMonth'),
        cell: ({ row }) => (
          <span className="text-sm tabular-nums">
            {row.original.maxMessagesMonthly?.toLocaleString() ?? '∞'}
          </span>
        ),
      },
      {
        id: 'status',
        header: t('columns.status'),
        cell: ({ row }) => <StatusBadge status={row.original.isActive ? 'ACTIVE' : 'DISABLED'} />,
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
          const plan = row.original;
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
                <DropdownMenuItem render={<Link href={ROUTES.admin.plan(plan.id)} />}>
                  <EditIcon data-icon="inline-start" />
                  {tCommon('edit')}
                </DropdownMenuItem>
                {plan.isActive && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => setDisableTarget(plan)}>
                      <Trash2Icon data-icon="inline-start" />
                      {tCommon('disable')}
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
        <PageHeader
          title={tPages('title')}
          description={tPages('description')}
          actions={
            <Button size="sm" render={<Link href={ROUTES.admin.planNew} />}>
              <PlusIcon data-icon="inline-start" />
              {t('newPlan')}
            </Button>
          }
        />

        <Card>
          <CardContent className="pt-6">
            <DataTable
              data={filteredPlans}
              columns={columns}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={() => refetch()}
              rowCount={data?.total ?? 0}
              pagination={{ page: 1, limit: data?.total ?? 20 }}
              onPageChange={() => {}}
              rowSelection={selectedIds}
              onRowSelectionChange={setSelectedIds}
              getRowId={(row) => row.id}
              emptyTitle={t('empty')}
              emptyAction={
                <Button size="sm" render={<Link href={ROUTES.admin.planNew} />}>
                  <PlusIcon data-icon="inline-start" />
                  {t('form.create')}
                </Button>
              }
              toolbar={
                <SearchBar
                  value={searchInput}
                  onChange={setSearchInput}
                  placeholder={t('searchPlaceholder')}
                  className="w-full sm:max-w-xs"
                />
              }
            />
          </CardContent>
        </Card>
      </div>

      <DeleteDialog
        open={!!disableTarget}
        onOpenChange={(open) => !open && setDisableTarget(null)}
        title={t('disableDialog.title')}
        description={disableTarget ? t('disableDialog.description', { name: disableTarget.name }) : ''}
        onConfirm={() => {
          if (!disableTarget) return;
          disableMutation.mutate(disableTarget.id, { onSuccess: () => setDisableTarget(null) });
        }}
        isLoading={disableMutation.isPending}
      />
    </PageContainer>
  );
}
