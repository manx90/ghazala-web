'use client';

import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import {
  ActivityIcon,
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSystemHealth } from '@/features/admin/hooks/use-system-health';
import {
  useAdminDatabaseHealth,
  useAdminQueueStatus,
  useAdminRedisHealth,
  useAdminStorageHealth,
  useAdminWorkersStatus,
} from '@/features/admin/hooks/use-admin-dashboard-metrics';
import type { AdminHealthStatus } from '@/types/admin.types';
import { cn } from '@/lib/utils';

type ServiceState = 'ok' | 'unknown' | 'error' | 'degraded' | 'not_configured';

function toServiceState(status?: AdminHealthStatus, isError?: boolean, isLoading?: boolean): ServiceState {
  if (isLoading) return 'unknown';
  if (isError) return 'error';
  if (!status) return 'unknown';
  if (status === 'down') return 'error';
  return status;
}

interface ServiceRowProps {
  name: string;
  endpoint: string;
  state: ServiceState;
  stateLabel: string;
  icon: LucideIcon;
}

function ServiceRow({ name, endpoint, state, stateLabel, icon: Icon }: ServiceRowProps) {
  const isOk = state === 'ok';
  const isError = state === 'error';

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 ring-1 ring-border/60 transition-colors hover:bg-muted/50">
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative flex size-2.5 shrink-0">
          {isOk && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          )}
          <span
            className={cn(
              'relative inline-flex size-2.5 rounded-full',
              isOk && 'bg-emerald-500',
              state === 'degraded' && 'bg-amber-500',
              state === 'not_configured' && 'bg-blue-500/60',
              isError && 'bg-destructive',
              state === 'unknown' && 'bg-muted-foreground/40',
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
          isOk && 'text-emerald-600',
          state === 'degraded' && 'text-amber-600',
          state === 'not_configured' && 'text-blue-600',
          isError && 'text-destructive',
          state === 'unknown' && 'text-muted-foreground',
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

  const api = useSystemHealth();
  const database = useAdminDatabaseHealth();
  const redis = useAdminRedisHealth();
  const storage = useAdminStorageHealth();
  const queue = useAdminQueueStatus();
  const workers = useAdminWorkersStatus();

  const refetchAll = () => {
    void api.refetch();
    void database.refetch();
    void redis.refetch();
    void storage.refetch();
    void queue.refetch();
    void workers.refetch();
  };

  const isFetching =
    api.isFetching || database.isFetching || redis.isFetching || storage.isFetching || queue.isFetching;

  const getHealthLabel = (status?: AdminHealthStatus, isLoading?: boolean, isError?: boolean) => {
    if (isLoading) return tHealth('checking');
    if (isError) return tHealth('error');
    if (!status) return tHealth('unavailable');
    if (status === 'ok') return tHealth('ok');
    if (status === 'degraded') return tHealth('degraded');
    if (status === 'down') return tHealth('down');
    if (status === 'not_configured') return tHealth('notConfigured');
    return tHealth('unknown');
  };

  const apiState: ServiceState = toServiceState(api.data?.status === 'ok' ? 'ok' : undefined, api.isError, api.isLoading);
  const apiLabel = api.isLoading
    ? tHealth('checking')
    : api.isError
      ? tHealth('error')
      : api.data?.status === 'ok'
        ? tHealth('ok')
        : tHealth('unavailable');

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t('title')}
          description={t('description')}
          actions={
            <Button variant="outline" size="sm" onClick={refetchAll} disabled={isFetching}>
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
                status: api.isLoading ? 'loading' : api.isError ? 'error' : api.data?.status ?? 'unknown',
                statusLabel: apiLabel,
                description: 'GET /health',
                icon: ServerIcon,
              },
              {
                title: tHealth('database'),
                status: database.data?.status ?? 'unknown',
                statusLabel: getHealthLabel(database.data?.status, database.isLoading, database.isError),
                description: 'GET /admin/health/database',
                icon: DatabaseIcon,
              },
              {
                title: tHealth('redis'),
                status: redis.data?.status ?? 'unknown',
                statusLabel: getHealthLabel(redis.data?.status, redis.isLoading, redis.isError),
                description: 'GET /admin/health/redis',
                icon: CpuIcon,
              },
              {
                title: tHealth('storage'),
                status: storage.data?.status ?? 'unknown',
                statusLabel: getHealthLabel(storage.data?.status, storage.isLoading, storage.isError),
                description: 'GET /admin/health/storage',
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
            <ServiceRow
              name={tHealth('database')}
              endpoint="GET /admin/health/database"
              state={toServiceState(database.data?.status, database.isError, database.isLoading)}
              stateLabel={getHealthLabel(database.data?.status, database.isLoading, database.isError)}
              icon={DatabaseIcon}
            />
            <ServiceRow
              name={tHealth('redis')}
              endpoint="GET /admin/health/redis"
              state={toServiceState(redis.data?.status, redis.isError, redis.isLoading)}
              stateLabel={getHealthLabel(redis.data?.status, redis.isLoading, redis.isError)}
              icon={CpuIcon}
            />
            <ServiceRow
              name={tHealth('storage')}
              endpoint="GET /admin/health/storage"
              state={toServiceState(storage.data?.status, storage.isError, storage.isLoading)}
              stateLabel={getHealthLabel(storage.data?.status, storage.isLoading, storage.isError)}
              icon={HardDriveIcon}
            />
          </CardContent>
        </Card>

        <Card className="stagger-in" style={{ '--stagger-delay': '400ms' } as CSSProperties}>
          <CardHeader>
            <CardTitle className="text-base">{t('backgroundJobs')}</CardTitle>
            <CardDescription>{t('backgroundJobsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <ServiceRow
              name={tHealth('queue')}
              endpoint="GET /admin/queue/status"
              state={queue.isLoading ? 'unknown' : queue.isError ? 'error' : 'ok'}
              stateLabel={
                queue.isLoading
                  ? tHealth('checking')
                  : queue.isError
                    ? tHealth('error')
                    : `${queue.data?.waiting ?? 0} waiting · ${queue.data?.failed ?? 0} failed`
              }
              icon={ActivityIcon}
            />
            <ServiceRow
              name={tHealth('workers')}
              endpoint="GET /admin/workers/status"
              state={workers.isLoading ? 'unknown' : workers.isError ? 'error' : 'ok'}
              stateLabel={
                workers.isLoading
                  ? tHealth('checking')
                  : workers.isError
                    ? tHealth('error')
                    : workers.data?.message ?? tHealth('ok')
              }
              icon={CpuIcon}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
