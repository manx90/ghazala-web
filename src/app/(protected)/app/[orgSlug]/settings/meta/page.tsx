'use client';

import { PageHeader } from '@/components/shared/page-header';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { MetaSettingsSection } from '@/features/settings/components/meta-settings-section';

export default function MetaSettingsPage() {
  return (
    <PermissionGuard permission="meta.manage">
      <div className="flex flex-col gap-6">
        <PageHeader title="إعدادات Meta" description="ربط ومزامنة Meta Business" />
        <MetaSettingsSection />
      </div>
    </PermissionGuard>
  );
}
