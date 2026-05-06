---
title: Create Fastify API foundation and contract skeleton
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 71
  - 74
  - 76
  - 78
  - 80
  - 81
  - 82
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Replace the raw Node HTTP backend shell with a Fastify API foundation. This slice should establish backend structure, config, envelopes, error handling, request ids, health/readiness endpoints, CORS configuration, body limits, method handling, logging boundaries, and an OpenAPI v1 skeleton.

The API wraps `@meadstep/core`; it must not become the source of formula truth.

## Acceptance criteria

- [ ] Backend uses Fastify and exports a `buildServer`/`server.ts` app factory that tests can instantiate.
- [ ] `index.ts` only loads config and starts the server.
- [ ] Backend folders exist for config, HTTP routes/schemas/errors/envelopes, services, and tests.
- [ ] `GET /healthz` returns an unversioned liveness response.
- [ ] `GET /readyz` returns readiness and verifies config plus basic `@meadstep/core` availability.
- [ ] Success and error envelope helpers exist with `apiVersion`, UTC ISO `generatedAt` where applicable, `assumptionsVersion` where applicable, and `requestId`.
- [ ] Request id handling accepts a sane inbound `X-Request-Id` or generates one, returns it in the response header, and includes it in envelope metadata.
- [ ] Unknown routes return `404 not_found` in the standard error envelope.
- [ ] Known routes with unsupported methods return `405 method_not_allowed` in the standard error envelope and include an `Allow` header.
- [ ] Invalid JSON returns `400 invalid_json`; oversized JSON returns `413 payload_too_large`.
- [ ] Request body limit is configurable with `BODY_LIMIT_BYTES` and defaults around `32kb`.
- [ ] CORS allows local frontend origins in development and explicit `CORS_ORIGINS` in deployed environments; wildcard CORS is not the default.
- [ ] Structured logging uses `LOG_LEVEL`, logs to stdout by default, and supports environment-controlled file logging path without app-owned rollover.
- [ ] No authentication or bearer token validation is implemented in MVP.
- [ ] `docs/api/openapi-v1.yaml` exists with API metadata, shared envelope/error schemas, health/readiness paths, and placeholder tags for reference, planner, and tools.
- [ ] Backend tests use Vitest and Fastify `app.inject()` to cover health, readiness, request ids, unknown routes, method handling, invalid JSON, body limit behavior, and envelope shape.

## Blocked by

None - can start immediately.
