import { TemplateCategory, TemplateComponentType, type Template } from '@/types/template.types';
import type { SendTemplateMessagePayload } from '@/types/message.types';

export interface TemplateVariableField {
  key: string;
  label: string;
  componentType: 'header' | 'body' | 'button';
  paramNumber: number;
  buttonIndex?: number;
}

const VARIABLE_PATTERN = /\{\{(\d+)\}\}/g;

export function countTemplateVariablesInText(text: string): number {
  const matches = [...text.matchAll(VARIABLE_PATTERN)];
  if (!matches.length) return 0;
  return Math.max(...matches.map((match) => Number(match[1])));
}

function resolveFieldLabel(
  template: Template,
  componentType: 'header' | 'body' | 'button',
  paramNumber: number,
  totalInComponent: number,
): string {
  if (
    template.category === TemplateCategory.AUTHENTICATION &&
    componentType === 'body' &&
    totalInComponent === 1 &&
    paramNumber === 1
  ) {
    return 'رمز التحقق';
  }

  if (componentType === 'header') {
    return totalInComponent === 1 ? 'متغير الرأس' : `متغير الرأس {{${paramNumber}}}`;
  }

  if (componentType === 'button') {
    return totalInComponent === 1 ? 'قيمة رابط الزر' : `رابط الزر {{${paramNumber}}}`;
  }

  return totalInComponent === 1 ? 'قيمة المتغير' : `المتغير {{${paramNumber}}}`;
}

export function getTemplateVariableFields(template: Template): TemplateVariableField[] {
  const fields: TemplateVariableField[] = [];

  for (const component of template.components) {
    const type = String(component.type).toUpperCase();

    if (
      type === TemplateComponentType.HEADER &&
      component.text &&
      (!component.format || String(component.format).toUpperCase() === 'TEXT')
    ) {
      const count = countTemplateVariablesInText(component.text);
      for (let paramNumber = 1; paramNumber <= count; paramNumber += 1) {
        fields.push({
          key: `header-${paramNumber}`,
          label: resolveFieldLabel(template, 'header', paramNumber, count),
          componentType: 'header',
          paramNumber,
        });
      }
    }

    if (type === TemplateComponentType.BODY && component.text) {
      const count = countTemplateVariablesInText(component.text);
      for (let paramNumber = 1; paramNumber <= count; paramNumber += 1) {
        fields.push({
          key: `body-${paramNumber}`,
          label: resolveFieldLabel(template, 'body', paramNumber, count),
          componentType: 'body',
          paramNumber,
        });
      }
    }

    if (type === TemplateComponentType.BUTTONS && component.buttons?.length) {
      component.buttons.forEach((button, buttonIndex) => {
        if (!button.url) return;
        const count = countTemplateVariablesInText(button.url);
        for (let paramNumber = 1; paramNumber <= count; paramNumber += 1) {
          fields.push({
            key: `button-${buttonIndex}-${paramNumber}`,
            label: resolveFieldLabel(template, 'button', paramNumber, count),
            componentType: 'button',
            paramNumber,
            buttonIndex,
          });
        }
      });
    }
  }

  return fields;
}

export function templateHasVariables(template: Template): boolean {
  return getTemplateVariableFields(template).length > 0;
}

export function areTemplateVariablesFilled(
  template: Template,
  values: Record<string, string>,
): boolean {
  return getTemplateVariableFields(template).every((field) => values[field.key]?.trim());
}

export function buildTemplateSendComponents(
  template: Template,
  values: Record<string, string>,
): SendTemplateMessagePayload['components'] | undefined {
  const components: NonNullable<SendTemplateMessagePayload['components']> = [];

  for (const component of template.components) {
    const type = String(component.type).toUpperCase();

    if (
      type === TemplateComponentType.HEADER &&
      component.text &&
      (!component.format || String(component.format).toUpperCase() === 'TEXT')
    ) {
      const count = countTemplateVariablesInText(component.text);
      if (count > 0) {
        components.push({
          type: 'header',
          parameters: Array.from({ length: count }, (_, index) => ({
            type: 'text',
            text: values[`header-${index + 1}`]?.trim() ?? '',
          })),
        });
      }
    }

    if (type === TemplateComponentType.BODY && component.text) {
      const count = countTemplateVariablesInText(component.text);
      if (count > 0) {
        components.push({
          type: 'body',
          parameters: Array.from({ length: count }, (_, index) => ({
            type: 'text',
            text: values[`body-${index + 1}`]?.trim() ?? '',
          })),
        });
      }
    }

    if (type === TemplateComponentType.BUTTONS && component.buttons?.length) {
      component.buttons.forEach((button, buttonIndex) => {
        if (!button.url) return;
        const count = countTemplateVariablesInText(button.url);
        if (count === 0) return;

        components.push({
          type: 'button',
          sub_type: 'url',
          index: String(buttonIndex),
          parameters: Array.from({ length: count }, (_, index) => ({
            type: 'text',
            text: values[`button-${buttonIndex}-${index + 1}`]?.trim() ?? '',
          })),
        });
      });
    }
  }

  return components.length ? components : undefined;
}
