'use client';

import { useState, type CSSProperties } from 'react';
import { CheckCircle2Icon, Loader2Icon, SparklesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/global/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { QueryState } from '@/components/shared/query-state';
import {
  useBillingPlans,
  useSubscribePlan,
} from '@/features/onboarding/hooks/use-select-plan';
import { BillingCycle } from '@/types/billing.types';
import type { Plan } from '@/types/billing.types';
import { cn } from '@/lib/utils';

function formatPlanLimit(value: number | null): string {
  return value === null ? 'غير محدود' : value.toLocaleString();
}

function PlanLimitsList({ plan }: { plan: Plan }) {
  return (
    <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
      <li className="flex items-start gap-2">
        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
        {formatPlanLimit(plan.maxMessagesMonthly)} رسالة / شهر
      </li>
      <li className="flex items-start gap-2">
        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
        {formatPlanLimit(plan.maxContacts)} جهة اتصال
      </li>
      <li className="flex items-start gap-2">
        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
        {formatPlanLimit(plan.maxTeamMembers)} عضو فريق
      </li>
      <li className="flex items-start gap-2">
        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
        {formatPlanLimit(plan.maxPhoneNumbers)} رقم هاتف
      </li>
    </ul>
  );
}

export function SelectPlanForm() {
  const plansQuery = useBillingPlans();
  const subscribePlan = useSubscribePlan();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(BillingCycle.MONTHLY);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleSubscribe = () => {
    if (!selectedPlanId) return;
    subscribePlan.mutate({ planId: selectedPlanId, billingCycle });
  };

  return (
    <PageContainer size="md" className="py-10">
      <div className="animate-fade-in-up mb-8 flex flex-col items-center gap-3 text-center">
        <span className="bg-gradient-brand glow-brand flex size-14 items-center justify-center rounded-2xl text-primary-foreground shadow-lg">
          <SparklesIcon className="size-7" aria-hidden="true" />
        </span>
        <h1 className="text-3xl font-bold tracking-tight">اختر خطتك</h1>
        <p className="text-sm text-muted-foreground">اختر الخطة المناسبة لاحتياجات منظمتك</p>
      </div>

      <div className="animate-fade-in-up mb-8 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1 ring-1 ring-border">
          <Button
            type="button"
            variant={billingCycle === BillingCycle.MONTHLY ? 'gradient' : 'ghost'}
            className="rounded-full"
            onClick={() => setBillingCycle(BillingCycle.MONTHLY)}
          >
            شهري
          </Button>
          <Button
            type="button"
            variant={billingCycle === BillingCycle.YEARLY ? 'gradient' : 'ghost'}
            className="rounded-full"
            onClick={() => setBillingCycle(BillingCycle.YEARLY)}
          >
            سنوي
          </Button>
        </div>
      </div>

      <QueryState
        isLoading={plansQuery.isLoading}
        isError={plansQuery.isError}
        error={plansQuery.error}
        isEmpty={!plansQuery.data?.items.length}
        emptyTitle="لا توجد خطط متاحة"
        emptyDescription="تواصل مع الدعم للحصول على المساعدة"
        onRetry={() => plansQuery.refetch()}
        skeletonRows={3}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plansQuery.data?.items.map((plan, index) => {
            const price =
              billingCycle === BillingCycle.MONTHLY ? plan.monthlyPrice : plan.yearlyPrice;
            const isSelected = selectedPlanId === plan.id;

            return (
              <Card
                key={plan.id}
                className={cn(
                  'card-interactive stagger-in relative cursor-pointer transition-all duration-300 hover:ring-primary/50',
                  isSelected && 'bg-gradient-brand-soft ring-2 ring-primary',
                )}
                style={{ '--stagger-delay': `${index * 80}ms` } as CSSProperties}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                {isSelected && (
                  <span className="bg-gradient-brand animate-scale-in absolute end-3 top-3 flex size-6 items-center justify-center rounded-full text-primary-foreground shadow-md">
                    <CheckCircle2Icon className="size-4" aria-hidden="true" />
                  </span>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.description ? (
                    <CardDescription>{plan.description}</CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div>
                    <p className="text-3xl font-bold tracking-tight">
                      {price} <span className="text-base font-medium text-muted-foreground">{plan.currency}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {billingCycle === BillingCycle.MONTHLY ? 'شهرياً' : 'سنوياً'}
                    </p>
                  </div>
                  <PlanLimitsList plan={plan} />
                </CardContent>
                <CardFooter className="bg-transparent">
                  <Button
                    type="button"
                    variant={isSelected ? 'gradient' : 'outline'}
                    className="w-full"
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    {isSelected ? 'محددة' : 'اختيار'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="animate-fade-in-up mt-10 flex justify-center">
          <Button
            variant="gradient"
            size="lg"
            className="min-w-56"
            disabled={!selectedPlanId || subscribePlan.isPending}
            onClick={handleSubscribe}
          >
            {subscribePlan.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                جاري الاشتراك...
              </>
            ) : (
              'اشتراك الآن'
            )}
          </Button>
        </div>
      </QueryState>
    </PageContainer>
  );
}
