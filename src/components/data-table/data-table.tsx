'use client';

import { type ReactNode, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react';
import { TableSkeleton } from '@/components/feedback/skeletons';
import { EmptyState } from '@/components/global/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  errorView?: ReactNode;
  onRetry?: () => void;

  rowCount: number;
  pagination: { page: number; limit: number };
  onPageChange: (page: number) => void;

  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;

  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  getRowId?: (row: TData) => string;
  isRowSelectable?: (row: TData) => boolean;

  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;

  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;

  toolbar?: ReactNode;
  bulkActions?: (selectedIds: string[]) => ReactNode;
  className?: string;
}

export function DataTable<TData>({
  data,
  columns,
  isLoading = false,
  isError = false,
  errorView,
  onRetry,
  rowCount,
  pagination,
  onPageChange,
  sorting,
  onSortingChange,
  rowSelection = {},
  onRowSelectionChange,
  getRowId,
  isRowSelectable,
  columnVisibility,
  onColumnVisibilityChange,
  emptyTitle = 'لا توجد بيانات',
  emptyDescription,
  emptyAction,
  toolbar,
  bulkActions,
  className,
}: DataTableProps<TData>) {
  const selectableColumns = useMemo(() => {
    if (!onRowSelectionChange) return columns;
    const selectCol: ColumnDef<TData, unknown> = {
      id: '__select',
      size: 40,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onCheckedChange={(checked) => table.toggleAllRowsSelected(checked === true)}
          aria-label="تحديد الكل"
        />
      ),
      cell: ({ row }) => {
        const selectable = isRowSelectable ? isRowSelectable(row.original) : true;
        return (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!selectable}
            onCheckedChange={(checked) => row.toggleSelected(checked === true)}
            aria-label="تحديد الصف"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    };
    return [selectCol, ...columns];
  }, [columns, onRowSelectionChange, isRowSelectable]);

  const table = useReactTable({
    data,
    columns: selectableColumns,
    state: {
      sorting: sorting ?? [],
      rowSelection,
      columnVisibility: columnVisibility ?? {},
    },
    onSortingChange: onSortingChange
      ? (updater) => onSortingChange(updater instanceof Function ? updater(sorting ?? []) : updater)
      : undefined,
    onRowSelectionChange: onRowSelectionChange
      ? (updater) =>
          onRowSelectionChange(
            updater instanceof Function ? updater(rowSelection) : updater,
          )
      : undefined,
    onColumnVisibilityChange: onColumnVisibilityChange
      ? (updater) =>
          onColumnVisibilityChange(
            updater instanceof Function
              ? updater(columnVisibility ?? {})
              : updater,
          )
      : undefined,
    getRowId,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.max(1, Math.ceil(rowCount / pagination.limit)),
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedIds = Object.keys(rowSelection);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {toolbar}

      {bulkActions && selectedIds.length > 0 && (
        <div className="animate-fade-in-down flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-gradient-brand-soft px-3 py-2 shadow-2xs">
          <span className="text-sm font-medium">
            {selectedIds.length} محدد
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {bulkActions(selectedIds)}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        {isLoading ? (
          <TableSkeleton rows={Math.min(pagination.limit, 8)} columns={columns.length + (onRowSelectionChange ? 1 : 0)} />
        ) : isError ? (
          errorView ?? (
            <div className="p-6">
              <EmptyState
                title="تعذر تحميل البيانات"
                description="حدث خطأ أثناء جلب البيانات"
                action={
                  onRetry ? (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      إعادة المحاولة
                    </button>
                  ) : undefined
                }
              />
            </div>
          )
        ) : data.length === 0 ? (
          <div className="p-6">
            <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted();
                    return (
                      <TableHead key={header.id} style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}>
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                            {sortDir === 'asc' ? (
                              <ArrowUpIcon className="size-3.5" />
                            ) : sortDir === 'desc' ? (
                              <ArrowDownIcon className="size-3.5" />
                            ) : (
                              <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
                            )}
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {!isLoading && !isError && data.length > 0 && (
        <PaginationControls
          page={pagination.page}
          limit={pagination.limit}
          total={rowCount}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
