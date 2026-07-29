import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default function AdminSettingsPage() {
  return (
    <AdminUnavailablePage
      title="الإعدادات العامة"
      description="Branding، Email، Storage، Queue، Security، API، والحدود الافتراضية"
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
