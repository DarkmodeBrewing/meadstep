import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default('0.0.0.0'),
  BODY_LIMIT_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(32 * 1024),
  CORS_ORIGINS: z.string().optional(),
  LOG_LEVEL: z.string().default('info'),
  LOG_FILE_PATH: z.string().optional(),
});

export interface ApiConfig {
  nodeEnv: string;
  port: number;
  host: string;
  bodyLimitBytes: number;
  corsOrigins: string[];
  logLevel: string;
  logFilePath?: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const parsed = envSchema.parse(env);

  return {
    nodeEnv: parsed.NODE_ENV,
    port: parsed.PORT,
    host: parsed.HOST,
    bodyLimitBytes: parsed.BODY_LIMIT_BYTES,
    corsOrigins:
      parsed.CORS_ORIGINS?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean) ?? developmentCorsOrigins(parsed.NODE_ENV),
    logLevel: parsed.LOG_LEVEL,
    logFilePath: parsed.LOG_FILE_PATH,
  };
}

function developmentCorsOrigins(nodeEnv: string): string[] {
  if (nodeEnv === 'production') {
    return [];
  }

  return ['http://localhost:4200', 'http://127.0.0.1:4200'];
}
