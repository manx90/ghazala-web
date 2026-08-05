'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { useAdminOrganizationSubscription } from '@/features/admin/hooks/use-admin-organizations';
import { formatDateTime } from '@/utils/date';

interface AdminOrganizationSubscriptionCardProps {
  organizationId: string;
}

export function AdminOrganizationSubscriptionCard({
  organizationId,
}: AdminOrganizationSubscriptionCardProps) {
  const subscriptionQuery = useAdminOrganizationSubscription(organizationId);

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-base">الاشتراك</CardTitle>
      </CardHeader>
      <CardContent>
        <QueryState
          isLoading={subscriptionQuery.isLoading}
          isError={subscriptionQuery.isError}
          error={subscriptionQuery.error}
          isEmpty={!subscriptionQuery.data?.hasSubscription}
          emptyTitle="لا يوجد اشتراك"
          onRetry={() => subscriptionQuery.refetch()}
        >
          {subscriptionQuery.data?.subscription && (
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground">الخطة</span>
                <p className="font-medium">{subscriptionQuery.data.subscription.plan?.name ?? '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">الحالة</span>
                <div className="mt-1">
                  <StatusBadge status={subscriptionQuery.data.subscription.status} />
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">دورة الفوترة</span>
                <p className="font-medium">{subscriptionQuery.data.subscription.billingCycle}</p>
              </div>
              <div>
                <span className="text-muted-foreground">تاريخ الانتهاء</span>
                <p className="font-medium" dir="ltr">
                  {subscriptionQuery.data.subscription.expiresAt
                    ? formatDateTime(subscriptionQuery.data.subscription.expiresAt)
                    : '—'}
                </p>
              </div>
            </div>
          )}
        </QueryState>
      </CardContent>
    </Card>
  );
}
