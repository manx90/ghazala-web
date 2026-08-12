'use client';

import { type ColumnDef } from '@tanstack/react-table';
import {
  CalendarPlusIcon,
  CheckCircle2Icon,
  ClockIcon,
  CreditCardIcon,
  EyeIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { DataTable } from '@/components/data-table';
import { FilterBar, SearchBar } from '@/components/feedback/bars';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminSubscriptionDetailDialog } from '@/features/admin/components/admin-subscription-detail-dialog';
import { AdminSubscriptionExtendDialog } from '@/features/admin/components/admin-subscription-extend-dialog';
import { useAdminPlans } from '@/features/admin/hooks/use-admin-plans';
import {
  useActivateAdminSubscription,
  useAdminSubscriptions,
  useAdminSubscriptionStats,
} from '@/features/admin/hooks/use-admin-subscriptions';
import type { AdminSubscription } from '@/types/admin.types';
import { BillingCycle, SubscriptionStatus } from '@/types/billing.types';
import { formatCurrency } from '@/utils/currency';
import { DEFAULT_CURRENCY } from '@/config/currency';
import { formatDateTime } from '@/utils/date';
import { cn } from '@/lib/utils';

const PAGE_LIMIT = 20;

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
  highlight,
}: {
  title: string;
  value: string | number;
  icon: typeof CreditCardIcon;
  loading?: boolean;
  highlight?: boolean;
}) {
  return (
    <Card className={cn(highlight && 'ring-1 ring-primary/20')}>
      <CardContent className="flex items-center gap-4 pt-6">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
          <Icon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          <span className="text-2xl font-bold tabular-nums">
            {loading ? '...' : value}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminSubscriptionsPage() {
  const t = useTranslations('admin.subscriptions');
  const tPages = useTranslations('admin.pages.subscriptions');
  const tCommon = useTranslations('admin.common');

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [extendTarget, setExtendTarget] = useState<AdminSubscription | null>(null);
  const [activateTarget, setActivateTarget] = useState<AdminSubscription | null>(null);

  const statsQuery = useAdminSubscriptionStats();
  const plansQuery = useAdminPlans();

  const statusOptions = useMemo(
    () =>
      [
        { value: 'all', label: t('filters.allStatuses') },
        { value: SubscriptionStatus.ACTIVE, label: t('filters.active') },
        { value: SubscriptionStatus.TRIAL, label: t('filters.trial') },
        { value: SubscriptionStatus.PENDING_PAYMENT, label: t('filters.pendingPayment') },
        { value: SubscriptionStatus.PAST_DUE, label: t('filters.pastDue') },
        { value: SubscriptionStatus.CANCELLED, label: t('filters.cancelled') },
        { value: SubscriptionStatus.EXPIRED, label: t('filters.expired') },
      ] as const,
    [t],
  );

  const billingCycleLabels = useMemo<Record<BillingCycle, string>>(
    () => ({
      [BillingCycle.MONTHLY]: t('cycle.monthly'),
      [BillingCycle.YEARLY]: t('cycle.yearly'),
    }),
    [t],
  );

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      ...(statusFilter !== 'all' ? { status: statusFilter as SubscriptionStatus } : {}),
      ...(planFilter !== 'all' ? { planId: planFilter } : {}),
      ...(searchInput.trim() ? { search: searchInput.trim() } : {}),
    }),
    [page, statusFilter, planFilter, searchInput],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useAdminSubscriptions(listParams);
  const activateMutation = useActivateAdminSubscription();

  const columns = useMemo<ColumnDef<AdminSubscription, unknown>[]>(
    () => [
      {
        id: 'organization',
        header: t('columns.organization'),
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{row.original.organization?.name ?? tCommon('notAvailable')}</span>
            <span className="font-mono text-xs text-muted-foreground" dir="ltr">
              {row.original.organization?.slug ?? row.original.organizationId}
            </span>
          </div>
        ),
      },
      {
        id: 'plan',
        header: t('columns.plan'),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.plan?.name ?? tCommon('notAvailable')}</span>
        ),
      },
      {
        id: 'status',
        header: t('columns.status'),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'billingCycle',
        header: t('columns.cycle'),
        cell: ({ row }) => billingCycleLabels[row.original.billingCycle],
      },
      {
        id: 'expiresAt',
        header: t('columns.expiresAt'),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.expiresAt ? formatDateTime(row.original.expiresAt) : tCommon('notAvailable')}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 48,
        cell: ({ row }) => {
          const subscription = row.original;
          const canActivate = subscription.status === SubscriptionStatus.PENDING_PAYMENT;
          const canExtend = [
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.TRIAL,
            SubscriptionStatus.PAST_DUE,
            SubscriptionStatus.EXPIRED,
          ].includes(subscription.status);

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
                <DropdownMenuItem onClick={() => setDetailId(subscription.id)}>
                  <EyeIcon data-icon="inline-start" />
                  {t('actions.details')}
                </DropdownMenuItem>
                {canActivate ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActivateTarget(subscription)}>
                      <CheckCircle2Icon data-icon="inline-start" />
                      {t('actions.manualActivate')}
                    </DropdownMenuItem>
                  </>
                ) : null}
                {canExtend ? (
                  <DropdownMenuItem onClick={() => setExtendTarget(subscription)}>
                    <CalendarPlusIcon data-icon="inline-start" />
                    {t('actions.extend')}
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t, tCommon, billingCycleLabels],
  );

  const stats = statsQuery.data;

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={tPages('title')}
          description={tPages('description')}
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void statsQuery.refetch();
                void refetch();
              }}
              disabled={statsQuery.isFetching || isFetching}
            >
              <RefreshCwIcon data-icon="inline-start" />
              {tCommon('refresh')}
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title={t('stats.active')}
            value={stats?.active ?? 0}
            icon={CheckCircle2Icon}
            loading={statsQuery.isLoading}
          />
          <StatCard
            title={t('stats.trial')}
            value={stats?.trial ?? 0}
            icon={ClockIcon}
            loading={statsQuery.isLoading}
          />
          <StatCard
            title={t('stats.pendingPayment')}
            value={stats?.pendingPayment ?? 0}
            icon={CreditCardIcon}
            loading={statsQuery.isLoading}
            highlight={(stats?.pendingPayment ?? 0) > 0}
          />
          <StatCard
            title={t('stats.mrr')}
            value={
              stats
                ? formatCurrency(stats.mrr, stats.currency)
                : formatCurrency('0', DEFAULT_CURRENCY)
            }
            icon={TrendingUpIcon}
            loading={statsQuery.isLoading}
          />
        </div>

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
              getRowId={(row) => row.id}
              emptyTitle={t('empty')}
              toolbar={
                <FilterBar>
                  <SearchBar
                    value={searchInput}
                    onChange={(value) => {
                      setSearchInput(value);
                      setPage(1);
                    }}
                    placeholder={t('searchPlaceholder')}
                    className="w-full sm:max-w-xs"
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
                    <SelectTrigger className="w-full sm:w-44">
                      <SelectValue placeholder={t('filters.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={planFilter}
                    onValueChange={(value) => {
                      if (value) {
                        setPlanFilter(value);
                        setPage(1);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-44">
                      <SelectValue placeholder={t('filters.plan')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('filters.allPlans')}</SelectItem>
                      {(plansQuery.data?.items ?? []).map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FilterBar>
              }
            />
          </CardContent>
        </Card>
      </div>

      <AdminSubscriptionDetailDialog
        subscriptionId={detailId}
        open={!!detailId}
        onOpenChange={(open) => !open && setDetailId(null)}
      />

      <AdminSubscriptionExtendDialog
        subscription={extendTarget}
        open={!!extendTarget}
        onOpenChange={(open) => !open && setExtendTarget(null)}
      />

      <ConfirmDialog
        open={!!activateTarget}
        onOpenChange={(open) => !open && setActivateTarget(null)}
        title={t('activateDialog.title')}
        description={
          activateTarget
            ? t('activateDialog.description', { name: activateTarget.organization?.name ?? '' })
            : ''
        }
        confirmLabel={t('activateDialog.confirm')}
        onConfirm={() => {
          if (!activateTarget) return;
          activateMutation.mutate(activateTarget.id, {
            onSuccess: () => setActivateTarget(null),
          });
        }}
        isLoading={activateMutation.isPending}
      />
    </PageContainer>
  );
}
