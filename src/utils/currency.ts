import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_LOCALE } from '@/config/currency';

export function formatCurrency(
  amount: number | string,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_CURRENCY_LOCALE,
): string {
  const numericAmount = typeof amount === 'string' ? Number(amount) : amount;

  if (Number.isNaN(numericAmount)) {
    return '—';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export function formatNumber(value: number, locale = DEFAULT_CURRENCY_LOCALE): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCompactNumber(value: number, locale = DEFAULT_CURRENCY_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}
