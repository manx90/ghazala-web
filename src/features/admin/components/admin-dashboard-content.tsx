'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ActivityIcon,
  Building2Icon,
  CreditCardIcon,
  DatabaseIcon,
  HardDriveIcon,
  MessageSquareIcon,
  PhoneIcon,
  ServerIcon,
  UsersIcon,
  WorkflowIcon,
  type LucideIcon,
} from 'lucide-react';
import { StatsGrid } from '@/components/cards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAdminDashboard } from '@/features/admin/hooks/use-admin-dashboard';
import {
  useAdminActivityTimeline,
  useAdminDatabaseHealth,
  useAdminMessageStats,
  useAdminPhoneNumberStats,
  useAdminQueueStatus,
  useAdminRedisHealth,
  useAdminRevenueStats,
  useAdminStorageHealth,
  useAdminSubscriptionSummary,
  useAdminWabaStats,
  useAdminWorkersStatus,
} from '@/features/admin/hooks/use-admin-dashboard-metrics';
import { useSystemHealth } from '@/features/admin/hooks/use-system-health';
import type { AdminHealthStatus, AdminMessageStatsPeriod } from '@/types/admin.types';
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

function healthLabel(status?: AdminHealthStatus): string {
  switch (status) {
    case 'ok':
      return 'سليم';
    case 'degraded':
      return 'متدهور';
    case 'down':
      return 'متوقف';
    case 'not_configured':
      return 'غير مفعّل';
    default:
      return 'غير معروف';
  }
}

