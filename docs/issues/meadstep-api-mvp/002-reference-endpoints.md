---
title: Add API reference endpoints for yeasts, assumptions, and options
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 77
  - 78
  - 79
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Add versioned read endpoints that expose static MeadStep reference data for API clients. These endpoints should make valid yeast ids, formula assumptions, and enum/options discoverable without requiring clients to inspect source code.

## Acceptance criteria

- [ ] `GET /api/v1/reference/yeasts` returns the curated MVP yeast list from `@meadstep/core` once available.
- [ ] `GET /api/v1/reference/assumptions` returns machine-readable assumption ids, values, units, display text, and `assumptionsVersion`.
- [ ] `GET /api/v1/reference/options` returns allowed unit systems, nitrogen requirement values, warning severities, and other stable API options.
- [ ] Reference responses use the standard success envelope and include `apiVersion`, UTC ISO `generatedAt`, `assumptionsVersion` where applicable, and `requestId`.
- [ ] Unsupported methods return `405 method_not_allowed` with an `Allow` header.
- [ ] Reference services read or adapt shared core data rather than duplicating domain constants in route handlers.
- [ ] `docs/api/openapi-v1.yaml` documents all reference endpoints and response schemas.
- [ ] Tests cover response envelopes, request ids, endpoint shapes, representative reference values, method handling, and OpenAPI path presence.

## Blocked by

- `001-fastify-api-foundation.md`
