'use client';

import type { CSSProperties } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ActivityIcon,
  Building2Icon,
  MessageSquareIcon,
  ServerIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react';
import { StatsGrid } from '@/components/cards';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminDashboard } from '@/features/admin/hooks/use-admin-dashboard';
import { useSystemHealth } from '@/features/admin/hooks/use-system-health';
import { formatDateTime } from '@/utils/date';
import { cn } from '@/lib/utils';

const CHART_GRADIENT_ID = 'adminOverviewBar';

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  loading?: boolean;
  delay?: number;
}

function KpiCard({ title, value, description, icon: Icon, loading, delay = 0 }: KpiCardProps) {
  const staggerStyle = { '--stagger-delay': `${delay}ms` } as CSSProperties;
  if (loading) {
    return (
      <Card className="stagger-in" style={staggerStyle}>
        <CardContent className="flex items-center gap-4 pt-6">
          <Skeleton className="size-11 shrink-0 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-7 w-14" />
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="stagger-in card-interactive" style={staggerStyle}>
      <CardContent className="flex items-center gap-4 pt-6">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-md">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-xs font-medium text-muted-foreground">{title}</span>
          <span className="text-2xl font-bold tracking-tight tabular-nums">{value}</span>
          {description && <span className="truncate text-xs text-muted-foreground">{description}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function HealthPulseCard({ status, loading, delay }: { status?: string; loading: boolean; delay: number }) {
  const isOk = status === 'ok';
  return (
    <Card className="stagger-in card-interactive" style={{ '--stagger-delay': `${delay}ms` } as CSSProperties}>
      <CardContent className="flex items-center gap-4 pt-6">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl shadow-md',
            isOk ? 'bg-gradient-brand text-primary-foreground' : 'bg-destructive/10 text-destructive',
          )}
        >
          <ServerIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">صحة API</span>
          {loading ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <span className="relative flex size-2.5">
                {isOk && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                )}
                <span
                  className={cn(
                    'relative inline-flex size-2.5 rounded-full',
                    isOk ? 'bg-emerald-500' : 'bg-destructive',
                  )}
                />
              </span>
              {isOk ? 'سليم' : 'غير متاح'}
            </span>
          )}
          <span className="font-mono text-xs text-muted-foreground" dir="ltr">
            GET /health
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardContent() {
  const { data: dashboard, isLoading: dashboardLoading } = useAdminDashboard();
  const { data: health, isLoading: healthLoading } = useSystemHealth();

  const chartData = dashboard
    ? [
        { name: 'منظمات نشطة', value: dashboard.organizations.active },
        { name: 'منظمات معلقة', value: dashboard.organizations.suspended },
        { name: 'مستخدمون نشطون', value: dashboard.users.active },
        { name: 'مستخدمون معطلون', value: dashboard.users.disabled },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      <StatsGrid>
        <KpiCard
          title="إجمالي المنظمات"
          value={dashboard?.organizations.total ?? 0}
          description={`${dashboard?.organizations.active ?? 0} نشطة · ${dashboard?.organizations.suspended ?? 0} معلقة`}
          icon={Building2Icon}
          loading={dashboardLoading}
          delay={0}
        />
        <KpiCard
          title="المنظمات النشطة"
          value={dashboard?.organizations.active ?? 0}
          icon={Building2Icon}
          loading={dashboardLoading}
          delay={70}
        />
        <KpiCard
          title="إجمالي المستخدمين"
          value={dashboard?.users.total ?? 0}
          description={`${dashboard?.users.active ?? 0} نشط · ${dashboard?.users.disabled ?? 0} معطل`}
          icon={UsersIcon}
          loading={dashboardLoading}
          delay={140}
        />
        <KpiCard
          title="المستخدمون النشطون"
          value={dashboard?.users.active ?? 0}
          icon={UsersIcon}
          loading={dashboardLoading}
          delay={210}
        />
      </StatsGrid>

      <StatsGrid className="xl:grid-cols-3">
        <KpiCard
          title="إجمالي الرسائل (منصة)"
          value={dashboard?.platform.totalMessages ?? 0}
          description="جميع رسائل المنصة"
          icon={MessageSquareIcon}
          loading={dashboardLoading}
          delay={280}
        />
        <KpiCard
          title="طلبات API (منصة)"
          value={dashboard?.platform.totalApiRequests ?? 0}
          description="جميع الطلبات المسجلة"
          icon={ActivityIcon}
          loading={dashboardLoading}
          delay={350}
        />
        <HealthPulseCard status={health?.status} loading={healthLoading} delay={420} />
      </StatsGrid>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card
          className="stagger-in lg:col-span-3"
          style={{ '--stagger-delay': '490ms' } as CSSProperties}
        >
          <CardHeader>
            <CardTitle className="text-base">المنظمات والمستخدمون</CardTitle>
            <CardDescription>مقارنة الحالات على مستوى المنصة</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <Skeleton className="h-64 w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={CHART_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3c6e71" />
                      <stop offset="100%" stopColor="#284b63" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={32} />
                  <Tooltip
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid var(--border)',
                      background: 'var(--card)',
                      fontSize: 12,
                    }}
                    formatter={(value) => [value ?? 0, 'العدد']}
                  />
                  <Bar dataKey="value" fill={`url(#${CHART_GRADIENT_ID})`} radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card
          className="stagger-in lg:col-span-2"
          style={{ '--stagger-delay': '560ms' } as CSSProperties}
        >
          <CardHeader>
            <CardTitle className="text-base">حالة النظام</CardTitle>
            <CardDescription>فحص مباشر يتجدد تلقائياً</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-xl bg-gradient-brand-soft px-4 py-3 ring-1 ring-primary/10">
              <div className="flex items-center gap-3">
                <span className="relative flex size-2.5">
                  {health?.status === 'ok' && (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  )}
                  <span
                    className={cn(
                      'relative inline-flex size-2.5 rounded-full',
                      health?.status === 'ok' ? 'bg-emerald-500' : 'bg-destructive',
                    )}
                  />
                </span>
                <span className="text-sm font-medium">خادم API</span>
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  healthLoading ? 'text-muted-foreground' : health?.status === 'ok' ? 'text-emerald-600' : 'text-destructive',
                )}
              >
                {healthLoading ? 'جاري الفحص...' : health?.status === 'ok' ? 'يعمل بشكل طبيعي' : 'غير متاح'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">آخر تحديث للبيانات</span>
              <span className="font-mono text-xs font-medium" dir="ltr">
                {dashboard ? formatDateTime(dashboard.generatedAt) : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">نقطة الفحص</span>
              <span className="font-mono text-xs font-medium" dir="ltr">
                GET /health
              </span>
            </div>
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
