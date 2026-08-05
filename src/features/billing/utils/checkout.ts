import type { CheckoutSessionResponse } from '@/types/billing.types';

export function redirectToCheckoutOrComplete(
  session: CheckoutSessionResponse,
  onComplete: () => void,
): void {
  if (session.requiresPayment && session.checkoutUrl) {
    window.location.assign(session.checkoutUrl);
    return;
  }

  onComplete();
}
