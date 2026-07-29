const ACCESS_TOKEN_KEY = 'ghazala:access-token';
const REFRESH_TOKEN_KEY = 'ghazala:refresh-token';
const ORG_ID_KEY = 'ghazala:organization-id';
const ORG_SLUG_KEY = 'ghazala:organization-slug';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const organizationStorage = {
  getId(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(ORG_ID_KEY);
  },

  getSlug(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(ORG_SLUG_KEY);
  },

  set(id: string, slug: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(ORG_ID_KEY, id);
    localStorage.setItem(ORG_SLUG_KEY, slug);
  },

  clear(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(ORG_ID_KEY);
    localStorage.removeItem(ORG_SLUG_KEY);
  },
};

export function clearSessionStorage(): void {
  tokenStorage.clearTokens();
  organizationStorage.clear();
}

export function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function safeJsonStringify(value: unknown): string | null {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}
