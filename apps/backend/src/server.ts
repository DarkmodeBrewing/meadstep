import cors from '@fastify/cors';
import Fastify, { type FastifyInstance } from 'fastify';
import { loadConfig, type ApiConfig } from './config/config.js';
import { registerErrorHandlers } from './http/errors/http-errors.js';
import { registerHealthRoutes } from './http/routes/health.js';
import { registerPlannerRoutes } from './http/routes/planner.js';

export interface BuildServerOptions {
  bodyLimitBytes?: number;
  corsOrigins?: string[];
  logger?: boolean;
}

export function buildServer(options: BuildServerOptions = {}): FastifyInstance {
  const config = {
    ...loadConfig(),
    ...removeUndefined({
      bodyLimitBytes: options.bodyLimitBytes,
      corsOrigins: options.corsOrigins,
    }),
  };

  const app = Fastify({
    bodyLimit: config.bodyLimitBytes,
    logger:
      options.logger ??
      (process.env['NODE_ENV'] === 'test' ? false : buildLoggerConfig(config)),
    genReqId: (request) => {
      const incoming = request.headers['x-request-id'];
      const requestId = Array.isArray(incoming) ? incoming[0] : incoming;

      return isSafeRequestId(requestId) ? requestId : crypto.randomUUID();
    },
  });

  app.addHook('onRequest', async (request, reply) => {
    reply.header('x-request-id', request.id);
  });

  void app.register(cors, {
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      callback(null, config.corsOrigins.includes(origin));
    },
  });

  registerHealthRoutes(app);
  registerPlannerRoutes(app);
  registerErrorHandlers(app);

  return app;
}

function buildLoggerConfig(config: ApiConfig): boolean | object {
  const base = { level: config.logLevel };

  if (!config.logFilePath) {
    return base;
  }

  return {
    ...base,
    transport: {
      target: 'pino/file',
      options: { destination: config.logFilePath },
    },
  };
}

function isSafeRequestId(value: string | undefined): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9._:-]{8,128}$/.test(value);
}

function removeUndefined<T extends Record<string, unknown>>(
  value: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as Partial<T>;
}
