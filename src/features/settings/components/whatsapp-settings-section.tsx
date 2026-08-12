'use client';

import { useTranslations } from 'next-intl';
import { Loader2Icon, PhoneIcon, RefreshCwIcon, SmartphoneIcon, UnplugIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConnectionStatusPill } from '@/features/meta/components/connection-status-pill';
import {
  useDisconnectPhoneNumber,
  useSyncWhatsappAccounts,
  useSyncWhatsappPhoneNumbers,
  useWhatsappBusinessAccounts,
  useWhatsappPhoneNumbers,
} from '@/features/settings/hooks/use-integration-settings';
import { WhatsappAccountStatus, type PhoneNumber } from '@/types/whatsapp.types';
import { useState } from 'react';

export function WhatsappSettingsSection() {
  const t = useTranslations('settings.whatsapp');
  const wabaQuery = useWhatsappBusinessAccounts();
  const phoneQuery = useWhatsappPhoneNumbers();
  const syncAccounts = useSyncWhatsappAccounts();
  const syncPhones = useSyncWhatsappPhoneNumbers();
  const disconnectPhone = useDisconnectPhoneNumber();

  const [phoneToDisconnect, setPhoneToDisconnect] = useState<PhoneNumber | null>(null);

  const handleDisconnect = async () => {
    if (!phoneToDisconnect) return;
    await disconnectPhone.mutateAsync(phoneToDisconnect.id);
    setPhoneToDisconnect(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="stagger-in">
        <div className="bg-gradient-brand h-1" aria-hidden="true" />
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
              <SmartphoneIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>{t('waba.title')}</CardTitle>
              <CardDescription>{t('waba.description')}</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => void syncAccounts.mutateAsync()}
            disabled={syncAccounts.isPending}
          >
            {syncAccounts.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <RefreshCwIcon />
            )}
            {t('waba.sync')}
          </Button>
        </CardHeader>
        <CardContent>
          <QueryState
            isLoading={wabaQuery.isLoading}
            isError={wabaQuery.isError}
            error={wabaQuery.error}
            isEmpty={!wabaQuery.data?.items.length}
            emptyTitle={t('waba.emptyTitle')}
            emptyDescription={t('waba.emptyDescription')}
            onRetry={() => void wabaQuery.refetch()}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('waba.columns.name')}</TableHead>
                  <TableHead>{t('waba.columns.wabaId')}</TableHead>
                  <TableHead>{t('waba.columns.status')}</TableHead>
                  <TableHead>{t('waba.columns.timezone')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wabaQuery.data?.items.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name ?? '—'}</TableCell>
                    <TableCell className="font-mono text-xs" dir="ltr">
                      {account.wabaId}
                    </TableCell>
                    <TableCell>
                      <ConnectionStatusPill
                        connected={account.status === WhatsappAccountStatus.CONNECTED}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{account.timezone ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </QueryState>
        </CardContent>
      </Card>

      <Card
        className="stagger-in"
        style={{ '--stagger-delay': '80ms' } as CSSProperties}
      >
        <div className="bg-gradient-brand h-1" aria-hidden="true" />
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
              <PhoneIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>{t('phones.title')}</CardTitle>
              <CardDescription>{t('phones.description')}</CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => void syncPhones.mutateAsync()}
            disabled={syncPhones.isPending}
          >
            {syncPhones.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <RefreshCwIcon />
            )}
            {t('phones.sync')}
          </Button>
        </CardHeader>
        <CardContent>
          <QueryState
            isLoading={phoneQuery.isLoading}
            isError={phoneQuery.isError}
            error={phoneQuery.error}
            isEmpty={!phoneQuery.data?.items.length}
            emptyTitle={t('phones.emptyTitle')}
            emptyDescription={t('phones.emptyDescription')}
            onRetry={() => void phoneQuery.refetch()}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('phones.columns.phone')}</TableHead>
                  <TableHead>{t('phones.columns.verifiedName')}</TableHead>
                  <TableHead>{t('phones.columns.quality')}</TableHead>
                  <TableHead>{t('phones.columns.status')}</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {phoneQuery.data?.items.map((phone) => (
                  <TableRow key={phone.id}>
                    <TableCell className="font-medium" dir="ltr">
                      {phone.displayPhoneNumber}
                    </TableCell>
                    <TableCell>{phone.verifiedName ?? '—'}</TableCell>
                    <TableCell>
                      <StatusBadge status={phone.qualityRating} />
                    </TableCell>
                    <TableCell>
                      <ConnectionStatusPill
                        connected={phone.status === WhatsappAccountStatus.CONNECTED}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t('phones.disconnectAria')}
                        onClick={() => setPhoneToDisconnect(phone)}
                      >
                        <UnplugIcon className="text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </QueryState>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(phoneToDisconnect)}
        onOpenChange={(open) => !open && setPhoneToDisconnect(null)}
        title={t('disconnectDialog.title')}
        description={t('disconnectDialog.description', {
          phone: phoneToDisconnect?.displayPhoneNumber ?? '',
        })}
        confirmLabel={t('disconnectDialog.confirm')}
        variant="destructive"
        onConfirm={() => void handleDisconnect()}
        isLoading={disconnectPhone.isPending}
      />
    </div>
  );
}
