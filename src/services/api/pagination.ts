import type { PaginationParams } from '@/types/pagination.types';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/types/pagination.types';
import { buildPaginationMeta } from '@/types/pagination.types';
import { buildPaginationQuery } from '@/utils/query';

export { buildPaginationMeta, DEFAULT_LIMIT, DEFAULT_PAGE };
export type { PaginationParams };

export function getPaginationQuery(params?: PaginationParams) {
  return buildPaginationQuery(params);
}

export function normalizePaginatedResponse<T extends { total: number; page: number; limit: number }>(
  response: T,
) {
  return {
    ...response,
    meta: buildPaginationMeta(response.page, response.limit, response.total),
  };
}

export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
