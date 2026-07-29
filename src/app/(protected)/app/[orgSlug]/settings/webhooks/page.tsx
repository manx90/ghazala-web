'use client';

import { PageHeader } from '@/components/shared/page-header';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { PermissionGuard } from '@/components/guards/permission-guard';

export default function WebhooksSettingsPage() {
  return (
    <PermissionGuard permission="org.manage">
      <div className="flex flex-col gap-6">
        <PageHeader title="Webhooks" description="إدارة webhooks للأحداث" />
        <UnavailableFeatureAlert
          title="Webhooks غير متاح"
          description="لا يمكن إدارة webhooks حالياً لعدم توفر واجهات API."
          requiredEndpoints={[
            'GET /webhooks',
            'POST /webhooks',
            'PATCH /webhooks/:id',
            'DELETE /webhooks/:id',
          ]}
        />
      </div>
    </PermissionGuard>
  );
}
