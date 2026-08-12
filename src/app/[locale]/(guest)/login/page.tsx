import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoadingScreen } from '@/components/global/loading-screen';
import { LoginForm } from '@/features/auth/components/login-form';
import { LoginShell } from '@/features/auth/components/login-shell';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auth.meta');
  return { title: t('login') };
}

export default async function LoginPage() {
  const t = await getTranslations('common');

  return (
    <LoginShell>
      <Suspense fallback={<LoadingScreen label={t('loading')} />}>
        <LoginForm />
      </Suspense>
    </LoginShell>
  );
}
