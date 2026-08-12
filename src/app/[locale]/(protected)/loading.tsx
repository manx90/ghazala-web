import { getTranslations } from 'next-intl/server';
import { LoadingScreen } from '@/components/global/loading-screen';

export default async function ProtectedLoading() {
  const t = await getTranslations('common');

  return <LoadingScreen label={t('loadingPage')} />;
}
