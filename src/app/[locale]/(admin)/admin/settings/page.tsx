import { getTranslations } from 'next-intl/server';
import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default async function AdminSettingsPage() {
  const t = await getTranslations('admin.unavailable.settings');

  return (
    <AdminUnavailablePage
      title={t('title')}
      description={t('description')}
      requiredEndpoints={[
        'GET /admin/settings',
        'PATCH /admin/settings/branding',
        'PATCH /admin/settings/email',
        'PATCH /admin/settings/storage',
        'PATCH /admin/settings/queue',
        'PATCH /admin/settings/security',
        'PATCH /admin/settings/api',
        'PATCH /admin/settings/default-limits',
      ]}
    />
  );
}