function healthColor(status?: AdminHealthStatus): string {
  switch (status) {
    case 'ok':
      return 'text-emerald-600';
    case 'degraded':
      return 'text-amber-600';
    case 'down':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '—';
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(1)} GB`;
}

function HealthMetricCard({
  title,
  status,
  loading,
  detail,
  icon: Icon,
  delay,
}: {
  title: string;
  status?: AdminHealthStatus;
  loading: boolean;
  detail?: string;
  icon: LucideIcon;
  delay: number;
}) {
  return (
    <Card className="stagger-in card-interactive" style={{ '--stagger-delay': `${delay}ms` } as CSSProperties}>
      <CardContent className="flex items-center gap-4 pt-6">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl shadow-md',
            status === 'ok' ? 'bg-gradient-brand text-primary-foreground' : 'bg-muted text-muted-foreground',
          )}
        >
          <Icon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          {loading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <span className={cn('text-sm font-semibold', healthColor(status))}>{healthLabel(status)}</span>
          )}
          {detail && <span className="truncate text-xs text-muted-foreground">{detail}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardContent() {
  const [messagePeriod, setMessagePeriod] = useState<AdminMessageStatsPeriod>('month');

  const { data: dashboard, isLoading: dashboardLoading } = useAdminDashboard();
  const { data: health, isLoading: healthLoading } = useSystemHealth();
  const { data: waba, isLoading: wabaLoading } = useAdminWabaStats();
  const { data: phones, isLoading: phonesLoading } = useAdminPhoneNumberStats();
  const { data: messages, isLoading: messagesLoading } = useAdminMessageStats(messagePeriod);
  const { data: revenue, isLoading: revenueLoading } = useAdminRevenueStats();
  const { data: subsSummary, isLoading: subsLoading } = useAdminSubscriptionSummary();
  const { data: queue, isLoading: queueLoading } = useAdminQueueStatus();
  const { data: workers, isLoading: workersLoading } = useAdminWorkersStatus();
  const { data: activity, isLoading: activityLoading } = useAdminActivityTimeline();
  const { data: dbHealth, isLoading: dbLoading } = useAdminDatabaseHealth();
  const { data: redisHealth, isLoading: redisLoading } = useAdminRedisHealth();
  const { data: storageHealth, isLoading: storageLoading } = useAdminStorageHealth();

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
          title="إجمالي المستخدمين"
          value={dashboard?.users.total ?? 0}
          description={`${dashboard?.users.active ?? 0} نشط · ${dashboard?.users.disabled ?? 0} معطل`}
          icon={UsersIcon}
          loading={dashboardLoading}
          delay={70}
        />
        <KpiCard
          title="MRR"
          value={revenue ? `${revenue.mrr} ${revenue.currency}` : '—'}
          description={subsSummary ? `${subsSummary.active} اشتراك نشط` : undefined}
          icon={CreditCardIcon}
          loading={revenueLoading || subsLoading}
          delay={140}
        />
        <KpiCard
          title="إيرادات الشهر"
          value={revenue ? `${revenue.revenueThisMonth} ${revenue.currency}` : '—'}
          description={revenue ? `${revenue.paidInvoices} فاتورة مدفوعة` : undefined}
          icon={CreditCardIcon}
          loading={revenueLoading}
          delay={210}
        />
      </StatsGrid>

      <StatsGrid className="xl:grid-cols-4">
        <KpiCard
          title="إجمالي الرسائل"
          value={dashboard?.platform.totalMessages ?? 0}
          description="كل رسائل المنصة"
          icon={MessageSquareIcon}
          loading={dashboardLoading}
          delay={280}
        />
        <KpiCard
          title="نشاط الشهر"
          value={dashboard?.platform.totalApiRequests ?? 0}
          description="رسائل هذا الشهر"
          icon={ActivityIcon}
          loading={dashboardLoading}
          delay={350}
        />
        <KpiCard
          title="حسابات WABA"
          value={waba?.total ?? 0}
          description={waba ? `${waba.connected} متصل · ${waba.organizationsWithWaba} منظمة` : undefined}
          icon={Building2Icon}
          loading={wabaLoading}
          delay={420}
        />
        <KpiCard
          title="أرقام WhatsApp"
          value={phones?.total ?? 0}
          description={phones ? `${phones.connected} متصل · ${phones.disconnected} مفصول` : undefined}
          icon={PhoneIcon}
          loading={phonesLoading}
          delay={490}
        />
      </StatsGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="stagger-in" style={{ '--stagger-delay': '560ms' } as CSSProperties}>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">إحصائيات الرسائل</CardTitle>
              <CardDescription>حسب الفترة المحددة</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                size="xs"
                variant={messagePeriod === 'today' ? 'default' : 'outline'}
                onClick={() => setMessagePeriod('today')}
              >
                اليوم
              </Button>
              <Button
                size="xs"
                variant={messagePeriod === 'month' ? 'default' : 'outline'}
                onClick={() => setMessagePeriod('month')}
              >
                الشهر
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {messagesLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)
            ) : (
              <>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">الإجمالي</p>
                  <p className="text-xl font-bold tabular-nums">{messages?.total ?? 0}</p>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">صادرة</p>
                  <p className="text-xl font-bold tabular-nums">{messages?.outbound ?? 0}</p>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">واردة</p>
                  <p className="text-xl font-bold tabular-nums">{messages?.inbound ?? 0}</p>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">فاشلة / بالانتظار</p>
                  <p className="text-xl font-bold tabular-nums">
                    {messages?.failed ?? 0} / {messages?.queued ?? 0}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="stagger-in" style={{ '--stagger-delay': '630ms' } as CSSProperties}>
          <CardHeader>
            <CardTitle className="text-base">ملخص الاشتراكات</CardTitle>
            <CardDescription>حالة كل الاشتراكات على المنصة</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {subsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)
            ) : (
              <>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">الإجمالي</p>
                  <p className="text-xl font-bold tabular-nums">{subsSummary?.total ?? 0}</p>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">نشط / تجريبي</p>
                  <p className="text-xl font-bold tabular-nums">
                    {subsSummary?.active ?? 0} / {subsSummary?.trial ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">بانتظار الدفع</p>
                  <p className="text-xl font-bold tabular-nums">{subsSummary?.pendingPayment ?? 0}</p>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">ملغي / منتهي</p>
                  <p className="text-xl font-bold tabular-nums">
                    {subsSummary?.cancelled ?? 0} / {subsSummary?.expired ?? 0}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <StatsGrid className="xl:grid-cols-3">
        <HealthMetricCard
          title="قاعدة البيانات"
          status={dbHealth?.status}
          loading={dbLoading}
          detail={dbHealth?.latencyMs !== undefined ? `${dbHealth.latencyMs}ms` : undefined}
          icon={DatabaseIcon}
          delay={700}
        />
        <HealthMetricCard
          title="Redis"
          status={redisHealth?.status}
          loading={redisLoading}
          detail={redisHealth?.message}
          icon={ServerIcon}
          delay={770}
        />
        <HealthMetricCard
          title="التخزين / الذاكرة"
          status={storageHealth?.status}
          loading={storageLoading}
          detail={
            storageHealth
              ? `متاح: ${formatBytes(storageHealth.freeMemoryBytes)}`
              : undefined
          }
          icon={HardDriveIcon}
          delay={840}
        />
      </StatsGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="stagger-in" style={{ '--stagger-delay': '910ms' } as CSSProperties}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <WorkflowIcon className="size-4" />
              طابور الرسائل
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {queueLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)
            ) : (
              <>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">بالانتظار</p>
                  <p className="text-xl font-bold tabular-nums">{queue?.waiting ?? 0}</p>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">قيد الإرسال</p>
                  <p className="text-xl font-bold tabular-nums">{queue?.active ?? 0}</p>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">فاشلة</p>
                  <p className="text-xl font-bold tabular-nums">{queue?.failed ?? 0}</p>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">مكتملة اليوم</p>
                  <p className="text-xl font-bold tabular-nums">{queue?.completedToday ?? 0}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="stagger-in" style={{ '--stagger-delay': '980ms' } as CSSProperties}>
          <CardHeader>
            <CardTitle className="text-base">Workers</CardTitle>
            <CardDescription>{workers?.message ?? 'حالة المعالجة الخلفية'}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {workersLoading ? (
              <Skeleton className="col-span-2 h-20 rounded-xl" />
            ) : (
              <>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">الوضع</p>
                  <p className="text-sm font-semibold">{workers?.mode === 'in_process' ? 'داخل API' : 'موزّع'}</p>
                </div>
                <div className="rounded-xl bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">الحالة</p>
                  <p className={cn('text-sm font-semibold', workers?.status === 'running' ? 'text-emerald-600' : '')}>
                    {workers?.status === 'running' ? 'يعمل' : workers?.status ?? '—'}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="stagger-in lg:col-span-3" style={{ '--stagger-delay': '1050ms' } as CSSProperties}>
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

        <Card className="stagger-in lg:col-span-2" style={{ '--stagger-delay': '1120ms' } as CSSProperties}>
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
              <span className="text-muted-foreground">إجمالي الإيرادات</span>
              <span className="font-mono text-xs font-medium" dir="ltr">
                {revenue ? `${revenue.totalRevenue} ${revenue.currency}` : '—'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="stagger-in" style={{ '--stagger-delay': '1190ms' } as CSSProperties}>
        <CardHeader>
          <CardTitle className="text-base">آخر النشاطات</CardTitle>
          <CardDescription>منظمات، مستخدمون، اشتراكات، وفواتير</CardDescription>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : activity?.items.length ? (
            <div className="flex flex-col gap-2">
              {activity.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border/60 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    {item.description && (
                      <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground" dir="ltr">
                    {formatDateTime(item.occurredAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">لا توجد نشاطات بعد</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
