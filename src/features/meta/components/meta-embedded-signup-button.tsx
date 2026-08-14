'use client';

import { Loader2Icon, MessageCircleIcon, SmartphoneIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/utils/error';
import { toastError } from '@/components/global/toast-helpers';
import { useMetaEmbeddedSignup } from '@/features/meta/hooks/use-meta-embedded-signup';
import type { MetaOnboardingMode } from '@/types/meta-onboarding.types';
import type { EmbeddedSignupSession } from '@/types/meta.types';

interface MetaEmbeddedSignupButtonProps {
  session: EmbeddedSignupSession;
  mode?: MetaOnboardingMode;
  disabled?: boolean;
  label?: string;
  onConnect: (payload: {
    authorizationCode: string;
    wabaId: string;
    metaBusinessId?: string;
    phoneNumberId?: string;
    onboardingMode: MetaOnboardingMode;
  }) => Promise<void>;
}

export function MetaEmbeddedSignupButton({
  session,
  mode = 'standard',
  disabled,
  label,
  onConnect,
}: MetaEmbeddedSignupButtonProps) {
  const { launch, isLaunching } = useMetaEmbeddedSignup(onConnect);
  const Icon = mode === 'coexistence' ? SmartphoneIcon : MessageCircleIcon;

  const handleClick = async () => {
    try {
      await launch(session, mode);
    } catch (error) {
      toastError(getErrorMessage(error));
    }
  };

  return (
    <Button
      type="button"
      variant={mode === 'coexistence' ? 'outline' : 'gradient'}
      size="lg"
      className="w-full"
      disabled={disabled || isLaunching}
      onClick={() => void handleClick()}
    >
      {isLaunching ? (
        <>
          <Loader2Icon className="animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Icon />
          {label ?? 'Connect with WhatsApp'}
        </>
      )}
    </Button>
  );
}
