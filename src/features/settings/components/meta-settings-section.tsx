'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link2Icon, Loader2Icon, RefreshCwIcon, ShieldCheckIcon, UnplugIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { QueryState } from '@/components/shared/query-state';
import { ConnectionStatusPill } from '@/features/meta/components/connection-status-pill';
import {
  createConnectMetaSchema,
  type ConnectMetaFormValues,
} from '@/features/settings/schemas/settings.schemas';
import {
  useConnectMeta,
  useDisconnectMeta,
  useMetaStatus,
  useSyncMeta,
} from '@/features/settings/hooks/use-integration-settings';
import { formatDateTime } from '@/utils/date';

export function MetaSettingsSection() {
  const t = useTranslations('settings.meta');
  const tValidation = useTranslations('settings.validation');
  const { data, isLoading, isError, error, refetch } = useMetaStatus();
  const connectMeta = useConnectMeta();
  const disconnectMeta = useDisconnectMeta();
  const syncMeta = useSyncMeta();
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  const schema = useMemo(
    () => createConnectMetaSchema((k) => tValidation(k)),
    [tValidation],
  );

  const form = useForm<ConnectMetaFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      wabaId: '',
      authorizationCode: '',
      metaBusinessId: '',
    },
  });

  const onConnect = form.handleSubmit(async (values) => {
    await connectMeta.mutateAsync({
      wabaId: values.wabaId,
      authorizationCode: values.authorizationCode || undefined,
      metaBusinessId: values.metaBusinessId || undefined,
      systemUserId: values.systemUserId || undefined,
      accessToken: values.accessToken || undefined,
    });
    form.reset();
  });

  const integration = data?.integration;

  return (
    <div className="flex flex-col gap-6">
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={false}
        emptyTitle=""
        onRetry={() => void refetch()}
      >
        <Card className="stagger-in">
          <div className="bg-gradient-brand h-1" aria-hidden="true" />
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
                <ShieldCheckIcon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle>{t('connection.title')}</CardTitle>
                <CardDescription>{t('connection.description')}</CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ConnectionStatusPill connected={data?.isConnected ?? false} />
              {data?.isConnected && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => void syncMeta.mutateAsync()}
                    disabled={syncMeta.isPending}
                  >
                    {syncMeta.isPending ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <RefreshCwIcon />
                    )}
                    {t('connection.sync')}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDisconnectOpen(true)}
                    disabled={disconnectMeta.isPending}
                  >
                    <UnplugIcon />
                    {t('connection.disconnect')}
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('fields.wabaId')}</p>
              <p className="font-mono text-sm" dir="ltr">{integration?.wabaId ?? '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('fields.businessId')}</p>
              <p className="font-mono text-sm" dir="ltr">{integration?.metaBusinessId ?? '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('fields.lastSync')}</p>
              <p className="text-sm">{formatDateTime(integration?.lastSyncAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('fields.connectedAt')}</p>
              <p className="text-sm">{formatDateTime(integration?.connectedAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('fields.tokenExpiry')}</p>
              <p className="text-sm">{formatDateTime(integration?.tokenExpiresAt)}</p>
            </div>
          </CardContent>
        </Card>
      </QueryState>

      {!data?.isConnected && (
        <Card
          className="stagger-in"
          style={{ '--stagger-delay': '80ms' } as CSSProperties}
        >
          <CardHeader className="flex flex-row items-start gap-3">
            <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
              <Link2Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>{t('connect.title')}</CardTitle>
              <CardDescription>{t('connect.description')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onConnect} className="flex flex-col gap-5">
              <div className="space-y-2">
                <Label htmlFor="wabaId">{t('connect.wabaId')}</Label>
                <Input id="wabaId" dir="ltr" className="text-left" {...form.register('wabaId')} />
                {form.formState.errors.wabaId && (
                  <p className="text-sm text-destructive">{form.formState.errors.wabaId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaBusinessId">{t('connect.businessId')}</Label>
                <Input id="metaBusinessId" dir="ltr" className="text-left" {...form.register('metaBusinessId')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorizationCode">{t('connect.authCode')}</Label>
                <Input id="authorizationCode" dir="ltr" className="text-left" {...form.register('authorizationCode')} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="gradient" disabled={connectMeta.isPending}>
                  {connectMeta.isPending && <Loader2Icon className="animate-spin" />}
                  {t('connect.title')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={disconnectOpen}
        onOpenChange={setDisconnectOpen}
        title={t('disconnectDialog.title')}
        description={t('disconnectDialog.description')}
        confirmLabel={t('disconnectDialog.confirm')}
        variant="destructive"
        onConfirm={() => void disconnectMeta.mutateAsync().then(() => setDisconnectOpen(false))}
        isLoading={disconnectMeta.isPending}
      />
    </div>
  );
}
