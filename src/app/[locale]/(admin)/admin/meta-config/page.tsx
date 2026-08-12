import { getTranslations } from 'next-intl/server';
import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default async function AdminMetaConfigPage() {
  const t = await getTranslations('admin.unavailable.metaConfig');

  return (
    <AdminUnavailablePage
      title={t('title')}
      description={t('description')}
      requiredEndpoints={[
        'GET /admin/meta/apps',
        'POST /admin/meta/apps',
        'GET /admin/meta/system-tokens',
        'PATCH /admin/meta/webhook-config',
        'GET /admin/meta/default-settings',
      ]}
    />
  );
}
