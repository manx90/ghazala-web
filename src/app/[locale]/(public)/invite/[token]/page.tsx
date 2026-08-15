import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoadingScreen } from '@/components/global/loading-screen';
import { InviteView } from '@/features/invite/components/invite-view';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('invite.meta');
  return { title: t('title') };
}

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const t = await getTranslations('common');

  return (
    <Suspense fallback={<LoadingScreen label={t('loading')} />}>
      <InviteView token={token} />
    </Suspense>
  );
}
