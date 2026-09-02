import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { errorEnvelope, type ApiErrorBody } from '../envelopes/envelope.js';

const knownRoutes = new Map<string, string[]>([
  ['/healthz', ['GET']],
  ['/readyz', ['GET']],
  ['/api/v1/planner/honey-only', ['POST']],
]);

export function registerErrorHandlers(app: FastifyInstance): void {
  app.setNotFoundHandler((request, reply) => {
    const allow = knownRoutes.get(request.url.split('?')[0] ?? request.url);

    if (allow) {
      return sendError(request, reply.header('allow', allow.join(', ')), 405, {
        code: 'method_not_allowed',
        message: `${request.method} is not allowed for ${request.url}.`,
      });
    }

    return sendError(request, reply, 404, {
      code: 'not_found',
      message: 'The requested route was not found.',
    });
  });

  app.setErrorHandler((error, request, reply) => {
    if (isPayloadTooLarge(error)) {
      return sendError(request, reply, 413, {
        code: 'payload_too_large',
        message: 'Request body exceeds the configured limit.',
      });
    }

    if (isInvalidJson(error)) {
      return sendError(request, reply, 400, {
        code: 'invalid_json',
        message: 'Request body must be valid JSON.',
      });
    }

    request.log.error({ err: error }, 'Unhandled request error');
    return sendError(request, reply, 500, {
      code: 'internal_error',
      message: 'Internal server error.',
    });
  });
}

function sendError(
  request: FastifyRequest,
  reply: FastifyReply,
  statusCode: number,
  error: ApiErrorBody,
): FastifyReply {
  return reply.status(statusCode).send(errorEnvelope(error, request.id));
}

function isInvalidJson(error: unknown): boolean {
  return (
    isFastifyError(error) && error.code === 'FST_ERR_CTP_INVALID_JSON_BODY'
  );
}

function isPayloadTooLarge(error: unknown): boolean {
  return isFastifyError(error) && error.code === 'FST_ERR_CTP_BODY_TOO_LARGE';
}

function isFastifyError(error: unknown): error is FastifyError {
  return typeof error === 'object' && error !== null && 'code' in error;
}
