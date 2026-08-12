import { TemplateStatus, type Template } from '@/types/template.types';

export function isTemplateSendable(template: Template): boolean {
  return Boolean(template.metaTemplateId) && template.status === TemplateStatus.APPROVED;
}

export function filterSendableTemplates(templates: Template[]): Template[] {
  return templates.filter(isTemplateSendable);
}

export const TEMPLATE_STATUS_HINT_KEYS: Partial<Record<TemplateStatus, string>> = {
  [TemplateStatus.PENDING]: 'statusHints.PENDING',
  [TemplateStatus.REJECTED]: 'statusHints.REJECTED',
  [TemplateStatus.DRAFT]: 'statusHints.DRAFT',
};
