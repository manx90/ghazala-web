'use client';

import { type ColumnDef } from '@tanstack/react-table';
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CopyIcon,
  ExternalLinkIcon,
  LinkIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  WalletIcon,
  WebhookIcon,
  XCircleIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DataTable } from '@/components/data-table';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useAddWhopFreeDays,
  useAdminWhopMemberships,
  useAdminWhopPayments,
  useAdminWhopPlans,
  useAdminWhopPromoCodes,
  useAdminWhopStatus,
  useAdminWhopWebhookEvents,
  useAdminWhopWebhooks,
  useApplyWhopPlanSuggestion,
  useCancelWhopMembership,
  useCreateWhopCheckout,
  useCreateWhopPromoCode,
  useDeleteWhopPromoCode,
  usePauseWhopMembership,
  useRefundWhopPayment,
  useRegisterWhopWebhook,
  useResumeWhopMembership,
  useRetryWhopPayment,
  useSyncAllWhopPlans,
  useSyncWhopPlan,
  useUncancelWhopMembership,
  useUpdateWhopPlanMapping,
  useVoidWhopPayment,
} from '@/features/admin/hooks/use-admin-whop';
import type {
  AdminWhopLocalPlanMapping,
  AdminWhopMembershipItem,
  AdminWhopPaymentItem,
  AdminWhopWebhookEventItem,
} from '@/types/admin.types';
import { formatCurrency } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';
import { useToastI18n } from '@/hooks/use-toast-i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NONE_VALUE = '__none__';

function ConfigRow({ label, value, ok }: { label: string; value: React.ReactNode; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 text-sm font-medium">
        {ok !== undefined ? (
          ok ? (
            <CheckCircle2Icon className="size-4 text-emerald-500" />
          ) : (
            <XCircleIcon className="size-4 text-destructive" />
          )
        ) : null}
        <span dir="ltr">{value}</span>
      </div>
    </div>
  );
}

