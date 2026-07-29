'use client';

import { PageHeader } from '@/components/shared/page-header';
import { SecuritySettingsSection } from '@/features/settings/components/security-settings-section';

export default function SecuritySettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="الأمان" description="إدارة الجلسة وكلمة المرور" />
      <SecuritySettingsSection />
    </div>
  );
}
