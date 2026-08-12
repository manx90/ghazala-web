'use client';

import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import {
  CpuIcon,
  DatabaseIcon,
  HardDriveIcon,
  RefreshCwIcon,
  ServerIcon,
  type LucideIcon,
} from 'lucide-react';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { StatsGrid, StatusCard } from '@/components/cards';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSystemHealth } from '@/features/admin/hooks/use-system-health';
import { cn } from '@/lib/utils';

type ServiceState = 'ok' | 'unknown' | 'error';

interface ServiceRowProps {
  name: string;
  endpoint: string;
  state: ServiceState;
  stateLabel: string;
  icon: LucideIcon;
}

function ServiceRow({ name, endpoint, state, stateLabel, icon: Icon }: ServiceRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 ring-1 ring-border/60 transition-colors hover:bg-muted/50">
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative flex size-2.5 shrink-0">
          {state === 'ok' && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          )}
          <span
            className={cn(
              'relative inline-flex size-2.5 rounded-full',
              state === 'ok' && 'bg-emerald-500',
              state === 'unknown' && 'bg-muted-foreground/40',
              state === 'error' && 'bg-destructive',
            )}
          />
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{name}</span>
          <span className="font-mono text-xs text-muted-foreground" dir="ltr">
            {endpoint}
          </span>
        </div>
      </div>
      <span
        className={cn(
          'shrink-0 text-xs font-medium',
          state === 'ok' && 'text-emerald-600',
          state === 'unknown' && 'text-muted-foreground',
          state === 'error' && 'text-destructive',
        )}
      >
        {stateLabel}
      </span>
    </div>
  );
}

export default function AdminSystemHealthPage() {
  const t = useTranslations('admin.pages.systemHealth');
  const tHealth = useTranslations('admin.health');
  const tCommon = useTranslations('admin.common');
  const { data, isLoading, isError, refetch, isFetching } = useSystemHealth();

  const apiState: ServiceState = isLoading ? 'unknown' : isError ? 'error' : data?.status === 'ok' ? 'ok' : 'unknown';
  const apiLabel = isLoading
    ? tHealth('checking')
    : isError
      ? tHealth('error')
      : data?.status === 'ok'
        ? tHealth('ok')
        : tHealth('unavailable');

  const unavailableLabel = tHealth('unavailable');
  const requiresEndpoint = tHealth('requiresEndpoint');

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t('title')}
          description={t('description')}
          actions={
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCwIcon data-icon="inline-start" />
              {tCommon('refresh')}
            </Button>
          }
        />

        <StatsGrid className="sm:grid-cols-2 xl:grid-cols-4">
          {(
            [
              {
                title: 'API',
                status: isLoading ? 'loading' : isError ? 'error' : data?.status ?? 'unknown',
                statusLabel: apiLabel,
                description: 'GET /health',
                icon: ServerIcon,
              },
              {
                title: tHealth('database'),
                status: 'unknown',
                statusLabel: unavailableLabel,
                description: requiresEndpoint,
                icon: DatabaseIcon,
              },
              {
                title: tHealth('redis'),
                status: 'unknown',
                statusLabel: unavailableLabel,
                description: requiresEndpoint,
                icon: CpuIcon,
              },
              {
                title: tHealth('storage'),
                status: 'unknown',
                statusLabel: unavailableLabel,
                description: requiresEndpoint,
                icon: HardDriveIcon,
              },
            ] as const
          ).map((service, index) => (
            <div
              key={service.title}
              className="stagger-in"
              style={{ '--stagger-delay': `${index * 80}ms` } as CSSProperties}
            >
              <StatusCard
                title={service.title}
                status={service.status}
                statusLabel={service.statusLabel}
                description={service.description}
                icon={service.icon}
                className="card-interactive h-full"
              />
            </div>
          ))}
        </StatsGrid>

        <Card className="stagger-in" style={{ '--stagger-delay': '320ms' } as CSSProperties}>
          <CardHeader>
            <CardTitle className="text-base">{t('coreServices')}</CardTitle>
            <CardDescription>{t('autoRefresh')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <ServiceRow name={tHealth('apiServer')} endpoint="GET /health" state={apiState} stateLabel={apiLabel} icon={ServerIcon} />
            <ServiceRow name={tHealth('database')} endpoint="GET /admin/health/database" state="unknown" stateLabel={unavailableLabel} icon={DatabaseIcon} />
            <ServiceRow name={tHealth('redis')} endpoint="GET /admin/health/redis" state="unknown" stateLabel={unavailableLabel} icon={CpuIcon} />
            <ServiceRow name={tHealth('storage')} endpoint="GET /admin/health/storage" state="unknown" stateLabel={unavailableLabel} icon={HardDriveIcon} />
          </CardContent>
        </Card>

        <UnavailableFeatureAlert
          title={t('advancedUnavailableTitle')}
          description={t('advancedUnavailableDescription')}
          requiredEndpoints={[
            'GET /admin/health/database',
            'GET /admin/health/redis',
            'GET /admin/health/storage',
            'GET /admin/queue/status',
            'GET /admin/workers/status',
            'GET /admin/cron/jobs',
            'GET /admin/jobs/background',
          ]}
        />
      </div>
    </PageContainer>
  );
}
