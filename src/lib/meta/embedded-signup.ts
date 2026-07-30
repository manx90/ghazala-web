import { loadFacebookSdk } from '@/lib/meta/load-facebook-sdk';
import type {
  EmbeddedSignupMessage,
  EmbeddedSignupResult,
  EmbeddedSignupSessionInfo,
  FacebookLoginResponse,
} from '@/types/meta-sdk.types';

const FACEBOOK_ORIGINS = ['https://www.facebook.com', 'https://web.facebook.com'];

function isFacebookOrigin(origin: string): boolean {
  return FACEBOOK_ORIGINS.includes(origin);
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
  if (!data?.waba_id) {
    return null;
  }

  return {
    wabaId: data.waba_id,
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

    const cleanup = (messageHandler: (event: MessageEvent) => void) => {
      window.removeEventListener('message', messageHandler);
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
        fail(messageHandler, new Error('تم إلغاء عملية الربط'));
        return;
      }

      if (message.event === 'ERROR') {
        fail(messageHandler, new Error('فشلت عملية الربط مع Meta'));
        return;
      }

      if (message.event === 'FINISH') {
        sessionInfo = toSessionInfo(message.data);
        if (!sessionInfo) {
          fail(messageHandler, new Error('لم يتم استلام بيانات حساب WhatsApp Business'));
          return;
        }
        tryComplete(messageHandler);
      }
    };

    window.addEventListener('message', messageHandler);

    void loadFacebookSdk(appId, graphApiVersion)
      .then(() => {
        if (!window.FB) {
          fail(messageHandler, new Error('Facebook SDK غير متاح'));
          return;
        }

        window.FB.login(
          (response: FacebookLoginResponse) => {
            if (response.status === 'unknown') {
              fail(messageHandler, new Error('تم إلغاء عملية الربط'));
              return;
            }

            const code = response.authResponse?.code;
            if (!code) {
              fail(messageHandler, new Error('لم يتم استلام رمز التفويض من Meta'));
              return;
            }

            authorizationCode = code;
            tryComplete(messageHandler);
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
        fail(messageHandler, error instanceof Error ? error : new Error('فشل تحميل Facebook SDK'));
      });
  });
}
