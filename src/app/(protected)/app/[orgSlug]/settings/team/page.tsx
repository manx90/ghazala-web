'use client';

import { PageHeader } from '@/components/shared/page-header';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { TeamMembersSection } from '@/features/settings/components/team-members-section';

export default function TeamSettingsPage() {
  return (
    <PermissionGuard permission="team.manage">
      <div className="flex flex-col gap-6">
        <PageHeader title="إدارة الفريق" description="إضافة وتعديل وإزالة أعضاء المنظمة" />
        <TeamMembersSection />
      </div>
    </PermissionGuard>
  );
}
