import { TemplateComponentType, TemplateHeaderFormat, type Template, type TemplateComponent } from '@/types/template.types';

export interface TemplateMessagePreview {
  header?: string;
  headerFormat?: string;
  body?: string;
  footer?: string;
  buttons?: string[];
}

export function extractTemplatePreview(components: TemplateComponent[]): TemplateMessagePreview {
  const preview: TemplateMessagePreview = {};

  for (const component of components) {
    const type = String(component.type).toUpperCase();

    if (type === TemplateComponentType.HEADER) {
      const format = String(component.format ?? '').toUpperCase();
      if (format === TemplateHeaderFormat.IMAGE) {
        preview.headerFormat = TemplateHeaderFormat.IMAGE;
      } else if (component.text) {
        preview.header = component.text;
      }
    }

    if (type === TemplateComponentType.BODY && component.text) {
      preview.body = component.text;
    }

    if (type === TemplateComponentType.FOOTER && component.text) {
      preview.footer = component.text;
    }

    if (type === TemplateComponentType.BUTTONS && component.buttons?.length) {
      preview.buttons = component.buttons.map((button) => button.text).filter(Boolean);
    }
  }

  return preview;
}

export function getTemplateBodyPreview(template: Template): string {
  return extractTemplatePreview(template.components).body ?? '—';
}

export function buildTemplateSendMeta(template: Template) {
  return {
    templateName: template.name,
    templateLanguage: template.language,
    templatePreview: extractTemplatePreview(template.components),
  };
}

export function readTemplatePreviewFromPayload(
  payload: Record<string, unknown>,
): TemplateMessagePreview | undefined {
  const raw = payload.templatePreview;
  if (!raw || typeof raw !== 'object') return undefined;

  const preview = raw as Record<string, unknown>;

  return {
    header: typeof preview.header === 'string' ? preview.header : undefined,
    body: typeof preview.body === 'string' ? preview.body : undefined,
    footer: typeof preview.footer === 'string' ? preview.footer : undefined,
    buttons: Array.isArray(preview.buttons)
      ? preview.buttons.filter((item): item is string => typeof item === 'string')
      : undefined,
  };
}
