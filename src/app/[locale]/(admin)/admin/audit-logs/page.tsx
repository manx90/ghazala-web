import { getTranslations } from 'next-intl/server';
import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default async function AdminAuditLogsPage() {
  const t = await getTranslations('admin.unavailable.auditLogs');

  return (
    <AdminUnavailablePage
      title={t('title')}
      description={t('description')}
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
