import { getTranslations } from 'next-intl/server';
import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default async function AdminFeatureFlagsPage() {
  const t = await getTranslations('admin.unavailable.featureFlags');

  return (
    <AdminUnavailablePage
      title={t('title')}
      description={t('description')}
      requiredEndpoints={[
        'GET /admin/feature-flags',
        'POST /admin/feature-flags',
        'PATCH /admin/feature-flags/:id/enable',
        'PATCH /admin/feature-flags/:id/disable',
        'PATCH /admin/feature-flags/:id/rollout',
      ]}
    />
  );
}
