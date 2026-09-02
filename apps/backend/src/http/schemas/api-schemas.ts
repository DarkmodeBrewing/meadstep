export const healthResponseSchema = {
  type: 'object',
  required: ['status'],
  properties: {
    status: { type: 'string', const: 'ok' },
  },
} as const;

export const readinessResponseSchema = {
  type: 'object',
  required: ['status', 'config', 'core'],
  properties: {
    status: { type: 'string', const: 'ready' },
    config: { type: 'string', const: 'valid' },
    core: { type: 'string', const: 'available' },
  },
} as const;

export const apiMetaSchema = {
  type: 'object',
  required: ['apiVersion', 'requestId'],
  properties: {
    apiVersion: { type: 'string', const: 'v1' },
    generatedAt: { type: 'string' },
    assumptionsVersion: { type: 'string' },
    requestId: { type: 'string' },
  },
} as const;
