'use client';

import { RefreshCwIcon } from 'lucide-react';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { AdminDashboardContent } from '@/features/admin/components/admin-dashboard-content';
import { useAdminDashboard } from '@/features/admin/hooks/use-admin-dashboard';
import { useSystemHealth } from '@/features/admin/hooks/use-system-health';

export default function AdminDashboardPage() {
  const { refetch: refetchDashboard, isFetching: dashboardFetching } = useAdminDashboard();
  const { refetch: refetchHealth, isFetching: healthFetching } = useSystemHealth();

  const refetchAll = () => {
    void refetchDashboard();
    void refetchHealth();
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="لوحة Super Admin"
          description="نظرة تنفيذية على المنصة والمستخدمين والمنظمات"
          actions={
            <Button variant="outline" size="sm" onClick={refetchAll} disabled={dashboardFetching || healthFetching}>
              <RefreshCwIcon data-icon="inline-start" />
              تحديث
            </Button>
          }
        />
        <AdminDashboardContent />
      </div>
    </PageContainer>
  );
}
