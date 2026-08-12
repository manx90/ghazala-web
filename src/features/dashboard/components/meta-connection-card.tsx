'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import { Link2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
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
  const t = useTranslations('dashboard.metaConnection');
  const integration = meta.data?.integration;
  const status = integration?.status ?? (meta.data?.isConnected ? 'CONNECTED' : 'DISCONNECTED');
  const isConnected = status === 'CONNECTED';

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
            <Link2Icon className="size-4" aria-hidden="true" />
          </span>
          {t('title')}
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <QueryState
          isLoading={meta.isLoading}
          isError={meta.isError}
          error={meta.error}
          isEmpty={!meta.data}
          emptyTitle={t('emptyTitle')}
          emptyDescription={t('emptyDescription')}
          onRetry={() => void meta.refetch()}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
              <span className="text-sm text-muted-foreground">{t('status')}</span>
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    isConnected ? 'bg-emerald-500 animate-glow-pulse' : 'bg-red-500',
                  )}
                />
                <StatusBadge status={status} />
              </span>
            </div>

            {integration && (
              <div className="divide-y divide-border/60 rounded-lg border border-border/60">
                <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm">
                  <span className="text-muted-foreground">{t('wabaId')}</span>
                  <span className="font-mono text-xs" dir="ltr">{integration.wabaId}</span>
                </div>
                {integration.connectedAt && (
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm">
                    <span className="text-muted-foreground">{t('connectedAt')}</span>
                    <span>{formatDateTime(integration.connectedAt)}</span>
                  </div>
                )}
                {integration.lastSyncAt && (
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm">
                    <span className="text-muted-foreground">{t('lastSyncAt')}</span>
                    <span>{formatDateTime(integration.lastSyncAt)}</span>
                  </div>
                )}
              </div>
            )}

            <Link
              href={ROUTES.app.settings.meta(orgSlug)}
              className={cn(buttonVariants({ variant: 'gradient', size: 'sm' }), 'w-full')}
            >
              {t('manageConnection')}
            </Link>
          </div>
        </QueryState>
      </CardContent>
    </Card>
  );
}
