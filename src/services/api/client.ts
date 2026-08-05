import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import axios, { AxiosHeaders } from 'axios';
import { env } from '@/config/env';
import { AUTH_COOKIE_NAME, ORG_COOKIE_NAME } from '@/config/routes';
import type { RequestConfig } from '@/types/api.types';
import { ApiError } from '@/types/api.types';
import type { AuthResponse } from '@/types/auth.types';
import { parseApiError } from '@/utils/error';
import { dispatchUnauthorizedEvent } from '@/utils/events';
import { organizationStorage, tokenStorage } from '@/utils/storage';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      retryCount?: number;
      skipAuth?: boolean;
      skipOrgHeader?: boolean;
      skipRefresh?: boolean;
    };
  }
}

const ORGANIZATION_HEADER = 'x-organization-id';
const REQUEST_ID_HEADER = 'x-request-id';

let refreshPromise: Promise<AuthResponse> | null = null;

function generateRequestId(): string {
  return crypto.randomUUID();
}

function getCookieSuffix(): string {
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  return `; path=/; max-age=604800; SameSite=Lax${secure}`;
}

function setAuthCookie(value: string | null): void {
  if (typeof document === 'undefined') return;

  if (!value) {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=1${getCookieSuffix()}`;
}

function setOrgCookie(orgId: string | null): void {
  if (typeof document === 'undefined') return;

  if (!orgId) {
    document.cookie = `${ORG_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }

  document.cookie = `${ORG_COOKIE_NAME}=${encodeURIComponent(orgId)}${getCookieSuffix()}`;
}

export function syncAuthCookies(): void {
  const hasToken = Boolean(tokenStorage.getAccessToken());
  setAuthCookie(hasToken ? '1' : null);

  const orgId = organizationStorage.getId();
  setOrgCookie(orgId);
}

async function refreshAccessToken(): Promise<AuthResponse> {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new ApiError({
      message: 'جلسة منتهية',
      statusCode: 401,
      code: 'UNAUTHORIZED',
      error: 'Unauthorized',
    });
  }

  const response = await axios.post<AuthResponse>(
    `${env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    { refreshToken },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: env.NEXT_PUBLIC_API_TIMEOUT,
    },
  );

  tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
  syncAuthCookies();

  return response.data;
}

function getRefreshPromise(): Promise<AuthResponse> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function attachRequestMetadata(
  config: InternalAxiosRequestConfig,
  options: RequestConfig = {},
): InternalAxiosRequestConfig {
  config.metadata = {
    retryCount: 0,
    skipAuth: options.skipAuth,
    skipOrgHeader: options.skipOrgHeader,
    skipRefresh: options.skipRefresh,
  };

  config.headers = AxiosHeaders.from(config.headers);
  config.headers.set(REQUEST_ID_HEADER, generateRequestId());

  if (!options.skipAuth) {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  if (!options.skipOrgHeader) {
    const organizationId = organizationStorage.getId();
    if (organizationId) {
      config.headers.set(ORGANIZATION_HEADER, organizationId);
    }
  }

  return config;
}

function shouldRetry(error: AxiosError, config: InternalAxiosRequestConfig): boolean {
  const retryCount = config.metadata?.retryCount ?? 0;
  const maxRetries = 2;

  if (retryCount >= maxRetries) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  return error.response.status === 408 || error.response.status === 429;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    timeout: env.NEXT_PUBLIC_API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  instance.interceptors.request.use((config) => config);

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as InternalAxiosRequestConfig | undefined;

      if (!config) {
        return Promise.reject(parseApiError(error));
      }

      const status = error.response?.status;
      const skipRefresh = config.metadata?.skipRefresh || config.metadata?.skipAuth;

      if (status === 401 && !skipRefresh) {
        try {
          await getRefreshPromise();
          config.metadata = { ...config.metadata, skipRefresh: true };
          config.headers = AxiosHeaders.from(config.headers);
          const accessToken = tokenStorage.getAccessToken();
          if (accessToken) {
            config.headers.set('Authorization', `Bearer ${accessToken}`);
          }
          return instance.request(config);
        } catch (refreshError) {
          tokenStorage.clearTokens();
          syncAuthCookies();
          const apiError = parseApiError(refreshError);
          if (apiError.isUnauthorized) {
            dispatchUnauthorizedEvent(apiError);
          }
          return Promise.reject(apiError);
        }
      }

      if (status === 401) {
        const apiError = parseApiError(error);
        dispatchUnauthorizedEvent(apiError);
        return Promise.reject(apiError);
      }

      if (shouldRetry(error, config)) {
        config.metadata = {
          ...config.metadata,
          retryCount: (config.metadata?.retryCount ?? 0) + 1,
        };

        const backoffMs = 300 * (config.metadata.retryCount ?? 1) ** 2;
        await delay(backoffMs);
        return instance.request(config);
      }

      return Promise.reject(parseApiError(error));
    },
  );

  return instance;
}

const axiosInstance = createAxiosInstance();

export async function apiRequest<T>(
  config: AxiosRequestConfig,
  options: RequestConfig = {},
): Promise<T> {
  const requestConfig: AxiosRequestConfig = {
    ...config,
    signal: options.signal,
    timeout: options.timeout ?? env.NEXT_PUBLIC_API_TIMEOUT,
  };

  attachRequestMetadata(requestConfig as InternalAxiosRequestConfig, options);

  const response = await axiosInstance.request<T>(requestConfig);
  return response.data;
}

export const apiClient = {
  get<T>(url: string, config?: AxiosRequestConfig, options?: RequestConfig): Promise<T> {
    return apiRequest<T>({ ...config, method: 'GET', url }, options);
  },

  post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    options?: RequestConfig,
  ): Promise<T> {
    return apiRequest<T>({ ...config, method: 'POST', url, data }, options);
  },

  put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    options?: RequestConfig,
  ): Promise<T> {
    return apiRequest<T>({ ...config, method: 'PUT', url, data }, options);
  },

  patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    options?: RequestConfig,
  ): Promise<T> {
    return apiRequest<T>({ ...config, method: 'PATCH', url, data }, options);
  },

  delete<T>(url: string, config?: AxiosRequestConfig, options?: RequestConfig): Promise<T> {
    return apiRequest<T>({ ...config, method: 'DELETE', url }, options);
  },

  download(url: string, config?: AxiosRequestConfig, options?: RequestConfig) {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      method: 'GET',
      url,
      responseType: 'blob',
    };

    attachRequestMetadata(requestConfig as InternalAxiosRequestConfig, options);
    return axiosInstance.request<Blob>(requestConfig);
  },
};

export function clearAuthSession(): void {
  tokenStorage.clearTokens();
  organizationStorage.clear();
  syncAuthCookies();
}

export function persistAuthSession(tokens: AuthResponse): void {
  tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
  syncAuthCookies();
}

export function persistOrganizationContext(id: string, slug: string): void {
  organizationStorage.set(id, slug);
  syncAuthCookies();
}

export { axiosInstance };
