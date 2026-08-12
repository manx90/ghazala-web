import { getTranslations } from 'next-intl/server';
import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default async function AdminMonitoringPage() {
  const t = await getTranslations('admin.unavailable.monitoring');

  return (
    <AdminUnavailablePage
      title={t('title')}
      description={t('description')}
      requiredEndpoints={[
        'GET /admin/queue/monitoring',
        'GET /admin/workers/monitoring',
        'GET /admin/cron/jobs',
        'GET /admin/jobs/background',
        'GET /admin/health/redis',
        'GET /admin/health/storage',
      ]}
    />
  );
}
