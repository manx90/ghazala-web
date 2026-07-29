import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default function AdminAuditLogsPage() {
  return (
    <AdminUnavailablePage
      title="سجل التدقيق"
      description="عرض وتصدير سجلات النشاط"
      requiredEndpoints={[
        'GET /admin/audit-logs?page&limit&search',
        'GET /admin/audit-logs/export',
        'GET /admin/audit-logs/users/:id',
        'GET /admin/audit-logs/organizations/:id',
        'GET /admin/audit-logs/api',
      ]}
    />
  );
}
