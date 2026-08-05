'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QueryState } from '@/components/shared/query-state';
import { useAdminOrganizationUsage } from '@/features/admin/hooks/use-admin-organizations';
import type { UsageMetric } from '@/types/billing.types';
import { cn } from '@/lib/utils';

function formatLimit(limit: number | null): string {
  return limit === null ? '∞' : limit.toLocaleString();
}

function UsageBar({ label, metric }: { label: string; metric: UsageMetric }) {
  const isWarning = metric.limit !== null && metric.percentUsed >= 80;
  const isCritical = metric.limit !== null && metric.percentUsed >= 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {metric.used.toLocaleString()} / {formatLimit(metric.limit)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isCritical ? 'bg-destructive' : isWarning ? 'bg-amber-500' : 'bg-primary',
          )}
          style={{ width: `${metric.limit === null ? 0 : Math.min(metric.percentUsed, 100)}%` }}
        />
      </div>
    </div>
  );
}

interface AdminOrganizationUsageCardProps {
  organizationId: string;
}

export function AdminOrganizationUsageCard({ organizationId }: AdminOrganizationUsageCardProps) {
  const usageQuery = useAdminOrganizationUsage(organizationId);

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-base">استخدام الخطة</CardTitle>
        <CardDescription>
          {usageQuery.data?.usage
            ? `${usageQuery.data.usage.planName} — ${usageQuery.data.usage.period}`
            : 'مقارنة الاستخدام بحدود الخطة'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <QueryState
          isLoading={usageQuery.isLoading}
          isError={usageQuery.isError}
          error={usageQuery.error}
          isEmpty={!usageQuery.data?.hasActiveSubscription}
          emptyTitle="لا يوجد اشتراك نشط"
          onRetry={() => usageQuery.refetch()}
          skeletonRows={4}
        >
          {usageQuery.data?.usage ? (
            <div className="flex flex-col gap-5">
              <UsageBar label="الرسائل الشهرية" metric={usageQuery.data.usage.messages} />
              <UsageBar label="جهات الاتصال" metric={usageQuery.data.usage.contacts} />
              <UsageBar label="أعضاء الفريق" metric={usageQuery.data.usage.teamMembers} />
              <UsageBar label="أرقام الهاتف" metric={usageQuery.data.usage.phoneNumbers} />
            </div>
          ) : null}
        </QueryState>
      </CardContent>
    </Card>
  );
}
