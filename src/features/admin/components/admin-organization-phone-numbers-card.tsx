'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { useAdminOrganizationPhoneNumbers } from '@/features/admin/hooks/use-admin-organizations';
import type { AdminOrganizationPhoneNumber } from '@/types/admin.types';
import { formatDateTime } from '@/utils/date';
import { useMemo } from 'react';

interface AdminOrganizationPhoneNumbersCardProps {
  organizationId: string;
}

export function AdminOrganizationPhoneNumbersCard({
  organizationId,
}: AdminOrganizationPhoneNumbersCardProps) {
  const { data, isLoading, isError, error, refetch } = useAdminOrganizationPhoneNumbers(organizationId);

  const columns = useMemo<ColumnDef<AdminOrganizationPhoneNumber, unknown>[]>(
    () => [
      {
        id: 'number',
        header: 'الرقم',
        cell: ({ row }) => (
          <span dir="ltr" className="font-mono text-sm">
            {row.original.displayPhoneNumber ?? '—'}
          </span>
        ),
      },
      {
        id: 'verifiedName',
        header: 'الاسم المعتمد',
        cell: ({ row }) => row.original.verifiedName ?? '—',
      },
      {
        id: 'status',
        header: 'الحالة',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'createdAt',
        header: 'تاريخ الإضافة',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>
        ),
      },
    ],
    [],
  );

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-base">أرقام WhatsApp ({data?.total ?? 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          data={data?.items ?? []}
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          rowCount={data?.total ?? 0}
          pagination={{ page: 1, limit: data?.total || 100 }}
          onPageChange={() => undefined}
          getRowId={(row) => row.id}
          emptyTitle="لا توجد أرقام"
        />
      </CardContent>
    </Card>
  );
}
