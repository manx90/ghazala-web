'use client';

import { PageHeader } from '@/components/shared/page-header';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { WhatsappSettingsSection } from '@/features/settings/components/whatsapp-settings-section';

export default function WhatsappSettingsPage() {
  return (
    <PermissionGuard permission="whatsapp.manage">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="إعدادات WhatsApp"
          description="حسابات WABA وأرقام الهاتف"
        />
        <WhatsappSettingsSection />
      </div>
    </PermissionGuard>
  );
}
