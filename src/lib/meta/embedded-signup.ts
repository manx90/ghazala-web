import { loadFacebookSdk } from '@/lib/meta/load-facebook-sdk';
import { MetaSignupError } from '@/lib/meta/meta-signup-error';
import type {
  EmbeddedSignupMessage,
  EmbeddedSignupResult,
  EmbeddedSignupSessionInfo,
  FacebookLoginResponse,
} from '@/types/meta-sdk.types';

const SIGNUP_TIMEOUT_MS = 120_000;

const SUCCESS_EVENTS = new Set([
  'FINISH',
  'FINISH_ONLY_WABA',
  'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING',
  'FINISH_OBO_MIGRATION',
  'FINISH_GRANT_ONLY_API_ACCESS',
]);

function isFacebookOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'facebook.com' || hostname.endsWith('.facebook.com');
  } catch {
    return false;
  }
}

function parseEmbeddedSignupMessage(raw: unknown): EmbeddedSignupMessage | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const message = raw as EmbeddedSignupMessage;
  if (message.type !== 'WA_EMBEDDED_SIGNUP') {
    return null;
  }

  return message;
}

function toSessionInfo(data: EmbeddedSignupMessage['data']): EmbeddedSignupSessionInfo | null {
  if (!data) {
    return null;
  }

  const wabaId = data.waba_id ?? data.waba_ids?.[0];
  if (!wabaId) {
    return null;
  }

  return {
    wabaId,
    phoneNumberId: data.phone_number_id,
    metaBusinessId: data.business_id,
  };
}

export interface LaunchEmbeddedSignupParams {
  appId: string;
  graphApiVersion: string;
  embeddedSignupConfigId: string;
}

export function launchEmbeddedSignup(
  params: LaunchEmbeddedSignupParams,
): Promise<EmbeddedSignupResult> {
  const { appId, graphApiVersion, embeddedSignupConfigId } = params;

  return new Promise((resolve, reject) => {
    let settled = false;
    let sessionInfo: EmbeddedSignupSessionInfo | null = null;
    let authorizationCode: string | null = null;
    let timeoutId: number | null = null;

    const cleanup = (messageHandler: (event: MessageEvent) => void) => {
      window.removeEventListener('message', messageHandler);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const fail = (messageHandler: (event: MessageEvent) => void, error: Error) => {
      if (settled) return;
      settled = true;
      cleanup(messageHandler);
      reject(error);
    };

    const tryComplete = (messageHandler: (event: MessageEvent) => void) => {
      if (settled || !authorizationCode || !sessionInfo?.wabaId) {
        return;
      }

      settled = true;
      cleanup(messageHandler);
      resolve({
        authorizationCode,
        session: sessionInfo,
      });
    };

    const messageHandler = (event: MessageEvent) => {
      if (!isFacebookOrigin(event.origin)) {
        return;
      }

      let payload: unknown = event.data;

      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }

      const message = parseEmbeddedSignupMessage(payload);
      if (!message) {
        return;
      }

      if (message.event === 'CANCEL') {
        fail(messageHandler, new MetaSignupError('cancelled'));
        return;
      }

      if (message.event === 'ERROR') {
        fail(messageHandler, new MetaSignupError('failed'));
        return;
      }

      if (message.data?.code && !authorizationCode) {
        authorizationCode = message.data.code;
        tryComplete(messageHandler);
      }

      if (SUCCESS_EVENTS.has(message.event)) {
        sessionInfo = toSessionInfo(message.data);
        if (!sessionInfo) {
          fail(messageHandler, new MetaSignupError('noWabaData'));
          return;
        }
        tryComplete(messageHandler);
      }
    };

    window.addEventListener('message', messageHandler);

    timeoutId = window.setTimeout(() => {
      if (authorizationCode && !sessionInfo?.wabaId) {
        fail(messageHandler, new MetaSignupError('noWabaData'));
        return;
      }

      if (!authorizationCode && sessionInfo?.wabaId) {
        fail(messageHandler, new MetaSignupError('noAuthCode'));
        return;
      }

      fail(messageHandler, new MetaSignupError('timeout'));
    }, SIGNUP_TIMEOUT_MS);

    void loadFacebookSdk(appId, graphApiVersion)
      .then(() => {
        if (!window.FB) {
          fail(messageHandler, new MetaSignupError('sdkUnavailable'));
          return;
        }

        window.FB.login(
          (response: FacebookLoginResponse) => {
            if (response.status === 'unknown') {
              fail(messageHandler, new MetaSignupError('cancelled'));
              return;
            }

            const code = response.authResponse?.code;
            if (code) {
              authorizationCode = code;
              tryComplete(messageHandler);
            }
          },
          {
            config_id: embeddedSignupConfigId,
            response_type: 'code',
            override_default_response_type: true,
            extras: {
              featureType: 'embedded_signup_v2',
              setup: {},
              sessionInfoVersion: '3',
            },
          },
        );
      })
      .catch((error: unknown) => {
        fail(
          messageHandler,
          error instanceof MetaSignupError ? error : new MetaSignupError('sdkLoadFailed'),
        );
      });
  });
}
