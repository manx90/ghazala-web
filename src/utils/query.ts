import type { PaginationParams} from '@/types/pagination.types';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/types/pagination.types';

export function buildQueryParams(params?: Record<string, unknown>): Record<string, string> {
  if (!params) return {};

  return Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value === undefined || value === null || value === '') {
      return acc;
    }

    if (Array.isArray(value)) {
      acc[key] = value.join(',');
      return acc;
    }

    acc[key] = String(value);
    return acc;
  }, {});
}

export function buildPaginationQuery(params?: PaginationParams): Record<string, string> {
  return buildQueryParams({
    page: params?.page ?? DEFAULT_PAGE,
    limit: params?.limit ?? DEFAULT_LIMIT,
  });
}

export function toQueryString(params?: Record<string, unknown> | object): string {
  const searchParams = new URLSearchParams(buildQueryParams(params as Record<string, unknown>));
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
