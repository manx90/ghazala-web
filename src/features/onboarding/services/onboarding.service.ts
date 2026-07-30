import { billingApi } from '@/features/billing/api/billing.api';
import { metaApi } from '@/features/meta/api/meta.api';
import { ApiError } from '@/types/api.types';
import type { OnboardingState } from '@/utils/onboarding';

export async function fetchOnboardingState(orgSlug: string | null): Promise<OnboardingState> {
  if (!orgSlug) {
    return { orgSlug: null, isMetaConnected: false, hasSubscription: false };
  }

  let isMetaConnected = false;
  let hasSubscription = false;

  try {
    const meta = await metaApi.status();
    isMetaConnected = meta.isConnected;
  } catch {
    isMetaConnected = false;
  }

  try {
    await billingApi.getSubscription();
    hasSubscription = true;
  } catch (error) {
    hasSubscription = !(error instanceof ApiError && error.statusCode === 404);
  }

  return { orgSlug, isMetaConnected, hasSubscription };
}
