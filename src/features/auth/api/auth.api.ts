import {
  apiClient,
  clearAuthSession,
  persistAuthSession,
} from '@/services/api/client';
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  LogoutPayload,
  RefreshTokenPayload,
  RegisterPayload,
  ResendVerificationPayload,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
} from '@/types/auth.types';
import type { ApiMessageResponse } from '@/types/api.types';
import { tokenStorage } from '@/utils/storage';

const AUTH_BASE = '/auth';

export const authApi = {
  login(payload: LoginPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${AUTH_BASE}/login`, payload, undefined, {
      skipAuth: true,
      skipOrgHeader: true,
    });
  },

  register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${AUTH_BASE}/register`, payload, undefined, {
      skipAuth: true,
      skipOrgHeader: true,
    });
  },

  refresh(payload: RefreshTokenPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${AUTH_BASE}/refresh`, payload, undefined, {
      skipAuth: true,
      skipOrgHeader: true,
      skipRefresh: true,
    });
  },

  logout(payload: LogoutPayload): Promise<ApiMessageResponse> {
    return apiClient.post<ApiMessageResponse>(`${AUTH_BASE}/logout`, payload, undefined, {
      skipAuth: true,
      skipOrgHeader: true,
      skipRefresh: true,
    });
  },

  me(): Promise<User> {
    return apiClient.get<User>(`${AUTH_BASE}/me`, undefined, {
      skipOrgHeader: true,
    });
  },

  forgotPassword(payload: ForgotPasswordPayload): Promise<ApiMessageResponse> {
    return apiClient.post<ApiMessageResponse>(
      `${AUTH_BASE}/forgot-password`,
      payload,
      undefined,
      { skipAuth: true, skipOrgHeader: true },
    );
  },

  resetPassword(payload: ResetPasswordPayload): Promise<ApiMessageResponse> {
    return apiClient.post<ApiMessageResponse>(
      `${AUTH_BASE}/reset-password`,
      payload,
      undefined,
      { skipAuth: true, skipOrgHeader: true },
    );
  },

  verifyEmail(payload: VerifyEmailPayload): Promise<ApiMessageResponse> {
    return apiClient.post<ApiMessageResponse>(
      `${AUTH_BASE}/verify-email`,
      payload,
      undefined,
      { skipAuth: true, skipOrgHeader: true },
    );
  },

  resendVerification(payload: ResendVerificationPayload): Promise<ApiMessageResponse> {
    return apiClient.post<ApiMessageResponse>(
      `${AUTH_BASE}/resend-verification-email`,
      payload,
      undefined,
      { skipAuth: true, skipOrgHeader: true },
    );
  },

  async establishSession(response: AuthResponse): Promise<AuthResponse> {
    persistAuthSession(response);
    return response;
  },

  async terminateSession(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();

    try {
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } finally {
      clearAuthSession();
    }
  },
};
