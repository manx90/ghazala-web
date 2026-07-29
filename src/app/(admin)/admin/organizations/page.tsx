'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontalIcon, PauseIcon, PlayIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { DeleteDialog } from '@/components/global/delete-dialog';
import { DataTable } from '@/components/data-table';
import { BulkActionsBar, FilterBar, SearchBar } from '@/components/feedback/bars';
import { NoOrganizationsEmpty } from '@/components/feedback/empty-presets';
import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROUTES } from '@/config/routes';
import {
  useActivateOrganization,
  useAdminOrganizations,
  useDeleteOrganization,
  useSuspendOrganization,
} from '@/features/admin/hooks/use-admin-organizations';
import { OrganizationStatus } from '@/types/organization.types';
import type { Organization } from '@/types/organization.types';
import { formatDateTime } from '@/utils/date';

const PAGE_LIMIT = 20;

export default function AdminOrganizationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [suspendTarget, setSuspendTarget] = useState<Organization | null>(null);
  const [activateTarget, setActivateTarget] = useState<Organization | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);

  const { data, isLoading, isError, error, refetch } = useAdminOrganizations({ page, limit: PAGE_LIMIT });
  const activateMutation = useActivateOrganization();
  const suspendMutation = useSuspendOrganization();
  const deleteMutation = useDeleteOrganization();

  const filteredItems = useMemo(() => {
    let items = data?.items ?? [];
    const q = searchInput.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (o) => o.name.toLowerCase().includes(q) || o.slug.toLowerCase().includes(q) || o.country.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== 'all') {
      items = items.filter((o) => o.status === statusFilter);
    }
    return items;
  }, [data?.items, searchInput, statusFilter]);

  const columns = useMemo<ColumnDef<Organization, unknown>[]>(
    () => [
      {
        id: 'name',
        header: 'الاسم',
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        id: 'slug',
        header: 'المعرّف',
        cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>,
      },
      {
        id: 'country',
        header: 'البلد',
        cell: ({ row }) => row.original.country,
      },
      {
        id: 'status',
        header: 'الحالة',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'createdAt',
        header: 'تاريخ الإنشاء',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>,
      },
      {
        id: 'actions',
        header: '',
        size: 48,
        cell: ({ row }) => {
          const org = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" aria-label="إجراءات">
                    <MoreHorizontalIcon />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link href={ROUTES.admin.organization(org.id)} />}>
                  التفاصيل
                </DropdownMenuItem>
                {org.status !== OrganizationStatus.ACTIVE && (
                  <DropdownMenuItem onClick={() => setActivateTarget(org)}>
                    <PlayIcon data-icon="inline-start" />
                    تفعيل
                  </DropdownMenuItem>
                )}
                {org.status !== OrganizationStatus.SUSPENDED && (
                  <DropdownMenuItem onClick={() => setSuspendTarget(org)}>
                    <PauseIcon data-icon="inline-start" />
                    تعليق
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(org)}>
                  <Trash2Icon data-icon="inline-start" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader title="المنظمات" description="إدارة منظمات المنصة — تفعيل، تعليق، وحذف" />

        <UnavailableFeatureAlert
          title="عمليات غير مدعومة"
          description="البحث والتصفية يعملان على الصفحة الحالية فقط. العمليات التالية تتطلب backend."
          requiredEndpoints={[
            'GET /admin/organizations?search=&status=',
            'POST /admin/organizations',
            'PATCH /admin/organizations/:id',
            'GET /admin/organizations/:id/usage',
            'GET /admin/organizations/:id/subscription',
            'GET /admin/organizations/:id/members',
            'GET /admin/organizations/:id/phone-numbers',
            'POST /admin/organizations/bulk',
          ]}
        />

        <Card>
          <CardContent className="pt-6">
            <DataTable
              data={filteredItems}
              columns={columns}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={() => refetch()}
              rowCount={data?.total ?? 0}
              pagination={{ page, limit: PAGE_LIMIT }}
              onPageChange={setPage}
              rowSelection={selectedIds}
              onRowSelectionChange={setSelectedIds}
              getRowId={(row) => row.id}
              emptyTitle="لا توجد منظمات"
              emptyAction={<NoOrganizationsEmpty />}
              toolbar={
                <FilterBar>
                  <SearchBar
                    value={searchInput}
                    onChange={setSearchInput}
                    placeholder="بحث في الصفحة الحالية..."
                    className="flex-1"
                  />
                  <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل الحالات</SelectItem>
                      <SelectItem value={OrganizationStatus.ACTIVE}>نشطة</SelectItem>
                      <SelectItem value={OrganizationStatus.SUSPENDED}>معلقة</SelectItem>
                      <SelectItem value={OrganizationStatus.INACTIVE}>غير نشطة</SelectItem>
                    </SelectContent>
                  </Select>
                </FilterBar>
              }
              bulkActions={(ids) => (
                <BulkActionsBar selectedCount={ids.length} onClear={() => setSelectedIds({})}>
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={() => {
                      void Promise.all(ids.map((id) => deleteMutation.mutateAsync(id))).then(() => {
                        setSelectedIds({});
                        router.refresh();
                      });
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2Icon data-icon="inline-start" />
                    حذف المحدد
                  </Button>
                </BulkActionsBar>
              )}
            />
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!activateTarget}
        onOpenChange={(open) => !open && setActivateTarget(null)}
        title="تفعيل المنظمة"
        description={`هل تريد تفعيل "${activateTarget?.name}"؟`}
        confirmLabel="تفعيل"
        onConfirm={() => {
          if (!activateTarget) return;
          activateMutation.mutate(activateTarget.id, { onSuccess: () => setActivateTarget(null) });
        }}
        isLoading={activateMutation.isPending}
      />

      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
        title="تعليق المنظمة"
        description={`هل تريد تعليق "${suspendTarget?.name}"؟`}
        confirmLabel="تعليق"
        variant="destructive"
        onConfirm={() => {
          if (!suspendTarget) return;
          suspendMutation.mutate(suspendTarget.id, { onSuccess: () => setSuspendTarget(null) });
        }}
        isLoading={suspendMutation.isPending}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="حذف المنظمة"
        description={`سيتم حذف "${deleteTarget?.name}" (soft delete).`}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
              setDeleteTarget(null);
              router.refresh();
            },
          });
        }}
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
