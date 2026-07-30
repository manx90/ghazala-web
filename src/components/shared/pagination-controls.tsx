'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildPaginationMeta } from '@/types/pagination.types';

interface PaginationControlsProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ page, limit, total, onPageChange }: PaginationControlsProps) {
  const meta = buildPaginationMeta(page, limit, total);

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <p className="text-sm text-muted-foreground">
        عرض {(page - 1) * limit + 1}–{Math.min(page * limit, total)} من {total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
          aria-label="الصفحة السابقة"
        >
          <ChevronRightIcon data-icon="inline-start" />
          السابق
        </Button>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          {page} / {meta.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(page + 1)}
          aria-label="الصفحة التالية"
        >
          التالي
          <ChevronLeftIcon data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
