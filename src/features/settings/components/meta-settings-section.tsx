'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link2Icon, Loader2Icon, RefreshCwIcon, ShieldCheckIcon, UnplugIcon } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { QueryState } from '@/components/shared/query-state';
import { ConnectionStatusPill } from '@/features/meta/components/connection-status-pill';
import {
  connectMetaSchema,
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
  const { data, isLoading, isError, error, refetch } = useMetaStatus();
  const connectMeta = useConnectMeta();
  const disconnectMeta = useDisconnectMeta();
  const syncMeta = useSyncMeta();
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  const form = useForm<ConnectMetaFormValues>({
    resolver: zodResolver(connectMetaSchema),
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
                <CardTitle>حالة الربط</CardTitle>
                <CardDescription>حالة تكامل Meta Business</CardDescription>
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
                    مزامنة
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDisconnectOpen(true)}
                    disabled={disconnectMeta.isPending}
                  >
                    <UnplugIcon />
                    فصل
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">معرف WABA</p>
              <p className="font-mono text-sm" dir="ltr">{integration?.wabaId ?? '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">معرف Meta Business</p>
              <p className="font-mono text-sm" dir="ltr">{integration?.metaBusinessId ?? '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">آخر مزامنة</p>
              <p className="text-sm">{formatDateTime(integration?.lastSyncAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">تاريخ الربط</p>
              <p className="text-sm">{formatDateTime(integration?.connectedAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">انتهاء التوكن</p>
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
              <CardTitle>ربط Meta</CardTitle>
              <CardDescription>أدخل بيانات الربط من Meta Business</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onConnect} className="flex flex-col gap-5">
              <div className="space-y-2">
                <Label htmlFor="wabaId">معرف WABA *</Label>
                <Input id="wabaId" dir="ltr" className="text-left" {...form.register('wabaId')} />
                {form.formState.errors.wabaId && (
                  <p className="text-sm text-destructive">{form.formState.errors.wabaId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaBusinessId">معرف Meta Business</Label>
                <Input id="metaBusinessId" dir="ltr" className="text-left" {...form.register('metaBusinessId')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorizationCode">رمز التفويض</Label>
                <Input id="authorizationCode" dir="ltr" className="text-left" {...form.register('authorizationCode')} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="gradient" disabled={connectMeta.isPending}>
                  {connectMeta.isPending && <Loader2Icon className="animate-spin" />}
                  ربط Meta
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={disconnectOpen}
        onOpenChange={setDisconnectOpen}
        title="فصل Meta"
        description="هل تريد فصل تكامل Meta؟ لن تتمكن من إرسال رسائل WhatsApp."
        confirmLabel="فصل"
        variant="destructive"
        onConfirm={() => void disconnectMeta.mutateAsync().then(() => setDisconnectOpen(false))}
        isLoading={disconnectMeta.isPending}
      />
    </div>
  );
}
