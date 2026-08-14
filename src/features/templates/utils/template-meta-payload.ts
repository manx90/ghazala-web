import { TemplateComponentType, type TemplateComponent } from '@/types/template.types';
import { countTemplateVariablesInText } from '@/features/templates/utils/template-variables';

const AR_SAMPLES = ['أحمد', '12345', 'Rabbit', 'خدمة العملاء'];
const EN_SAMPLES = ['John', '12345', 'Rabbit', 'Support'];

function sampleForIndex(index: number, language?: string): string {
  const samples = language?.toLowerCase().startsWith('en') ? EN_SAMPLES : AR_SAMPLES;
  return samples[index - 1] ?? `Sample ${index}`;
}

export function textStartsWithVariable(text: string): boolean {
  return /^\{\{\d+\}\}/.test(text.trim());
}

export function textEndsWithVariable(text: string): boolean {
  const normalized = text.trim().replace(/[،,.!?…\s]+$/u, '');
  return /\{\{\d+\}\}$/.test(normalized);
}

function buildHeaderExample(text: string, language?: string): Record<string, unknown> | undefined {
  const count = countTemplateVariablesInText(text);
  if (count === 0) {
    return undefined;
  }

  return {
    header_text: Array.from({ length: count }, (_, index) => sampleForIndex(index + 1, language)),
  };
}

function buildBodyExample(text: string, language?: string): Record<string, unknown> | undefined {
  const count = countTemplateVariablesInText(text);
  if (count === 0) {
    return undefined;
  }

  return {
    body_text: [Array.from({ length: count }, (_, index) => sampleForIndex(index + 1, language))],
  };
}

export function enrichTemplateComponents(
  components: TemplateComponent[],
  language?: string,
): TemplateComponent[] {
  return components.map((component) => {
    const type = String(component.type).toUpperCase();
    const text = component.text ?? '';

    if (component.example) {
      return component;
    }

    if (type === TemplateComponentType.HEADER && text) {
      const example = buildHeaderExample(text, language);
      return example ? { ...component, example } : component;
    }

    if (type === TemplateComponentType.BODY && text) {
      const example = buildBodyExample(text, language);
      return example ? { ...component, example } : component;
    }

    return component;
  });
}
