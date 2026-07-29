'use client';

import { PageHeader } from '@/components/shared/page-header';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { PermissionGuard } from '@/components/guards/permission-guard';

export default function ApiKeysSettingsPage() {
  return (
    <PermissionGuard permission="org.manage">
      <div className="flex flex-col gap-6">
        <PageHeader title="مفاتيح API" description="إنشاء وإدارة مفاتيح الوصول" />
        <UnavailableFeatureAlert
          title="مفاتيح API غير متاحة"
          description="لا يمكن إدارة مفاتيح API حالياً لعدم توفر واجهات API."
          requiredEndpoints={[
            'GET /api-keys',
            'POST /api-keys',
            'DELETE /api-keys/:id',
          ]}
        />
      </div>
    </PermissionGuard>
  );
}
