'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { TemplateCategory, TemplateComponentType } from '@/types/template.types';
import type { Template } from '@/types/template.types';

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  [TemplateCategory.MARKETING]: 'تسويق',
  [TemplateCategory.UTILITY]: 'خدمي',
  [TemplateCategory.AUTHENTICATION]: 'مصادقة',
};

interface TemplatePreviewProps {
  template: Template;
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const header = template.components.find((c) => c.type === TemplateComponentType.HEADER);
  const body = template.components.find((c) => c.type === TemplateComponentType.BODY);
  const footer = template.components.find((c) => c.type === TemplateComponentType.FOOTER);
  const buttons = template.components.find((c) => c.type === TemplateComponentType.BUTTONS);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>معاينة WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mx-auto max-w-sm rounded-xl border bg-[#e5ddd5] p-4 dark:bg-muted/30">
            <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-card">
              {header?.text && (
                <p className="mb-2 text-sm font-semibold">{header.text}</p>
              )}
              {body?.text && <p className="whitespace-pre-wrap text-sm">{body.text}</p>}
              {footer?.text && (
                <p className="mt-2 text-xs text-muted-foreground">{footer.text}</p>
              )}
              {buttons?.buttons?.length ? (
                <div className="mt-3 flex flex-col gap-1 border-t pt-2">
                  {buttons.buttons.map((btn, index) => (
                    <span
                      key={`${btn.text}-${index}`}
                      className="text-center text-sm text-primary"
                    >
                      {btn.text}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل القالب</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">الاسم</span>
            <span dir="ltr" className="font-medium">
              {template.name}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">التصنيف</span>
            <span>{CATEGORY_LABELS[template.category] ?? template.category}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">اللغة</span>
            <span>{template.language}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">الحالة</span>
            <StatusBadge status={template.status} />
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">جودة القالب</span>
            <StatusBadge status={template.qualityScore} />
          </div>
          {template.rejectionReason && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-xs font-medium text-destructive">سبب الرفض</p>
              <p className="mt-1 text-sm">{template.rejectionReason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
