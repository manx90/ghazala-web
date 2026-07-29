import { AdminUnavailablePage } from '@/features/admin/components/admin-unavailable-page';

export default function AdminFeatureFlagsPage() {
  return (
    <AdminUnavailablePage
      title="Feature Flags"
      description="تفعيل وتعطيل الميزات والتحكم بالبيئات"
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
