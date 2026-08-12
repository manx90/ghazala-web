import { parseApiError } from '@/utils/error';

const DEFAULT_SAFE_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: 'Session expired. Please sign in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please review the entered data.',
  NETWORK_ERROR: 'Could not connect to the server. Check your connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  RATE_LIMITED: 'Too many requests. Wait a moment and try again.',
  SERVER_ERROR: 'A server error occurred. Please try again later.',
};

const SENSITIVE_PATTERNS = [
  /sql/i,
  /stack/i,
  /trace/i,
  /internal server/i,
  /exception/i,
  /at\s+\w+\./,
  /ECONNREFUSED/,
  /ENOTFOUND/,
];

function isSensitiveMessage(message: string): boolean {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(message));
}

export function sanitizeErrorForDisplay(
  error: unknown,
  fallback = 'An unexpected error occurred',
  safeMessages: Record<string, string> = DEFAULT_SAFE_MESSAGES,
): string {
  const parsed = parseApiError(error);

  if (parsed.code in safeMessages) {
    const safe = safeMessages[parsed.code];
    if (parsed.isValidationError && parsed.message && !isSensitiveMessage(parsed.message)) {
      return parsed.message;
    }
    return safe ?? fallback;
  }

  if (process.env.NODE_ENV === 'development') {
    return parsed.message || fallback;
  }

  if (parsed.message && !isSensitiveMessage(parsed.message) && parsed.statusCode < 500) {
    return parsed.message;
  }

  return fallback;
}

export function sanitizeRuntimeError(
  error: Error & { digest?: string },
  fallback = 'An unexpected error occurred. Please try again.',
): string {
  if (process.env.NODE_ENV === 'development') {
    return error.message || fallback;
  }
  return fallback;
}
