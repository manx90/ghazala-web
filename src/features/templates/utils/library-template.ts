import {
  TemplateCategory,
  type CreateFromLibraryPayload,
  type LibraryTemplateBodyInputs,
  type LibraryTemplateButtonInput,
  type TemplateLibraryButton,
  type TemplateLibraryItem,
} from '@/types/template.types';

const SUPPORTED_BUTTON_TYPES = new Set(['URL', 'PHONE_NUMBER', 'OTP']);

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

export function isAuthenticationLibraryItem(item: TemplateLibraryItem): boolean {
  return resolveLibraryCategory(item.category) === TemplateCategory.AUTHENTICATION;
}

export function getUnsupportedLibraryButtons(
  item: TemplateLibraryItem,
): TemplateLibraryButton[] {
  if (isAuthenticationLibraryItem(item)) {
    return [];
  }

  return (item.buttons ?? []).filter(
    (button) => !SUPPORTED_BUTTON_TYPES.has(String(button.type ?? '').toUpperCase()),
  );
}

export function getRequiredConfigurableButtons(item: TemplateLibraryItem): {
  url: boolean;
  phone: boolean;
} {
  if (isAuthenticationLibraryItem(item)) {
    return { url: false, phone: false };
  }

  return {
    url: (item.buttons ?? []).some((button) => button.type === 'URL'),
    phone: (item.buttons ?? []).some((button) => button.type === 'PHONE_NUMBER'),
  };
}

function buildAuthenticationButtonInputs(): LibraryTemplateButtonInput[] {
  return [
    {
      type: 'OTP',
      otp_type: 'COPY_CODE',
    },
  ];
}

function buildUtilityMarketingButtonInputs(input: {
  item: TemplateLibraryItem;
  urlBase?: string;
  phoneNumber?: string;
}): LibraryTemplateButtonInput[] | undefined {
  const buttonInputs: LibraryTemplateButtonInput[] = [];
  const buttons = input.item.buttons ?? [];

  for (const button of buttons) {
    const type = String(button.type ?? '').toUpperCase();

    if (type === 'URL') {
      const baseUrl = input.urlBase?.trim();
      if (!baseUrl) continue;

      buttonInputs.push({
        type: 'URL',
        url: {
          base_url: baseUrl,
          url_suffix_example: baseUrl.includes('{{1}}')
            ? baseUrl.replace('{{1}}', 'demo')
            : baseUrl,
        },
      });
      continue;
    }

    if (type === 'PHONE_NUMBER') {
      const phone = input.phoneNumber?.trim();
      if (!phone) continue;

      buttonInputs.push({
        type: 'PHONE_NUMBER',
        phone_number: phone,
      });
    }
  }

  return buttonInputs.length ? buttonInputs : undefined;
}

export function buildLibraryBodyInputs(
  category?: TemplateCategory,
): LibraryTemplateBodyInputs | undefined {
  if (category === TemplateCategory.AUTHENTICATION) {
    return {
      code_expiration_minutes: 5,
      add_security_recommendation: true,
    };
  }

  return undefined;
}

export function canSubmitLibraryTemplate(input: {
  item: TemplateLibraryItem;
  name: string;
  urlBase?: string;
  phoneNumber?: string;
}): { ok: boolean; reason?: string } {
  if (!input.name.trim()) {
    return { ok: false, reason: 'اسم القالب مطلوب' };
  }

  if (!/^[a-z0-9_]+$/.test(input.name.trim())) {
    return {
      ok: false,
      reason: 'اسم القالب يجب أن يكون lowercase مع underscore فقط',
    };
  }

  const unsupported = getUnsupportedLibraryButtons(input.item);
  if (unsupported.length) {
    return {
      ok: false,
      reason: `هذا القالب يحتوي أزرار غير مدعومة حالياً: ${unsupported
        .map((button) => button.type)
        .join(', ')}`,
    };
  }

  if (isAuthenticationLibraryItem(input.item)) {
    return { ok: true };
  }

  const required = getRequiredConfigurableButtons(input.item);

  if (required.url && !input.urlBase?.trim()) {
    return { ok: false, reason: 'رابط الزر مطلوب' };
  }

  if (required.phone && !input.phoneNumber?.trim()) {
    return { ok: false, reason: 'رقم الهاتف مطلوب' };
  }

  return { ok: true };
}

export function buildCreateFromLibraryPayload(input: {
  name: string;
  item: TemplateLibraryItem;
  urlBase?: string;
  phoneNumber?: string;
}): CreateFromLibraryPayload {
  const category = resolveLibraryCategory(input.item.category);

  const payload: CreateFromLibraryPayload = {
    name: input.name.trim(),
    libraryTemplateName: input.item.name,
    language: input.item.language,
    category,
  };

  if (category === TemplateCategory.AUTHENTICATION) {
    payload.libraryTemplateButtonInputs = buildAuthenticationButtonInputs();
  } else {
    const buttonInputs = buildUtilityMarketingButtonInputs(input);
    if (buttonInputs) {
      payload.libraryTemplateButtonInputs = buttonInputs;
    }
  }

  const bodyInputs = buildLibraryBodyInputs(category);
  if (bodyInputs) {
    payload.libraryTemplateBodyInputs = bodyInputs;
  }

  return payload;
}
