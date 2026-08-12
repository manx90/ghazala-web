'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { useAdminOrganizationMembers } from '@/features/admin/hooks/use-admin-organizations';
import type { OrganizationMember } from '@/types/member.types';
import { formatDateTime } from '@/utils/date';

interface AdminOrganizationMembersCardProps {
  organizationId: string;
}

export function AdminOrganizationMembersCard({ organizationId }: AdminOrganizationMembersCardProps) {
  const t = useTranslations('admin.organizations.members');
  const { data, isLoading, isError, error, refetch } = useAdminOrganizationMembers(organizationId);

  const columns = useMemo<ColumnDef<OrganizationMember, unknown>[]>(
    () => [
      {
        id: 'name',
        header: t('columns.name'),
        cell: ({ row }) =>
          [row.original.user.firstName, row.original.user.lastName].filter(Boolean).join(' ') ||
          row.original.user.email,
      },
      {
        id: 'email',
        header: t('columns.email'),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground" dir="ltr">
            {row.original.user.email}
          </span>
        ),
      },
      {
        id: 'role',
        header: t('columns.role'),
        cell: ({ row }) => <StatusBadge status={row.original.role} />,
      },
      {
        id: 'joinedAt',
        header: t('columns.joinedAt'),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">{formatDateTime(row.original.joinedAt)}</span>
        ),
      },
    ],
    [t],
  );

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-base">
          {t('columns.name')} ({data?.total ?? 0})
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
