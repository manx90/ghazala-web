export interface ApiMessageResponse {
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  method: string;
  timestamp: string;
  requestId?: string;
}

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: ApiErrorCode;
  readonly error: string;
  readonly messages: string[];
  readonly path?: string;
  readonly method?: string;
  readonly requestId?: string;
  readonly isOffline: boolean;

  constructor(options: {
    message: string;
    statusCode: number;
    code: ApiErrorCode;
    error?: string;
    messages?: string[];
    path?: string;
    method?: string;
    requestId?: string;
    isOffline?: boolean;
  }) {
    super(options.message);
    this.name = 'ApiError';
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.error = options.error ?? options.code;
    this.messages = options.messages ?? [options.message];
    this.path = options.path;
    this.method = options.method;
    this.requestId = options.requestId;
    this.isOffline = options.isOffline ?? false;
  }

  get isUnauthorized(): boolean {
    return this.code === 'UNAUTHORIZED';
  }

  get isForbidden(): boolean {
    return this.code === 'FORBIDDEN';
  }

  get isValidationError(): boolean {
    return this.code === 'VALIDATION_ERROR';
  }
}

export interface RequestConfig {
  skipAuth?: boolean;
  skipOrgHeader?: boolean;
  skipRefresh?: boolean;
  signal?: AbortSignal;
  timeout?: number;
  retry?: number;
}
