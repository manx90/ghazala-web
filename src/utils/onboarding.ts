import { ROUTES } from '@/config/routes';

export interface OnboardingState {
  orgSlug: string | null;
  isMetaConnected: boolean;
  hasSubscription: boolean;
}

export function resolveOnboardingPath(state: OnboardingState): string {
  if (!state.orgSlug) {
    return ROUTES.onboarding.createOrganization;
  }

  if (!state.isMetaConnected) {
    return ROUTES.onboarding.connectWhatsapp;
  }

  if (!state.hasSubscription) {
    return ROUTES.onboarding.selectPlan;
  }

  return ROUTES.app.dashboard(state.orgSlug);
}

export function isOnboardingComplete(state: OnboardingState): boolean {
  return Boolean(state.orgSlug && state.isMetaConnected && state.hasSubscription);
}
