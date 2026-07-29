import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default function AdminMetaConfigPage() {
  return (
    <AdminUnavailablePage
      title="إعدادات Meta"
      description="إدارة Meta Apps والـ Tokens وWebhooks على مستوى المنصة"
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
