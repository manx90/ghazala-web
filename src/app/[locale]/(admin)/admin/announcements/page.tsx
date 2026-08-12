import { getTranslations } from 'next-intl/server';
import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default async function AdminAnnouncementsPage() {
  const t = await getTranslations('admin.unavailable.announcements');

  return (
    <AdminUnavailablePage
      title={t('title')}
      description={t('description')}
      requiredEndpoints={[
        'GET /admin/announcements',
        'POST /admin/announcements',
        'PATCH /admin/announcements/:id/publish',
        'PATCH /admin/announcements/:id/schedule',
        'PATCH /admin/announcements/:id/expire',
      ]}
    />
  );
}
