'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { EditIcon, MoreHorizontalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
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
        header: 'الاسم',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-xs font-bold text-primary ring-1 ring-primary/10">
              {row.original.name.trim().charAt(0) || '—'}
            </span>
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        id: 'code',
        header: 'الرمز',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground" dir="ltr">
            {row.original.code}
          </span>
        ),
      },
      {
        id: 'monthly',
        header: 'شهري',
        cell: ({ row }) => (
          <span>
            <span className="font-medium tabular-nums">{row.original.monthlyPrice}</span>{' '}
            <span className="text-xs text-muted-foreground">{row.original.currency}</span>
          </span>
        ),
      },
      {
        id: 'yearly',
        header: 'سنوي',
        cell: ({ row }) => (
          <span>
            <span className="font-medium tabular-nums">{row.original.yearlyPrice}</span>{' '}
            <span className="text-xs text-muted-foreground">{row.original.currency}</span>
          </span>
        ),
      },
      {
        id: 'limits',
        header: 'الرسائل/شهر',
        cell: ({ row }) => (
          <span className="text-sm tabular-nums">
            {row.original.maxMessagesMonthly?.toLocaleString() ?? '∞'}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'الحالة',
        cell: ({ row }) => <StatusBadge status={row.original.isActive ? 'ACTIVE' : 'DISABLED'} />,
      },
      {
        id: 'createdAt',
        header: 'تاريخ الإنشاء',
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
                  <Button variant="ghost" size="sm" aria-label="إجراءات">
                    <MoreHorizontalIcon />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href={ROUTES.admin.plan(plan.id)} />}>
                  <EditIcon data-icon="inline-start" />
                  تعديل
                </DropdownMenuItem>
                {plan.isActive && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => setDisableTarget(plan)}>
                      <Trash2Icon data-icon="inline-start" />
                      تعطيل
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="الخطط"
          description="إدارة خطط الاشتراك والأسعار"
          actions={
            <Button size="sm" render={<Link href={ROUTES.admin.planNew} />}>
              <PlusIcon data-icon="inline-start" />
              خطة جديدة
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
              emptyTitle="لا توجد خطط"
              emptyAction={
                <Button size="sm" render={<Link href={ROUTES.admin.planNew} />}>
                  <PlusIcon data-icon="inline-start" />
                  إنشاء خطة
                </Button>
              }
              toolbar={
                <SearchBar
                  value={searchInput}
                  onChange={setSearchInput}
                  placeholder="بحث بالاسم أو الرمز..."
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
        title="تعطيل الخطة"
        description={`تعطيل "${disableTarget?.name}"؟ لن تظهر للعملاء.`}
        onConfirm={() => {
          if (!disableTarget) return;
          disableMutation.mutate(disableTarget.id, { onSuccess: () => setDisableTarget(null) });
        }}
        isLoading={disableMutation.isPending}
      />
    </PageContainer>
  );
}
