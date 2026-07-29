export function formatCurrency(
  amount: number | string,
  currency = 'SAR',
  locale = 'ar-SA',
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

export function formatNumber(value: number, locale = 'ar-SA'): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCompactNumber(value: number, locale = 'ar-SA'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}
