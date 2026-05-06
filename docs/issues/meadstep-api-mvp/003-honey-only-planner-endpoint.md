---
title: Add honey-only planner API endpoint
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
  - 79
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Add `POST /api/v1/planner/honey-only` as the HTTP contract for the main honey-only planner. The endpoint should accept user-facing unit inputs, validate the request body strictly, call `@meadstep/core`, and return canonical metric data plus selected-unit display data in the standard envelope.

## Acceptance criteria

- [ ] `POST /api/v1/planner/honey-only` accepts camelCase JSON with `unitSystem`, user-facing batch volume, target ABV, yeast/custom yeast, and initial OG strategy fields as supported by the current core planner.
- [ ] Request validation rejects unknown fields with `400 validation_failed`.
- [ ] Numeric inputs must be JSON numbers; numeric strings are rejected with `400 validation_failed`.
- [ ] Validation errors point to API request paths, not internal canonical/core paths.
- [ ] The endpoint calls a thin planner API service that wraps `@meadstep/core`; formulas are not implemented in the backend.
- [ ] Successful responses include `data.canonical` metric results and `data.display` results for the selected unit system.
- [ ] Planner warnings include stable codes, severity, affected field/section metadata, and plain human-readable messages.
- [ ] Response metadata includes `apiVersion`, UTC ISO `generatedAt`, `assumptionsVersion`, and `requestId`.
- [ ] Unsupported methods return `405 method_not_allowed` with an `Allow` header.
- [ ] `docs/api/openapi-v1.yaml` documents the planner endpoint, request schema, success envelope, warning shape, and validation errors.
- [ ] Tests cover valid metric and US requests, canonical/display parity, representative smoke values, warning shape, strict unknown-field rejection, numeric-string rejection, validation path mapping, request ids, method handling, and OpenAPI path presence.

## Blocked by

- `001-fastify-api-foundation.md`
- `002-reference-endpoints.md`
