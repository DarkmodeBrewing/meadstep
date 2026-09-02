import type { FastifyInstance } from 'fastify';
import { successEnvelope } from '../envelopes/envelope.js';

export function registerPlannerRoutes(app: FastifyInstance): void {
  app.post('/api/v1/planner/honey-only', async (request) =>
    successEnvelope(
      {
        status: 'not_implemented',
        received: request.body,
      },
      request.id,
      { assumptions: true },
    ),
  );
}
