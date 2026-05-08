export const API_VERSION = 'v1';
export const ASSUMPTIONS_VERSION = '2026-05-08';

export interface ApiMeta {
  apiVersion: typeof API_VERSION;
  generatedAt?: string;
  assumptionsVersion?: string;
  requestId: string;
}

export interface ApiErrorIssue {
  path: Array<string | number>;
  message: string;
}

export interface ApiErrorBody {
  code:
    | 'validation_failed'
    | 'not_found'
    | 'method_not_allowed'
    | 'invalid_json'
    | 'payload_too_large'
    | 'internal_error';
  message: string;
  issues?: ApiErrorIssue[];
}

export function successEnvelope<TData>(
  data: TData,
  requestId: string,
  options: { assumptions?: boolean } = {},
): { data: TData; meta: ApiMeta } {
  return {
    data,
    meta: {
      apiVersion: API_VERSION,
      generatedAt: new Date().toISOString(),
      ...(options.assumptions
        ? { assumptionsVersion: ASSUMPTIONS_VERSION }
        : {}),
      requestId,
    },
  };
}

export function errorEnvelope(
  error: ApiErrorBody,
  requestId: string,
): { error: ApiErrorBody; meta: ApiMeta } {
  return {
    error,
    meta: {
      apiVersion: API_VERSION,
      requestId,
    },
  };
}
