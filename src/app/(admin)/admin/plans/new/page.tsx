'use client';

import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlanForm } from '@/features/admin/components/plan-form';
import { useCreatePlan } from '@/features/admin/hooks/use-admin-plans';
import type { PlanFormValues } from '@/features/admin/schemas/plan.schemas';
import { planFormToCreatePayload } from '@/features/admin/utils/plan-form-payload';
import { ROUTES } from '@/config/routes';

export default function AdminPlanNewPage() {
  const router = useRouter();
  const createMutation = useCreatePlan();

  const handleSubmit = (values: PlanFormValues) => {
    createMutation.mutate(planFormToCreatePayload(values), {
      onSuccess: () => router.push(ROUTES.admin.plans),
    });
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

        <PlanForm mode="create" onSubmit={handleSubmit} isLoading={createMutation.isPending} />
      </div>
    </PageContainer>
  );
}
