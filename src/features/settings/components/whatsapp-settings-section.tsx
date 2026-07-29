'use client';

import { Loader2Icon, RefreshCwIcon, UnplugIcon } from 'lucide-react';
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
import { Section } from '@/components/global/section';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  useDisconnectPhoneNumber,
  useSyncWhatsappAccounts,
  useSyncWhatsappPhoneNumbers,
  useWhatsappBusinessAccounts,
  useWhatsappPhoneNumbers,
} from '@/features/settings/hooks/use-integration-settings';
import type { PhoneNumber } from '@/types/whatsapp.types';
import { useState } from 'react';

export function WhatsappSettingsSection() {
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
    <div className="flex flex-col gap-8">
      <Section
        title="حسابات WhatsApp Business"
        description="حسابات WABA المرتبطة بالمنظمة"
        action={
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
            مزامنة الحسابات
          </Button>
        }
      >
        <Card>
          <CardContent className="pt-6">
            <QueryState
              isLoading={wabaQuery.isLoading}
              isError={wabaQuery.isError}
              error={wabaQuery.error}
              isEmpty={!wabaQuery.data?.items.length}
              emptyTitle="لا توجد حسابات WABA"
              emptyDescription="قم بربط Meta ثم زامن الحسابات"
              onRetry={() => void wabaQuery.refetch()}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>معرف WABA</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>المنطقة الزمنية</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wabaQuery.data?.items.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name ?? '—'}</TableCell>
                      <TableCell className="font-mono text-xs">{account.wabaId}</TableCell>
                      <TableCell>
                        <StatusBadge status={account.status} />
                      </TableCell>
                      <TableCell>{account.timezone ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </QueryState>
          </CardContent>
        </Card>
      </Section>

      <Section
        title="أرقام الهاتف"
        description="أرقام WhatsApp المرتبطة"
        action={
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
            مزامنة الأرقام
          </Button>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>قائمة الأرقام</CardTitle>
            <CardDescription>يمكنك فصل أي رقم غير مستخدم</CardDescription>
          </CardHeader>
          <CardContent>
            <QueryState
              isLoading={phoneQuery.isLoading}
              isError={phoneQuery.isError}
              error={phoneQuery.error}
              isEmpty={!phoneQuery.data?.items.length}
              emptyTitle="لا توجد أرقام"
              emptyDescription="زامن الأرقام من Meta"
              onRetry={() => void phoneQuery.refetch()}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الرقم</TableHead>
                    <TableHead>الاسم المعتمد</TableHead>
                    <TableHead>الجودة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {phoneQuery.data?.items.map((phone) => (
                    <TableRow key={phone.id}>
                      <TableCell dir="ltr">{phone.displayPhoneNumber}</TableCell>
                      <TableCell>{phone.verifiedName ?? '—'}</TableCell>
                      <TableCell>
                        <StatusBadge status={phone.qualityRating} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={phone.status} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="فصل الرقم"
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
      </Section>

      <ConfirmDialog
        open={Boolean(phoneToDisconnect)}
        onOpenChange={(open) => !open && setPhoneToDisconnect(null)}
        title="فصل رقم الهاتف"
        description={`هل تريد فصل ${phoneToDisconnect?.displayPhoneNumber}؟`}
        confirmLabel="فصل"
        variant="destructive"
        onConfirm={() => void handleDisconnect()}
        isLoading={disconnectPhone.isPending}
      />
    </div>
  );
}
