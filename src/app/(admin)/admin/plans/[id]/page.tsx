'use client';

import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { QueryState } from '@/components/shared/query-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlanForm } from '@/features/admin/components/plan-form';
import { useAdminPlans, useUpdatePlan } from '@/features/admin/hooks/use-admin-plans';
import type { PlanFormValues } from '@/features/admin/schemas/plan.schemas';
import { ROUTES } from '@/config/routes';

export default function AdminPlanEditPage() {
  const params = useParams<{ id: string }>();
  const planId = params.id;

  const { data, isLoading, isError, error, refetch } = useAdminPlans();
  const updateMutation = useUpdatePlan(planId);

  const plan = data?.items.find((p) => p.id === planId);

  const handleSubmit = (values: PlanFormValues) => {
    updateMutation.mutate({
      name: values.name,
      description: values.description || null,
      monthlyPrice: values.monthlyPrice,
      yearlyPrice: values.yearlyPrice,
      currency: values.currency,
      isActive: values.isActive,
    });
  };

  return (
    <PageContainer size="md">
      <div className="flex flex-col gap-6">
        <PageHeader
          title={plan?.name ?? 'تعديل الخطة'}
          description={plan ? plan.code : 'جاري التحميل...'}
          actions={
            <Button variant="outline" size="sm" render={<Link href={ROUTES.admin.plans} />}>
              <ArrowRightIcon data-icon="inline-start" />
              العودة
            </Button>
          }
        />

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!plan && !isLoading}
          emptyTitle="الخطة غير موجودة"
          onRetry={() => refetch()}
        >
          {plan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">تعديل الخطة</CardTitle>
              </CardHeader>
              <CardContent>
                <PlanForm
                  mode="edit"
                  defaultValues={plan}
                  onSubmit={handleSubmit}
                  isLoading={updateMutation.isPending}
                />
              </CardContent>
            </Card>
          )}
        </QueryState>
      </div>
    </PageContainer>
  );
}
