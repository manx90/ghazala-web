export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone);

  if (normalized.startsWith('+966') && normalized.length === 13) {
    return `+966 ${normalized.slice(4, 6)} ${normalized.slice(6, 9)} ${normalized.slice(9)}`;
  }

  if (normalized.startsWith('966') && normalized.length === 12) {
    return `+966 ${normalized.slice(3, 5)} ${normalized.slice(5, 8)} ${normalized.slice(8)}`;
  }

  return normalized.startsWith('+') ? normalized : `+${normalized}`;
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^\+?\d{8,15}$/.test(normalized);
}

export function maskPhone(phone: string): string {
  const normalized = normalizePhone(phone);
  if (normalized.length <= 4) return normalized;
  return `${normalized.slice(0, 4)}${'*'.repeat(Math.max(0, normalized.length - 7))}${normalized.slice(-3)}`;
}
