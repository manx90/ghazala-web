'use client';

import { EditIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
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
                aria-label="تحديد الكل"
              />
            </TableHead>
          )}
          <TableHead>الاسم</TableHead>
          <TableHead>الرمز</TableHead>
          <TableHead>شهري</TableHead>
          <TableHead>سنوي</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>تاريخ الإنشاء</TableHead>
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
                  aria-label={`تحديد ${plan.name}`}
                />
              </TableCell>
            )}
            <TableCell className="font-medium">{plan.name}</TableCell>
            <TableCell className="font-mono text-xs">{plan.code}</TableCell>
            <TableCell>
              {plan.monthlyPrice} {plan.currency}
            </TableCell>
            <TableCell>
              {plan.yearlyPrice} {plan.currency}
            </TableCell>
            <TableCell>
              <StatusBadge status={plan.isActive ? 'ACTIVE' : 'DISABLED'} />
            </TableCell>
            <TableCell className="text-muted-foreground">{formatDateTime(plan.createdAt)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="sm" aria-label="إجراءات">
                      <MoreHorizontalIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem render={<Link href={ROUTES.admin.plan(plan.id)} />}>
                    <EditIcon data-icon="inline-start" />
                    تعديل
                  </DropdownMenuItem>
                  {plan.isActive && onDisable && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => onDisable(plan)}>
                        <Trash2Icon />
                        تعطيل
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
