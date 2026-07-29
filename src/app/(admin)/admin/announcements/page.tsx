import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default function AdminAnnouncementsPage() {
  return (
    <AdminUnavailablePage
      title="الإعلانات"
      description="إنشاء ونشر وإدارة إعلانات المنصة"
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
