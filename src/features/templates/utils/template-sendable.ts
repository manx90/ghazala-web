import { TemplateStatus, type Template } from '@/types/template.types';

export function isTemplateSendable(template: Template): boolean {
  return Boolean(template.metaTemplateId) && template.status === TemplateStatus.APPROVED;
}

export function filterSendableTemplates(templates: Template[]): Template[] {
  return templates.filter(isTemplateSendable);
}

export const TEMPLATE_STATUS_HINTS: Partial<Record<TemplateStatus, string>> = {
  [TemplateStatus.PENDING]: 'قيد مراجعة Meta — زامن لاحقاً بعد الاعتماد',
  [TemplateStatus.REJECTED]: 'مرفوض — عدّل القالب أو اختر قالباً آخر',
  [TemplateStatus.DRAFT]: 'مسودة — أرسله للمراجعة أولاً',
};
