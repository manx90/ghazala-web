'use client';

import Link from 'next/link';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/global/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { QueryState } from '@/components/shared/query-state';
import { MetaConnectionSummary } from '@/features/meta/components/meta-connection-summary';
import { MetaEmbeddedSignupButton } from '@/features/meta/components/meta-embedded-signup-button';
import {
  useConnectMeta,
  useDisconnectMeta,
  useMetaStatus,
  useSyncMeta,
  useWhatsappBusinessAccounts,
  useWhatsappPhoneNumbers,
} from '@/features/onboarding/hooks/use-meta-onboarding';
import { ROUTES } from '@/config/routes';

export function ConnectWhatsappForm() {
  const metaStatus = useMetaStatus();
  const connectMeta = useConnectMeta();
  const syncMeta = useSyncMeta();
  const disconnectMeta = useDisconnectMeta();

  const isConnected = metaStatus.data?.isConnected ?? false;
  const businessAccounts = useWhatsappBusinessAccounts(isConnected);
  const phoneNumbers = useWhatsappPhoneNumbers(isConnected);

  const integration = metaStatus.data?.integration;
  const embeddedSession = metaStatus.data?.embeddedSignupSession;
  const primaryWaba = businessAccounts.data?.items[0] ?? null;
  const primaryPhone = phoneNumbers.data?.items[0] ?? null;

  const isDetailsLoading =
    isConnected && (businessAccounts.isLoading || phoneNumbers.isLoading);

  const handleConnect = async (payload: {
    authorizationCode: string;
    wabaId: string;
    metaBusinessId?: string;
  }) => {
    await connectMeta.mutateAsync({
      authorizationCode: payload.authorizationCode,
      wabaId: payload.wabaId,
      metaBusinessId: payload.metaBusinessId,
    });
  };

  return (
    <PageContainer size="sm" className="space-y-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle>ربط WhatsApp Business</CardTitle>
          <CardDescription>
            اربط حساب WhatsApp Business عبر Meta Embedded Signup للبدء في إرسال الرسائل
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QueryState
            isLoading={metaStatus.isLoading}
            isError={metaStatus.isError}
            error={metaStatus.error}
            isEmpty={false}
            emptyTitle=""
            onRetry={() => metaStatus.refetch()}
            skeletonRows={4}
          >
            {isConnected && integration ? (
              <>
                <QueryState
                  isLoading={isDetailsLoading}
                  isError={businessAccounts.isError || phoneNumbers.isError}
                  error={businessAccounts.error ?? phoneNumbers.error}
                  isEmpty={false}
                  emptyTitle=""
                  onRetry={() => {
                    void businessAccounts.refetch();
                    void phoneNumbers.refetch();
                  }}
                  skeletonRows={6}
                >
                  <MetaConnectionSummary
                    integration={integration}
                    businessAccount={primaryWaba}
                    phoneNumber={primaryPhone}
                    onSync={() => syncMeta.mutate()}
                    onDisconnect={async () => {
                      await disconnectMeta.mutateAsync();
                    }}
                    isSyncing={syncMeta.isPending}
                    isDisconnecting={disconnectMeta.isPending}
                  />
                </QueryState>

                <Button
                  className="mt-6 w-full"
                  render={<Link href={ROUTES.onboarding.selectPlan} />}
                >
                  المتابعة لاختيار الخطة
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">كيف يعمل الربط؟</p>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>اضغط Connect with WhatsApp للانتقال إلى Meta</li>
                    <li>سجّل الدخول واختر أو أنشئ حساب WhatsApp Business</li>
                    <li>بعد الموافقة، سيتم ربط حسابك تلقائياً دون إدخال أي رموز</li>
                  </ul>
                </div>

                {embeddedSession ? (
                  <MetaEmbeddedSignupButton
                    session={embeddedSession}
                    disabled={connectMeta.isPending}
                    onConnect={handleConnect}
                  />
                ) : (
                  <p className="text-sm text-destructive">
                    Meta Embedded Signup غير مهيأ. تأكد من إعداد التطبيق في Meta Developer Console.
                  </p>
                )}

                {connectMeta.isPending ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2Icon className="size-4 animate-spin" />
                    جاري إكمال الربط...
                  </div>
                ) : null}
              </div>
            )}
          </QueryState>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
