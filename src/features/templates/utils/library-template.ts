import { TemplateCategory } from '@/types/template.types';

export function resolveLibraryCategory(value?: string): TemplateCategory {
  const normalized = value?.toUpperCase();

  if (normalized === TemplateCategory.MARKETING) {
    return TemplateCategory.MARKETING;
  }

  if (normalized === TemplateCategory.AUTHENTICATION) {
    return TemplateCategory.AUTHENTICATION;
  }

  return TemplateCategory.UTILITY;
}

export function buildLibraryBodyInputs(bodyParams?: string[]): Record<string, unknown>[] | undefined {
  if (!bodyParams?.length) {
    return undefined;
  }

  return bodyParams.map((_, index) => ({
    type: 'text',
    text: `example_${index + 1}`,
  }));
}
