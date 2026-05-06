---
title: Add standalone tool API endpoints
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 41
  - 42
  - 43
  - 44
  - 45
  - 46
  - 47
  - 48
  - 49
  - 50
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

Add versioned API endpoints for the standalone calculators as the corresponding `@meadstep/core` functions become available. Each endpoint should be single-calculation, strict about request shape, and return structured calculation results without Markdown.

## Acceptance criteria

- [ ] `POST /api/v1/tools/honey-og` returns estimated OG, Brix/Plato, and ABV potential.
- [ ] `POST /api/v1/tools/gravity` converts SG to Brix/Plato and Brix/Plato to SG.
- [ ] `POST /api/v1/tools/abv` supports classic OG + FG to ABV and reverse OG + target ABV to estimated FG.
- [ ] `POST /api/v1/tools/sugar-break` calculates 1/3 sugar break from starting OG or Brix.
- [ ] `POST /api/v1/tools/scale` returns scale factor and scaled honey/nutrient/fruit quantities.
- [ ] `POST /api/v1/tools/fruit-sugar` returns estimated fruit sugar and gravity contribution while keeping fruit separate from the planner.
- [ ] Each endpoint accepts camelCase JSON, rejects unknown fields, and requires JSON numbers for numeric inputs.
- [ ] Each endpoint returns canonical metric data plus selected-unit display data where unit systems apply.
- [ ] Each endpoint uses a thin tools API service that wraps `@meadstep/core`; formulas are not implemented in backend routes.
- [ ] Validation errors point to API request paths.
- [ ] Unsupported methods return `405 method_not_allowed` with an `Allow` header.
- [ ] `docs/api/openapi-v1.yaml` documents each implemented tool endpoint, request schema, success envelope, and validation errors.
- [ ] Tests cover success envelopes, validation failures, strict unknown-field rejection, numeric-string rejection, representative smoke values, request ids, method handling, and OpenAPI path presence for each endpoint.

## Blocked by

- `001-fastify-api-foundation.md`
- `002-reference-endpoints.md`
- Core support for each corresponding standalone tool.
