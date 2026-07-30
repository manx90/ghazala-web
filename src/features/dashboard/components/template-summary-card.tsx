'use client';

import { useMemo } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { FileTextIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { TemplateStatus } from '@/types/template.types';
import type { TemplateListResponse } from '@/types/template.types';

const STATUS_ORDER: TemplateStatus[] = [
  TemplateStatus.APPROVED,
  TemplateStatus.PENDING,
  TemplateStatus.DRAFT,
  TemplateStatus.REJECTED,
  TemplateStatus.PAUSED,
  TemplateStatus.DISABLED,
];

interface TemplateSummaryCardProps {
  templates: UseQueryResult<TemplateListResponse>;
}

export function TemplateSummaryCard({ templates }: TemplateSummaryCardProps) {
  const items = useMemo(() => templates.data?.items ?? [], [templates.data?.items]);

  const statusCounts = useMemo(() => {
    const counts = Object.values(TemplateStatus).reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<TemplateStatus, number>,
    );

    items.forEach((template) => {
      counts[template.status] = (counts[template.status] ?? 0) + 1;
    });

    return STATUS_ORDER.map((status) => ({
      status,
      count: counts[status] ?? 0,
    })).filter((entry) => entry.count > 0);
  }, [items]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
            <FileTextIcon className="size-4" aria-hidden="true" />
          </span>
          ملخص القوالب
        </CardTitle>
        <CardDescription>توزيع القوالب حسب الحالة</CardDescription>
      </CardHeader>
      <CardContent>
        <QueryState
          isLoading={templates.isLoading}
          isError={templates.isError}
          error={templates.error}
          isEmpty={items.length === 0}
          emptyTitle="لا توجد قوالب"
          emptyDescription="أنشئ أو زامن قوالب واتساب من صفحة القوالب."
          onRetry={() => void templates.refetch()}
        >
          <div className="flex flex-col gap-3">
            {statusCounts.map(({ status, count }) => (
              <div
                key={status}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 transition-colors duration-200 hover:bg-muted/40"
              >
                <StatusBadge status={status} />
                <span className="flex size-7 items-center justify-center rounded-md bg-gradient-brand-soft text-xs font-bold text-primary ring-1 ring-primary/10 tabular-nums">
                  {count}
                </span>
              </div>
            ))}
            <p className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
              الإجمالي:{' '}
              <span className="font-semibold text-foreground tabular-nums">
                {templates.data?.total ?? 0}
              </span>{' '}
              قالب
            </p>
          </div>
        </QueryState>
      </CardContent>
    </Card>
  );
}
