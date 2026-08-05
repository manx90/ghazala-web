'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { useAdminOrganizationMembers } from '@/features/admin/hooks/use-admin-organizations';
import type { OrganizationMember } from '@/types/member.types';
import { formatDateTime } from '@/utils/date';
import { useMemo } from 'react';

interface AdminOrganizationMembersCardProps {
  organizationId: string;
}

export function AdminOrganizationMembersCard({ organizationId }: AdminOrganizationMembersCardProps) {
  const { data, isLoading, isError, error, refetch } = useAdminOrganizationMembers(organizationId);

  const columns = useMemo<ColumnDef<OrganizationMember, unknown>[]>(
    () => [
      {
        id: 'name',
        header: 'الاسم',
        cell: ({ row }) =>
          [row.original.user.firstName, row.original.user.lastName].filter(Boolean).join(' ') ||
          row.original.user.email,
      },
      {
        id: 'email',
        header: 'البريد',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground" dir="ltr">
            {row.original.user.email}
          </span>
        ),
      },
      {
        id: 'role',
        header: 'الدور',
        cell: ({ row }) => <StatusBadge status={row.original.role} />,
      },
      {
        id: 'joinedAt',
        header: 'تاريخ الانضمام',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">{formatDateTime(row.original.joinedAt)}</span>
        ),
      },
    ],
    [],
  );

  return (
    <Card className="animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-base">الأعضاء ({data?.total ?? 0})</CardTitle>
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
          emptyTitle="لا يوجد أعضاء"
        />
      </CardContent>
    </Card>
  );
}
