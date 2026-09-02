import { afterEach, describe, expect, it } from 'vitest';
import { buildServer } from '../server.js';

const testServers = new Set<ReturnType<typeof buildServer>>();

function createTestServer(...args: Parameters<typeof buildServer>) {
  const app = buildServer(...args);
  testServers.add(app);
  return app;
}

afterEach(async () => {
  await Promise.all([...testServers].map((app) => app.close()));
  testServers.clear();
});

describe('Fastify API foundation', () => {
  it('returns an unversioned liveness response', async () => {
    const app = createTestServer();
    const response = await app.inject({ method: 'GET', url: '/healthz' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });

  it('returns readiness in the standard success envelope', async () => {
    const app = createTestServer();
    const response = await app.inject({
      method: 'GET',
      url: '/readyz',
      headers: { 'x-request-id': 'test-ready' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-request-id']).toBe('test-ready');
    expect(response.json()).toMatchObject({
      data: { status: 'ready', core: 'available' },
      meta: {
        apiVersion: 'v1',
        assumptionsVersion: '2026-05-08',
        requestId: 'test-ready',
      },
    });
    expect(new Date(response.json().meta.generatedAt).toISOString()).toBe(
      response.json().meta.generatedAt,
    );
  });

  it('generates a request id when the inbound id is missing or unsafe', async () => {
    const app = createTestServer();
    const response = await app.inject({
      method: 'GET',
      url: '/readyz',
      headers: { 'x-request-id': '../../bad id' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-request-id']).toMatch(
      /^[A-Za-z0-9._:-]{8,128}$/,
    );
    expect(response.json().meta.requestId).toBe(
      response.headers['x-request-id'],
    );
  });

  it('wraps unknown routes and unsupported methods in error envelopes', async () => {
    const app = createTestServer();
    const notFound = await app.inject({ method: 'GET', url: '/missing' });
    const methodNotAllowed = await app.inject({
      method: 'POST',
      url: '/healthz',
    });

    expect(notFound.statusCode).toBe(404);
    expect(notFound.json()).toMatchObject({
      error: { code: 'not_found' },
      meta: { apiVersion: 'v1' },
    });

    expect(methodNotAllowed.statusCode).toBe(405);
    expect(methodNotAllowed.headers['allow']).toBe('GET');
    expect(methodNotAllowed.json()).toMatchObject({
      error: { code: 'method_not_allowed' },
      meta: { apiVersion: 'v1' },
    });
  });

  it('normalizes invalid JSON and body limit errors', async () => {
    const invalidJsonApp = createTestServer();
    const invalidJson = await invalidJsonApp.inject({
      method: 'POST',
      url: '/api/v1/planner/honey-only',
      headers: { 'content-type': 'application/json' },
      payload: '{"bad":',
    });

    const smallLimitApp = createTestServer({ bodyLimitBytes: 8 });
    const payloadTooLarge = await smallLimitApp.inject({
      method: 'POST',
      url: '/api/v1/planner/honey-only',
      headers: { 'content-type': 'application/json' },
      payload: JSON.stringify({ tooLarge: true }),
    });

    expect(invalidJson.statusCode).toBe(400);
    expect(invalidJson.json().error.code).toBe('invalid_json');
    expect(payloadTooLarge.statusCode).toBe(413);
    expect(payloadTooLarge.json().error.code).toBe('payload_too_large');
  });

  it('uses explicit CORS origins and does not default to wildcard CORS', async () => {
    const app = createTestServer({ corsOrigins: ['http://localhost:4200'] });
    const allowed = await app.inject({
      method: 'OPTIONS',
      url: '/readyz',
      headers: {
        origin: 'http://localhost:4200',
        'access-control-request-method': 'GET',
      },
    });
    const denied = await app.inject({
      method: 'OPTIONS',
      url: '/readyz',
      headers: {
        origin: 'https://example.com',
        'access-control-request-method': 'GET',
      },
    });

    expect(allowed.headers['access-control-allow-origin']).toBe(
      'http://localhost:4200',
    );
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });
});
