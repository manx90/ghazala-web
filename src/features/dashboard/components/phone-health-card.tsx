'use client';

import type { UseQueryResult } from '@tanstack/react-query';
import { PhoneIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import type { PhoneNumberListResponse } from '@/types/whatsapp.types';

interface PhoneHealthCardProps {
  phones: UseQueryResult<PhoneNumberListResponse>;
}

export function PhoneHealthCard({ phones }: PhoneHealthCardProps) {
  const items = phones.data?.items ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PhoneIcon className="size-4 text-muted-foreground" />
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
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{phone.displayPhoneNumber}</span>
                  {phone.verifiedName && (
                    <span className="text-xs text-muted-foreground">{phone.verifiedName}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={phone.status} />
                  <StatusBadge status={phone.qualityRating} />
                </div>
              </li>
            ))}
          </ul>
        </QueryState>
      </CardContent>
    </Card>
  );
}
