'use client';

import { useTranslations } from 'next-intl';
import { EditIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/config/routes';
import type { Plan } from '@/types/billing.types';
import { formatDateTime } from '@/utils/date';

interface PlanTableProps {
  plans: Plan[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onDisable?: (plan: Plan) => void;
}

export function PlanTable({ plans, selectedIds = [], onSelectionChange, onDisable }: PlanTableProps) {
  const t = useTranslations('admin.plans');
  const tCommon = useTranslations('admin.common');

  const toggleSelection = (id: string, checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? [...selectedIds, id] : selectedIds.filter((x) => x !== id));
  };

  const toggleAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? plans.map((p) => p.id) : []);
  };

  const allSelected = plans.length > 0 && selectedIds.length === plans.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {onSelectionChange && (
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => toggleAll(checked === true)}
                aria-label={tCommon('selectAll')}
              />
            </TableHead>
          )}
          <TableHead>{t('columns.name')}</TableHead>
          <TableHead>{t('columns.code')}</TableHead>
          <TableHead>{t('columns.monthly')}</TableHead>
          <TableHead>{t('columns.yearly')}</TableHead>
          <TableHead>{t('columns.status')}</TableHead>
          <TableHead>{t('columns.createdAt')}</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={plan.id}>
            {onSelectionChange && (
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(plan.id)}
                  onCheckedChange={(checked) => toggleSelection(plan.id, checked === true)}
                  aria-label={tCommon('selectRow', { name: plan.name })}
                />
              </TableCell>
            )}
            <TableCell>
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-brand-soft text-xs font-bold text-primary ring-1 ring-primary/10">
                  {plan.name.trim().charAt(0) || tCommon('notAvailable')}
                </span>
                <span className="font-medium">{plan.name}</span>
              </div>
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground" dir="ltr">{plan.code}</TableCell>
            <TableCell>
              <span className="font-medium tabular-nums">{plan.monthlyPrice}</span>{' '}
              <span className="text-xs text-muted-foreground">{plan.currency}</span>
            </TableCell>
            <TableCell>
              <span className="font-medium tabular-nums">{plan.yearlyPrice}</span>{' '}
              <span className="text-xs text-muted-foreground">{plan.currency}</span>
            </TableCell>
            <TableCell>
              <StatusBadge status={plan.isActive ? 'ACTIVE' : 'DISABLED'} />
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">{formatDateTime(plan.createdAt)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="sm" aria-label={tCommon('actions')}>
                      <MoreHorizontalIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem render={<Link href={ROUTES.admin.plan(plan.id)} />}>
                    <EditIcon data-icon="inline-start" />
                    {tCommon('edit')}
                  </DropdownMenuItem>
                  {plan.isActive && onDisable && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => onDisable(plan)}>
                        <Trash2Icon />
                        {tCommon('disable')}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
