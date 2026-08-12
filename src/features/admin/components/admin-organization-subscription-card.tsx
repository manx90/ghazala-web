'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { useAdminOrganizationSubscription } from '@/features/admin/hooks/use-admin-organizations';
import { BillingCycle } from '@/types/billing.types';
import { formatDateTime } from '@/utils/date';

interface AdminOrganizationSubscriptionCardProps {
  organizationId: string;
}

export function AdminOrganizationSubscriptionCard({
  organizationId,
}: AdminOrganizationSubscriptionCardProps) {
  const t = useTranslations('admin.organizations.subscription');
  const tSubs = useTranslations('admin.subscriptions');
  const tBilling = useTranslations('settings.billing.subscription');
  const tCommon = useTranslations('admin.common');
  const subscriptionQuery = useAdminOrganizationSubscription(organizationId);

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-base">{tBilling('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <QueryState
          isLoading={subscriptionQuery.isLoading}
          isError={subscriptionQuery.isError}
          error={subscriptionQuery.error}
          isEmpty={!subscriptionQuery.data?.hasSubscription}
          emptyTitle={t('empty')}
          onRetry={() => subscriptionQuery.refetch()}
        >
          {subscriptionQuery.data?.subscription && (
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground">{tBilling('plan')}</span>
                <p className="font-medium">
                  {subscriptionQuery.data.subscription.plan?.name ?? tCommon('notAvailable')}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">{tBilling('status')}</span>
                <div className="mt-1">
                  <StatusBadge status={subscriptionQuery.data.subscription.status} />
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">{tBilling('cycle')}</span>
                <p className="font-medium">
                  {subscriptionQuery.data.subscription.billingCycle === BillingCycle.MONTHLY
                    ? tSubs('cycle.monthly')
                    : tSubs('cycle.yearly')}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">{tBilling('expiresAt')}</span>
                <p className="font-medium" dir="ltr">
                  {subscriptionQuery.data.subscription.expiresAt
                    ? formatDateTime(subscriptionQuery.data.subscription.expiresAt)
                    : tCommon('notAvailable')}
                </p>
              </div>
            </div>
          )}
        </QueryState>
      </CardContent>
    </Card>
  );
}
