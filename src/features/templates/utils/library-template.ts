import {
  TemplateCategory,
  type CreateFromLibraryPayload,
  type LibraryTemplateBodyInputs,
  type LibraryTemplateButtonInput,
  type TemplateLibraryItem,
} from '@/types/template.types';

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

function buildButtonInputs(input: {
  urlBase?: string;
  phoneNumber?: string;
  hasUrlButton: boolean;
  hasPhoneButton: boolean;
}): LibraryTemplateButtonInput[] | undefined {
  const buttonInputs: LibraryTemplateButtonInput[] = [];

  if (input.hasUrlButton && input.urlBase?.trim()) {
    const baseUrl = input.urlBase.trim();
    buttonInputs.push({
      type: 'URL',
      url: {
        base_url: baseUrl,
        url_suffix_example: baseUrl.includes('{{1}}')
          ? baseUrl.replace('{{1}}', 'demo')
          : baseUrl,
      },
    });
  }

  if (input.hasPhoneButton && input.phoneNumber?.trim()) {
    buttonInputs.push({
      type: 'PHONE_NUMBER',
      phone_number: input.phoneNumber.trim(),
    });
  }

  return buttonInputs.length ? buttonInputs : undefined;
}

/** Meta library body inputs — object flags only, never variable text arrays. */
export function buildLibraryBodyInputs(
  category?: TemplateCategory,
): LibraryTemplateBodyInputs | undefined {
  if (category === TemplateCategory.AUTHENTICATION) {
    return { code_expiration_minutes: 5 };
  }

  return undefined;
}

export function buildCreateFromLibraryPayload(input: {
  name: string;
  item: TemplateLibraryItem;
  urlBase?: string;
  phoneNumber?: string;
}): CreateFromLibraryPayload {
  const category = resolveLibraryCategory(input.item.category);
  const hasUrlButton = input.item.buttons?.some((button) => button.type === 'URL') ?? false;
  const hasPhoneButton =
    input.item.buttons?.some((button) => button.type === 'PHONE_NUMBER') ?? false;

  const payload: CreateFromLibraryPayload = {
    name: input.name.trim(),
    libraryTemplateName: input.item.name,
    language: input.item.language,
    category,
  };

  const buttonInputs = buildButtonInputs({
    urlBase: input.urlBase,
    phoneNumber: input.phoneNumber,
    hasUrlButton,
    hasPhoneButton,
  });

  if (buttonInputs) {
    payload.libraryTemplateButtonInputs = buttonInputs;
  }

  const bodyInputs = buildLibraryBodyInputs(category);
  if (bodyInputs) {
    payload.libraryTemplateBodyInputs = bodyInputs;
  }

  return payload;
}
