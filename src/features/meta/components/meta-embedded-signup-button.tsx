'use client';

import { Loader2Icon, MessageCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/utils/error';
import { toastError } from '@/components/global/toast-helpers';
import { useMetaEmbeddedSignup } from '@/features/meta/hooks/use-meta-embedded-signup';
import type { EmbeddedSignupSession } from '@/types/meta.types';

interface MetaEmbeddedSignupButtonProps {
  session: EmbeddedSignupSession;
  disabled?: boolean;
  onConnect: (payload: {
    authorizationCode: string;
    wabaId: string;
    metaBusinessId?: string;
  }) => Promise<void>;
}

export function MetaEmbeddedSignupButton({
  session,
  disabled,
  onConnect,
}: MetaEmbeddedSignupButtonProps) {
  const { launch, isLaunching } = useMetaEmbeddedSignup(onConnect);

  const handleClick = async () => {
    try {
      await launch(session);
    } catch (error) {
      toastError(getErrorMessage(error));
    }
  };

  return (
    <Button
      type="button"
      variant="gradient"
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
          <MessageCircleIcon />
          Connect with WhatsApp
        </>
      )}
    </Button>
  );
}
