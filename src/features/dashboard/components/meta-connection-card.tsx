'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import { Link2Icon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { ROUTES } from '@/config/routes';
import type { MetaStatusResponse } from '@/types/meta.types';
import { formatDateTime } from '@/utils/date';
import { cn } from '@/lib/utils';

interface MetaConnectionCardProps {
  meta: UseQueryResult<MetaStatusResponse>;
  orgSlug: string;
}

export function MetaConnectionCard({ meta, orgSlug }: MetaConnectionCardProps) {
  const integration = meta.data?.integration;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2Icon className="size-4 text-muted-foreground" />
          اتصال Meta
        </CardTitle>
        <CardDescription>حالة ربط حساب Meta Business</CardDescription>
      </CardHeader>
      <CardContent>
        <QueryState
          isLoading={meta.isLoading}
          isError={meta.isError}
          error={meta.error}
          isEmpty={!meta.data}
          emptyTitle="لا توجد بيانات اتصال"
          emptyDescription="تعذّر جلب حالة الاتصال."
          onRetry={() => void meta.refetch()}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">الحالة</span>
              {integration ? (
                <StatusBadge status={integration.status} />
              ) : (
                <StatusBadge status={meta.data?.isConnected ? 'CONNECTED' : 'DISCONNECTED'} />
              )}
            </div>

            {integration && (
              <>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">WABA ID</span>
                  <span className="font-mono text-xs">{integration.wabaId}</span>
                </div>
                {integration.connectedAt && (
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">تاريخ الربط</span>
                    <span>{formatDateTime(integration.connectedAt)}</span>
                  </div>
                )}
                {integration.lastSyncAt && (
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">آخر مزامنة</span>
                    <span>{formatDateTime(integration.lastSyncAt)}</span>
                  </div>
                )}
              </>
            )}

            <Link
              href={ROUTES.app.settings.meta(orgSlug)}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
            >
              إدارة الاتصال
            </Link>
          </div>
        </QueryState>
      </CardContent>
    </Card>
  );
}
