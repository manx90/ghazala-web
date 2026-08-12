export const TEMPLATE_LANGUAGE_CODES = [
  'ar',
  'en_US',
  'en_GB',
  'fr',
  'es',
  'de',
  'it',
  'pt_BR',
  'tr',
  'ur',
] as const;

export const TEMPLATE_LANGUAGE_OPTIONS = TEMPLATE_LANGUAGE_CODES.map((value) => ({ value }));

export const LIBRARY_TOPIC_OPTIONS = [
  { value: 'ALL' },
  { value: 'ORDER_MANAGEMENT' },
  { value: 'PAYMENTS' },
  { value: 'ACCOUNT_UPDATE' },
  { value: 'CUSTOMER_FEEDBACK' },
] as const;

export const LIBRARY_USECASE_OPTIONS = [
  { value: 'ALL' },
  { value: 'ORDER_CONFIRMATION' },
  { value: 'ORDER_DELAY' },
  { value: 'ORDER_PICK_UP' },
  { value: 'SHIPMENT_CONFIRMATION' },
  { value: 'DELIVERY_UPDATE' },
  { value: 'DELIVERY_CONFIRMATION' },
  { value: 'DELIVERY_FAILED' },
  { value: 'PAYMENT_CONFIRMATION' },
  { value: 'PAYMENT_DUE_REMINDER' },
  { value: 'RETURN_CONFIRMATION' },
  { value: 'FEEDBACK_SURVEY' },
] as const;

export const LIBRARY_INDUSTRY_OPTIONS = [
  { value: 'ALL' },
  { value: 'E_COMMERCE' },
  { value: 'FINANCIAL_SERVICES' },
] as const;

type TemplatesTranslate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export function getLanguageLabel(code: string, t: TemplatesTranslate): string {
  if ((TEMPLATE_LANGUAGE_CODES as readonly string[]).includes(code)) {
    return t(`filters.languages.${code}`);
  }
  return code;
}

export function getFilterLabel(
  group: 'topics' | 'usecases' | 'industries',
  value: string,
  t: TemplatesTranslate,
): string {
  const options =
    group === 'topics'
      ? LIBRARY_TOPIC_OPTIONS
      : group === 'usecases'
        ? LIBRARY_USECASE_OPTIONS
        : LIBRARY_INDUSTRY_OPTIONS;
  if (options.some((item) => item.value === value)) {
    return t(`filters.${group}.${value}`);
  }
  return value;
}

export const TEMPLATE_STATUS_FILTER_VALUES = [
  'ALL',
  'APPROVED',
  'PENDING',
  'REJECTED',
  'DRAFT',
  'PAUSED',
  'DISABLED',
] as const;
