'use client';

import { useTranslations } from 'next-intl';
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
  const t = useTranslations('common.pagination');
  const meta = buildPaginationMeta(page, limit, total);

  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <p className="text-sm text-muted-foreground">
        {t('range', { from, to, total })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
          aria-label={t('previousAria')}
        >
          <ChevronRightIcon data-icon="inline-start" />
          {t('previous')}
        </Button>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          {t('pageOf', { page, totalPages: meta.totalPages })}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(page + 1)}
          aria-label={t('nextAria')}
        >
          {t('next')}
          <ChevronLeftIcon data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
