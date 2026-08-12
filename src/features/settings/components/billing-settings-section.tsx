'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgeCheckIcon, CreditCardIcon, Loader2Icon, ReceiptTextIcon, SparklesIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { ModalWrapper } from '@/components/global/modal-wrapper';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  createChangePlanSchema,
  type ChangePlanFormValues,
} from '@/features/settings/schemas/settings.schemas';
import {
  useBillingPlans,
  useCancelSubscription,
  useChangePlan,
  useInvoices,
  useSubscribe,
  useSubscription,
} from '@/features/settings/hooks/use-billing-settings';
import { BillingCycle, SubscriptionStatus } from '@/types/billing.types';
import type { Plan } from '@/types/billing.types';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { cn } from '@/lib/utils';
import { UsageLimitsCard } from '@/features/settings/components/usage-limits-card';

export function BillingSettingsSection() {
  const t = useTranslations('settings.billing');
  const tValidation = useTranslations('settings.validation');
  const tCommon = useTranslations('common');
  const subscriptionQuery = useSubscription();
  const plansQuery = useBillingPlans();
  const invoicesQuery = useInvoices();
  const subscribe = useSubscribe();
  const changePlan = useChangePlan();
  const cancelSubscription = useCancelSubscription();

  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const schema = useMemo(
    () => createChangePlanSchema((k) => tValidation(k)),
    [tValidation],
  );

  const form = useForm<ChangePlanFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      planId: '',
      billingCycle: BillingCycle.MONTHLY,
    },
  });

  const subscription = subscriptionQuery.data;
  const hasSubscription =
    subscription &&
    subscription.status !== SubscriptionStatus.CANCELLED &&
    subscription.status !== SubscriptionStatus.EXPIRED;

  const openPlanDialog = (plan: Plan) => {
    setSelectedPlan(plan);
    form.reset({
      planId: plan.id,
      billingCycle: subscription?.billingCycle ?? BillingCycle.MONTHLY,
    });
    setPlanDialogOpen(true);
  };

  const handlePlanSubmit = form.handleSubmit(async (values: ChangePlanFormValues) => {
    if (hasSubscription) {
      await changePlan.mutateAsync(values);
    } else {
      await subscribe.mutateAsync(values);
    }
    setPlanDialogOpen(false);
    setSelectedPlan(null);
  });

  const handleCancel = async () => {
    await cancelSubscription.mutateAsync();
    setCancelOpen(false);
  };

  const isPlanPending = subscribe.isPending || changePlan.isPending;

  return (
    <div className="flex flex-col gap-6">
      <Card className="stagger-in bg-gradient-brand-soft ring-primary/10">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="bg-gradient-brand flex size-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-md">
              <CreditCardIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>{t('subscription.title')}</CardTitle>
              <CardDescription>{t('subscription.description')}</CardDescription>
            </div>
          </div>
          {hasSubscription && subscription.status === SubscriptionStatus.ACTIVE && (
            <Button variant="destructive" onClick={() => setCancelOpen(true)}>
              {t('subscription.cancel')}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <QueryState
            isLoading={subscriptionQuery.isLoading}
            isError={subscriptionQuery.isError}
            error={subscriptionQuery.error}
            isEmpty={false}
            emptyTitle=""
            onRetry={() => void subscriptionQuery.refetch()}
          >
            {subscription && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('subscription.plan')}</p>
                  <p className="text-lg font-semibold tracking-tight">
                    {subscription.plan?.name ?? subscription.planId}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('subscription.status')}</p>
                  <StatusBadge status={subscription.status} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('subscription.cycle')}</p>
                  <p className="font-medium">
                    {subscription.billingCycle === BillingCycle.MONTHLY
                      ? t('cycle.monthly')
                      : t('cycle.yearly')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('subscription.expiresAt')}</p>
                  <p className="font-medium">{formatDate(subscription.expiresAt)}</p>
                </div>
              </div>
            )}
          </QueryState>
        </CardContent>
      </Card>

      {hasSubscription ? <UsageLimitsCard /> : null}

      <Card className="stagger-in" style={{ '--stagger-delay': '80ms' } as CSSProperties}>
        <CardHeader className="flex flex-row items-start gap-3">
          <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
            <SparklesIcon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>{t('plans.title')}</CardTitle>
            <CardDescription>{t('plans.description')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <QueryState
            isLoading={plansQuery.isLoading}
            isError={plansQuery.isError}
            error={plansQuery.error}
            isEmpty={!plansQuery.data?.items.length}
            emptyTitle={t('plans.emptyTitle')}
            onRetry={() => void plansQuery.refetch()}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {plansQuery.data?.items.map((plan, index) => {
                const isCurrent = subscription?.planId === plan.id;
                return (
                  <Card
                    key={plan.id}
                    size="sm"
                    className={cn(
                      'card-interactive stagger-in transition-all hover:ring-primary/40',
                      isCurrent && 'bg-gradient-brand-soft ring-2 ring-primary/60',
                    )}
                    style={{ '--stagger-delay': `${120 + index * 60}ms` } as CSSProperties}
                  >
                    <CardHeader className="flex flex-row items-start justify-between gap-2">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description ?? plan.code}</CardDescription>
                      </div>
                      {isCurrent && (
                        <Badge className="bg-gradient-brand shrink-0 gap-1 text-primary-foreground">
                          <BadgeCheckIcon className="size-3.5" aria-hidden="true" />
                          {t('plans.current')}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div>
                        <p className="text-3xl font-bold tracking-tight">
                          {formatCurrency(plan.monthlyPrice, plan.currency)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{t('plans.perMonth')}</p>
                      </div>
                      <Button
                        variant={isCurrent ? 'secondary' : 'gradient'}
                        disabled={isCurrent || !plan.isActive}
                        onClick={() => openPlanDialog(plan)}
                      >
                        {isCurrent
                          ? t('plans.currentPlan')
                          : hasSubscription
                            ? t('plans.changePlan')
                            : t('plans.subscribe')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </QueryState>
        </CardContent>
      </Card>

      <Card className="stagger-in" style={{ '--stagger-delay': '160ms' } as CSSProperties}>
        <CardHeader className="flex flex-row items-start gap-3">
          <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
            <ReceiptTextIcon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>{t('invoices.title')}</CardTitle>
            <CardDescription>{t('invoices.description')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <QueryState
            isLoading={invoicesQuery.isLoading}
            isError={invoicesQuery.isError}
            error={invoicesQuery.error}
            isEmpty={!invoicesQuery.data?.items.length}
            emptyTitle={t('invoices.emptyTitle')}
            onRetry={() => void invoicesQuery.refetch()}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('invoices.columns.number')}</TableHead>
                  <TableHead>{t('invoices.columns.amount')}</TableHead>
                  <TableHead>{t('invoices.columns.status')}</TableHead>
                  <TableHead>{t('invoices.columns.issuedAt')}</TableHead>
                  <TableHead>{t('invoices.columns.paidAt')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoicesQuery.data?.items.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium" dir="ltr">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell>{formatDate(invoice.issuedAt)}</TableCell>
                    <TableCell>{formatDate(invoice.paidAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </QueryState>
        </CardContent>
      </Card>

      <ModalWrapper
        open={planDialogOpen}
        onOpenChange={setPlanDialogOpen}
        title={hasSubscription ? t('changePlanDialog.changeTitle') : t('changePlanDialog.subscribeTitle')}
        description={selectedPlan?.name}
        footer={
          <>
            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button variant="gradient" onClick={() => void handlePlanSubmit()} disabled={isPlanPending}>
              {isPlanPending && <Loader2Icon className="animate-spin" />}
              {tCommon('confirm')}
            </Button>
          </>
        }
      >
        <form className="flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('subscription.cycle')}</p>
            <Select
              value={form.watch('billingCycle')}
              onValueChange={(value) =>
                form.setValue('billingCycle', value as BillingCycle, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BillingCycle.MONTHLY}>{t('cycle.monthly')}</SelectItem>
                <SelectItem value={BillingCycle.YEARLY}>{t('cycle.yearly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </ModalWrapper>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title={t('cancelDialog.title')}
        description={t('cancelDialog.description')}
        confirmLabel={t('cancelDialog.confirm')}
        variant="destructive"
        onConfirm={() => void handleCancel()}
        isLoading={cancelSubscription.isPending}
      />
    </div>
  );
}
