import { billingApi } from '@/features/billing/api/billing.api';
import { metaApi } from '@/features/meta/api/meta.api';
import { ApiError } from '@/types/api.types';
import { SubscriptionStatus } from '@/types/billing.types';
import type { OnboardingState } from '@/utils/onboarding';

const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIAL,
  SubscriptionStatus.PAST_DUE,
]);

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
    const subscription = await billingApi.getSubscription();
    hasSubscription = ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status);
  } catch {
    hasSubscription = false;
  }

  return { orgSlug, isMetaConnected, hasSubscription };
}
