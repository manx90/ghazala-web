import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { arSA } from 'date-fns/locale';

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : parseISO(value);
  return isValid(date) ? date : null;
}

export function formatDate(
  value: string | Date | null | undefined,
  pattern = 'dd/MM/yyyy',
): string {
  const date = toDate(value);
  if (!date) return '—';
  return format(date, pattern, { locale: arSA });
}

export function formatDateTime(
  value: string | Date | null | undefined,
  pattern = 'dd/MM/yyyy HH:mm',
): string {
  const date = toDate(value);
  if (!date) return '—';
  return format(date, pattern, { locale: arSA });
}

export function formatRelativeTime(value: string | Date | null | undefined): string {
  const date = toDate(value);
  if (!date) return '—';
  return formatDistanceToNow(date, { addSuffix: true, locale: arSA });
}

export function formatTime(value: string | Date | null | undefined): string {
  const date = toDate(value);
  if (!date) return '—';
  return format(date, 'HH:mm', { locale: arSA });
}
