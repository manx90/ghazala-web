import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminDetailHeroProps {
  title: string;
  subtitle?: string;
  initials: string;
  badges?: ReactNode;
  actions?: ReactNode;
}

export function AdminDetailHero({ title, subtitle, initials, badges, actions }: AdminDetailHeroProps) {
  return (
    <Card className="animate-fade-in-up">
      <CardContent className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 rounded-2xl shadow-md after:rounded-2xl">
            <AvatarFallback className="rounded-2xl text-xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-bold tracking-tight">{title}</h2>
              {badges}
            </div>
            {subtitle && (
              <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </CardContent>
    </Card>
  );
}

export interface AdminInfoItem {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
}

interface AdminInfoGridProps {
  title: string;
  items: AdminInfoItem[];
}

export function AdminInfoGrid({ title, items }: AdminInfoGridProps) {
  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="truncate text-sm font-medium">{value}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
