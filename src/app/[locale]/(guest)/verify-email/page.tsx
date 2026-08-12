import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoadingScreen } from '@/components/global/loading-screen';
import { VerifyEmailForm } from '@/features/auth/components/verify-email-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.meta');
  return { title: t('verifyEmail') };
}

export default async function VerifyEmailPage() {
  const t = await getTranslations('common');

  return (
    <Suspense fallback={<LoadingScreen label={t('loading')} />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
