import type { ApiError } from '@/types/api.types';

export const UNAUTHORIZED_EVENT = 'ghazala:unauthorized';

export function dispatchUnauthorizedEvent(error: ApiError): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ApiError>(UNAUTHORIZED_EVENT, { detail: error }));
}
