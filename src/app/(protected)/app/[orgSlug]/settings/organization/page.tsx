'use client';

import { PageHeader } from '@/components/shared/page-header';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { OrganizationSettingsForm } from '@/features/settings/components/organization-settings-form';

export default function OrganizationSettingsPage() {
  return (
    <PermissionGuard permission="org.manage">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="إعدادات المنظمة"
          description="إدارة الشعار والمنطقة الزمنية والدولة"
        />
        <OrganizationSettingsForm />
      </div>
    </PermissionGuard>
  );
}
