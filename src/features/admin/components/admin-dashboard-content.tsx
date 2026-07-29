'use client';

import { Building2Icon, MessageSquareIcon, ServerIcon, UsersIcon, ActivityIcon } from 'lucide-react';
import { MetricCard, StatusCard, StatsGrid, InformationCard } from '@/components/cards';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminDashboard } from '@/features/admin/hooks/use-admin-dashboard';
import { useSystemHealth } from '@/features/admin/hooks/use-system-health';
import { formatDateTime } from '@/utils/date';

export function AdminDashboardContent() {
  const { data: dashboard, isLoading: dashboardLoading } = useAdminDashboard();
  const { data: health, isLoading: healthLoading } = useSystemHealth();

  return (
    <div className="flex flex-col gap-6">
      <StatsGrid>
        <MetricCard
          title="إجمالي المنظمات"
          value={dashboard?.organizations.total ?? 0}
          description={`${dashboard?.organizations.active ?? 0} نشطة · ${dashboard?.organizations.suspended ?? 0} معلقة`}
          icon={Building2Icon}
          loading={dashboardLoading}
        />
        <MetricCard
          title="المنظمات النشطة"
          value={dashboard?.organizations.active ?? 0}
          icon={Building2Icon}
          loading={dashboardLoading}
        />
        <MetricCard
          title="إجمالي المستخدمين"
          value={dashboard?.users.total ?? 0}
          description={`${dashboard?.users.active ?? 0} نشط · ${dashboard?.users.disabled ?? 0} معطل`}
          icon={UsersIcon}
          loading={dashboardLoading}
        />
        <MetricCard
          title="المستخدمون النشطون"
          value={dashboard?.users.active ?? 0}
          icon={UsersIcon}
          loading={dashboardLoading}
        />
      </StatsGrid>

      <StatsGrid className="xl:grid-cols-3">
        <MetricCard
          title="إجمالي الرسائل (منصة)"
          value={dashboard?.platform.totalMessages ?? 0}
          description="من GET /admin/dashboard"
          icon={MessageSquareIcon}
          loading={dashboardLoading}
        />
        <MetricCard
          title="طلبات API (منصة)"
          value={dashboard?.platform.totalApiRequests ?? 0}
          description="من GET /admin/dashboard"
          icon={ActivityIcon}
          loading={dashboardLoading}
        />
        <StatusCard
          title="صحة API"
          status={health?.status ?? '—'}
          statusLabel={health?.status === 'ok' ? 'سليم' : 'غير متاح'}
          description="GET /health"
          icon={ServerIcon}
        />
      </StatsGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <InformationCard
          title="ملخص المنصة"
          rows={[
            { label: 'آخر تحديث', value: dashboard ? formatDateTime(dashboard.generatedAt) : '—' },
            { label: 'إجمالي المنظمات', value: dashboard?.organizations.total ?? 0 },
            { label: 'إجمالي المستخدمين', value: dashboard?.users.total ?? 0 },
            { label: 'المنظمات المعلقة', value: dashboard?.organizations.suspended ?? 0 },
          ]}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">حالة النظام</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {healthLoading ? (
              <span className="text-muted-foreground">جاري الفحص...</span>
            ) : (
              <span className={health?.status === 'ok' ? 'text-green-600' : 'text-destructive'}>
                {health?.status === 'ok' ? 'الخدمة تعمل بشكل طبيعي' : 'غير متاح'}
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      <UnavailableFeatureAlert
        title="مقاييس غير متوفرة بعد"
        description="البيانات التالية تتطلب endpoints إضافية في الـ backend."
        requiredEndpoints={[
          'GET /admin/stats/waba',
          'GET /admin/stats/phone-numbers',
          'GET /admin/stats/messages?period=today|month',
          'GET /admin/queue/status',
          'GET /admin/workers/status',
          'GET /admin/stats/revenue',
          'GET /admin/subscriptions/summary',
          'GET /admin/activity/timeline',
          'GET /admin/health/database',
          'GET /admin/health/redis',
          'GET /admin/health/storage',
        ]}
      />
    </div>
  );
}
