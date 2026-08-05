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

function resolveOtpType(item: TemplateLibraryItem): string {
  const otpButton = item.buttons?.find((button) => button.type === 'OTP');
  return otpButton?.otp_type ?? 'COPY_CODE';
}

function buildAuthenticationButtonInputs(item: TemplateLibraryItem): LibraryTemplateButtonInput[] {
  return [
    {
      type: 'OTP',
      otp_type: resolveOtpType(item),
    },
  ];
}

function buildUtilityMarketingButtonInputs(input: {
  item: TemplateLibraryItem;
  urlBase?: string;
  phoneNumber?: string;
}): LibraryTemplateButtonInput[] | undefined {
  const buttonInputs: LibraryTemplateButtonInput[] = [];
  const hasUrlButton = input.item.buttons?.some((button) => button.type === 'URL') ?? false;
  const hasPhoneButton =
    input.item.buttons?.some((button) => button.type === 'PHONE_NUMBER') ?? false;

  if (hasUrlButton && input.urlBase?.trim()) {
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

  if (hasPhoneButton && input.phoneNumber?.trim()) {
    buttonInputs.push({
      type: 'PHONE_NUMBER',
      phone_number: input.phoneNumber.trim(),
    });
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
    payload.libraryTemplateButtonInputs = buildAuthenticationButtonInputs(input.item);
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

export function isAuthenticationLibraryItem(item: TemplateLibraryItem): boolean {
  return resolveLibraryCategory(item.category) === TemplateCategory.AUTHENTICATION;
}
