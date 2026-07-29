import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import type { ApiError } from '@/types/api.types';

export const QUERY_STALE_TIME = env.NEXT_PUBLIC_QUERY_STALE_TIME;
export const DEFAULT_STALE_TIME = 60_000;
export const FAST_STALE_TIME = 10_000;
export const SLOW_STALE_TIME = 5 * 60_000;
export const DEFAULT_GCTIME = 10 * 60_000;
export const FAST_GCTIME = 5 * 60_000;

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  organizations: {
    all: ['organizations'] as const,
    current: ['organizations', 'current'] as const,
    detail: (id: string) => ['organizations', id] as const,
  },
} as const;

function isRetryableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return true;
  const status = (error as ApiError).statusCode ?? (error as { status?: number }).status;
  if (typeof status === 'number') {
    if (status === 401 || status === 403) return false;
    if (status >= 400 && status < 500 && status !== 408 && status !== 429) return false;
  }
  if ('isOffline' in error && (error as { isOffline: boolean }).isOffline) return true;
  return true;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_STALE_TIME * 5,
        retry: (failureCount, error) => {
          if (failureCount >= 3) return false;
          return isRetryableError(error);
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        networkMode: 'online',
      },
      mutations: {
        retry: false,
        networkMode: 'online',
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

export const queryConfig = {
  dashboard: {
    staleTime: FAST_STALE_TIME,
    gcTime: FAST_GCTIME,
    refetchInterval: 60_000,
  },
  inbox: {
    conversations: {
      staleTime: FAST_STALE_TIME,
      gcTime: FAST_GCTIME,
      refetchInterval: 30_000,
    },
    messages: {
      staleTime: FAST_STALE_TIME,
      gcTime: FAST_GCTIME,
      refetchInterval: 10_000,
    },
  },
  messages: {
    status: {
      staleTime: 2_000,
      gcTime: FAST_GCTIME,
      refetchInterval: 5_000,
    },
  },
  admin: {
    staleTime: SLOW_STALE_TIME,
    gcTime: SLOW_STALE_TIME * 2,
    refetchInterval: 60_000,
  },
  health: {
    staleTime: 0,
    gcTime: FAST_GCTIME,
    refetchInterval: 30_000,
  },
  static: {
    staleTime: SLOW_STALE_TIME,
    gcTime: SLOW_STALE_TIME * 2,
  },
  fast: {
    staleTime: FAST_STALE_TIME,
    gcTime: FAST_GCTIME,
  },
} as const;