function PlanMappingRow({
  plan,
  whopPlanOptions,
}: {
  plan: AdminWhopLocalPlanMapping;
  whopPlanOptions: { id: string; label: string }[];
}) {
  const t = useTranslations('admin.whop');
  const tPlans = useTranslations('admin.plans.columns');
  const [monthly, setMonthly] = useState(plan.whopPlanIdMonthly ?? '');
  const [yearly, setYearly] = useState(plan.whopPlanIdYearly ?? '');
  const updateMutation = useUpdateWhopPlanMapping(plan.id);
  const syncMutation = useSyncWhopPlan();
  const checkoutMutation = useCreateWhopCheckout();

  const dirty =
    monthly !== (plan.whopPlanIdMonthly ?? '') || yearly !== (plan.whopPlanIdYearly ?? '');

  return (
    <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
      <div>
        <p className="font-medium">{plan.name}</p>
        <p className="font-mono text-xs text-muted-foreground" dir="ltr">
          {plan.code}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          <Button
            size="sm"
            variant="outline"
            disabled={syncMutation.isPending}
            onClick={() => syncMutation.mutate(plan.id)}
          >
            <RotateCcwIcon data-icon="inline-start" />
            {t('actions.syncWhop')}
          </Button>
          {monthly ? (
            <Button
              size="sm"
              variant="ghost"
              disabled={checkoutMutation.isPending}
              onClick={() => checkoutMutation.mutate({ whopPlanId: monthly })}
            >
              <ExternalLinkIcon data-icon="inline-start" />
              {t('actions.monthlyCheckout')}
            </Button>
          ) : null}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">{`Whop ${tPlans('monthly')}`}</label>
        <Select
          value={monthly || NONE_VALUE}
          onValueChange={(v) => setMonthly(v === NONE_VALUE ? '' : (v ?? ''))}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('actions.selectWhopPlan')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>{t('mapping.notLinked')}</SelectItem>
            {whopPlanOptions.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">{`Whop ${tPlans('yearly')}`}</label>
        <Select
          value={yearly || NONE_VALUE}
          onValueChange={(v) => setYearly(v === NONE_VALUE ? '' : (v ?? ''))}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('actions.selectWhopPlan')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>{t('mapping.notLinked')}</SelectItem>
            {whopPlanOptions.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        size="sm"
        disabled={!dirty || updateMutation.isPending}
        onClick={() =>
          updateMutation.mutate({
            whopPlanIdMonthly: monthly || null,
            whopPlanIdYearly: yearly || null,
          })
        }
      >
        {t('actions.save')}
      </Button>
    </div>
  );
}

export function AdminWhopContent() {
  const t = useTranslations('admin.whop');
  const tPages = useTranslations('admin.pages.whop');
  const tSubs = useTranslations('admin.subscriptions');
  const tPlansCol = useTranslations('admin.plans.columns');
  const tCommon = useTranslations('admin.common');
  const { toastSuccess } = useToastI18n();
  const [tab, setTab] = useState('status');
  const [promoCode, setPromoCode] = useState('');
  const [promoAmount, setPromoAmount] = useState('20');
  const [promoType, setPromoType] = useState<'percentage' | 'flat_amount'>('percentage');
  const [promoNewUsersOnly, setPromoNewUsersOnly] = useState(true);
  const [promoDuration, setPromoDuration] = useState('1');

  const statusQuery = useAdminWhopStatus();
  const plansQuery = useAdminWhopPlans();
  const paymentsQuery = useAdminWhopPayments();
  const membershipsQuery = useAdminWhopMemberships();
  const webhookQuery = useAdminWhopWebhookEvents();
  const webhooksQuery = useAdminWhopWebhooks();
  const promoQuery = useAdminWhopPromoCodes();
  const applySuggestion = useApplyWhopPlanSuggestion();
  const syncAllMutation = useSyncAllWhopPlans();
  const registerWebhookMutation = useRegisterWhopWebhook();
  const refundMutation = useRefundWhopPayment();
  const retryMutation = useRetryWhopPayment();
  const voidMutation = useVoidWhopPayment();
  const cancelMembershipMutation = useCancelWhopMembership();
  const pauseMembershipMutation = usePauseWhopMembership();
  const resumeMembershipMutation = useResumeWhopMembership();
  const uncancelMembershipMutation = useUncancelWhopMembership();
  const freeDaysMutation = useAddWhopFreeDays();
  const createPromoMutation = useCreateWhopPromoCode();
  const deletePromoMutation = useDeleteWhopPromoCode();

  const status = statusQuery.data;
  const plansData = plansQuery.data;

  const whopPlanOptions = useMemo(
    () =>
      (plansData?.whopPlans ?? []).map((p) => ({
        id: p.id,
        label: `${p.title} — ${formatCurrency(String(p.renewalPrice), p.currency)}${p.billingPeriod ? ` / ${p.billingPeriod}d` : ''}`,
      })),
    [plansData?.whopPlans],
  );

  const paymentColumns = useMemo<ColumnDef<AdminWhopPaymentItem, unknown>[]>(
    () => [
      {
        id: 'id',
        header: t('payments.columns.id'),
        cell: ({ row }) => (
          <span className="font-mono text-xs" dir="ltr">
            {row.original.id}
          </span>
        ),
      },
      {
        id: 'amount',
        header: t('payments.columns.amount'),
        cell: ({ row }) => formatCurrency(String(row.original.amount), row.original.currency),
      },
      {
        id: 'status',
        header: t('payments.columns.status'),
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.substatus || row.original.status || tCommon('notAvailable')}</Badge>
        ),
      },
      {
        id: 'plan',
        header: t('payments.columns.plan'),
        cell: ({ row }) => row.original.planTitle ?? row.original.planId ?? tCommon('notAvailable'),
      },
      {
        id: 'createdAt',
        header: t('payments.columns.date'),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 48,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="sm" aria-label={tCommon('actions')}>
                  <MoreHorizontalIcon />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => refundMutation.mutate({ paymentId: row.original.id })}
              >
                {t('payments.refund')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => retryMutation.mutate(row.original.id)}>
                {t('payments.retry')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => voidMutation.mutate(row.original.id)}
              >
                {t('payments.cancel')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [t, tCommon, refundMutation, retryMutation, voidMutation],
  );

  const membershipColumns = useMemo<ColumnDef<AdminWhopMembershipItem, unknown>[]>(
    () => [
      {
        id: 'id',
        header: t('memberships.columns.id'),
        cell: ({ row }) => (
          <span className="font-mono text-xs" dir="ltr">
            {row.original.id}
          </span>
        ),
      },
      {
        id: 'status',
        header: t('memberships.columns.status'),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'plan',
        header: t('memberships.columns.product'),
        cell: ({ row }) => row.original.planTitle ?? tCommon('notAvailable'),
      },
      {
        id: 'member',
        header: t('memberships.columns.member'),
        cell: ({ row }) => (
          <span className="text-xs" dir="ltr">
            {row.original.memberEmail ?? tCommon('notAvailable')}
          </span>
        ),
      },
      {
        id: 'renewsAt',
        header: t('memberships.columns.renewal'),
        cell: ({ row }) =>
          row.original.renewsAt ? formatDateTime(row.original.renewsAt) : tCommon('notAvailable'),
      },
      {
        id: 'actions',
        header: '',
        size: 48,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="sm" aria-label={tCommon('actions')}>
                  <MoreHorizontalIcon />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  cancelMembershipMutation.mutate({
                    membershipId: row.original.id,
                    mode: 'at_period_end',
                  })
                }
              >
                {t('memberships.cancelEndOfPeriod')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  cancelMembershipMutation.mutate({
                    membershipId: row.original.id,
                    mode: 'immediate',
                  })
                }
              >
                {t('memberships.cancelImmediate')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => pauseMembershipMutation.mutate(row.original.id)}>
                {t('memberships.pause')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => resumeMembershipMutation.mutate(row.original.id)}>
                {t('memberships.resume')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => freeDaysMutation.mutate({ membershipId: row.original.id, freeDays: 7 })}
              >
                {t('memberships.freeDays')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [
      t,
      tCommon,
      cancelMembershipMutation,
      pauseMembershipMutation,
      resumeMembershipMutation,
      freeDaysMutation,
    ],
  );

  const webhookColumns = useMemo<ColumnDef<AdminWhopWebhookEventItem, unknown>[]>(
    () => [
      {
        id: 'eventType',
        header: t('events.columns.type'),
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.eventType}</Badge>
        ),
      },
      {
        id: 'eventId',
        header: t('events.columns.eventId'),
        cell: ({ row }) => (
          <span className="font-mono text-xs" dir="ltr">
            {row.original.eventId}
          </span>
        ),
      },
      {
        id: 'processedAt',
        header: t('events.columns.processedAt'),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {formatDateTime(row.original.processedAt)}
          </span>
        ),
      },
    ],
    [t],
  );

  const refreshAll = () => {
    void statusQuery.refetch();
    void plansQuery.refetch();
    void paymentsQuery.refetch();
    void membershipsQuery.refetch();
    void webhookQuery.refetch();
    void webhooksQuery.refetch();
    void promoQuery.refetch();
  };

  const copyWebhookUrl = async () => {
    if (!status?.webhookUrl) return;
    await navigator.clipboard.writeText(status.webhookUrl);
    toastSuccess(t('toast.webhookCopied'));
  };

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
              onClick={refreshAll}
              disabled={
                statusQuery.isFetching ||
                plansQuery.isFetching ||
                paymentsQuery.isFetching
              }
            >
              <RefreshCwIcon data-icon="inline-start" />
              {tCommon('refresh')}
            </Button>
          }
        />

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="status">{t('tabs.status')}</TabsTrigger>
            <TabsTrigger value="plans">{t('tabs.plans')}</TabsTrigger>
            <TabsTrigger value="transactions">{t('tabs.transactions')}</TabsTrigger>
            <TabsTrigger value="promo">{t('tabs.promoCodes')}</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="mt-4 space-y-4">
            {status?.warning ? (
              <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
                <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <span>{status.warning}</span>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <WalletIcon className="size-4" />
                    {t('config.apiKey')}
                  </CardTitle>
                  <CardDescription>{t('config.configured')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {statusQuery.isLoading ? (
                    <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
                  ) : (
                    <>
                      <ConfigRow label={t('config.configured')} value={status?.configured ? tCommon('yes') : tCommon('no')} ok={status?.configured} />
                      <ConfigRow label={t('config.sandbox')} value={status?.sandbox ? tCommon('yes') : tCommon('no')} />
                      <ConfigRow
                        label={t('config.webhookSecret')}
                        value={status?.webhookSecretConfigured ? t('config.configuredYes') : t('config.configuredNo')}
                        ok={status?.webhookSecretConfigured}
                      />
                      <ConfigRow label={t('config.companyId')} value={status?.companyId ?? tCommon('notAvailable')} ok={status?.companyIdConfigured} />
                      <ConfigRow label={t('config.apiKey')} value={status?.maskedApiKey ?? tCommon('notAvailable')} />
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <WebhookIcon className="size-4" />
                    Webhook
                  </CardTitle>
                  <CardDescription>{t("tabs.transactions")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="break-all font-mono text-xs" dir="ltr">
                      {status?.webhookUrl ?? '—'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => void copyWebhookUrl()}>
                    <CopyIcon data-icon="inline-start" />
                    {t('actions.copyWebhook')}
                  </Button>
                  <Button
                    size="sm"
                    disabled={registerWebhookMutation.isPending}
                    onClick={() => registerWebhookMutation.mutate()}
                  >
                    <WebhookIcon data-icon="inline-start" />
                    {t('actions.registerWhop')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {(webhooksQuery.data?.items.length ?? 0) > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Webhooks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {webhooksQuery.data?.items.map((hook) => (
                    <div key={hook.id} className="rounded-md border px-3 py-2 text-sm">
                      <p className="break-all font-mono text-xs" dir="ltr">
                        {hook.url}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {hook.enabled ? t('promo.enabled') : t('promo.disabled')} — {t('promo.eventsCount', { count: hook.events.length })}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="plans" className="mt-4 space-y-4">
            {plansData?.error ? (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                <span>{plansData.error}</span>
              </div>
            ) : null}

            {(plansData?.suggestions ?? []).length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("tabs.plans")}</CardTitle>
                  <CardDescription>{t("mapping.notLinked")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {plansData?.suggestions.map((s) => {
                    const local = plansData.localPlans.find((p) => p.id === s.localPlanId);
                    const whop = plansData.whopPlans.find((p) => p.id === s.whopPlanId);
                    return (
                      <div
                        key={`${s.localPlanId}-${s.billingCycle}`}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                      >
                        <span>
                          {local?.name} ← {whop?.title} ({s.billingCycle === 'monthly' ? tSubs('cycle.monthly') : tSubs('cycle.yearly')})
                        </span>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={applySuggestion.isPending}
                          onClick={() =>
                            applySuggestion.mutate({
                              planId: s.localPlanId,
                              whopPlanId: s.whopPlanId,
                              billingCycle: s.billingCycle,
                              currentMonthly: local?.whopPlanIdMonthly ?? null,
                              currentYearly: local?.whopPlanIdYearly ?? null,
                            })
                          }
                        >
                          <LinkIcon data-icon="inline-start" />
                          {t('actions.save')}
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{t("tabs.plans")}</CardTitle>
                  <CardDescription>
                    {(plansData?.localPlans ?? []).filter((p) => p.isFullyMapped).length} /{' '}
                    {plansData?.localPlans.length ?? 0}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={syncAllMutation.isPending}
                  onClick={() => syncAllMutation.mutate()}
                >
                  <RotateCcwIcon data-icon="inline-start" />
                  {t('actions.syncWhop')}
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {plansQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
                ) : (
                  (plansData?.localPlans ?? []).map((plan) => (
                    <PlanMappingRow key={plan.id} plan={plan} whopPlanOptions={whopPlanOptions} />
                  ))
                )}
              </CardContent>
            </Card>

            {(plansData?.whopPlans ?? []).length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("tabs.plans")} ({plansData?.whopPlans.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="py-2 text-start">{tPlansCol('name')}</th>
                          <th className="py-2 text-start">{tPlansCol('monthly')}</th>
                          <th className="py-2 text-start">{tSubs('columns.cycle')}</th>
                          <th className="py-2 text-start">{t('payments.columns.id')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plansData?.whopPlans.map((p) => (
                          <tr key={p.id} className="border-b border-border/40">
                            <td className="py-2">{p.title}</td>
                            <td className="py-2 tabular-nums">
                              {formatCurrency(String(p.renewalPrice), p.currency)}
                            </td>
                            <td className="py-2">{p.billingPeriod ?? tCommon("notAvailable")}</td>
                            <td className="py-2 font-mono text-xs" dir="ltr">
                              {p.id}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="transactions" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('tabs.transactions')}</CardTitle>
                {paymentsQuery.data?.error ? (
                  <CardDescription className="text-destructive">{paymentsQuery.data.error}</CardDescription>
                ) : null}
              </CardHeader>
              <CardContent>
                <DataTable
                  data={paymentsQuery.data?.items ?? []}
                  columns={paymentColumns}
                  isLoading={paymentsQuery.isLoading}
                  isError={paymentsQuery.isError}
                  error={paymentsQuery.error}
                  onRetry={() => void paymentsQuery.refetch()}
                  rowCount={paymentsQuery.data?.items.length ?? 0}
                  pagination={{ page: 1, limit: 20 }}
                  onPageChange={() => {}}
                  getRowId={(row) => row.id}
                  emptyTitle={t('payments.empty')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('memberships.columns.member')}</CardTitle>
                {membershipsQuery.data?.error ? (
                  <CardDescription className="text-destructive">
                    {membershipsQuery.data.error}
                  </CardDescription>
                ) : null}
              </CardHeader>
              <CardContent>
                <DataTable
                  data={membershipsQuery.data?.items ?? []}
                  columns={membershipColumns}
                  isLoading={membershipsQuery.isLoading}
                  isError={membershipsQuery.isError}
                  error={membershipsQuery.error}
                  onRetry={() => void membershipsQuery.refetch()}
                  rowCount={membershipsQuery.data?.items.length ?? 0}
                  pagination={{ page: 1, limit: 20 }}
                  onPageChange={() => {}}
                  getRowId={(row) => row.id}
                  emptyTitle={t('memberships.empty')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('events.columns.type')}</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={webhookQuery.data?.items ?? []}
                  columns={webhookColumns}
                  isLoading={webhookQuery.isLoading}
                  isError={webhookQuery.isError}
                  error={webhookQuery.error}
                  onRetry={() => void webhookQuery.refetch()}
                  rowCount={webhookQuery.data?.items.length ?? 0}
                  pagination={{ page: 1, limit: 20 }}
                  onPageChange={() => {}}
                  getRowId={(row) => row.id}
                  emptyTitle={t('events.empty')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promo" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('promo.create')}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="promo-code">{t("promo.create")}</Label>
                  <Input
                    id="promo-code"
                    dir="ltr"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="SAVE20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo-amount">{t('promo.fixedAmount')}</Label>
                  <Input
                    id="promo-amount"
                    type="number"
                    value={promoAmount}
                    onChange={(e) => setPromoAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('promo.percentage')}</Label>
                  <Select value={promoType} onValueChange={(v) => v && setPromoType(v as typeof promoType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">{t("promo.percentage")}</SelectItem>
                      <SelectItem value="flat_amount">{t("promo.fixedAmount")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo-duration">{t('promo.create')}</Label>
                  <Input
                    id="promo-duration"
                    type="number"
                    min={1}
                    value={promoDuration}
                    onChange={(e) => setPromoDuration(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <Switch checked={promoNewUsersOnly} onCheckedChange={setPromoNewUsersOnly} />
                  <Label>{t("promo.newUsersOnly")}</Label>
                </div>
                <Button
                  className="md:col-span-2 md:w-fit"
                  disabled={!promoCode.trim() || createPromoMutation.isPending}
                  onClick={() =>
                    createPromoMutation.mutate({
                      code: promoCode.trim(),
                      promoType,
                      amountOff: parseFloat(promoAmount) || 0,
                      newUsersOnly: promoNewUsersOnly,
                      promoDurationMonths: parseInt(promoDuration, 10) || 1,
                    })
                  }
                >
                  {t("promo.create")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('tabs.promoCodes')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {promoQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
                ) : (promoQuery.data?.items.length ?? 0) === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("promo.empty")}</p>
                ) : (
                  promoQuery.data?.items.map((promo) => (
                    <div
                      key={promo.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                    >
                      <div>
                        <span className="font-mono font-medium" dir="ltr">
                          {promo.code}
                        </span>
                        <span className="mx-2 text-muted-foreground">—</span>
                        <span>
                          {promo.amountOff}
                          {promo.promoType === 'percentage' ? '%' : ` ${promo.currency}`}
                        </span>
                        <Badge variant="outline" className="ms-2">
                          {promo.status}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={deletePromoMutation.isPending}
                        onClick={() => deletePromoMutation.mutate(promo.id)}
                      >
                        {t("promo.archive")}
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
