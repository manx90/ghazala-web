'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/global/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { queryKeys } from '@/config/query-keys';
import { ROUTES } from '@/config/routes';
import { billingApi } from '@/features/billing/api/billing.api';
import { invalidateOnboardingState } from '@/features/onboarding/utils/invalidate-onboarding';
import { SubscriptionStatus } from '@/types/billing.types';
import { useOrganizationStore } from '@/store/organization.store';

const ACTIVE_STATUSES = new Set([
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIAL,
  SubscriptionStatus.PAST_DUE,
]);

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 15;

export default function BillingCallbackPage() {
  const t = useTranslations('onboarding.billingCallback');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization);

  const statusParam = searchParams.get('status');
  const [phase, setPhase] = useState<'polling' | 'success' | 'timeout' | 'failed'>('polling');

  useEffect(() => {
    if (statusParam === 'failed') {
      setPhase('failed');
      return;
    }

    let attempts = 0;
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;

      try {
        const subscription = await billingApi.getSubscription();

        if (subscription && ACTIVE_STATUSES.has(subscription.status)) {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription }),
            invalidateOnboardingState(queryClient),
          ]);
          setPhase('success');

          const slug = currentOrganization?.slug;
          if (slug) {
            router.replace(ROUTES.app.dashboard(slug));
          }
          return;
        }
      } catch {
        // continue polling
      }

      attempts += 1;
      if (attempts >= MAX_ATTEMPTS) {
        setPhase('timeout');
        return;
      }

      window.setTimeout(poll, POLL_INTERVAL_MS);
    };

    void poll();

    return () => {
      cancelled = true;
    };
  }, [currentOrganization?.slug, queryClient, router, statusParam]);

  if (phase === 'failed') {
    return (
      <PageContainer size="sm" className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircleIcon className="mx-auto size-12 text-destructive" />
            <CardTitle>{t('paymentFailed')}</CardTitle>
            <CardDescription>{t('paymentFailedDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button render={<Link href={ROUTES.onboarding.selectPlan} />}>{t('backToPlans')}</Button>
            {currentOrganization?.slug ? (
              <Button variant="outline" render={<Link href={ROUTES.app.settings.billing(currentOrganization.slug)} />}>
                {t('billingSettings')}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (phase === 'timeout') {
    return (
      <PageContainer size="sm" className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2Icon className="mx-auto size-12 animate-spin text-primary" />
            <CardTitle>{t('confirmingPayment')}</CardTitle>
            <CardDescription>{t('confirmingPaymentTimeout')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              {tCommon('retry')}
            </Button>
            {currentOrganization?.slug ? (
              <Button variant="outline" render={<Link href={ROUTES.app.settings.billing(currentOrganization.slug)} />}>
                {t('billingSettings')}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="sm" className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {phase === 'success' ? (
            <CheckCircle2Icon className="mx-auto size-12 text-secondary" />
          ) : (
            <Loader2Icon className="mx-auto size-12 animate-spin text-primary" />
          )}
          <CardTitle>
            {phase === 'success' ? t('subscriptionActivated') : t('confirmingPayment')}
          </CardTitle>
          <CardDescription>
            {phase === 'success' ? t('redirectingToDashboard') : t('confirmingPaymentDescription')}
          </CardDescription>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
