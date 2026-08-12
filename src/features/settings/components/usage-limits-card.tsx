'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QueryState } from '@/components/shared/query-state';
import { useUsage } from '@/features/settings/hooks/use-billing-settings';
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

export function UsageLimitsCard() {
  const t = useTranslations('settings.billing.usage');
  const usageQuery = useUsage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('title')}</CardTitle>
        <CardDescription>
          {usageQuery.data
            ? `${usageQuery.data.planName} — ${usageQuery.data.period}`
            : t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <QueryState
          isLoading={usageQuery.isLoading}
          isError={usageQuery.isError}
          error={usageQuery.error}
          isEmpty={false}
          emptyTitle=""
          onRetry={() => usageQuery.refetch()}
          skeletonRows={4}
        >
          {usageQuery.data ? (
            <div className="flex flex-col gap-5">
              <UsageBar label={t('messages')} metric={usageQuery.data.messages} />
              <UsageBar label={t('contacts')} metric={usageQuery.data.contacts} />
              <UsageBar label={t('teamMembers')} metric={usageQuery.data.teamMembers} />
              <UsageBar label={t('phoneNumbers')} metric={usageQuery.data.phoneNumbers} />
            </div>
          ) : null}
        </QueryState>
      </CardContent>
    </Card>
  );
}
