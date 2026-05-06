---
title: Polish API contract, tests, and operational boundaries
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 71
  - 72
  - 73
  - 74
  - 75
  - 76
  - 78
  - 80
  - 81
  - 82
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Perform the final API MVP contract pass after the foundation, reference endpoints, planner endpoint, tool endpoints, and planner Markdown output are in place. This issue should verify consistency across envelopes, OpenAPI, validation, method handling, CORS, logging, payload limits, and route tests.

## Acceptance criteria

- [ ] `docs/api/openapi-v1.yaml` documents every implemented `/api/v1` endpoint, envelope schema, error schema, warning schema, request id behavior, validation errors, and reference schemas.
- [ ] Every route uses the standard success/error envelope shape.
- [ ] Every route includes request id handling in the header and response metadata.
- [ ] Every request body endpoint rejects unknown fields and numeric strings.
- [ ] Every known route returns `405 method_not_allowed` with `Allow` for unsupported methods.
- [ ] Unknown routes return `404 not_found`.
- [ ] CORS behavior is covered by config and tests for local/default behavior.
- [ ] Body limit behavior is covered by config and tests.
- [ ] Structured logging is environment-controlled and does not log full request bodies by default.
- [ ] API and Angular static hosting remain separate.
- [ ] No authentication, public rate limiting, or batch/multi-calculation endpoint is implemented in MVP.
- [ ] Final backend tests cover route smoke paths, error consistency, method handling, request ids, representative calculations, and OpenAPI path/schema presence.
- [ ] Backend package uses Vitest for tests.

## Blocked by

- `001-fastify-api-foundation.md`
- `002-reference-endpoints.md`
- `003-honey-only-planner-endpoint.md`
- `004-standalone-tool-endpoints.md`
- `005-planner-markdown-api-output.md`
