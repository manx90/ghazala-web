'use client';

import { useTranslations } from 'next-intl';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { QueryState } from '@/components/shared/query-state';
import { Button } from '@/components/ui/button';
import { PlanForm } from '@/features/admin/components/plan-form';
import { useAdminPlans, useUpdatePlan } from '@/features/admin/hooks/use-admin-plans';
import type { PlanFormValues } from '@/features/admin/schemas/plan.schemas';
import { planFormToUpdatePayload } from '@/features/admin/utils/plan-form-payload';
import { ROUTES } from '@/config/routes';

export default function AdminPlanEditPage() {
  const t = useTranslations('admin.pages.planEdit');
  const tCommon = useTranslations('admin.common');
  const params = useParams<{ id: string }>();
  const planId = params.id;

  const { data, isLoading, isError, error, refetch } = useAdminPlans();
  const updateMutation = useUpdatePlan(planId);

  const plan = data?.items.find((p) => p.id === planId);

  const handleSubmit = (values: PlanFormValues) => {
    updateMutation.mutate(planFormToUpdatePayload(values));
  };

  return (
    <PageContainer size="md">
      <div className="flex flex-col gap-6">
        <PageHeader
          title={plan?.name ?? t('title')}
          description={plan ? plan.code : tCommon('loading')}
          actions={
            <Button variant="outline" size="sm" render={<Link href={ROUTES.admin.plans} />}>
              <ArrowRightIcon data-icon="inline-start" />
              {tCommon('back')}
            </Button>
          }
        />

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!plan && !isLoading}
          emptyTitle={t('notFound')}
          onRetry={() => refetch()}
        >
          {plan && (
            <PlanForm
              mode="edit"
              defaultValues={plan}
              onSubmit={handleSubmit}
              isLoading={updateMutation.isPending}
            />
          )}
        </QueryState>
      </div>
    </PageContainer>
  );
}
