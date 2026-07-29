import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: { value: number; label?: string };
  loading?: boolean;
  className?: string;
}

export function MetricCard({ title, value, description, icon: Icon, trend, loading, className }: MetricCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="size-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-2 h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="size-4 text-muted-foreground" aria-hidden="true" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <p className={cn('mt-1 text-xs', trend.value >= 0 ? 'text-emerald-600' : 'text-destructive')}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label ?? ''}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface StatisticCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  loading?: boolean;
  className?: string;
}

export function StatisticCard({ title, value, description, icon: Icon, loading, className }: StatisticCardProps) {
  return <MetricCard title={title} value={value} description={description} icon={Icon} loading={loading} className={className} />;
}

interface StatusCardProps {
  title: string;
  status: string;
  statusLabel?: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatusCard({ title, status, statusLabel, description, icon: Icon, className }: StatusCardProps) {
  const isOk = status === 'ok' || status === 'ACTIVE' || status === 'active';
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="size-4 text-muted-foreground" aria-hidden="true" />}
      </CardHeader>
      <CardContent>
        <div className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-medium', isOk ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive')}>
          <span className={cn('size-1.5 rounded-full', isOk ? 'bg-emerald-500' : 'bg-destructive')} />
          {statusLabel ?? status}
        </div>
        {description && <p className="mt-2 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

interface ActivityCardProps {
  title: string;
  items: { id: string; icon?: ReactNode; primary: string; secondary?: string; meta?: string }[];
  emptyMessage?: string;
  className?: string;
}

export function ActivityCard({ title, items, emptyMessage = 'لا يوجد نشاط', className }: ActivityCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                {item.icon && <span className="mt-0.5 text-muted-foreground">{item.icon}</span>}
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium">{item.primary}</span>
                  {item.secondary && <span className="text-xs text-muted-foreground">{item.secondary}</span>}
                </div>
                {item.meta && <span className="text-xs text-muted-foreground">{item.meta}</span>}
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

interface InformationCardProps {
  title: string;
  description?: string;
  rows: { label: string; value: ReactNode }[];
  className?: string;
}

export function InformationCard({ title, description, rows, className }: InformationCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium">{row.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function StatsGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>{children}</div>;
}
