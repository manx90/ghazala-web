import { getTranslations } from 'next-intl/server';
import { LoadingScreen } from '@/components/global/loading-screen';

export default async function AdminLoading() {
  const t = await getTranslations('admin.common');

  return <LoadingScreen label={t('loadingAdmin')} />;
}
