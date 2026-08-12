'use client';

import type React from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import {
  Bar,
  BarChart,
  CartesianGrid,
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

function ChartGradientDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      {CHART_COLORS.map((color, index) => (
        <linearGradient
          key={color}
          id={`${prefix}-gradient-${index}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={0.55} />
        </linearGradient>
      ))}
    </defs>
  );
}

const TOOLTIP_STYLE: React.CSSProperties = {
  borderRadius: '0.75rem',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--popover)',
  color: 'var(--popover-foreground)',
  boxShadow: 'var(--shadow-lg)',
  fontSize: '0.75rem',
  padding: '0.5rem 0.75rem',
};

const TOOLTIP_LABEL_STYLE: React.CSSProperties = {
  color: 'var(--muted-foreground)',
  marginBottom: '0.125rem',
};

interface ConversationChartsProps {
  stats: UseQueryResult<ConversationStatistics>;
}

function ChartsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-72 w-full rounded-xl" />
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}

export function ConversationCharts({ stats }: ConversationChartsProps) {
  const t = useTranslations('dashboard.charts');

  if (stats.isLoading) return <ChartsSkeleton />;

  const chartData = stats.data
    ? [
        { name: t('open'), value: stats.data.open, key: 'open' },
        { name: t('closed'), value: stats.data.closed, key: 'closed' },
        { name: t('expired'), value: stats.data.expired, key: 'expired' },
      ]
    : [];
  const isEmpty = chartData.every((item) => item.value === 0);

  return (
    <QueryState
      isLoading={false}
      isError={stats.isError}
      error={stats.error}
      isEmpty={isEmpty}
      emptyTitle={t('emptyTitle')}
      emptyDescription={t('emptyDescription')}
      onRetry={() => void stats.refetch()}
      skeletonRows={2}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className="stagger-in"
          style={{ '--stagger-delay': '240ms' } as React.CSSProperties}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="tracking-tight">{t('distributionTitle')}</CardTitle>
              <CardDescription>{t('distributionDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <ChartGradientDefs prefix="pie" />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={92}
                    paddingAngle={3}
                    cornerRadius={6}
                    stroke="var(--card)"
                    strokeWidth={3}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={chartData[index].key}
                        fill={`url(#pie-gradient-${index % CHART_COLORS.length})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value ?? 0, t('count')]}
                    contentStyle={TOOLTIP_STYLE}
                    labelStyle={TOOLTIP_LABEL_STYLE}
                    itemStyle={{ color: 'var(--popover-foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
                {chartData.map((item, index) => (
                  <span key={item.key} className="flex items-center gap-1.5">
                    <span
                      className="size-2.5 rounded-full ring-2 ring-background shadow-2xs"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    {item.name}: <span className="font-semibold text-foreground tabular-nums">{item.value}</span>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div
          className="stagger-in"
          style={{ '--stagger-delay': '320ms' } as React.CSSProperties}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="tracking-tight">{t('statsTitle')}</CardTitle>
              <CardDescription>{t('statsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <ChartGradientDefs prefix="bar" />
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="var(--border)"
                    strokeOpacity={0.5}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    tickLine={false}
                    axisLine={false}
                    width={28}
                  />
                  <Tooltip
                    formatter={(value) => [value ?? 0, t('count')]}
                    contentStyle={TOOLTIP_STYLE}
                    labelStyle={TOOLTIP_LABEL_STYLE}
                    itemStyle={{ color: 'var(--popover-foreground)' }}
                    cursor={{ fill: 'var(--muted)', fillOpacity: 0.4 }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
                    {chartData.map((_, index) => (
                      <Cell
                        key={chartData[index].key}
                        fill={`url(#bar-gradient-${index % CHART_COLORS.length})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </QueryState>
  );
}
