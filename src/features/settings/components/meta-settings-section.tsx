'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, RefreshCwIcon, UnplugIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
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
import { useState } from 'react';

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
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>حالة الربط</CardTitle>
              <CardDescription>حالة تكامل Meta Business</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
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
              <p className="text-sm text-muted-foreground">الحالة</p>
              {integration ? (
                <StatusBadge status={integration.status} />
              ) : (
                <StatusBadge status="DISCONNECTED" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">معرف WABA</p>
              <p className="font-mono text-sm">{integration?.wabaId ?? '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">معرف Meta Business</p>
              <p className="font-mono text-sm">{integration?.metaBusinessId ?? '—'}</p>
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
        <Card>
          <CardHeader>
            <CardTitle>ربط Meta</CardTitle>
            <CardDescription>أدخل بيانات الربط من Meta Business</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onConnect} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="wabaId">معرف WABA *</Label>
                <Input id="wabaId" {...form.register('wabaId')} />
                {form.formState.errors.wabaId && (
                  <p className="text-sm text-destructive">{form.formState.errors.wabaId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaBusinessId">معرف Meta Business</Label>
                <Input id="metaBusinessId" {...form.register('metaBusinessId')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorizationCode">رمز التفويض</Label>
                <Input id="authorizationCode" {...form.register('authorizationCode')} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={connectMeta.isPending}>
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
