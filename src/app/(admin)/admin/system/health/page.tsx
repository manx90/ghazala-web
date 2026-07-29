'use client';

import { RefreshCwIcon, ServerIcon, DatabaseIcon, HardDriveIcon, CpuIcon } from 'lucide-react';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { StatusCard } from '@/components/cards';
import { StatsGrid } from '@/components/cards';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSystemHealth } from '@/features/admin/hooks/use-system-health';

export default function AdminSystemHealthPage() {
  const { data, isLoading, isError, refetch, isFetching } = useSystemHealth();

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="صحة النظام"
          description="مراقبة حالة الخدمات الأساسية"
          actions={
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCwIcon data-icon="inline-start" />
              تحديث
            </Button>
          }
        />

        <StatsGrid className="sm:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            title="API"
            status={isLoading ? 'loading' : isError ? 'error' : data?.status ?? 'unknown'}
            statusLabel={isLoading ? 'جاري الفحص' : isError ? 'خطأ' : data?.status === 'ok' ? 'سليم' : 'غير متاح'}
            description="GET /health"
            icon={ServerIcon}
          />
          <StatusCard
            title="قاعدة البيانات"
            status="unknown"
            statusLabel="غير متاح"
            description="يتطلب endpoint"
            icon={DatabaseIcon}
          />
          <StatusCard
            title="Redis"
            status="unknown"
            statusLabel="غير متاح"
            description="يتطلب endpoint"
            icon={CpuIcon}
          />
          <StatusCard
            title="التخزين"
            status="unknown"
            statusLabel="غير متاح"
            description="يتطلب endpoint"
            icon={HardDriveIcon}
          />
        </StatsGrid>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">تفاصيل الفحص</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {isError
              ? 'تعذر الوصول إلى نقطة الفحص'
              : data?.status === 'ok'
                ? 'الـ API يستجيب بشكل طبيعي. الفحص يتكرر كل 30 ثانية.'
                : '—'}
          </CardContent>
        </Card>

        <UnavailableFeatureAlert
          title="مراقبة متقدمة غير متوفرة"
          description="الـ backend يوفّر GET /health فقط حالياً."
          requiredEndpoints={[
            'GET /admin/health/database',
            'GET /admin/health/redis',
            'GET /admin/health/storage',
            'GET /admin/queue/status',
            'GET /admin/workers/status',
            'GET /admin/cron/jobs',
            'GET /admin/jobs/background',
          ]}
        />
      </div>
    </PageContainer>
  );
}
