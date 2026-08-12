import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoadingScreen } from '@/components/global/loading-screen';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.meta');
  return { title: t('resetPassword') };
}

export default async function ResetPasswordPage() {
  const t = await getTranslations('common');

  return (
    <Suspense fallback={<LoadingScreen label={t('loading')} />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
