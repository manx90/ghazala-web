'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { useAdminOrganizationPhoneNumbers } from '@/features/admin/hooks/use-admin-organizations';
import type { AdminOrganizationPhoneNumber } from '@/types/admin.types';
import { formatDateTime } from '@/utils/date';

interface AdminOrganizationPhoneNumbersCardProps {
  organizationId: string;
}

export function AdminOrganizationPhoneNumbersCard({
  organizationId,
}: AdminOrganizationPhoneNumbersCardProps) {
  const t = useTranslations('admin.organizations.phones');
  const tCommon = useTranslations('admin.common');
  const { data, isLoading, isError, error, refetch } = useAdminOrganizationPhoneNumbers(organizationId);

  const columns = useMemo<ColumnDef<AdminOrganizationPhoneNumber, unknown>[]>(
    () => [
      {
        id: 'number',
        header: t('columns.phone'),
        cell: ({ row }) => (
          <span dir="ltr" className="font-mono text-sm">
            {row.original.displayPhoneNumber ?? tCommon('notAvailable')}
          </span>
        ),
      },
      {
        id: 'verifiedName',
        header: t('columns.verifiedName'),
        cell: ({ row }) => row.original.verifiedName ?? tCommon('notAvailable'),
      },
      {
        id: 'status',
        header: t('columns.status'),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'createdAt',
        header: t('columns.addedAt'),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>
        ),
      },
    ],
    [t, tCommon],
  );

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-base">
          {t('columns.phone')} ({data?.total ?? 0})
        </CardTitle>
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
          emptyTitle={t('empty')}
        />
      </CardContent>
    </Card>
  );
}
