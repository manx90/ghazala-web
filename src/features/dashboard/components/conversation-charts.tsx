'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QueryState } from '@/components/shared/query-state';
import { Skeleton } from '@/components/ui/skeleton';
import type { ConversationStatistics } from '@/types/conversation.types';

const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-5)'];

interface ConversationChartsProps {
  stats: UseQueryResult<ConversationStatistics>;
}

function buildChartData(stats: ConversationStatistics) {
  return [
    { name: 'مفتوحة', value: stats.open, key: 'open' },
    { name: 'مغلقة', value: stats.closed, key: 'closed' },
    { name: 'منتهية', value: stats.expired, key: 'expired' },
  ];
}

function ChartsSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Skeleton className="h-72 w-full rounded-xl" />
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}

export function ConversationCharts({ stats }: ConversationChartsProps) {
  if (stats.isLoading) return <ChartsSkeleton />;

  const chartData = stats.data ? buildChartData(stats.data) : [];
  const isEmpty = chartData.every((item) => item.value === 0);

  return (
    <QueryState
      isLoading={false}
      isError={stats.isError}
      error={stats.error}
      isEmpty={isEmpty}
      emptyTitle="لا توجد بيانات محادثات"
      emptyDescription="ستظهر الإحصائيات عند بدء استقبال المحادثات."
      onRetry={() => void stats.refetch()}
      skeletonRows={2}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>توزيع المحادثات</CardTitle>
            <CardDescription>نسبة المحادثات حسب الحالة</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {chartData.map((_, index) => (
                    <Cell key={chartData[index].key} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value ?? 0, 'عدد']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              {chartData.map((item, index) => (
                <span key={item.key} className="flex items-center gap-1.5">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  {item.name}: {item.value}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إحصائيات المحادثات</CardTitle>
            <CardDescription>مقارنة حسب الحالة</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [value ?? 0, 'عدد']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={chartData[index].key} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </QueryState>
  );
}
