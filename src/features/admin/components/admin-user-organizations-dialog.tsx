'use client';

import Link from 'next/link';
import { ModalWrapper } from '@/components/global/modal-wrapper';
import { QueryState } from '@/components/shared/query-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/config/routes';
import { useAdminUserOrganizations } from '@/features/admin/hooks/use-admin-users';
import { formatDateTime } from '@/utils/date';

interface AdminUserOrganizationsDialogProps {
  userId: string | null;
  userName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminUserOrganizationsDialog({
  userId,
  userName,
  open,
  onOpenChange,
}: AdminUserOrganizationsDialogProps) {
  const { data, isLoading, isError, error, refetch } = useAdminUserOrganizations(
    userId ?? '',
    open && !!userId,
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="منظمات المستخدم"
      description={userName}
    >
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!data?.items.length && !isLoading}
        emptyTitle="لا ينتمي لأي منظمة"
        onRetry={() => refetch()}
      >
        {data?.items.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المنظمة</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>تاريخ الانضمام</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.organization.id}>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{item.organization.name}</span>
                      <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                        {item.organization.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.role} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTime(item.joinedAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      render={<Link href={ROUTES.admin.organization(item.organization.id)} />}
                    >
                      عرض
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </QueryState>
    </ModalWrapper>
  );
}
