'use client';

import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getLanguageLabel } from '@/features/templates/constants/template-filters';
import type { TemplateLibraryItem } from '@/types/template.types';

const USECASE_LABELS: Record<string, string> = {
  ORDER_CONFIRMATION: 'تأكيد الطلب',
  SHIPMENT_CONFIRMATION: 'تأكيد الشحن',
  DELIVERY_UPDATE: 'تحديث التسليم',
  DELIVERY_CONFIRMATION: 'تأكيد التسليم',
  PAYMENT_CONFIRMATION: 'تأكيد الدفع',
  PAYMENT_DUE_REMINDER: 'تذكير الدفع',
  RETURN_CONFIRMATION: 'تأكيد الإرجاع',
  FEEDBACK_SURVEY: 'استبيان',
};

interface TemplateLibraryTableProps {
  items: TemplateLibraryItem[];
  onAdd: (item: TemplateLibraryItem) => void;
  isAdding?: boolean;
}

export function TemplateLibraryTable({ items, onAdd, isAdding }: TemplateLibraryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>الاسم</TableHead>
            <TableHead>اللغة</TableHead>
            <TableHead>الاستخدام</TableHead>
            <TableHead>المحتوى</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={`${item.id}-${item.language}`}>
              <TableCell>
                <span dir="ltr" className="font-mono text-xs font-medium">
                  {item.name}
                </span>
              </TableCell>
              <TableCell>
                <span dir="ltr" className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {getLanguageLabel(item.language)}
                </span>
              </TableCell>
              <TableCell className="text-sm">
                {item.usecase ? (USECASE_LABELS[item.usecase] ?? item.usecase) : '—'}
              </TableCell>
              <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                {item.header ? `${item.header} — ` : ''}
                {item.body}
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isAdding}
                  onClick={() => onAdd(item)}
                >
                  <PlusIcon data-icon="inline-start" />
                  إضافة
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
