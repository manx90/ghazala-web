'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
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

export function ConnectWhatsappForm() {
  const t = useTranslations('onboarding.connectWhatsapp');
  const metaStatus = useMetaStatus();
  const connectMeta = useConnectMeta();
  const syncMeta = useSyncMeta();
  const disconnectMeta = useDisconnectMeta();

  const isConnected = metaStatus.data?.isConnected ?? false;
  const businessAccounts = useWhatsappBusinessAccounts(isConnected);
  const phoneNumbers = useWhatsappPhoneNumbers(isConnected);

  const integration = metaStatus.data?.integration;
  const embeddedSession = metaStatus.data?.embeddedSignupSession;
  const isEmbeddedConfigured = Boolean(
    embeddedSession?.appId && embeddedSession?.embeddedSignupConfigId,
  );
  const primaryWaba = businessAccounts.data?.items?.[0] ?? null;
  const primaryPhone = phoneNumbers.data?.items?.[0] ?? null;

  const isDetailsLoading =
    isConnected && (businessAccounts.isLoading || phoneNumbers.isLoading);
  const detailsLoadFailed = isConnected && (businessAccounts.isError || phoneNumbers.isError);

  const connectionSteps = t.raw('steps') as string[];

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
          <CardTitle className="text-xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
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
                {isDetailsLoading ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                    <Loader2Icon className="size-4 animate-spin" />
                    {t('loadingDetails')}
                  </div>
                ) : (
                  <>
                    {detailsLoadFailed ? (
                      <p className="mb-4 text-sm text-muted-foreground">{t('detailsLoadFailed')}</p>
                    ) : null}
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
                  </>
                )}

                <Button
                  variant="gradient"
                  size="lg"
                  className="mt-6 w-full"
                  render={<Link href={ROUTES.onboarding.selectPlan} />}
                >
                  {t('continueToPlan')}
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="bg-gradient-brand-soft rounded-xl p-4 ring-1 ring-primary/10">
                  <p className="text-sm font-medium">{t('howItWorks')}</p>
                  <ol className="mt-3 flex flex-col gap-2.5">
                    {connectionSteps.map((step, index) => (
                      <li key={step} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="bg-gradient-brand mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold text-primary-foreground">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {isEmbeddedConfigured ? (
                  <MetaEmbeddedSignupButton
                    session={embeddedSession!}
                    disabled={connectMeta.isPending}
                    onConnect={handleConnect}
                  />
                ) : (
                  <p className="text-sm text-destructive">{t('embeddedNotConfigured')}</p>
                )}

                {connectMeta.isPending ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2Icon className="size-4 animate-spin" />
                    {t('connecting')}
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
