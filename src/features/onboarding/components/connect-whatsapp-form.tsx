'use client';

import Link from 'next/link';
import { Loader2Icon, MessageCircleIcon } from 'lucide-react';
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

const CONNECTION_STEPS = [
  'اضغط Connect with WhatsApp للانتقال إلى Meta',
  'سجّل الدخول واختر أو أنشئ حساب WhatsApp Business',
  'بعد الموافقة، سيتم ربط حسابك تلقائياً دون إدخال أي رموز',
];

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
    <PageContainer size="sm" className="max-w-lg py-10">
      <Card className="glass-strong animate-fade-in-up shadow-xl">
        <CardHeader className="flex flex-col items-center gap-3 pt-8 text-center">
          <span className="bg-gradient-brand glow-brand flex size-14 items-center justify-center rounded-2xl text-primary-foreground shadow-lg">
            <MessageCircleIcon className="size-7" aria-hidden="true" />
          </span>
          <CardTitle className="text-xl">ربط WhatsApp Business</CardTitle>
          <CardDescription>
            اربط حساب WhatsApp Business عبر Meta Embedded Signup للبدء في إرسال الرسائل
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
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
                  variant="gradient"
                  size="lg"
                  className="mt-6 w-full"
                  render={<Link href={ROUTES.onboarding.selectPlan} />}
                >
                  المتابعة لاختيار الخطة
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="bg-gradient-brand-soft rounded-xl p-4 ring-1 ring-primary/10">
                  <p className="text-sm font-medium">كيف يعمل الربط؟</p>
                  <ol className="mt-3 flex flex-col gap-2.5">
                    {CONNECTION_STEPS.map((step, index) => (
                      <li key={step} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="bg-gradient-brand mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold text-primary-foreground">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
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
