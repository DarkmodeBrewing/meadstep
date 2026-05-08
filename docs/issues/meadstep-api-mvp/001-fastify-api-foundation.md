---
title: Create Fastify API foundation and contract skeleton
type: AFK
status: ready-for-human
labels:
  - ready-for-human
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

- [x] Backend uses Fastify and exports a `buildServer`/`server.ts` app factory that tests can instantiate.
- [x] `index.ts` only loads config and starts the server.
- [x] Backend folders exist for config, HTTP routes/schemas/errors/envelopes, services, and tests.
- [x] `GET /healthz` returns an unversioned liveness response.
- [x] `GET /readyz` returns readiness and verifies config plus basic `@meadstep/core` availability.
- [x] Success and error envelope helpers exist with `apiVersion`, UTC ISO `generatedAt` where applicable, `assumptionsVersion` where applicable, and `requestId`.
- [x] Request id handling accepts a sane inbound `X-Request-Id` or generates one, returns it in the response header, and includes it in envelope metadata.
- [x] Unknown routes return `404 not_found` in the standard error envelope.
- [x] Known routes with unsupported methods return `405 method_not_allowed` in the standard error envelope and include an `Allow` header.
- [x] Invalid JSON returns `400 invalid_json`; oversized JSON returns `413 payload_too_large`.
- [x] Request body limit is configurable with `BODY_LIMIT_BYTES` and defaults around `32kb`.
- [x] CORS allows local frontend origins in development and explicit `CORS_ORIGINS` in deployed environments; wildcard CORS is not the default.
- [x] Structured logging uses `LOG_LEVEL`, logs to stdout by default, and supports environment-controlled file logging path without app-owned rollover.
- [x] No authentication or bearer token validation is implemented in MVP.
- [x] `docs/api/openapi-v1.yaml` exists with API metadata, shared envelope/error schemas, health/readiness paths, and placeholder tags for reference, planner, and tools.
- [x] Backend tests use Vitest and Fastify `app.inject()` to cover health, readiness, request ids, unknown routes, method handling, invalid JSON, body limit behavior, and envelope shape.

## Blocked by

None - can start immediately.

## Comments

Implementation status: ready for human review.

Implemented in:

- `cfe07c0` Create Fastify API foundation

Notes:

- The API foundation wraps `@meadstep/core` for readiness only in this slice; formula-owning API endpoints remain deferred to later API issues.
- Verified with `corepack pnpm format:check`, `corepack pnpm -r test`, and `corepack pnpm -r build`.
