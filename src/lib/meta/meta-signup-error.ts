export type MetaSignupErrorCode =
  | 'cancelled'
  | 'failed'
  | 'noWabaData'
  | 'sdkUnavailable'
  | 'noAuthCode'
  | 'sdkLoadFailed'
  | 'timeout';

export class MetaSignupError extends Error {
  readonly code: MetaSignupErrorCode;

  constructor(code: MetaSignupErrorCode) {
    super(code);
    this.name = 'MetaSignupError';
    this.code = code;
  }
}

export function isMetaSignupError(error: unknown): error is MetaSignupError {
  return error instanceof MetaSignupError;
}
