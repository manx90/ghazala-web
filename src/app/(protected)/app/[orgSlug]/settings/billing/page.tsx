'use client';

import { PageHeader } from '@/components/shared/page-header';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { BillingSettingsSection } from '@/features/settings/components/billing-settings-section';

export default function BillingSettingsPage() {
  return (
    <PermissionGuard permission="billing.manage">
      <div className="flex flex-col gap-6">
        <PageHeader title="الفوترة والاشتراك" description="إدارة الخطة والفواتير" />
        <BillingSettingsSection />
      </div>
    </PermissionGuard>
  );
}
