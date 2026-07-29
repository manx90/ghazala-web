'use client';

import { useState } from 'react';
import { Loader2Icon } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
    <PageContainer size="md" className="py-12">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-2xl font-semibold">اختر خطتك</h1>
        <p className="text-sm text-muted-foreground">اختر الخطة المناسبة لاحتياجات منظمتك</p>
      </div>

      <div className="mb-6 flex justify-center gap-2">
        <Button
          type="button"
          variant={billingCycle === BillingCycle.MONTHLY ? 'default' : 'outline'}
          onClick={() => setBillingCycle(BillingCycle.MONTHLY)}
        >
          شهري
        </Button>
        <Button
          type="button"
          variant={billingCycle === BillingCycle.YEARLY ? 'default' : 'outline'}
          onClick={() => setBillingCycle(BillingCycle.YEARLY)}
        >
          سنوي
        </Button>
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
          {plansQuery.data?.items.map((plan) => {
            const price =
              billingCycle === BillingCycle.MONTHLY ? plan.monthlyPrice : plan.yearlyPrice;
            const isSelected = selectedPlanId === plan.id;

            return (
              <Card
                key={plan.id}
                className={cn(
                  'cursor-pointer transition-colors',
                  isSelected && 'ring-2 ring-primary',
                )}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.description ? (
                    <CardDescription>{plan.description}</CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {price} {plan.currency}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {billingCycle === BillingCycle.MONTHLY ? 'شهرياً' : 'سنوياً'}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
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

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
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
