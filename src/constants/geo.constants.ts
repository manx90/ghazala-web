const EXCLUDED_REGION_CODES = new Set(['001', '150', '419', 'EU', 'EZ', 'UN']);

const FALLBACK_COUNTRY_CODES = [
  'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ',
  'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ',
  'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ',
  'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ',
  'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET',
  'FI', 'FJ', 'FK', 'FM', 'FO', 'FR',
  'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY',
  'HK', 'HM', 'HN', 'HR', 'HT', 'HU',
  'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT',
  'JE', 'JM', 'JO', 'JP',
  'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ',
  'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY',
  'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ',
  'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ',
  'OM',
  'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY',
  'QA',
  'RE', 'RO', 'RS', 'RU', 'RW',
  'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ',
  'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ',
  'UA', 'UG', 'UM', 'US', 'UY', 'UZ',
  'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU',
  'WF', 'WS',
  'YE', 'YT',
  'ZA', 'ZM', 'ZW',
] as const;

function resolveCountryCodes(): readonly string[] {
  try {
    const supportedValuesOf = Intl.supportedValuesOf as (key: string) => readonly string[];
    const regions = supportedValuesOf('region').filter(
      (code) => /^[A-Z]{2}$/.test(code) && !EXCLUDED_REGION_CODES.has(code),
    );
    if (regions.length > 0) return Object.freeze(regions.sort());
  } catch {
    // fallback below
  }
  return FALLBACK_COUNTRY_CODES;
}

export const ALL_COUNTRY_CODES: readonly string[] = resolveCountryCodes();

export const ALL_TIMEZONES: readonly string[] = Object.freeze(
  Intl.supportedValuesOf('timeZone').sort(),
);

export function getCountryLabel(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function getTimezoneLabel(timezone: string, locale: string): string {
  const city = timezone.split('/').pop()?.replace(/_/g, ' ') ?? timezone;

  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const offset = formatter.formatToParts(new Date()).find((part) => part.type === 'timeZoneName')?.value;
    return offset ? `${city} (${timezone}) — ${offset}` : `${city} (${timezone})`;
  } catch {
    return timezone;
  }
}

export function buildCountryOptions(locale: string) {
  return ALL_COUNTRY_CODES.map((value) => ({
    value,
    label: getCountryLabel(value, locale),
  })).sort((a, b) => a.label.localeCompare(b.label, locale));
}

export function buildTimezoneOptions(locale: string) {
  return ALL_TIMEZONES.map((value) => ({
    value,
    label: getTimezoneLabel(value, locale),
  })).sort((a, b) => a.label.localeCompare(b.label, locale));
}

export function isValidCountryCode(code: string): boolean {
  return ALL_COUNTRY_CODES.includes(code.toUpperCase());
}

export function isValidTimezone(timezone: string): boolean {
  return ALL_TIMEZONES.includes(timezone);
}
