'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import { PhoneIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import type { PhoneNumberListResponse } from '@/types/whatsapp.types';
import { cn } from '@/lib/utils';

// لون مؤشر جودة المراسلة
const QUALITY_DOT: Record<string, string> = {
  GREEN: 'bg-emerald-500',
  YELLOW: 'bg-amber-500',
  RED: 'bg-red-500',
};

interface PhoneHealthCardProps {
  phones: UseQueryResult<PhoneNumberListResponse>;
}

export function PhoneHealthCard({ phones }: PhoneHealthCardProps) {
  const items = phones.data?.items ?? [];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
            <PhoneIcon className="size-4" aria-hidden="true" />
          </span>
          صحة أرقام واتساب
        </CardTitle>
        <CardDescription>حالة الأرقام وجودة المراسلة</CardDescription>
      </CardHeader>
      <CardContent>
        <QueryState
          isLoading={phones.isLoading}
          isError={phones.isError}
          error={phones.error}
          isEmpty={items.length === 0}
          emptyTitle="لا توجد أرقام"
          emptyDescription="اربط رقم واتساب من الإعدادات."
          onRetry={() => void phones.refetch()}
        >
          <ul className="flex flex-col gap-3">
            {items.map((phone) => (
              <li
                key={phone.id}
                className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 transition-colors duration-200 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
                    <PhoneIcon className="size-3.5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium" dir="ltr">{phone.displayPhoneNumber}</span>
                    {phone.verifiedName && (
                      <span className="text-xs text-muted-foreground">{phone.verifiedName}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={phone.status} />
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn('size-1.5 rounded-full', QUALITY_DOT[phone.qualityRating] ?? 'bg-muted-foreground')}
                    />
                    <StatusBadge status={phone.qualityRating} />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </QueryState>
      </CardContent>
    </Card>
  );
}
