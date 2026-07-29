'use client';

import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanForm } from '@/features/admin/components/plan-form';
import { useCreatePlan } from '@/features/admin/hooks/use-admin-plans';
import type { PlanFormValues } from '@/features/admin/schemas/plan.schemas';
import { ROUTES } from '@/config/routes';

export default function AdminPlanNewPage() {
  const router = useRouter();
  const createMutation = useCreatePlan();

  const handleSubmit = (values: PlanFormValues) => {
    createMutation.mutate(
      {
        name: values.name,
        code: values.code,
        description: values.description,
        monthlyPrice: values.monthlyPrice,
        yearlyPrice: values.yearlyPrice,
        currency: values.currency,
        isActive: values.isActive,
      },
      {
        onSuccess: () => router.push(ROUTES.admin.plans),
      },
    );
  };

  return (
    <PageContainer size="md">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="خطة جديدة"
          description="إنشاء خطة اشتراك جديدة"
          actions={
            <Button variant="outline" size="sm" render={<Link href={ROUTES.admin.plans} />}>
              <ArrowRightIcon data-icon="inline-start" />
              العودة
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">بيانات الخطة</CardTitle>
          </CardHeader>
          <CardContent>
            <PlanForm mode="create" onSubmit={handleSubmit} isLoading={createMutation.isPending} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
