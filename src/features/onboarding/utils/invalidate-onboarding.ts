import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/query-keys';

export function invalidateOnboardingState(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.onboarding.all });
}
