import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default function AdminMonitoringPage() {
  return (
    <AdminUnavailablePage
      title="مراقبة النظام"
      description="Queue، Workers، Cron Jobs، وBackground Jobs"
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
