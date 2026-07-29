export interface FacebookLoginResponse {
  authResponse?: {
    code?: string;
    accessToken?: string;
    userID?: string;
    expiresIn?: number;
  };
  status?: 'connected' | 'not_authorized' | 'unknown';
}

export interface FacebookLoginOptions {
  config_id: string;
  response_type: 'code';
  override_default_response_type: true;
  extras: {
    setup: Record<string, unknown>;
    featureType: string;
    sessionInfoVersion: string;
  };
}

export interface FacebookSDK {
  init(params: { appId: string; cookie?: boolean; xfbml?: boolean; version: string }): void;
  login(callback: (response: FacebookLoginResponse) => void, options: FacebookLoginOptions): void;
}

declare global {
  interface Window {
    FB?: FacebookSDK;
    fbAsyncInit?: () => void;
  }
}

export type EmbeddedSignupEventType = 'WA_EMBEDDED_SIGNUP';

export interface EmbeddedSignupFinishData {
  phone_number_id?: string;
  waba_id?: string;
  business_id?: string;
  current_step?: string;
}

export interface EmbeddedSignupMessage {
  type: EmbeddedSignupEventType;
  event: 'FINISH' | 'CANCEL' | 'ERROR';
  data?: EmbeddedSignupFinishData;
}

export interface EmbeddedSignupSessionInfo {
  wabaId: string;
  phoneNumberId?: string;
  metaBusinessId?: string;
}

export interface EmbeddedSignupResult {
  authorizationCode: string;
  session: EmbeddedSignupSessionInfo;
}
