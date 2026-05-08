import type { FastifyInstance } from 'fastify';
import { successEnvelope } from '../envelopes/envelope.js';
import { checkCoreAvailability } from '../../services/core-readiness.js';
import {
  healthResponseSchema,
  apiMetaSchema,
  readinessResponseSchema,
} from '../schemas/api-schemas.js';

export function registerHealthRoutes(app: FastifyInstance): void {
  app.get(
    '/healthz',
    {
      schema: {
        response: { 200: healthResponseSchema },
      },
    },
    async () => ({ status: 'ok' }),
  );

  app.get(
    '/readyz',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            required: ['data', 'meta'],
            properties: {
              data: readinessResponseSchema,
              meta: apiMetaSchema,
            },
          },
        },
      },
    },
    async (request) =>
      successEnvelope(
        {
          status: 'ready',
          config: 'valid',
          core: checkCoreAvailability(),
        },
        request.id,
        { assumptions: true },
      ),
  );
}
