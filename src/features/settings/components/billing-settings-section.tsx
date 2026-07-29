'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
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
  changePlanSchema,
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

const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  [BillingCycle.MONTHLY]: 'شهري',
  [BillingCycle.YEARLY]: 'سنوي',
};

export function BillingSettingsSection() {
  const subscriptionQuery = useSubscription();
  const plansQuery = useBillingPlans();
  const invoicesQuery = useInvoices();
  const subscribe = useSubscribe();
  const changePlan = useChangePlan();
  const cancelSubscription = useCancelSubscription();

  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const form = useForm<ChangePlanFormValues>({
    resolver: zodResolver(changePlanSchema),
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
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>الاشتراك الحالي</CardTitle>
            <CardDescription>تفاصيل خطتك ودورة الفوترة</CardDescription>
          </div>
          {hasSubscription && subscription.status === SubscriptionStatus.ACTIVE && (
            <Button variant="destructive" onClick={() => setCancelOpen(true)}>
              إلغاء الاشتراك
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
                  <p className="text-sm text-muted-foreground">الخطة</p>
                  <p className="font-medium">{subscription.plan?.name ?? subscription.planId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">الحالة</p>
                  <StatusBadge status={subscription.status} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">دورة الفوترة</p>
                  <p>{BILLING_CYCLE_LABELS[subscription.billingCycle]}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">تاريخ الانتهاء</p>
                  <p>{formatDate(subscription.expiresAt)}</p>
                </div>
              </div>
            )}
          </QueryState>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الخطط المتاحة</CardTitle>
          <CardDescription>اختر خطة أو غيّر خطتك الحالية</CardDescription>
        </CardHeader>
        <CardContent>
          <QueryState
            isLoading={plansQuery.isLoading}
            isError={plansQuery.isError}
            error={plansQuery.error}
            isEmpty={!plansQuery.data?.items.length}
            emptyTitle="لا توجد خطط"
            onRetry={() => void plansQuery.refetch()}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {plansQuery.data?.items.map((plan) => {
                const isCurrent = subscription?.planId === plan.id;
                return (
                  <Card key={plan.id} size="sm">
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description ?? plan.code}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <div>
                        <p className="text-2xl font-semibold">
                          {formatCurrency(plan.monthlyPrice, plan.currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">شهرياً</p>
                      </div>
                      <Button
                        variant={isCurrent ? 'secondary' : 'default'}
                        disabled={isCurrent || !plan.isActive}
                        onClick={() => openPlanDialog(plan)}
                      >
                        {isCurrent ? 'الخطة الحالية' : hasSubscription ? 'تغيير الخطة' : 'اشتراك'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </QueryState>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الفواتير</CardTitle>
          <CardDescription>سجل الفواتير السابقة</CardDescription>
        </CardHeader>
        <CardContent>
          <QueryState
            isLoading={invoicesQuery.isLoading}
            isError={invoicesQuery.isError}
            error={invoicesQuery.error}
            isEmpty={!invoicesQuery.data?.items.length}
            emptyTitle="لا توجد فواتير"
            onRetry={() => void invoicesQuery.refetch()}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الفاتورة</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإصدار</TableHead>
                  <TableHead>تاريخ الدفع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoicesQuery.data?.items.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
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
        title={hasSubscription ? 'تغيير الخطة' : 'اشتراك جديد'}
        description={selectedPlan?.name}
        footer={
          <>
            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={() => void handlePlanSubmit()} disabled={isPlanPending}>
              {isPlanPending && <Loader2Icon className="animate-spin" />}
              تأكيد
            </Button>
          </>
        }
      >
        <form className="flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">دورة الفوترة</p>
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
                <SelectItem value={BillingCycle.MONTHLY}>شهري</SelectItem>
                <SelectItem value={BillingCycle.YEARLY}>سنوي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </ModalWrapper>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="إلغاء الاشتراك"
        description="هل أنت متأكد من إلغاء الاشتراك؟ سيظل نشطاً حتى نهاية دورة الفوترة."
        confirmLabel="إلغاء الاشتراك"
        variant="destructive"
        onConfirm={() => void handleCancel()}
        isLoading={cancelSubscription.isPending}
      />
    </div>
  );
}
